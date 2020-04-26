import {
  all,
  call,
  fork,
  put,
  takeEvery,
  takeLatest,
} from "redux-saga/effects";
import axios from "axios";
import {
  EDIT_NICKNAME_FAILURE,
  EDIT_NICKNAME_REQUEST,
  EDIT_NICKNAME_SUCCESS,
  FOLLOW_USER_FAILURE,
  FOLLOW_USER_REQUEST,
  FOLLOW_USER_SUCCESS,
  LOAD_FOLLOWERS_FAILURE,
  LOAD_FOLLOWERS_REQUEST,
  LOAD_FOLLOWERS_SUCCESS,
  LOAD_FOLLOWINGS_FAILURE,
  LOAD_FOLLOWINGS_REQUEST,
  LOAD_FOLLOWINGS_SUCCESS,
  LOAD_USER_FAILURE,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  SIGN_IN_FAILURE,
  SIGN_IN_REQUEST,
  SIGN_IN_SUCCESS,
  SIGN_OUT_FAILURE,
  SIGN_OUT_REQUEST,
  SIGN_OUT_SUCCESS,
  REMOVE_FOLLOWER_FAILURE,
  REMOVE_FOLLOWER_REQUEST,
  REMOVE_FOLLOWER_SUCCESS,
  SIGN_UP_FAILURE,
  SIGN_UP_REQUEST,
  SIGN_UP_SUCCESS,
  UNFOLLOW_USER_FAILURE,
  UNFOLLOW_USER_REQUEST,
  UNFOLLOW_USER_SUCCESS,
  ACTIVATION_REQUEST,
  ACTIVATION_SUCCESS,
  ACTIVATION_FAILURE,
  PASSWORD_RESET_FAILURE,
  PASSWORD_RESET_SUCCESS,
  PASSWORD_RESET_REQUEST,
  OAUTH_SIGN_IN_REQUEST,
  OAUTH_SIGN_IN_SUCCESS,
  OAUTH_SIGN_IN_FAILURE,
  CHANGE_PASSWORD_FAILURE,
  CHANGE_PASSWORD_REQUEST,
  CHANGE_PASSWORD_SUCCESS,
  EDIT_DESCRIPTION_FAILURE,
  EDIT_DESCRIPTION_REQUEST,
  EDIT_DESCRIPTION_SUCCESS,
  CONFIRM_PASSWORD_RESET_REQUEST,
  CONFIRM_PASSWORD_RESET_SUCCESS,
  CONFIRM_PASSWORD_RESET_FAILURE,
  UPLOAD_PROFILE_REQUEST,
  UPLOAD_PROFILE_FAILURE,
  UPLOAD_PROFILE_SUCCESS,
} from "../reducers/user";

import {
  DECREASE_SUBSCRIPTION,
  INCREASE_SUBSCRIPTION,
} from "../reducers/video.js";
const https = require("https");

//https agent not required here. delete them all.
const httpsAgent =
  process.env.NODE_ENV === "production"
    ? new https.Agent({
        rejectUnauthorized: false,
      })
    : undefined;

function signInAPI(loginData) {
  return axios.post("/user/login", loginData, {
    withCredentials: true,
    httpsAgent,
  });
}

function* signIn(action) {
  try {
    const result = yield call(signInAPI, action.data);
    yield put({
      type: SIGN_IN_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error("this is error for login action", e.response);
    yield put({
      type: SIGN_IN_FAILURE,
      reason: e.response && e.response.data,
    });
  }
}

function* watchSignIn() {
  yield takeEvery(SIGN_IN_REQUEST, signIn);
}

function signUpAPI(signUpData) {
  return axios.post("/user/", signUpData, {
    withCredentials: true,
    httpsAgent,
  });
}

function* signUp(action) {
  try {
    yield call(signUpAPI, action.data);
    yield put({
      type: SIGN_UP_SUCCESS,
    });
  } catch (e) {
    console.error("this is error for signup action", e.response);
    yield put({
      type: SIGN_UP_FAILURE,
      reason: e.response && e.response.data,
    });
  }
}

function* watchSignUp() {
  yield takeEvery(SIGN_UP_REQUEST, signUp);
}

function logOutAPI() {
  return axios.post(
    "/user/logout",
    {},
    {
      withCredentials: true,
      httpsAgent,
    }
  );
}

function* logOut() {
  try {
    yield call(logOutAPI);
    yield put({
      //
      type: SIGN_OUT_SUCCESS,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: SIGN_OUT_FAILURE,
      reason: e.response && e.response.data,
    });
  }
}

function* watchLogOut() {
  yield takeEvery(SIGN_OUT_REQUEST, logOut);
}

function loadUserAPI(userId) {
  return axios.get(userId ? `/user/${userId}` : "/user/", {
    withCredentials: true,
    httpsAgent,
  });
}

function* loadUser(action) {
  try {
    const result = yield call(loadUserAPI, action.data);
    yield put({
      type: LOAD_USER_SUCCESS,
      me: !action.data,
      data: result.data,
    });
    // console.log('load user success', result.data);
  } catch (e) {
    console.error(e);
    yield put({
      type: LOAD_USER_FAILURE,
      error: e,
    });
  }
}

function* watchLoadUser() {
  yield takeEvery(LOAD_USER_REQUEST, loadUser);
}

function followAPI(userId) {
  return axios.post(
    `/user/${userId}/follow`,
    {},
    {
      withCredentials: true,
      httpsAgent,
    }
  );
}

function* follow(action) {
  try {
    const result = yield call(followAPI, action.data);
    yield put({
      type: FOLLOW_USER_SUCCESS,
      data: result.data,
    });
    yield put({
      type: INCREASE_SUBSCRIPTION,
      data: result.data,
    });
  } catch (e) {
    yield put({
      type: FOLLOW_USER_FAILURE,
      error: e,
    });
  }
}

function* watchFollow() {
  yield takeEvery(FOLLOW_USER_REQUEST, follow);
}

function unfollowAPI(userId) {
  return axios.delete(`/user/${userId}/follow`, {
    withCredentials: true,
    httpsAgent,
  });
}

function* unfollow(action) {
  try {
    const result = yield call(unfollowAPI, action.data);
    yield put({
      type: UNFOLLOW_USER_SUCCESS,
      data: result.data,
    });
    yield put({
      type: DECREASE_SUBSCRIPTION,
      data: result.data,
    });
  } catch (e) {
    yield put({
      type: UNFOLLOW_USER_FAILURE,
      error: e,
    });
  }
}

function* watchUnfollow() {
  yield takeEvery(UNFOLLOW_USER_REQUEST, unfollow);
}

function loadFollowersAPI(userId, offset = 0, limit = 3) {
  return axios.get(
    `/user/${userId || 0}/followers?offset=${offset}&limit=${limit}`,
    { withCredentials: true, httpsAgent }
  );
}

function* loadFollowers(action) {
  try {
    const result = yield call(loadFollowersAPI, action.data, action.offset);
    yield put({
      type: LOAD_FOLLOWERS_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: LOAD_FOLLOWERS_FAILURE,
      error: e,
    });
  }
}

function* watchLoadFollowers() {
  yield takeEvery(LOAD_FOLLOWERS_REQUEST, loadFollowers);
}

function loadFollowingsAPI(userId, offset = 0, limit = 3) {
  return axios.get(
    `/user/${userId || 0}/followings?offset=${offset}&limit=${limit}`,
    {
      withCredentials: true,
      httpsAgent,
    }
  );
}

function* loadFollowings(action) {
  try {
    const result = yield call(loadFollowingsAPI, action.data, action.offset);
    yield put({
      type: LOAD_FOLLOWINGS_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: LOAD_FOLLOWINGS_FAILURE,
      error: e,
    });
  }
}

function* watchLoadFollowings() {
  yield takeEvery(LOAD_FOLLOWINGS_REQUEST, loadFollowings);
}

function removeFollowerAPI(userId) {
  return axios.delete(`/user/${userId}/follower`, {
    withCredentials: true,
    httpsAgent,
  });
}

function* removeFollower(action) {
  try {
    const result = yield call(removeFollowerAPI, action.data);
    yield put({
      type: REMOVE_FOLLOWER_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: REMOVE_FOLLOWER_FAILURE,
      error: e,
    });
  }
}

function* watchRemoveFollower() {
  yield takeEvery(REMOVE_FOLLOWER_REQUEST, removeFollower);
}

function editNicknameAPI(nickname) {
  return axios.patch(
    "/user/nickname",
    { nickname },
    {
      withCredentials: true,
      httpsAgent,
    }
  );
}

function* editNickname(action) {
  try {
    const result = yield call(editNicknameAPI, action.data);
    yield put({
      type: EDIT_NICKNAME_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error(e);

    yield put({
      type: EDIT_NICKNAME_FAILURE,
      error: e,
    });
  }
}

function* watchEditNickname() {
  yield takeEvery(EDIT_NICKNAME_REQUEST, editNickname);
}

function activationAPI(userInfo) {
  return axios.post("/user/account-activation", userInfo);
  //userinfo = {token: token}
}

function* activationRequest(action) {
  try {
    const result = yield call(activationAPI, action.data);
    yield put({
      type: ACTIVATION_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error("this is error for activation action", e.response);

    yield put({
      type: ACTIVATION_FAILURE,
      reason: e.response && e.response.data,
    });
  }
}

function* watchActivationRequest() {
  yield takeEvery(ACTIVATION_REQUEST, activationRequest);
}

function passwordResetAPI(userId) {
  return axios.post("/user/passwordreset", userId);
  //userinfo = {token: token}
}

function* passwordResetRequest(action) {
  try {
    const result = yield call(passwordResetAPI, action.data);
    yield put({
      type: PASSWORD_RESET_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error("this is error for PASSWORD_RESET action", e.response);

    yield put({
      type: PASSWORD_RESET_FAILURE,
      reason: e.response && e.response.data,
    });
  }
}

function* watchPasswordReset() {
  yield takeEvery(PASSWORD_RESET_REQUEST, passwordResetRequest);
}

//wath login 부분 바꾸고,
//카카오랑 기타등등 다 추가하기.
//링크 부분만 스트링 인터폴레이션 가능한지 생각해 보기.
// 결국 익스프레스 설치 해야 한다.

function OauthSignInAPI(loginData) {
  return axios.get(`/user/auth/${loginData}`, {
    withCredentials: true,
    httpsAgent,
  });
}

function* OauthSignIn(action) {
  try {
    const result = yield call(OauthSignInAPI, action.data);
    yield put({
      type: OAUTH_SIGN_IN_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error("this is error for login action", e.response);
    yield put({
      type: OAUTH_SIGN_IN_FAILURE,
      reason: e.response && e.response.data,
    });
  }
}

function* watchOauthSignIn() {
  yield takeEvery(OAUTH_SIGN_IN_REQUEST, OauthSignIn);
}

function changePasswordAPI(password) {
  return axios.patch(
    "/user/password",
    { password },
    {
      withCredentials: true,
      httpsAgent,
    }
  );
}

function* changePassword(action) {
  console.log("change password fired :", action);
  try {
    const result = yield call(changePasswordAPI, action.data);
    yield put({
      type: CHANGE_PASSWORD_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error(e);

    yield put({
      type: CHANGE_PASSWORD_FAILURE,
      reason: e.response && e.response.data,
    });
  }
}

function* watchChangePassword() {
  yield takeEvery(CHANGE_PASSWORD_REQUEST, changePassword);
}

function confirmResetPasswordAPI(data) {
  return axios.patch("/user/confirm-password-reset", data, {
    withCredentials: true,
    httpsAgent,
  });
}

function* confirmResetPassword(action) {
  console.log("change password fired :", action);
  try {
    const result = yield call(confirmResetPasswordAPI, action.data);
    yield put({
      type: CONFIRM_PASSWORD_RESET_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error(
      "this is error for confirm_PASSWORD_RESET action",
      e.response
    );

    // console.error(e.data);

    yield put({
      type: CONFIRM_PASSWORD_RESET_FAILURE,
      reason: e.response && e.response.data,
    });
  }
}

function* watchConfirmPasswordReset() {
  yield takeEvery(CONFIRM_PASSWORD_RESET_REQUEST, confirmResetPassword);
}

function editDescriptionAPI(description) {
  return axios.patch(
    "/user/description",
    { description },
    {
      withCredentials: true,
      httpsAgent,
    }
  );
}

function* editDescription(action) {
  try {
    const result = yield call(editDescriptionAPI, action.data);
    yield put({
      type: EDIT_DESCRIPTION_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error(e);

    yield put({
      type: EDIT_DESCRIPTION_FAILURE,
      reason: e.response && e.response.data,
    });
  }
}

function* watchEditDescription() {
  yield takeEvery(EDIT_DESCRIPTION_REQUEST, editDescription);
}

function uploadProfileImagesAPI(formData) {
  return axios.post("/user/profile", formData, {
    withCredentials: true,
    httpsAgent,
  });
}

function* uploadProfileImages(action) {
  try {
    const result = yield call(uploadProfileImagesAPI, action.data);
    yield put({
      type: UPLOAD_PROFILE_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: UPLOAD_PROFILE_FAILURE,
      error: e,
    });
  }
}

function* watchUploadProfileImages() {
  yield takeLatest(UPLOAD_PROFILE_REQUEST, uploadProfileImages);
}
export default function* userSaga() {
  yield all([
    fork(watchUploadProfileImages),
    fork(watchEditDescription),
    fork(watchConfirmPasswordReset),
    fork(watchChangePassword),
    fork(watchOauthSignIn),
    fork(watchSignIn),
    fork(watchLogOut),
    fork(watchLoadUser),
    fork(watchSignUp),
    fork(watchFollow),
    fork(watchUnfollow),
    fork(watchLoadFollowers),
    fork(watchLoadFollowings),
    fork(watchRemoveFollower),
    fork(watchEditNickname),
    fork(watchActivationRequest),
    fork(watchPasswordReset),
  ]);
}
