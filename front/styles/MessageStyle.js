import styled from "styled-components";

export const StyledChatForm = styled.div`
  & > *,
  & > * > * {
    z-index: 10;
  }
  #chat-form {
    display: grid;
    grid: 4rem / 3.2rem 1fr;
    align-content: center;
    align-items: center;
    grid-gap: 1rem;
    border-radius: 0 0 1rem 0;
    padding: 0 0.5rem;
  }

  #chat-form > img {
    cursor: pointer;
  }
  #chat-form input {
    z-index: 10;
    outline: none;
    padding: 1rem;
    border: 2px solid #ddd;
    color: #330;
    border-radius: 0.6rem;
    font-size: 1.4rem;
  }
`;

export const StyledMessageBox = styled.div`
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
    margin-bottom: 2rem;
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
    grid-template-columns: 4.8rem 1fr;
    /* grid-column-gap: 1.5rem; */
  }

  & .message-row img {
    border-radius: 100%;
    width: 3rem;
    height: 3rem;
    grid-row: span 2;
  }

  & .message-time {
    font-size: 0.8rem;
    color: white;
  }

  & .message-text {
    padding: 0.5rem 0.5rem;
    font-size: 1.2rem;
    margin-bottom: 5px;
  }

  & .you-message .message-text {
    background: #0048aa;
    color: #eee;
    border: 1px solid #0048aa;
    border-radius: 1.4rem 1.4rem 0 1.4rem;
  }

  & .other-message .message-text {
    background: #eee;
    color: #111;
    border: 1px solid #ddd;
    border-radius: 1.4rem 1.4rem 1.4rem 0;
  }
  & ::-webkit-scrollbar {
    display: none;
  }
`;
