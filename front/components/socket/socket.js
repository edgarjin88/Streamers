import socketIOClient from "socket.io-client";
import { URL } from "../../config/config";
import { StoreExported } from "../../pages/_app";
import { UPDATE_CHAT_MESSAGE_LIST } from "../../reducers/video";

export const socket = socketIOClient(URL, {
  secure: true,
  rejectUnauthorized: false,
});

socket.on("message", (message) => {
  console.log("message received here:", message);
  StoreExported.dispatch({
    type: UPDATE_CHAT_MESSAGE_LIST,
    data: message,
  });
});

//방에서 나가도 소켓이 계속 있는 문제가 발생하네.
// 이거 close()를 쓰기는 해야할듯. 이후에 다시 onConnect 같은 방식이 있는지 알아보자.

//   socket.close(); 같은 것도 쓰자. 들어오면 on, 나가면 close()
// component에서는 colse action을 오려주고, 여기서 조절하자.
// 아니다 리 메이킹이 될 수 있으니 socket은 남겨 두자.
// close도 하지 말자. 방에서만 나갈 수 있는지 정도만 확실히 알아두자.
//webRTC 소켓은 하나더 만들까?  불필요할듯.
//방정보 더하고,

//백 부분에서는 같은 이름이면 마지막 부분 잘라내고, 최신거만 더하는 식으로 가자.
//userName이 아니라 userId로 들어가서, 잘라내도록 하자.

//일단 userName inUse가 나올때 리스트가 어떻게 변하는지 한번 보도록 하자. 이미 방에 조이
// 만약 socket이 다르면
// join 부분도 다 빼자. 일단 들어와서 업데이트 되면, 이쪽으로 쏴주고 그게 된 후에 여기서 조인 시키자.
// socket.on("roomData", ({ room, users }) => {
//   //room, user coming from server.
//   // room user update:
//   // document.querySelector("#sidebar").innerHTML = html;
//   setRoomInfo({ room, users });
// });

// StoreExported;
// console.log("store.exporeted :", StoreExported);
