import { all, fork, takeLatest, put, throttle, call } from 'redux-saga/effects';
import axios from 'axios';
import {
  ADD_ROOM_FAILURE,
  ADD_ROOM_REQUEST,
  ADD_ROOM_SUCCESS,
  ADD_MESSAGE_FAILURE,
  ADD_MESSAGE_REQUEST,
  ADD_MESSAGE_SUCCESS,
  LIKE_ROOM_FAILURE,
  LIKE_ROOM_REQUEST,
  LIKE_ROOM_SUCCESS,
  LOAD_MESSAGES_FAILURE,
  LOAD_MESSAGES_REQUEST,
  LOAD_MESSAGES_SUCCESS,
  LOAD_MAIN_ROOMS_FAILURE,
  LOAD_MAIN_ROOMS_REQUEST,

} from '../reducers/post';

import { ADD_POST_TO_ME, REMOVE_POST_OF_ME } from '../reducers/user';
//굉장히 중요. 트윗 카운트등 실시간 업데이트. 포스트는 포스트만 처리가능하나, 여기서 유저 정보를 가져와서 처리 



function* addRoom(action) {
  try {
    const result = yield call(addPostAPI, action.data);
    yield put({ // post reducer의 데이터를 수정
      type: ADD_ROOM_SUCCESS,
      data: result.data,
    });
    yield put({ // user reducer의 데이터를 수정
      type: ADD_ROOM_TO_ME,  // action을 두개 불러와서 해준다. 
      data: result.data.id,
    });
  } catch (e) {
    yield put({
      type: ADD_ROOM_FAILURE,
      error: e,
    });
  }
}

function* watchAddRoom() {
  yield takeLatest(ADD_ROOM_REQUEST, addRoom);
}

function loadMainRoomAPI(lastId = 0, limit = 10) {
  return axios.get(`/room?lastId=${lastId}&limit=${limit}`);
  //lastId=0가 들어감에 주의하자. 개시글이 하나도 없는 경우가 있기 때문이다.이경우에는 서버쪽에서는 처음부터 불러온다.  
}

function* loadMainRooms(action) { // 누누히 이야기하지만 action은 아래서 넣어준 그거다. 
  // 이 액션은 LOAD_MAIN_POSTS_REQUEST 이고, 
  // 아래서는 다른 액션을 다시 만든다

  try {
    const result = yield call(loadMainRoomsAPI, action.lastId);
    yield put({
      type: LOAD_MAIN_Rooms_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    yield put({
      type: LOAD_MAIN_ROOMS_FAILURE,
      error: e,
    });
  }
}

function* watchLoadMainPosts() {
  yield throttle(2000, LOAD_MAIN_ROOMS_REQUEST, loadMainRooms); 
  //throttle 들어간다. 
  //takeLatest는 마지막만 전달이 되지만, 리퀘스트 자체를 안나가게는 못한다. 처음에 연달아 멀티플 리퀘스트가 나온다. 
  
}

function addMessageAPI(data) {
  return axios.post(`/room/${data.postId}/message`, { content: data.content }, {
    withCredentials: true,
  });
}

function* addMessage(action) {
  try {
    const result = yield call(addMessageAPI, action.data);
    yield put({
      type: ADD_MESSAGE_SUCCESS,
      data: {
        postId: action.data.postId,
        comment: result.data,
      },
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: ADD_MESSAGE_FAILURE,
      error: e,
    });
  }
}

function* watchAddMessage() {
  yield takeLatest(ADD_MESSAGE_REQUEST, addMessage);
}

function loadMessagesAPI(postId) {
  return axios.get(`/post/${postId}/Messages`);
} // 나중에 인피넛 스크롤링 하기. 

function* loadMessages(action) { // 여기서 부터 위로 올라가면서 실행한다. 
  try {
    const result = yield call(loadMessagesAPI, action.data);
    //다시 말하지만 여기서 loadMessagesAPI가 실행되고, 서버로부터 return된 값이 result에 들어간다. 
    yield put({
      type: LOAD_MESSAGES_SUCCESS,
      data: {
        postId: action.data,
        messages: result.data,
      },
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: LOAD_MESSAGES_FAILURE,
      error: e,
    });
  }
}

function* watchLoadMessages() {
  yield takeLatest(LOAD_MESSAGES_REQUEST, loadMessages);
}



function* removeRoom(action) {
  try {
    const result = yield call(removeRoomAPI, action.data);
    yield put({
      type: REMOVE_Room_SUCCESS,
      data: result.data,
    });
    yield put({
      type: REMOVE_POST_OF_ME,
      data: result.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: REMOVE_POST_FAILURE,
      error: e,
    });
  }
}



function loadPostAPI(postId) {
  return axios.get(`/room/${postId}`);
}

function* loadPost(action) {
  try {
    const result = yield call(loadRoomAPI, action.data);
    yield put({
      type: LOAD_ROOM_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: LOAD_ROOM_FAILURE,
      error: e,
    });
  }
}

function* watchLoadRoom() {
  yield takeLatest(LOAD_ROOM_REQUEST, loadRoom);
}


//일단 addroom
//add comment 이거 먼저 끝내고. 
// 그다음 딜리팅으로가자 
export default function* postSaga() {
  yield all([
    fork(watchLoadMainPosts),
    fork(watchAddPost),
    fork(watchAddComment),
    fork(watchLoadPost),
  ]);
}

// 메시지가 유저 이름을 담고 있을 테니 유저 정보는 불필요. 

