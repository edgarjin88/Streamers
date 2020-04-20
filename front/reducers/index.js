import { combineReducers } from "redux";
import menu from "./menu";
import user from "./user";
import post from "./post";
import video from "./video";
import input from "./input";

const rootReducer = combineReducers({
  user,
  post,
  menu,
  input,
  video,
});

export default rootReducer;
