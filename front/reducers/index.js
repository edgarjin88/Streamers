import { combineReducers } from "redux";
import menu from "./menu";
import user from "./user";
import video from "./video";
import input from "./input";

const rootReducer = combineReducers({
  user,
  menu,
  input,
  video,
});

export default rootReducer;
