import React from "react";

// import { Provider } from "react-redux";

import Helmet from "react-helmet";
import { Container } from "next/app";
// import AppLayout from "../components/AppLayout";

// import '../static/result.css'
// import '../node_modules/antd/dist/result.css'

const Front = ({ Component, store, pageProps }) => {
  return (
    <Container>
      {/* <Provider store={store}> */}
      <Helmet
        title="CloneTube"
        htmlAttributes={{ lang: "en" }}
        meta={[
          {
            charset: "UTF-8"
          },
          {
            name: "viewport",
            content:
              "width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=yes,viewport-fit=cover"
          },
          {
            "http-equiv": "X-UA-Compatible",
            content: "IE=edge"
          },
          {
            name: "description",
            content: "CloneTube"
          },
          {
            name: "og:title",
            content: "CloneTube"
          },
          {
            name: "og:description",
            content:
              "CloneTube. Demo website that uses Next.js, React.js, Redux, Express.js, Material UI, Grid, and Styled-Components for front end"
          },
          {
            property: "og:type",
            content: "website"
            //open graph
          },
          {
            property: "og:image",
            content: "https://test/favicon.ico"
          }
        ]}
        link={[
          {
            rel: "shortcut icon",
            href: "/favicon.ico"
          },
          {
            rel: "stylesheet",
            href:
              "https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          },
          {
            rel: "stylesheet",
            href:
              "https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
          }
        ]}
        script={[
          {
            src: "https://cdnjs.cloudflare.com/ajax/libs/antd/3.16.2/antd.js"
          }
        ]}
      />
      {/* <AppLayout> */}
      <Component {...pageProps} />
      {/* </AppLayout> */}
      {/* </Provider> */}
    </Container>
  );
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
