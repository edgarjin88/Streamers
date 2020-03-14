import { all, fork } from "redux-saga/effects";
import axios from "axios";
import user from "./user";
import post from "./post";
import { URL } from "../config/config";

// console.log("axios before: ", axios);
axios.defaults.baseURL = `${URL}/api`;
// console.log("axios after: ", axios);

// axios default value would be cached here

export default function* rootSaga() {
  yield all([fork(user), fork(post)]);
}
