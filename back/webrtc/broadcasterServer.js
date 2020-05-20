"use strict";

const { EventEmitter } = require("events");

const broadcaster = new EventEmitter();
const { on } = broadcaster;

// console.log("broadcaster before beforeOffer:", broadcaster);
function beforeOffer(peerConnection, room) {
  // console.log("beforeOffer Broadcast fired :", room);

  const eventName = `a${room.toString()}`;
  broadcaster[eventName] = {};

  // console.log("broadcaster[eventName] fired :", broadcaster[eventName]);
  const audioTrack = (broadcaster[
    eventName
  ].audioTrack = peerConnection.addTransceiver("audio").receiver.track);

  const videoTrack = (broadcaster[
    eventName
  ].videoTrack = peerConnection.addTransceiver("video").receiver.track);

  // console.log("event name :", eventName);
  broadcaster.emit(`${eventName}`, {
    audioTrack,
    videoTrack,
  });

  const { close } = peerConnection;
  peerConnection.close = function () {
    audioTrack.stop();
    videoTrack.stop();
    return close.apply(this, arguments);
  };

  // console.log("broadcaster after beforeOffer:", broadcaster);
}

module.exports = {
  beforeOffer,
  broadcaster,
};
