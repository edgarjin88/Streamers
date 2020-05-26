import React, { useEffect } from "react";
import Head from "next/head";

import withRedux from "next-redux-wrapper";
import withReduxSaga from "next-redux-saga";
import { applyMiddleware, compose, createStore } from "redux";
import { Provider } from "react-redux";
import createSagaMiddleware from "redux-saga";
import axios from "axios";
import SimpleModal from "../containers/CreateChannel";

//set up helmet later.

import rootSaga from "../sagas";
import reducer from "../reducers";
import { LOAD_USER_REQUEST } from "../reducers/user";
import WrapperComponent from "../containers/WrapperComponent";

const Front = ({ Component, pageProps, store }) => {
  useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
    // const styled = document.querySelector("[data-styled]");
    // if (styled && styled.parentNode) {
    //   styled.parentNode.removeChild(styled);
    // }
  }, []);
  return (
    <Provider store={store}>
      <Head>
        <title>Streamers.com</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="shortcut icon" href="/static/favicon.ico" />
      </Head>
      <Component {...pageProps} />
      <SimpleModal />
      <WrapperComponent />
    </Provider>
  );
};

export let StoreExported = {};

Front.getInitialProps = async (context) => {
  const { ctx, Component } = context;
  let pageProps = {};
  const state = ctx.store.getState(); //
  const cookie = ctx.isServer ? ctx.req.headers.cookie : "";
  axios.defaults.headers.Cookie = "";
  console.log("axios common:", axios.defaults.headers.common);
  if (ctx.isServer && cookie) {
    console.log("is server? :", ctx.isServer);
    axios.defaults.headers.Cookie = cookie;
  }

  if (!state.user.me) {
    ctx.store.dispatch({
      type: LOAD_USER_REQUEST,
    });
  }
  if (Component.getInitialProps) {
    pageProps = (await Component.getInitialProps(ctx)) || {};
  }
  return { pageProps }; //
};

const configureStore = (initialState = {}, options) => {
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [sagaMiddleware];
  const enhancer =
    process.env.NODE_ENV === "production"
      ? compose(applyMiddleware(...middlewares))
      : compose(
          applyMiddleware(...middlewares),
          !options.isServer &&
            typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== "undefined"
            ? window.__REDUX_DEVTOOLS_EXTENSION__({
                serialize: true,
                trace: true,
              })
            : (f) => f
        );
  const store = createStore(reducer, initialState, enhancer);
  store.sagaTask = sagaMiddleware.run(rootSaga);
  StoreExported = store;
  return StoreExported;
};

export default withRedux(configureStore)(withReduxSaga(Front));
