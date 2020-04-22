import { all, fork, takeLatest, put, throttle, call } from "redux-saga/effects";
import axios from "axios";
import {
  ADD_VIDEO_FAILURE,
  ADD_VIDEO_REQUEST,
  ADD_VIDEO_SUCCESS,
  ADD_COMMENT_FAILURE,
  ADD_COMMENT_REQUEST,
  ADD_COMMENT_SUCCESS,
  LIKE_VIDEO_FAILURE,
  LIKE_VIDEO_REQUEST,
  LIKE_VIDEO_SUCCESS,
  LOAD_COMMENTS_FAILURE,
  LOAD_COMMENTS_REQUEST,
  LOAD_COMMENTS_SUCCESS,
  LOAD_HASHTAG_VIDEOS_FAILURE,
  LOAD_HASHTAG_VIDEOS_REQUEST,
  LOAD_HASHTAG_VIDEOS_SUCCESS,
  LOAD_MAIN_VIDEOS_FAILURE,
  LOAD_MAIN_VIDEOS_REQUEST,
  LOAD_MAIN_VIDEOS_SUCCESS,
  LOAD_USER_VIDEOS_FAILURE,
  LOAD_USER_VIDEOS_REQUEST,
  LOAD_USER_VIDEOS_SUCCESS,
  REMOVE_VIDEO_FAILURE,
  REMOVE_VIDEO_REQUEST,
  REMOVE_VIDEO_SUCCESS,
  RETWEET_FAILURE,
  RETWEET_REQUEST,
  RETWEET_SUCCESS,
  UNLIKE_VIDEO_FAILURE,
  UNLIKE_VIDEO_REQUEST,
  UNLIKE_VIDEO_SUCCESS,
  UPLOAD_IMAGES_FAILURE,
  UPLOAD_IMAGES_REQUEST,
  UPLOAD_IMAGES_SUCCESS,
  LOAD_VIDEO_SUCCESS,
  LOAD_VIDEO_FAILURE,
  LOAD_VIDEO_REQUEST,
  EDIT_VIDEO_REQUEST,
  EDIT_VIDEO_FAILURE,
  EDIT_VIDEO_SUCCESS,
  UPLOAD_VIDEO_IMAGE_FAILURE,
  UPLOAD_VIDEO_IMAGE_REQUEST,
  UPLOAD_VIDEO_IMAGE_SUCCESS,
} from "../reducers/video";

import { ADD_VIDEO_TO_ME, REMOVE_VIDEO_OF_ME } from "../reducers/user";

const https = require("https");

const httpsAgent =
  process.env.NODE_ENV === "production"
    ? new https.Agent({
        rejectUnauthorized: false,
      })
    : undefined;

function addVideoAPI(videoData) {
  return axios.post("/video", videoData, {
    httpsAgent,
    withCredentials: true,
  });
}

function* addVideo(action) {
  try {
    const result = yield call(addVideoAPI, action.data);
    yield put({
      type: ADD_VIDEO_SUCCESS,
      data: result.data,
    });
    yield put({
      type: ADD_VIDEO_TO_ME,
      data: result.data.id,
    });
  } catch (e) {
    yield put({
      type: ADD_VIDEO_FAILURE,
      error: e,
    });
  }
}

function* watchAddVideo() {
  yield takeLatest(ADD_VIDEO_REQUEST, addVideo);
}

function loadMainVideosAPI(lastId = 0, limit = 10) {
  return axios.get(`/videos?lastId=${lastId}&limit=${limit}`, {
    httpsAgent,
    withCredentials: true,
  });
  //lastId=0 as a default value otherwise, sequelize can make an error with the value "undefined"
}

function* loadMainVideos(action) {
  try {
    const result = yield call(loadMainVideosAPI, action.lastId);
    yield put({
      type: LOAD_MAIN_VIDEOS_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    yield put({
      type: LOAD_MAIN_VIDEOS_FAILURE,
      error: e,
    });
  }
}

function* watchLoadMainVideos() {
  yield throttle(2000, LOAD_MAIN_VIDEOS_REQUEST, loadMainVideos);
}

function loadHashtagVideosAPI(tag, lastId) {
  return axios.get(
    `/hashtag/${encodeURIComponent(tag)}?lastId=${lastId}&limit=10`,
    { httpsAgent, withCredentials: true }
  );
}

function* loadHashtagVideos(action) {
  try {
    const result = yield call(loadHashtagVideosAPI, action.data, action.lastId);
    yield put({
      type: LOAD_HASHTAG_VIDEOS_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    yield put({
      type: LOAD_HASHTAG_VIDEOS_FAILURE,
      error: e,
    });
  }
}

function* watchLoadHashtagVideos() {
  yield takeLatest(LOAD_HASHTAG_VIDEOS_REQUEST, loadHashtagVideos);
}

function loadUserVideosAPI(id) {
  return axios.get(`/user/${id || 0}/videos`, {
    // if no ide, 0 == my video
    httpsAgent,
    withCredentials: true,
  });
}

function* loadUserVideos(action) {
  try {
    const result = yield call(loadUserVideosAPI, action.data);
    yield put({
      type: LOAD_USER_VIDEOS_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    yield put({
      type: LOAD_USER_VIDEOS_FAILURE,
      error: e,
    });
  }
}

function* watchLoadUserVideos() {
  yield takeLatest(LOAD_USER_VIDEOS_REQUEST, loadUserVideos);
}

///////review above
///////review above
///////review above
function addCommentAPI(data) {
  return axios.post(
    `/video/${data.videoId}/comment`,
    { content: data.content },
    {
      withCredentials: true,
      httpsAgent,
    }
  );
}

function* addComment(action) {
  try {
    const result = yield call(addCommentAPI, action.data);
    yield put({
      type: ADD_COMMENT_SUCCESS,
      data: {
        videoId: action.data.videoId,
        comment: result.data,
      },
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: ADD_COMMENT_FAILURE,
      error: e,
    });
  }
}

function* watchAddComment() {
  yield takeLatest(ADD_COMMENT_REQUEST, addComment);
}

function loadCommentsAPI(videoId) {
  return axios.get(`/video/${videoId}/comments`, {
    httpsAgent,
    withCredentials: true,
  });
}

function* loadComments(action) {
  try {
    const result = yield call(loadCommentsAPI, action.data);
    yield put({
      type: LOAD_COMMENTS_SUCCESS,
      data: {
        videoId: action.data,
        comments: result.data,
      },
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: LOAD_COMMENTS_FAILURE,
      error: e,
    });
  }
}

function* watchLoadComments() {
  yield takeLatest(LOAD_COMMENTS_REQUEST, loadComments);
}

function uploadImagesAPI(formData) {
  return axios.post("/video/images", formData, {
    withCredentials: true,
    httpsAgent,
  });
}

function* uploadImages(action) {
  try {
    const result = yield call(uploadImagesAPI, action.data);
    yield put({
      type: UPLOAD_IMAGES_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: UPLOAD_IMAGES_FAILURE,
      error: e,
    });
  }
}

function* watchUploadImages() {
  yield takeLatest(UPLOAD_IMAGES_REQUEST, uploadImages);
}

function likeVideoAPI(videoId) {
  return axios.post(
    `/video/${videoId}/like`,
    {},
    {
      withCredentials: true,
      httpsAgent,
    }
  );
}

function* likeVideo(action) {
  try {
    const result = yield call(likeVideoAPI, action.data);
    yield put({
      type: LIKE_VIDEO_SUCCESS,
      data: {
        videoId: action.data,
        userId: result.data.userId,
      },
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: LIKE_VIDEO_FAILURE,
      error: e,
    });
  }
}

function* watchLikeVideo() {
  yield takeLatest(LIKE_VIDEO_REQUEST, likeVideo);
}

function unlikeVideoAPI(videoId) {
  return axios.delete(`/video/${videoId}/like`, {
    withCredentials: true,
    httpsAgent,
  });
}

function* unlikeVideo(action) {
  try {
    const result = yield call(unlikeVideoAPI, action.data);
    yield put({
      type: UNLIKE_VIDEO_SUCCESS,
      data: {
        videoId: action.data,
        userId: result.data.userId,
      },
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: UNLIKE_VIDEO_FAILURE,
      error: e,
    });
  }
}

function* watchUnlikeVideo() {
  yield takeLatest(UNLIKE_VIDEO_REQUEST, unlikeVideo);
}

function retweetAPI(videoId) {
  return axios.post(
    `/video/${videoId}/retweet`,
    {},
    {
      withCredentials: true,
      httpsAgent,
    }
  );
}

function* retweet(action) {
  try {
    const result = yield call(retweetAPI, action.data);
    yield put({
      type: RETWEET_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: RETWEET_FAILURE,
      error: e,
    });
    alert(e.response && e.response.data);
  }
}

function* watchRetweet() {
  yield takeLatest(RETWEET_REQUEST, retweet);
}

function removeVideoAPI(videoId) {
  return axios.delete(`/video/${videoId}`, {
    // delete!
    withCredentials: true,
    httpsAgent,
  });
}

function* removeVideo(action) {
  try {
    const result = yield call(removeVideoAPI, action.data);
    yield put({
      type: REMOVE_VIDEO_SUCCESS,
      data: result.data,
    });
    yield put({
      type: REMOVE_VIDEO_OF_ME,
      data: result.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: REMOVE_VIDEO_FAILURE,
      error: e,
    });
  }
}

function* watchRemoveVideo() {
  yield takeLatest(REMOVE_VIDEO_REQUEST, removeVideo);
}

function editVideoAPI(videoId, content) {
  return axios.patch(
    `/video/${videoId}`,
    { content },
    {
      withCredentials: true,
      httpsAgent,
    }
  );
}

function* editVideo(action) {
  try {
    const result = yield call(editVideoAPI, action.data, action.content);
    yield put({
      type: EDIT_VIDEO_SUCCESS,
      data: result.data,
      videoId: action.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: EDIT_VIDEO_FAILURE,
      error: e,
    });
  }
}

function* watchEditVideo() {
  yield takeLatest(EDIT_VIDEO_REQUEST, editVideo);
}

function loadVideoAPI(videoId) {
  return axios.get(`/video/${videoId}`, { httpsAgent, withCredentials: true });
}

function* loadVideo(action) {
  try {
    const result = yield call(loadVideoAPI, action.data);
    yield put({
      type: LOAD_VIDEO_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: LOAD_VIDEO_FAILURE,
      error: e,
    });
  }
}

function* watchLoadVideo() {
  yield takeLatest(LOAD_VIDEO_REQUEST, loadVideo);
}

// /////////////

function uploadVideoImagesAPI(formData) {
  console.log("uploadVideoImagesAPI fired");

  return axios.post("/video/image", formData, {
    withCredentials: true,
    httpsAgent,
  });
}

function* uploadVideoImages(action) {
  console.log("uploadVideoImages fired");

  try {
    const result = yield call(uploadVideoImagesAPI, action.data);
    yield put({
      type: UPLOAD_VIDEO_IMAGE_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: UPLOAD_VIDEO_IMAGE_FAILURE,
      error: e,
    });
  }
}

function* watchUploadVideoeImages() {
  console.log("watch upload image fired");
  yield takeLatest(UPLOAD_VIDEO_IMAGE_REQUEST, uploadVideoImages);
}

export default function* videoSaga() {
  yield all([
    fork(watchUploadVideoeImages),
    fork(watchLoadMainVideos),
    fork(watchAddVideo),
    fork(watchAddComment),
    fork(watchLoadComments),
    fork(watchLoadHashtagVideos),
    fork(watchLoadUserVideos),
    fork(watchUploadImages),
    fork(watchLikeVideo),
    fork(watchUnlikeVideo),
    fork(watchRetweet),
    fork(watchRemoveVideo),
    fork(watchEditVideo),
    fork(watchLoadVideo),
  ]);
}
