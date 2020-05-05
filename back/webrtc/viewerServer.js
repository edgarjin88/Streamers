"use strict";

const { broadcaster } = require("./broadcasterServer");

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
  }

  const { close } = peerConnection;

  console.log("this is close :", close);
  peerConnection.close = function () {
    broadcaster.removeListener("newBroadcast", onNewBroadcast);
    return close.apply(this, arguments);
  };
}

module.exports = { beforeOffer };
