import styled from "styled-components";

export const StyledChatForm = styled.div`
  z-index: 10;
  background-color: white;
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
    /* background-color: white; */
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

export const StyledChatMessageBox = styled.div`
  display: block;
  left: 0;
  top: 0;
  position: absolute;
  width: 100%;
  height: 100%;
  color: white;
  padding-bottom: 2rem;
  & .chatMessageList {
    display: flex;
    flex-direction: column-reverse;
    height: 95%;
    padding: 0 1rem;
    overflow-y: scroll;
    scrollbar-width: none;
  }

  /*message-row는 안에 있는데, 컨텐츠는 밖으로 나간다. 이유는?  */
  & .message-row {
    display: grid;
    grid-template-columns: 70%;
    grid-template-rows: 100%;
    margin-bottom: 2rem;
  }

  & .message-content {
    display: grid;
    grid-template-columns: auto-fit;
  }

  & .you-message {
    justify-content: end;
  }

  & .you-message .message-content {
    justify-items: end;
  }

  & .other-message {
    /* justify-items: start; */
    justify-content: start;
  }

  & .other-message .message-content {
    grid-template-columns: 4.8rem 1fr;
    /* grid-column-gap: 1.5rem; */
    /*   */
    justify-items: start;
  }

  & .message-row img {
    border-radius: 100%;
    width: 3rem;
    height: 3rem;
    grid-row: span 2;
  }

  & .message-time {
    font-size: 1rem;
    color: white;
  }

  & .message-text {
    display: inline-block;
    word-wrap: break-word;
    padding: 0.5rem 0.5rem;
    font-size: 1.2rem;
    margin-bottom: 5px;
    /* max-width: 70%; */
    /* max-height: 30rem; */
  }

  & .you-message .message-text {
    background: rgba(207, 154, 54, 0.801);
    color: rgb(255, 255, 255);
    border: none;
    border-radius: 1.4rem 1.4rem 0 1.4rem;
  }

  & .other-message .message-text {
    background: rgba(255, 249, 249, 0.376);
    color: black;
    border: none;
    border-radius: 1.4rem 1.4rem 1.4rem 0;
    /* 
            */
  }
  & ::-webkit-scrollbar {
    display: none;
  }
`;
