"use strict";

import { URL } from "../../config/config";
import {
  START_STREAMING_REQUEST,
  STOP_STREAMING_REQUEST,
} from "../../reducers/video";
import { StoreExported } from "../../pages/_app";

const fetch = require("node-fetch");
const DefaultRTCPeerConnection = require("wrtc").RTCPeerConnection;
const { RTCSessionDescription } = require("wrtc");

const TIME_TO_HOST_CANDIDATES = 3000; // NOTE(mroberts): Too long.

class ConnectionClient {
  constructor(options = {}) {
    options = {
      RTCPeerConnection: DefaultRTCPeerConnection,
      clearTimeout,
      host: "",
      prefix: ".",
      setTimeout,
      timeToHostCandidates: TIME_TO_HOST_CANDIDATES,
      ...options,
    };

    const { RTCPeerConnection, prefix, host } = options;

    console.log(
      "const { RTCPeerConnection, prefix, host } = options;",
      options
    );

    this.createConnection = async (func, typePassed, currentVideoId) => {
      // func, typePassed, roomId
      options = {
        // roomId : roomId
        beforeAnswer: func,
        stereo: false,
        type: typePassed,
        ...options,
      };

      const { beforeAnswer, stereo, type } = options;

      const response1 = await fetch(
        `${URL}/api/connections/${type}/${currentVideoId}`,
        {
          method: "POST",
        }
      );
      // roomId to be passed into Router

      const remotePeerConnection = await response1.json();
      console.log(
        "remote  peerconnection made on the serverside here: ",
        remotePeerConnection
      );

      const { id } = remotePeerConnection;
      const localPeerConnection = new RTCPeerConnection({
        sdpSemantics: "unified-plan",
      });

      localPeerConnection.close = function (videoId) {
        StoreExported.dispatch({
          type: STOP_STREAMING_REQUEST,
        });
        // redux 필요하네 여기서도.
        console.log("delete  session fired");
        fetch(`${URL}/api/connections/${typePassed}/${id}/${videoId}`, {
          method: "delete",
        }).catch(() => {});
        return RTCPeerConnection.prototype.close.apply(this, arguments);
      };

      try {
        await localPeerConnection.setRemoteDescription(
          remotePeerConnection.localDescription
        );

        await beforeAnswer(localPeerConnection);

        const originalAnswer = await localPeerConnection.createAnswer();
        const updatedAnswer = new RTCSessionDescription({
          type: "answer",
          sdp: stereo
            ? enableStereoOpus(originalAnswer.sdp)
            : originalAnswer.sdp,
        });
        await localPeerConnection.setLocalDescription(updatedAnswer);

        await fetch(
          `${URL}/api/connections/${typePassed}/${id}/remote-description`,
          {
            method: "POST",
            body: JSON.stringify(localPeerConnection.localDescription),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        return localPeerConnection;
      } catch (error) {
        console.log("error occurred. session will be deleted :", error);
        localPeerConnection.close(currentVideoId);
        throw error;
      }
    };
  }
}

function enableStereoOpus(sdp) {
  return sdp.replace(/a=fmtp:111/, "a=fmtp:111 stereo=1\r\na=fmtp:111");
}

module.exports = ConnectionClient;
