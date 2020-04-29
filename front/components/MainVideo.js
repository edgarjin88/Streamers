import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { URL } from "../config/config";
import { LOAD_VIDEO_REQUEST } from "../reducers/video";
import styled from "styled-components";

const MainVideo = () => {
  const { src } = useSelector(({ video }) => {
    return {
      src:
        video.currentVideo &&
        video.currentVideo.Images &&
        video.currentVideo.Images[0] &&
        video.currentVideo.Images[0].src,
    };
  }, shallowEqual);

  const StyledChatForm = styled.div`
    #chat-form {
      display: grid;
      grid: 4rem / 32px 1fr;
      align-content: center;
      align-items: center;
      grid-gap: 1rem;
      border-radius: 0 0 10px 0;
      padding: 0 0.5rem;
    }

    #chat-form > img {
      cursor: pointer;
    }
    #chat-form input {
      outline: none;
      padding: 1rem;
      border: 2px solid #ddd;
      color: #330;
      border-radius: 0.6rem;
      font-size: 1.4rem;
    }
  `;
  const ChatMessageForm = () => {
    return (
      <div id="chat-form">
        <img
          src="../static/images/icons/attachment-logo.svg"
          alt="Add Attachment"
        />
        <input type="text" placeholder="type a message" />
      </div>
    );
  };

  const StyledMessageBox = styled.div`
    display: block;
    left: 0;
    top: 0;
    position: absolute;
    width: 100%;
    height: 100%;
    color: white;
    & .chatMessageList {
      /* grid-area: chat-message-list; */
      display: flex;
      flex-direction: column-reverse;
      height: 95%;
      padding: 0 20px;
      overflow-y: scroll;
    }

    & .message-row {
      display: grid;
      grid-template-columns: 70%;
      margin-bottom: 20px;
    }

    & .message-content {
      display: grid;
    }

    & .you-message {
      justify-content: end;
    }

    & .you-message .message-content {
      justify-items: end;
    }

    & .other-message {
      justify-items: start;
    }

    & .other-message .message-content {
      grid-template-columns: 48px 1fr;
      grid-column-gap: 15px;
    }

    & .message-row img {
      border-radius: 100%;
      grid-row: span 2;
    }

    & .message-time {
      font-size: 1.3rem;
      color: #777;
    }

    & .message-text {
      padding: 9px 14px;
      font-size: 1.6rem;
      margin-bottom: 5px;
    }

    & .you-message .message-text {
      background: #0048aa;
      color: #eee;
      border: 1px solid #0048aa;
      border-radius: 14px 14px 0 14px;
    }

    & .other-message .message-text {
      background: #eee;
      color: #111;
      border: 1px solid #ddd;
      border-radius: 14px 14px 14px 0;
    }
    & ::-webkit-scrollbar {
      display: none;
    }
  `;

  const MessageBox = () => {
    return (
      <StyledMessageBox>
        <div className="chatMessageList">
          <div className="message-row you-message">
            <div className="message-content">
              <div className="message-text">Ok then</div>
              <div className="message-time">Apr 16</div>
            </div>
          </div>

          <div className="message-row other-message">
            <div className="message-content">
              <img
                src="../static/images/profiles/daryl.png"
                alt="Daryl Duckmanton"
              />
              <div className="message-text">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Alias,
                voluptatem vitae cumque quidem fuga odit voluptatum facilis
                facere animi cum!
              </div>
              <div className="message-time">Apr 16</div>
            </div>
          </div>
        </div>
      </StyledMessageBox>
    );
  };

  return (
    <div id="main-video" style={{ position: "relative" }}>
      <img
        className={"main-content"}
        src={src ? `${URL}/${src}` : "../static/images/videos/novideoimage.jpg"}
        alt="How to film your course"
      />
      {/* or video contents later */}
      {/* <img
        className={"main-content"}
        src={src ? `${URL}/${src}` : "../static/images/videos/main-video.png"}
        alt="How to film your course"
      /> */}
      <MessageBox />
      <StyledChatForm>
        <ChatMessageForm />
      </StyledChatForm>
    </div>
  );
};

export default MainVideo;
