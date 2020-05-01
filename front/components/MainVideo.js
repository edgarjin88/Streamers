import React, { useState, useEffect, Children } from "react";
import moment from "moment";

import { useDispatch, useSelector, shallowEqual } from "react-redux";

import { LOAD_VIDEO_REQUEST } from "../reducers/video";
import styled from "styled-components";
import { StyledMessageBox, StyledChatForm } from "../styles/MessageStyle";

import ChatMessageBox from "../components/chat/ChatMessageBox";
import { URL } from "../config/config";
import { useRouter } from "next/router";
import { socket } from "./socket/socket";

moment.locale("en");

const MainVideo = () => {
  const Router = useRouter();
  const queryId = Router.query.id;

  const dispatch = useDispatch();

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

  const sendMessage = (message) => {
    socket.emit(
      "sendMessage",
      { message: message, userId: me.userId, profilePhoto: me.profilePhoto },
      (error) => {
        if (error) {
          return console.log(error);
        }
      }
    );
  };

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
            // alert(error);
            console.log("user name in use");
            // location.href = "/";
          }
        }
      );
    }
    //cleanUp may no required here.
    // return () => {
    //   socket.close();
    // };
  }, [me]);

  const ChatMessageForm = ({ sendMessage }) => {
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
      setMessage(e.target.value);
    };
    const handleSubmit = (message) => {
      sendMessage(message);
      setMessage("");
    };

    const handleEnter = (e) => {
      // e.preventDefault();
      if (e.key === "Enter") {
        sendMessage(e.target.value);
        setMessage("");
      }
    };
    return (
      <StyledChatForm>
        <div id="chat-form">
          <img
            onClick={handleSubmit}
            src="../static/images/icons/attachment-logo.svg"
            alt="Add Attachment"
          />
          <input
            type="text"
            onKeyDown={handleEnter}
            value={message}
            onChange={handleChange}
            placeholder="type a message"
          />
        </div>
      </StyledChatForm>
    );
  };

  return (
    <div id="main-video" style={{ position: "relative" }}>
      <img
        className={"main-content"}
        src={src ? `${URL}/${src}` : "../static/images/videos/novideoimage.jpg"}
        alt="How to film your course"
      />
      <ChatMessageBox />
      {me && <ChatMessageForm sendMessage={sendMessage} />}
    </div>
  );
};

export default MainVideo;
