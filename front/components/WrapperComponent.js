import React, { useEffect } from "react";
import withRedux from "next-redux-wrapper";
import withReduxSaga from "next-redux-saga";
import { applyMiddleware, compose, createStore } from "redux";
import { Provider, useSelector, shallowEqual } from "react-redux";
import createSagaMiddleware from "redux-saga";
import axios from "axios";
import Helmet from "react-helmet";
import SimpleModal from "../containers/CreateChannel";
import { socket } from "../components/socket/socket";

//all socket logic to be added here
const WrapperComponent = ({ children }) => {
  const { me } = useSelector(({ user }) => {
    return { me: user && user.me };
  }, shallowEqual);
  useEffect(() => {
    if (me) {
      socket.emit("loginInfo", me.id);
    }
  }, [me]);

  return <>{children}</>;
};

export default WrapperComponent;
