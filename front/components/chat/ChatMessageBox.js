import React, { useState, useEffect, Children } from "react";
import moment from "moment";

import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { StyledChatMessageBox } from "../../styles/MessageStyle";
import { URL } from "../../config/config";

moment.locale("en");

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

  return (
    <StyledChatMessageBox>
      <div className="chatMessageList">
        {messageList.map(
          ({ username, text, createdAt, userId, profilePhoto }) => {
            const hours = parseInt(moment(createdAt).format("HH"), 10);
            const mins = parseInt(moment(createdAt).format("mm"), 10);
            const time =
              hours > 12 ? `PM ${hours - 12}:${mins}` : `AM ${hours}:${mins}`;
            const myMessage = userId === me.id;

            return myMessage ? (
              <div className="message-row you-message">
                <div className="message-content">
                  <div className="message-text">{text}</div>
                  <div className="message-time">{time}</div>
                </div>
              </div>
            ) : (
              <div className="message-row other-message">
                <div className="message-content">
                  <img
                    src={
                      profilePhoto
                        ? `${URL}/${profilePhoto}`
                        : `../static/images/profiles/defaultUser.png`
                    }
                    alt="Profile Photo"
                  />
                  <div className="message-text">{text}</div>
                  <div className="message-time">
                    {username} : {time}
                  </div>
                </div>
              </div>
            );
          }
        )}
      </div>
    </StyledChatMessageBox>
  );
};

export default ChatMessageBox;
