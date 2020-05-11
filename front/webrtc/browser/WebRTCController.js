import React, { useState } from "react";
import ConnectionClient from "../client/index";
import { StyledButton1 } from "../../components/CustomButtons";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import {
  START_STREAMING_REQUEST,
  STOP_STREAMING_REQUEST,
} from "../../reducers/video";

import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
import StopIcon from "@material-ui/icons/Stop";
const WebRTCController = ({ type, description, options, currentVideoId }) => {
  const { streamingOn, currentVideoOwner, myId } = useSelector((state) => {
    return {
      streamingOn: state.video.streamingOn,
      currentVideoOwner: state.video.currentVideo.UserId,
      myId: state.user.me && state.user.me.id,
    };
  }, shallowEqual);
  const owner = myId === currentVideoOwner;
  const connectionClient = new ConnectionClient();
  let peerConnection = null;

  const onStart = async () => {
    console.log("onstart fired");
    peerConnection = await connectionClient.createConnection(
      options,
      type,
      currentVideoId
    );
    window.peerConnection = peerConnection;
  };

  const dispatch = useDispatch();

  const onStop = () => {
    if (window.peerConnection) {
      window.peerConnection.close();
    }
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
        <StyledButton1 size={"1.2rem"} color="orange" onClick={handleStart}>
          <PlayCircleFilledIcon fontSize="large" />
          {owner ? "Start Streaming" : "Join Streaming"}
        </StyledButton1>
      ) : (
        <StyledButton1
          size={"1.2rem"}
          color="red"
          // disabled={false}
          onClick={handleStop}
          // disabled={stopDisabled}
        >
          <StopIcon fontSize="large" />
          {owner ? "Stop Streaming" : "Quit Streaming"}
        </StyledButton1>
      )}
    </div>
  );
};

export default WebRTCController;
