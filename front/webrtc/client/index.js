"use strict";

import { URL } from "../../config/config";
import {
  START_STREAMING_REQUEST,
  STOP_STREAMING_REQUEST,
} from "../../reducers/video";
import { StoreExported } from "../../pages/_app";
import axios from "axios";

const DefaultRTCPeerConnection = require("wrtc").RTCPeerConnection;
const { RTCSessionDescription } = require("wrtc");

const TIME_TO_HOST_CANDIDATES = 3000;
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

      const response1 = await axios.post(
        `${URL}/api/connections/${type}/${currentVideoId}`,
        {},
        { withCredentials: true }
      );
      // roomId to be passed into Router

      const remotePeerConnection = await response1.data;

      console.log("remotePeerConnection :", remotePeerConnection);
      const { id } = remotePeerConnection;
      const localPeerConnection = new RTCPeerConnection({
        sdpSemantics: "unified-plan",
      });

      localPeerConnection.close = async function (videoId) {
        StoreExported.dispatch({
          type: STOP_STREAMING_REQUEST,
        });

        await axios.delete(
          `${URL}/api/connections/${typePassed}/${id}/${videoId}`,
          { withCredentials: true }
        );

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

        await axios.post(
          `${URL}/api/connections/${typePassed}/${id}/remote-description`,
          {
            body: JSON.stringify(localPeerConnection.localDescription),
          },
          {
            withCredentials: true,
          }
        );
        return localPeerConnection;
      } catch (error) {
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
