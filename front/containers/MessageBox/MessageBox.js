import React, { useRef, useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";

import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";

import VideocamIcon from "@material-ui/icons/Videocam";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import SaveIcon from "@material-ui/icons/Save";

const ConversationList = () => {
  return (
    <div id="conversation-list">
      <div className="conversation">
        <img src="images/profiles/daryl.png" alt="Profile Photo" />
        <div className="title-text">Daryl Duckmanton</div>
        <div className="created-date">Apr 16</div>
        <div className="conversation-message">This is a message</div>
      </div>
    </div>
  );
};

const ChatMessageList = () => {
  return (
    <div id="chat-message-list">
      <div className="message-row you-message">
        <div className="message-content">
          <div className="message-text">Ok then</div>
          <div className="message-time">Apr 16</div>
        </div>
      </div>

      <div className="message-row other-message">
        <div className="message-content">
          <img src="images/profiles/daryl.png" alt="Daryl Duckmanton" />
          <div className="message-text">
            Yeah I think it's best we do that. Otherwise things won't work well
            at all. I'm adding more text here to test the sizing of the speech
            bubble and the wrapping of it too.
          </div>
          <div className="message-time">Apr 16</div>
        </div>
      </div>
    </div>
  );
};

const ChatMessageForm = () => {
  return (
    <div id="chat-form">
      <img src="images/icons/attachment-logo.svg" alt="Add Attachment" />
      <input type="text" placeholder="type a message" />
    </div>
  );
};

const ChatMessageSearchContainer = () => {
  return (
    <div id="search-container">
      <input type="text" placeholder="Search" />
    </div>
  );
};

const NewMessageContainer = () => {
  return (
    <div id="new-message-container">
      <a href="#">+</a>
    </div>
  );
};

const ChatTitle = () => {
  return (
    <div id="chat-title">
      <span>Daryl Duckmanton</span>
      <img src="images/icons/trash-logo.svg" alt="Delete Conversation" />
    </div>
  );
};

// 1. Data record first.
// 2. Load and view test
// 3. User Notification counter, Like notification counter
// 4. onClick, notifications to be removed.
// 5. WebSocket test.
// 6. Notification counter no to be updated if a user was looking at the message.
// 7. if Socket connected, notification not to be updated.
const MessageBox = () => {
  return (
    <body>
      <div id="chat-container">
        <ChatMessageSearchContainer />
        <ConversationList />
        <NewMessageContainer />
        <ChatTitle />
        <ChatMessageList />
        <ChatMessageForm />
      </div>
    </body>
  );
};

export default MessageBox;
