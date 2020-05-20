import socketIOClient from "socket.io-client";
import { URL } from "../../config/config";

export const socket = socketIOClient(URL, {
  secure: true,
  rejectUnauthorized: false,
});
