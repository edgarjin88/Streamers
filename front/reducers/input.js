import produce from "immer";
import { validateEmail } from "../helpers/loginHelpers";
import { SIGN_UP_SUCCESS } from "./user";

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
  termError: false,
  untouchedTerm: true,
  untouchedPassword: true,
  untouchedPasswordCheck: true,
  untouchedNickname: true,
  untouchedEmail: true,
  searchValue: ""
};

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
export const SET_SEARCH_VALUE = "SET_SEARCH_VALUE";

export const CLEAR_INPUT_FIELDS = "CLEAR_INPUT_FIELDS";
// export const OPEN_BACKDROP = "OPEN_BACKDROP";
// export const CLOSE_BACKDROP = "CLOSE_BACKDROP";

export default (state = initialState, action) => {
  return produce(state, draft => {
    switch (action.type) {
      case SET_SEARCH_VALUE: {
        draft.searchValue = action.data;
        break;
      }
      case SET_EMAIL_ERROR: {
        draft.emailError = true;
        break;
      }
      case CLEAR_INPUT_FIELDS: {
        (draft.email = ""),
          (draft.emailError = false),
          (draft.nickname = ""),
          (draft.nicknameError = false),
          (draft.password = ""),
          (draft.passwordError = false),
          (draft.passwordCheck = ""),
          (draft.passwordCheckError = false),
          (draft.term = false),
          (draft.termError = false);
        break;
      }
      case SET_NICKNAME: {
        draft.nickname = action.data;
        draft.nicknameError = !!!action.data;
        draft.untouchedNickname = false;
        break;
      }

      case SET_EMAIL: {
        draft.email = action.data;
        draft.emailError = !validateEmail(action.data);
        draft.untouchedEmail = false;

        break;
      }
      case SET_PASSWORD: {
        draft.password = action.data;
        draft.passwordError = !!!action.data;
        draft.untouchedPassword = false;

        break;
      }
      case SET_PASSWORD_ERROR: {
        draft.passwordError = true;
        break;
      }
      case SET_PASSWORD_CHECK: {
        draft.passwordCheck = action.data;
        draft.passwordCheckError = draft.password !== draft.passwordCheck;
        draft.untouchedPasswordCheck = false;

        break;
      }
      case SET_TERM: {
        draft.term = action.data;
        draft.termError = !draft.term;
        draft.untouchedTerm = false;

        break;
      }

      default: {
        break;
      }
    }
  });
};
