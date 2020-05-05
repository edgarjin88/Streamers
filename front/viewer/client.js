"use strict";

const createExample = require("../../lib/browser/example");

const description =
  'View a broadcast. You should have already started the \
broadcast example. Although you can prototype such a system with  node-webrtc, \
you should consider using an \
<a href="https://webrtcglossary.com/sfu/" target="_blank">SFU</a>.';

const remoteVideo = document.createElement("video");
remoteVideo.autoplay = true;

async function beforeAnswer(peerConnection) {
  const remoteStream = new MediaStream(
    peerConnection.getReceivers().map((receiver) => receiver.track)
  );
  remoteVideo.srcObject = remoteStream;

  //getReciever로 상대방의 remote를 받는군.
  // NOTE(mroberts): This is a hack so that we can get a callback when the
  // RTCPeerConnection is closed. In the future, we can subscribe to
  // "connectionstatechange" events.
  const { close } = peerConnection;
  peerConnection.close = function () {
    remoteVideo.srcObject = null;
    return close.apply(this, arguments);
  };

  //before answer와 beforeOffer 전에 항상 close한 벨류 값을 리턴한다.
  //peerConnection은 불려온 값, 다시말해 유저로 부터 받는 스트리밍 값이다.

  //왜?
}

createExample("viewer", description, { beforeAnswer });

const videos = document.createElement("div");
videos.className = "grid";
videos.appendChild(remoteVideo);
document.body.appendChild(videos);
