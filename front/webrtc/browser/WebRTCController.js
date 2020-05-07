import React, { useState } from "react";
import ConnectionClient from "../client/index";
import { StyledButton1 } from "../../components/CustomButtons";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import {
  START_STREAMING_REQUEST,
  STOP_STREAMING_REQUEST,
} from "../../reducers/video";

const WebRTCController = ({ type, description, options, currentVideoId }) => {
  const { streamingOn, currentVideoOwner, myId } = useSelector((state) => {
    return {
      streamingOn: state.video.streamingOn,
      currentVideoOwner: state.video.currentVideo.UserId,
      myId: state.user.me && state.user.me.id,
    };
  }, shallowEqual);
  const connectionClient = new ConnectionClient();
  let peerConnection = null;

  const onStart = async () => {
    console.log("onstart fired");
    peerConnection = await connectionClient.createConnection(
      options,
      type,
      currentVideoId
    );
    // type, id to be included
    // console.log('peer')
    // console.log("peerConnection? :", peerConnection);
    window.peerConnection = peerConnection;
  };

  const dispatch = useDispatch();

  const onStop = () => {
    window.peerConnection.close();
  };

  const handleStart = (e) => {
    console.log("start button fired");
    try {
      onStart();
      dispatch({
        type: START_STREAMING_REQUEST,
      });
    } catch (error) {
      // startButton.disabled = false;
      throw error;
    }
  };
  const handleStop = (e) => {
    console.log("stopButton fired");
    try {
      onStop();
      // setStreaming(false);
      dispatch({
        type: STOP_STREAMING_REQUEST,
      });
      // setStopDisabled(true);
      // setStartDisabled(false);
    } catch (error) {
      throw error;
    }
  };
  return (
    <div>
      {!streamingOn ? (
        <StyledButton1
          // disabled={startDisabled}
          size={"1.2rem"}
          color="orange"
          onClick={handleStart}
        >
          Start Streaming
        </StyledButton1>
      ) : (
        <StyledButton1
          size={"1.2rem"}
          color="red"
          // disabled={false}
          onClick={handleStop}
          // disabled={stopDisabled}
        >
          Stop Streaming
        </StyledButton1>
      )}
    </div>
  );
};

export default WebRTCController;
