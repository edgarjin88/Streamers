import React, { useState, useEffect, Children } from "react";
import moment from "moment";

import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { StyledMessageBox, StyledChatForm } from "../../styles/MessageStyle";
import { URL } from "../../config/config";
import { useRouter } from "next/router";
import { socket } from "../../components/socket/socket";

const ChatMessageBox = () => {
  const { nickname, me } = useSelector(({ user }) => {
    return {
      nickname: user && user.me && user.me.nickname,
      me: user.me,
    };
  }, shallowEqual);

  const { messageList } = useSelector(({ video }) => {
    return {
      messageList: video.messageList,
    };
  }, shallowEqual);

  // const [roomInfo, setRoomInfo] = useState({});
  // const [messageList, setMessageList] = useState([]);

  // socket.on("message", (message) => {
  //   console.log("message received here:", message);
  //   setMessageList([message, ...messageList]);
  // });

  return (
    <StyledMessageBox>
      <div className="chatMessageList">
        {messageList.map(
          ({ username, text, createdAt, userId, profilePhoto }) => {
            const myMessage = userId === me.id;

            return myMessage ? (
              <div className="message-row you-message">
                <div className="message-content">
                  <div className="message-text">{text}</div>
                  <div className="message-time">{username} : Apr 16</div>
                </div>
              </div>
            ) : (
              <div className="message-row other-message">
                <div className="message-content">
                  <img
                    src={
                      profilePhoto
                        ? `${URL}/${profilePhoto}`
                        : `../static/images/profiles/how-to-anything.png`
                    }
                    alt="Profile Photo"
                  />
                  <div className="message-text">{text}</div>
                  <div className="message-time">Apr 16</div>
                </div>
              </div>
            );
          }
        )}
      </div>
    </StyledMessageBox>
  );
};

export default ChatMessageBox;
