import React, { useState, useEffect, useCallback, Children } from "react";
import moment from "moment";

import { useDispatch, useSelector, shallowEqual } from "react-redux";

import ChatMessageBox from "../components/chat/ChatMessageBox";
import { URL } from "../config/config";
import { useRouter } from "next/router";
import { socket } from "./socket/socket";
import ChatMessageForm from "./chat/ChatMessageForm";
import { EMPTY_CHAT_MESSAGE_LIST } from "../reducers/video";

import WebRTCVideo from "./WebRTCVideo";
moment.locale("en");

const MainVideo = () => {
  const dispatch = useDispatch();

  const Router = useRouter();
  const queryId = Router.query.id;

  const { src, streamingOn } = useSelector(({ video }) => {
    return {
      streamingOn: video.streamingOn,
      src:
        video.currentVideo &&
        video.currentVideo.Images &&
        video.currentVideo.Images[0] &&
        video.currentVideo.Images[0].src,
    };
  }, shallowEqual);

  const { nickname, me } = useSelector(({ user }) => {
    return {
      nickname: user && user.me && user.me.nickname,
      me: user.me,
    };
  }, shallowEqual);

  useEffect(() => {
    if (me) {
      socket.emit(
        "join",
        {
          username: nickname,
          profilePhoto: me.profilePhoto,
          userId: me.id,
          room: "a" + queryId,
        },
        (error) => {
          if (error) {
            alert(error);
            location.href = "/";
          }
        }
      );
    }
    return () => {
      if (me) {
        socket.emit("leaveRoom", {
          username: nickname,
          profilePhoto: me.profilePhoto,
          userId: me.id,
          room: "a" + queryId,
        });

        dispatch({ type: EMPTY_CHAT_MESSAGE_LIST });
      }
    };
  }, [queryId]);

  return (
    <>
      <div id="main-video" style={{ position: "relative" }}>
        {!streamingOn && (
          <img
            className={"main-content"}
            src={src ? `${URL}/${src}` : "../static/images/videos/noimage.png"}
            alt="How to film your course"
          />
        )}
        <WebRTCVideo />

        <ChatMessageBox />

        {me && <ChatMessageForm />}
      </div>
    </>
  );
};

export default MainVideo;
