import React, { useState } from "react";
import ConnectionClient from "../client/index";

const WebRTCController = ({ type, description, options }) => {
  const connectionClient = new ConnectionClient();
  let peerConnection = null;

  const onStart = async () => {
    console.log("onstart fired");
    console.log("window? :", window);
    peerConnection = await connectionClient.createConnection(options, type);
    console.log("peerConnection? :", peerConnection);
    window.peerConnection = peerConnection;
  };

  const onStop = () => {
    peerConnection.close();
  };

  const handleStart = (e) => {
    console.log("start button fired");
    // startButton.disabled = true;
    try {
      onStart();
      // stopButton.disabled = false;
    } catch (error) {
      // startButton.disabled = false;
      throw error;
    }
  };
  const handleStop = (e) => {
    console.log("stopButton fired");
    try {
      onStop();
      // startButton.disabled = false;
    } catch (error) {
      // stopButton.disabled = false;
      throw error;
    }
  };
  return (
    <div>
      <button onClick={handleStart}>Start</button>;
      <button disabled={false} onClick={handleStop}>
        Stop
      </button>
      ;
    </div>
  );
};

export default WebRTCController;
