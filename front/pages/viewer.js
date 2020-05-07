"use strict";

import React, { useRef } from "react";

import { useRouter } from "next/router";
import WebRTCController from "../webrtc/browser/WebRTCController";

const VideoPage = () => {
  const router = useRouter();

  const videoRef = useRef();

  const description = "description";
  const type = "viewer";
  async function beforeAnswer(peerConnection) {
    const remoteStream = new MediaStream(
      peerConnection.getReceivers().map((receiver) => receiver.track)
    );
    videoRef.current.srcObject = remoteStream;

    const { close } = peerConnection;
    peerConnection.close = function () {
      videoRef.current.srcObject = null;
      return close.apply(this, arguments);
      // 굉장히 중요.
    };
  }

  return (
    <div className="container">
      <main>
        <div>Page number : viewer page</div>
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
          currentVideoId={9}
        />
        <WebRTCController
          type={type}
          description={description}
          options={beforeAnswer}
          currentVideoId={9}
        />
        <WebRTCController
          type={type}
          description={description}
          options={beforeAnswer}
          currentVideoId={10}
        />
      </main>
    </div>
  );
};

export default VideoPage;
