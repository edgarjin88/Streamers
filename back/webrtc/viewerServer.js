"use strict";

const { broadcaster } = require("./broadcasterServer");

function beforeOffer(peerConnection, room) {
  const eventName = `a${room.toString()}`;
  console.log("fired before offer :", room);
  console.log("fired before offer eventName :", eventName);
  const audioTransceiver = peerConnection.addTransceiver("audio");
  const videoTransceiver = peerConnection.addTransceiver("video");

  async function onNewBroadcast({ audioTrack, videoTrack }) {
    await audioTransceiver.sender.replaceTrack(audioTrack),
      await videoTransceiver.sender.replaceTrack(videoTrack);
  }

  broadcaster.on(`${eventName}`, onNewBroadcast);

  if (broadcaster[eventName].audioTrack && broadcaster[eventName].videoTrack) {
    onNewBroadcast(broadcaster[eventName]);
  }

  const { close } = peerConnection;

  peerConnection.close = function () {
    broadcaster.removeListener(`${eventName}`, onNewBroadcast);
    return close.apply(this, arguments);
  };
}

module.exports = { beforeOffer };
