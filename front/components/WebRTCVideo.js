"use strict";

import React, { useRef } from "react";
import { useSelector, shallowEqual } from "react-redux";

import { useRouter } from "next/router";
import WebRTCController from "../webrtc/browser/WebRTCController";
import styled from "styled-components";
const WebRTCVideo = () => {
  const router = useRouter();
  const queryId = router.query.id;

  const videoRef = useRef();

  const { myId, videoOwnerId, me } = useSelector((state) => {
    return {
      me: state.user && state.user.me,
      myId: state.user.me && state.user.me.id,
      videoOwnerId: state.video.currentVideo.UserId,
    };
  }, shallowEqual);

  const type = myId === videoOwnerId ? "broadcaster" : "viwer";

  console.log("mytype ", type);

  const typeFunction = async (peerConnection) => {
    if (type === "broadcaster") {
      console.log("before answer fired");
      console.log("window : ", window);
      const localStream = await window.navigator.mediaDevices.getUserMedia({
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
    } else {
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
  };

  const beforeAnswer = typeFunction;

  const StyledVideoComponent = styled.div`
    position: relative;

    & video {
      position: relative;
      width: 100%;

      max-height: calc(100vh / 2);
      object-fit: cover;
    }

    & > div {
      position: absolute;
      right: 1rem;
      bottom: 0.5rem;
      z-index: 33;
    }
  `;

  const { streamingOn, currentVideoId } = useSelector(({ video }) => {
    return {
      streamingOn: video.streamingOn,
      currentVideoId: video.currentVideo.id,
    };
  }, shallowEqual);

  return (
    <StyledVideoComponent>
      {streamingOn && (
        <video
          className="main-content"
          ref={videoRef}
          autoPlay={true}
          muted={true}
        ></video>
      )}
      {me && (
        <WebRTCController
          className="controller"
          type={type}
          options={beforeAnswer}
          currentVideoId={currentVideoId}
        />
      )}
    </StyledVideoComponent>
  );
};

export default WebRTCVideo;
