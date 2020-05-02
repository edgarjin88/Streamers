import socketIOClient from "socket.io-client";
import { URL } from "../../config/config";
import { StoreExported } from "../../pages/_app";
import { UPDATE_CHAT_MESSAGE_LIST } from "../../reducers/video";

export const socket = socketIOClient(URL, {
  secure: true,
  rejectUnauthorized: false,
});

socket.on("message", (message) => {
  console.log("message received here:", message);
  StoreExported.dispatch({
    type: UPDATE_CHAT_MESSAGE_LIST,
    data: message,
  });
});
