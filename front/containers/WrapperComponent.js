import React, { useEffect } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { socket } from "../components/socket/socket";
import { UPDATE_CHAT_MESSAGE_LIST } from "../reducers/video";
import { FRONTURL, URL } from "../config/config";
import { UPDATE_NOTIFICATION } from "../reducers/user";

import Toasters from "./Toasters";
//all socket logic to be added here
const createNotification = (title, { icon, message, videoId, profileLink }) => {
  const link = videoId
    ? `${FRONTURL}/video/${videoId}`
    : `${FRONTURL}/profile/${profileLink}`;

  const options = {
    body: message,
    icon: `${URL}/${icon}`,
  };
  const n = new Notification(title, options);
  n.onclick = (e) => {
    window.location.href = link;
  };

  setTimeout(n.close.bind(n), 4000);
};

const WrapperComponent = () => {
  const dispatch = useDispatch();

  const { me } = useSelector(({ user }) => {
    return {
      me: user.me,
    };
  }, shallowEqual);

  //socketLogic
  useEffect(() => {
    Notification.requestPermission().then(function (result) {
      console.log(result);
    });
    if (me) {
      socket.emit("loginInfo", me.id);
    }
  }, [me]);

  useEffect(() => {
    socket.on("eventSentFromServer", (data) => {
      dispatch({ type: UPDATE_NOTIFICATION });
      createNotification("Streamers.com", data);
    });

    socket.on("message", (message) => {
      console.log("message received here:", message);
      dispatch({
        type: UPDATE_CHAT_MESSAGE_LIST,
        data: message,
      });
    });
  }, []);

  return (
    <>
      <Toasters />
    </>
  );
};

export default WrapperComponent;
