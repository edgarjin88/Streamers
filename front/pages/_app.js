import React from "react";

// import { Provider } from "react-redux";

import Helmet from "react-helmet";

import "../css/video.css";

const Front = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export default Front;

// Front.getInitialProps = async context => {
//   const { ctx, Component } = context;

//   let pageProps = {};
//   const state = ctx.store.getState();
//   const cookie = ctx.isServer ? ctx.req.headers.cookie : "";
//   axios.defaults.headers.Cookie = "";
//   if (ctx.isServer && cookie) {
//     axios.defaults.headers.Cookie = cookie;
//   }

//   if (!state.user.me) {
//     ctx.store.dispatch({
//       type: LOAD_USER_REQUEST
//     });
//   }
//   if (Component.getInitialProps) {
//     pageProps = (await Component.getInitialProps(ctx)) || {};
//   }
//   return { pageProps }; //
// };

// const configureStore = (initialState, options) => {
//   const sagaMiddleware = createSagaMiddleware();
//   const middlewares = [sagaMiddleware];
//   const enhancer =
//     process.env.NODE_ENV === "production"
//       ? compose(applyMiddleware(...middlewares))
//       : compose(
//           applyMiddleware(...middlewares),
//           !options.isServer &&
//             typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== "undefined"
//             ? window.__REDUX_DEVTOOLS_EXTENSION__()
//             : f => f
//         );
//   const store = createStore(reducer, initialState, enhancer);
//   store.sagaTask = sagaMiddleware.run(rootSaga);
//   return store;
// };

// export default withRedux(configureStore)(withReduxSaga(Front));
