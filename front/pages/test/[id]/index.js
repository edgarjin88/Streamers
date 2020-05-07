"use strict";

import React, { useRef } from "react";

import { useRouter } from "next/router";
import WebRTCController from "../../../webrtc/browser/WebRTCController";

const VideoPage = () => {
  const router = useRouter();
  const queryId = router.query.id;

  const videoRef = useRef();

  const description = "description";
  const type = "broadcaster";

  async function beforeAnswer(peerConnection) {
    console.log("before answer fired");
    const localStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    console.log("local stream here :", localStream);
    localStream
      .getTracks()
      .forEach((track) => peerConnection.addTrack(track, localStream));

    videoRef.current.srcObject = localStream;

    const { close } = peerConnection;
    peerConnection.close = function () {
      videoRef.current.srcObject = null;

      localStream.getTracks().forEach((track) => track.stop());

      return close.apply(this, arguments);
    };
  }

  return (
    <div className="container">
      <main>
        <div>Page number : {queryId}</div>
        <video
          style={{ width: "400px", height: "400px" }}
          ref={videoRef}
          autoPlay={true}
          muted={true}
        ></video>
        <WebRTCController
          type={type}
          description={description}
          options={beforeAnswer}
        />
      </main>
    </div>
  );
};

export default VideoPage;
