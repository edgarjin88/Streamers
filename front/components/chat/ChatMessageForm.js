import React, { useState, useCallback, Children } from "react";
import { useSelector, shallowEqual } from "react-redux";

import { StyledChatForm } from "../../styles/MessageStyle";
import { socket } from "../socket/socket";

const ChatMessageForm = () => {
  const [message, setMessage] = useState("");
  const { nickname, me } = useSelector(({ user }) => {
    return {
      nickname: user && user.me && user.me.nickname,
      me: user.me,
    };
  }, shallowEqual);

  const sendMessage = useCallback((message) => {
    socket.emit(
      "sendMessage",
      { message: message, userId: me.userId, profilePhoto: me.profilePhoto },
      (error) => {
        if (error) {
          return console.error(error);
        }
      }
    );
  }, []);

  const handleChange = (e) => {
    setMessage(e.target.value);
  };
  const handleSubmit = (e) => {
    sendMessage(message);
    setMessage("");
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      sendMessage(message);
      setMessage("");
    }
  };
  return (
    <StyledChatForm>
      <div id="chat-form">
        <img
          onMouseDown={handleSubmit}
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

export default ChatMessageForm;
