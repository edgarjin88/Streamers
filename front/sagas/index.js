import { all, fork } from "redux-saga/effects";
import axios from "axios";
import user from "./user";
// import input from "./input";
import post from "./post";
import video from "./video";
import { URL } from "../config/config";

console.log("axios before: ", axios);
axios.defaults.baseURL = `${URL}/api`;
console.log("axios after: ", axios);

export default function* rootSaga() {
  yield all([fork(user), fork(post), fork(video)]);
}
