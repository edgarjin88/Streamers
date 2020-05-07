// 'use strict';

const DefaultRTCPeerConnection = require("wrtc").RTCPeerConnection;

const Connection = require("./connection");

const TIME_TO_CONNECTED = 10000;
const TIME_TO_HOST_CANDIDATES = 3000; // NOTE(mroberts): Too long.
const TIME_TO_RECONNECTED = 10000;

class WebRtcConnection extends Connection {
  // peerConnection made here only once
  constructor(id, options = {}, room) {
    super(id, room);
    //id used right here.
    options = {
      RTCPeerConnection: DefaultRTCPeerConnection,
      beforeOffer() {},
      clearTimeout,
      setTimeout,
      timeToConnected: TIME_TO_CONNECTED,
      timeToHostCandidates: TIME_TO_HOST_CANDIDATES,
      timeToReconnected: TIME_TO_RECONNECTED,
      ...options,
    };

    const {
      RTCPeerConnection,
      beforeOffer,
      timeToConnected,
      timeToReconnected,
    } = options;

    const peerConnection = new RTCPeerConnection({
      sdpSemantics: "unified-plan",
    });

    console.log("error room :", room);

    // peerConnection.room = room

    beforeOffer(peerConnection, room);
    //viewer, broadcaster will share "broadcaster" object as an event bus.

    let connectionTimer = options.setTimeout(() => {
      if (
        peerConnection.iceConnectionState !== "connected" &&
        peerConnection.iceConnectionState !== "completed"
      ) {
        this.close();
      }
    }, timeToConnected);

    let reconnectionTimer = null;

    const onIceConnectionStateChange = () => {
      if (
        peerConnection.iceConnectionState === "connected" ||
        peerConnection.iceConnectionState === "completed"
      ) {
        if (connectionTimer) {
          options.clearTimeout(connectionTimer);
          connectionTimer = null;
        }
        options.clearTimeout(reconnectionTimer);
        reconnectionTimer = null;
      } else if (
        peerConnection.iceConnectionState === "disconnected" ||
        peerConnection.iceConnectionState === "failed"
      ) {
        if (!connectionTimer && !reconnectionTimer) {
          const self = this;
          reconnectionTimer = options.setTimeout(() => {
            self.close();
          }, timeToReconnected);
        }
      }
    };

    peerConnection.addEventListener(
      "iceconnectionstatechange",
      onIceConnectionStateChange
    );
    //state별로 대응

    this.doOffer = async () => {
      const offer = await peerConnection.createOffer();
      //this is the only one place to create the offer, not on the client side, to store, and share the offer.

      await peerConnection.setLocalDescription(offer);
      try {
        await waitUntilIceGatheringStateComplete(peerConnection, options);
      } catch (error) {
        console.log(
          "error occurred while waitUntilIceGatheringStateComplete :"
        );
        this.close();
        throw error;
      }
    };

    this.applyAnswer = async (answer) => {
      await peerConnection.setRemoteDescription(answer);
    };

    this.close = () => {
      peerConnection.removeEventListener(
        "iceconnectionstatechange",
        onIceConnectionStateChange
      );
      if (connectionTimer) {
        options.clearTimeout(connectionTimer);
        connectionTimer = null;
      }
      if (reconnectionTimer) {
        options.clearTimeout(reconnectionTimer);
        reconnectionTimer = null;
      }
      peerConnection.close();
      super.close();
    };

    this.toJSON = () => {
      return {
        ...super.toJSON(),
        iceConnectionState: this.iceConnectionState,
        localDescription: this.localDescription,
        remoteDescription: this.remoteDescription,
        signalingState: this.signalingState,
      };
    };

    Object.defineProperties(this, {
      iceConnectionState: {
        get() {
          return peerConnection.iceConnectionState;
        },
      },
      localDescription: {
        get() {
          return descriptionToJSON(peerConnection.localDescription, true);
        },
      },
      remoteDescription: {
        get() {
          return descriptionToJSON(peerConnection.remoteDescription);
        },
      },
      signalingState: {
        get() {
          return peerConnection.signalingState;
        },
      },
    });
  }

  // end of constructor
  // end of constructor
  // end of constructor
  // end of constructor
  // end of constructor
}

function descriptionToJSON(description, shouldDisableTrickleIce) {
  return !description
    ? {}
    : {
        type: description.type,
        sdp: shouldDisableTrickleIce
          ? disableTrickleIce(description.sdp)
          : description.sdp,
      };
}

function disableTrickleIce(sdp) {
  return sdp.replace(/\r\na=ice-options:trickle/g, "");
}

async function waitUntilIceGatheringStateComplete(peerConnection, options) {
  if (peerConnection.iceGatheringState === "complete") {
    return;
  }

  const { timeToHostCandidates } = options;

  const deferred = {};
  deferred.promise = new Promise((resolve, reject) => {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });

  const timeout = options.setTimeout(() => {
    peerConnection.removeEventListener("icecandidate", onIceCandidate);
    deferred.reject(new Error("Timed out waiting for host candidates"));
  }, timeToHostCandidates);

  function onIceCandidate({ candidate }) {
    if (!candidate) {
      options.clearTimeout(timeout);
      peerConnection.removeEventListener("icecandidate", onIceCandidate);
      deferred.resolve();
    }
  }

  peerConnection.addEventListener("icecandidate", onIceCandidate);

  await deferred.promise;
}

module.exports = WebRtcConnection;
