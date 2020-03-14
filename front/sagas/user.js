import { all, call, fork, put, takeEvery } from "redux-saga/effects";
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
  LOAD_USER_SUCCESS, // 이런 친구들을 굳이 스테이트에 올려놓지 않고 따로 계속 액션으로 불러오는 이유는 새로고침할 때 필요하기 때문이다. 새로고침하면, 스테이트가 날라가나?
  LOG_IN_FAILURE,
  LOG_IN_REQUEST,
  LOG_IN_SUCCESS,
  LOG_OUT_FAILURE,
  LOG_OUT_REQUEST,
  LOG_OUT_SUCCESS,
  REMOVE_FOLLOWER_FAILURE,
  REMOVE_FOLLOWER_REQUEST,
  REMOVE_FOLLOWER_SUCCESS,
  SIGN_UP_FAILURE,
  SIGN_UP_REQUEST,
  SIGN_UP_SUCCESS,
  UNFOLLOW_USER_FAILURE,
  UNFOLLOW_USER_REQUEST,
  UNFOLLOW_USER_SUCCESS
} from "../reducers/user";

//take(a)  a가 올 때까지 기다린다. next는 필요 없다. 이거는 next middlware
//put. just like dispatch in Redux take로 무엇가를 받으면 put(aa)를 실행. take와 쌍으로 간다. while true로 감싸라.
//dispatch 처럼 deliver 까지 하나?
//takeLatest. 마지막 인풋만 받는다
//call 동기 호출 하고 기다린다. ajax 때는 이거 써라
//fork 비동기 - 요청하고 바로 가 버린다. 순서가 상관 없을 때는 fork
//takeEvery - 할때마다 put한다
//명심해라. 이거는 리덕스 떵그 캍은 거다.

// const path = require('path')
// const fs = require('fs')
const https = require("https");
// let certsPath = path.join(__dirname, '/');

const httpsAgent =
  process.env.NODE_ENV === "production"
    ? new https.Agent({
        rejectUnauthorized: false
        // cert: fs.readFileSync(path.join(__dirname,'sumontee.com.crt')),
        // key: fs.readFileSync(path.join(__dirname,'sumontee_com_key.txt'))
      })
    : undefined;

// const {httpsAgent} = require('../server.js')

function logInAPI(loginData) {
  return axios.post("/user/login", loginData, {
    withCredentials: true,
    httpsAgent
  });
}

function* logIn(action) {
  //근데 이 action은 어디서 오는가?
  //action type "LOG_IN_REQUEST", data: {userId: "aoiwoi", password: "password"}
  //data 부분은 loginForm 에서 dispatch 되서 날라온다.
  try {
    const result = yield call(logInAPI, action.data); // action.data 이게 loginAPI 펑션으로 파싱 된다.
    yield put({
      //
      type: LOG_IN_SUCCESS,
      data: result.data
    });
  } catch (e) {
    console.error("this is error for login action", e.response);
    yield put({
      type: LOG_IN_FAILURE,
      reason: e.response && e.response.data
    });
  }
}

function* watchLogIn() {
  yield takeEvery(LOG_IN_REQUEST, logIn);
}

function signUpAPI(signUpData) {
  return axios.post("/user/", signUpData, {
    withCredentials: true,
    httpsAgent
  });
}

function* signUp(action) {
  try {
    yield call(signUpAPI, action.data);
    yield put({
      type: SIGN_UP_SUCCESS
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: SIGN_UP_FAILURE,
      error: e
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
      httpsAgent
    }
  );
}

function* logOut() {
  try {
    yield call(logOutAPI);
    yield put({
      //
      type: LOG_OUT_SUCCESS
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: LOG_OUT_FAILURE,
      error: e
    });
  }
}

function* watchLogOut() {
  yield takeEvery(LOG_OUT_REQUEST, logOut);
}

function loadUserAPI(userId) {
  return axios.get(userId ? `/user/${userId}` : "/user/", {
    withCredentials: true,
    httpsAgent
  });
}

function* loadUser(action) {
  try {
    const result = yield call(loadUserAPI, action.data);
    yield put({
      type: LOAD_USER_SUCCESS,
      me: !action.data,
      data: result.data
    });
    // console.log('load user success', result.data);
  } catch (e) {
    console.error(e);
    yield put({
      type: LOAD_USER_FAILURE,
      error: e
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
      httpsAgent
    }
  );
}

function* follow(action) {
  try {
    const result = yield call(followAPI, action.data);
    yield put({
      type: FOLLOW_USER_SUCCESS,
      data: result.data
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: FOLLOW_USER_FAILURE,
      error: e
    });
  }
}

function* watchFollow() {
  yield takeEvery(FOLLOW_USER_REQUEST, follow);
}

function unfollowAPI(userId) {
  return axios.delete(`/user/${userId}/follow`, {
    withCredentials: true,
    httpsAgent
  });
}

function* unfollow(action) {
  try {
    const result = yield call(unfollowAPI, action.data);
    yield put({
      type: UNFOLLOW_USER_SUCCESS,
      data: result.data
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: UNFOLLOW_USER_FAILURE,
      error: e
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
      data: result.data
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: LOAD_FOLLOWERS_FAILURE,
      error: e
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
      httpsAgent
    }
  );
}

function* loadFollowings(action) {
  try {
    const result = yield call(loadFollowingsAPI, action.data, action.offset);
    yield put({
      type: LOAD_FOLLOWINGS_SUCCESS,
      data: result.data
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: LOAD_FOLLOWINGS_FAILURE,
      error: e
    });
  }
}

function* watchLoadFollowings() {
  yield takeEvery(LOAD_FOLLOWINGS_REQUEST, loadFollowings);
}

function removeFollowerAPI(userId) {
  return axios.delete(`/user/${userId}/follower`, {
    withCredentials: true,
    httpsAgent
  });
}

function* removeFollower(action) {
  try {
    const result = yield call(removeFollowerAPI, action.data);
    yield put({
      type: REMOVE_FOLLOWER_SUCCESS,
      data: result.data
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: REMOVE_FOLLOWER_FAILURE,
      error: e
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
      httpsAgent
    }
  );
}

function* editNickname(action) {
  try {
    const result = yield call(editNicknameAPI, action.data);
    yield put({
      type: EDIT_NICKNAME_SUCCESS,
      data: result.data
    });
  } catch (e) {
    console.error(e);

    yield put({
      type: EDIT_NICKNAME_FAILURE,
      error: e
    });
  }
}

function* watchEditNickname() {
  yield takeEvery(EDIT_NICKNAME_REQUEST, editNickname);
}

export default function* userSaga() {
  yield all([
    fork(watchLogIn),
    fork(watchLogOut),
    fork(watchLoadUser),
    fork(watchSignUp),
    fork(watchFollow),
    fork(watchUnfollow),
    fork(watchLoadFollowers),
    fork(watchLoadFollowings),
    fork(watchRemoveFollower),
    fork(watchEditNickname)
  ]);
}
