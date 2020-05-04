import React, { useState, useEffect, useCallback, Children } from "react";
import moment from "moment";

import { useDispatch, useSelector, shallowEqual } from "react-redux";

import ChatMessageBox from "../components/chat/ChatMessageBox";
import { URL } from "../config/config";
import { useRouter } from "next/router";
import { socket } from "./socket/socket";
import ChatMessageForm from "./chat/ChatMessageForm";

moment.locale("en");

const MainVideo = () => {
  const Router = useRouter();
  const queryId = Router.query.id;

  const { src } = useSelector(({ video }) => {
    return {
      currentVideoId: video.currentVideo && video.currentVideo.id,
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
    console.log("video component loaded");
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
            console.log("user name in use");
            location.href = "/";
          }
        }
      );
    }
    // cleanUp may no required here.
    return () => {
      console.log("leave room fired");
      socket.emit("leaveRoom", {
        username: nickname,
        profilePhoto: me.profilePhoto,
        userId: me.id,
        room: "a" + queryId,
      });
    };
  }, [me]);

  return (
    <>
      {/* <button style={{ zIndex: 1000000000000000 }} onClick={closeSocket}>
        close socket
      </button> */}
      <div id="main-video" style={{ position: "relative" }}>
        <img
          className={"main-content"}
          src={
            src ? `${URL}/${src}` : "../static/images/videos/novideoimage.jpg"
          }
          alt="How to film your course"
        />
        <ChatMessageBox />
        {me && <ChatMessageForm />}
      </div>
    </>
  );
};

export default MainVideo;
