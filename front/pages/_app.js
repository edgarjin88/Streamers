import React from "react";
import withRedux from "next-redux-wrapper";
import withReduxSaga from "next-redux-saga";
import { applyMiddleware, compose, createStore } from "redux";
import { Provider, useSelector, shallowEqual } from "react-redux";
import createSagaMiddleware from "redux-saga";
import axios from "axios";
import Helmet from "react-helmet";
import SimpleModal from "../containers/CreateChannel";

//set up helmet later.

import rootSaga from "../sagas";
import reducer from "../reducers";
import { LOAD_USER_REQUEST } from "../reducers/user";
import WrapperComponent from "../components/WrapperComponent";

const Front = ({ Component, pageProps, store }) => {
  return (
    <Provider store={store}>
      <WrapperComponent>
        <Component {...pageProps} />
        <SimpleModal />
      </WrapperComponent>
    </Provider>
  );
};

export let StoreExported = {};

Front.getInitialProps = async (context) => {
  const { ctx, Component } = context;
  // console.log("ctx on getInitialProps :", ctx);
  let pageProps = {};
  const state = ctx.store.getState(); //
  const cookie = ctx.isServer ? ctx.req.headers.cookie : ""; //cookies는 여기
  axios.defaults.headers.Cookie = "";
  if (ctx.isServer && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }

  if (!state.user.me) {
    // console.log('getinitialprops fired');
    ctx.store.dispatch({
      type: LOAD_USER_REQUEST,
    });
  }
  if (Component.getInitialProps) {
    pageProps = (await Component.getInitialProps(ctx)) || {};
  }
  // console.log('this is pageProps result', pageProps);
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
            ? window.__REDUX_DEVTOOLS_EXTENSION__()
            : (f) => f
        );
  const store = createStore(reducer, initialState, enhancer);
  store.sagaTask = sagaMiddleware.run(rootSaga);
  StoreExported = store;
  return StoreExported;
};

export default withRedux(configureStore)(withReduxSaga(Front));
