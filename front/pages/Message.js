import React, { useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";

import { MessageBoxGlobalStyle } from "../styles/MessageBox";
import HideBar from "../containers/HideBar";
import MessageBox from "../containers/MessageBox/MessageBox";

import socketIOClient from "socket.io-client";
import { URL } from "../config/config";

const endpoint = URL;
const socket = socketIOClient(endpoint, {
  secure: true,
  rejectUnauthorized: false,
});

const Index = () => {
  const dispatch = useDispatch();

  const socketConnect = () => {
    socketIOClient(endpoint, {
      secure: true,
      rejectUnauthorized: false,
    });
  };
  useEffect(() => {
    socketConnect();
  });
  return (
    <div className="container">
      <MessageBoxGlobalStyle />
      <HideBar style={{ zIndex: 3000 }} />

      <MessageBox />
    </div>
  );
};

export default Index;
