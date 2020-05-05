"use strict";

const { broadcaster } = require("../broadcaster/server");
// 이거는브로드 케스터 쪽 view 페이지
function beforeOffer(peerConnection) {
  const audioTransceiver = peerConnection.addTransceiver("audio");
  const videoTransceiver = peerConnection.addTransceiver("video");

  function onNewBroadcast({ audioTrack, videoTrack }) {
    audioTransceiver.sender.replaceTrack(audioTrack),
      videoTransceiver.sender.replaceTrack(videoTrack);
  }

  // The audio transceiver's RTCRtpSender's replaceTrack() method is used to set the outgoing audio track to the first track of the microphone's audio stream.

  broadcaster.on("newBroadcast", onNewBroadcast);

  if (broadcaster.audioTrack && broadcaster.videoTrack) {
    onNewBroadcast(broadcaster);
    // 이미 broadcasting이 시작되어 있으며 그냥 그전거 계속 보내주는 거.
  }

  const { close } = peerConnection;

  console.log("this is close :", close);
  peerConnection.close = function () {
    broadcaster.removeListener("newBroadcast", onNewBroadcast);
    return close.apply(this, arguments);
    // arguments는 어디서 오는가.
  };

  // 모든 펑션들은  beforeOffer 라는 점을 명심.
}

module.exports = { beforeOffer };
