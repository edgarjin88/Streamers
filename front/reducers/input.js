import produce from "immer";
import { validateEmail } from "../helpers/loginHelpers";

export const initialState = {
  email: "",
  emailError: false,
  nickname: "",
  nicknameError: false,
  password: "",
  passwordError: false,
  passwordCheck: "",
  passwordCheckError: false,
  term: false,
  termError: false
};

//use effect 같은 애들은 onsubmit action 발행했을 때 리셋하는 걸로 가자.
export const SET_NICKNAME = "SET_NICKNAME";
export const SET_NICKNAME_ERROR = "SET_NICKNAME_ERROR";
export const SET_EMAIL = "SET_EMAIL";
export const SET_EMAIL_ERROR = "SET_EMAIL_ERROR";
export const SET_PASSWORD = "SET_PASSWORD";
export const SET_PASSWORD_ERROR = "SET_PASSWORD_ERROR";
export const SET_PASSWORD_CHECK = "SET_PASSWORD_CHECK";
export const SET_PASSWORD_CHECK_ERROR = "SET_PASSWORD_CHECK_ERROR";
export const SET_TERM = "SET_TERM";
export const SET_TERM_ERROR = "SET_TERM_ERROR";
// export const OPEN_BACKDROP = "OPEN_BACKDROP";
// export const CLOSE_BACKDROP = "CLOSE_BACKDROP";

// export const ADD_POST_TO_ME = "ADD_POST_TO_ME";
// export const REMOVE_POST_OF_ME = "REMOVE_POST_OF_ME";

export default (state = initialState, action) => {
  return produce(state, draft => {
    switch (action.type) {
      case SET_NICKNAME: {
        draft.nickname = action.payload;
        draft.nicknameError = !!!action.payload;
        break;
      }
      // case SET_NICKNAME_ERROR: {
      //   draft.nicknameError = action.nicknameError;
      //   break;
      // }
      case SET_EMAIL: {
        draft.email = action.payload;
        draft.emailError = !validateEmail(action.payload);
        break;
      }
      case SET_PASSWORD: {
        draft.password = action.payload;
        draft.passwordError = !!!action.payload;
        break;
      }
      case SET_PASSWORD_CHECK: {
        draft.passwordCheck = action.payload;
        draft.passwordCheckError = draft.password !== draft.passwordCheck;
        break;
      }
      case SET_TERM: {
        draft.term = action.payload;
        draft.termError = !draft.term;
        break;
      }

      default: {
        break;
      }
    }
  });
};
