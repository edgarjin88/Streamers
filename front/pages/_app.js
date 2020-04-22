import React from "react";
import withRedux from "next-redux-wrapper";
import withReduxSaga from "next-redux-saga";
import { applyMiddleware, compose, createStore } from "redux";
import { Provider } from "react-redux";
import createSagaMiddleware from "redux-saga";
import axios from "axios";
import Helmet from "react-helmet";
import SimpleModal from "../containers/CreateChannel";

//set up helmet later.

import rootSaga from "../sagas";
import reducer from "../reducers";
import { LOAD_USER_REQUEST } from "../reducers/user";

// import "../css/video.css";

const Front = ({ Component, pageProps, store }) => {
  // console.log("front itself  :", );
  console.log("store inside Front :", store);
  return (
    <Provider store={store}>
      <Component {...pageProps} />
      <SimpleModal />
    </Provider>
  );
};

Front.getInitialProps = async (context) => {
  //executed when paged loaded first, and move to other page via link or next/router.
  // store, Apptree, query pathname objects are included in context by next

  console.log("context on getInitialProps :", context);
  const { ctx, Component } = context;
  console.log("ctx on getInitialProps :", ctx);
  let pageProps = {};
  const state = ctx.store.getState(); //
  const cookie = ctx.isServer ? ctx.req.headers.cookie : ""; //cookies는 여기 들어 있다. 근데 이 req 는 프론트로 들어오는 req?
  axios.defaults.headers.Cookie = "";
  if (ctx.isServer && cookie) {
    axios.defaults.headers.Cookie = cookie;
    //reset the default cookies in axios with cookies in headers
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
  //inhancer includes everything at this point.
  store.sagaTask = sagaMiddleware.run(rootSaga);
  console.log("sagaTask: ", store.sagaTask);
  return store;
};

export default withRedux(configureStore)(withReduxSaga(Front));
