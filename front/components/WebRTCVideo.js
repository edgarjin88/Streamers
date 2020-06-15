"use strict";

import React, { useRef, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import OwnerWebRTCController from "../webrtc/browser/OwnerWebRTCController";
import ViewerWebRTCController from "../webrtc/browser/ViewerWebRTCController";
import styled from "styled-components";
import { socket } from "./socket/socket";

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
  z-index: 33;d
}
`;

const WebRTCVideo = () => {
  const videoRef = useRef();

  const { myId, videoOwnerId, me } = useSelector((state) => {
    return {
      me: state.user && state.user.me,
      myId: state.user.me && state.user.me.id,
      videoOwnerId: state.video.currentVideo.UserId,
    };
  }, shallowEqual);

  const type = myId === videoOwnerId ? "broadcaster" : "viwer";
  const owner = myId === videoOwnerId;

  const { streamingOn, currentVideoId } = useSelector(({ video }) => {
    return {
      streamingOn: video.streamingOn,
      currentVideoId: video.currentVideo.id,
    };
  }, shallowEqual);

  const addStreamingDataToVideo = (arg) => {
    if (videoRef.current) {
      // streamingData = stream
      console.log("objeaddStreamingDataToVideo fired :");
      console.log("arg is :", arg);
      videoRef.current.srcObject = arg;
    }
  };
  return (
    <StyledVideoComponent>
      <video
        style={{ display: streamingOn ? "block" : "none" }}
        className="main-content"
        ref={videoRef}
        autoPlay={true}
        muted={true}
      ></video>

      {me && owner && (
        <OwnerWebRTCController
          ref={videoRef}
          className="controller"
          type={type}
          // options={beforeAnswer}
          currentVideoId={currentVideoId}
          addStreamingDataToVideo={addStreamingDataToVideo}
          // peerConnection={peerConnection}
        />
      )}
      {me && !owner && (
        <ViewerWebRTCController
          ref={videoRef}
          className="controller"
          type={type}
          // options={beforeAnswer}
          currentVideoId={currentVideoId}
          addStreamingDataToVideo={addStreamingDataToVideo}
          // peerConnection={peerConnection}
        />
      )}
    </StyledVideoComponent>
  );
};

export default WebRTCVideo;
