import { useEffect, useState, forwardRef, useRef } from "react";
import { StyledButton1 } from "../../components/CustomButtons";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useRouter } from "next/router";

import {
  START_STREAMING_REQUEST,
  STOP_STREAMING_REQUEST,
} from "../../reducers/video";

import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
import StopIcon from "@material-ui/icons/Stop";
import { socket } from "../../components/socket/socket";


const WebRTCController =forwardRef( ({currentVideoId, addStreamingDataToVideo }, ref) => {
// forwardref 사용하기

  const log = (message, order)=>{
    console.log(`order [${order}]. message: ${message}`)
  }


  const dispatch = useDispatch();
  const { streamingOn, currentVideoOwner, myId } = useSelector((state) => {
    return {
      streamingOn: state.video.streamingOn,
      currentVideoOwner: state.video.currentVideo.UserId,
      myId: state.user.me && state.user.me.id,
    };
  }, shallowEqual);
  const owner = myId === currentVideoOwner;
  const Router = useRouter();
  const queryId = Router.query.id;

  //streamingData 부분은 항상 webrtc와는 별개로 작동해야 한다. 
  let streamingData;
  console.log('this is ref :', ref)

  const webRTCList ={}
  const handlePlay = async()=>{
    navigator.mediaDevices
    .getUserMedia({
      audio: false,
      video: true,
    })
    .then((stream) => {
      if (ref.current) {
        streamingData = stream
        ref.current.srcObject = streamingData}
    });
  }

  

  

  ///rtc start 
  
  const RTCList = useRef({}) 
  // connection이 들어오면, 여기다가 push 한다. 
  //client 쪽에서는 uuid로 아이디를 만들어서 메시지를 보낼때 같이 보낸다. 
  async function handleNegotiationNeededEvent() {
    log("*** Negotiation needed");
    try {
      log("---> Creating offer");
      const offer = await myPeerConnection.createOffer();
  
      if (myPeerConnection.signalingState != "stable") {
        log("     -- The connection isn't stable yet; postponing...")
        return;
      }
  
      log("---> Setting local description to the offer");
      await myPeerConnection.setLocalDescription(offer);
  
      log("---> Sending the offer to the remote peer");
      sendToServer({
        name: myUsername,
        target: targetUsername,
        type: "video-offer",
        sdp: myPeerConnection.localDescription
      });
    } catch(err) {
      log("*** The following error occurred while handling the negotiationneeded event:");
      reportError(err);
    };
  }

  async function addTrackToPeerConnection(peerId){
    log(`this is peerid :${peerId}`)
    if(streamingData && RTCList[peerId]){
      
      try {
        streamingData.getTracks().forEach(
          transceiver = track => RTCList[peerId].addTransceiver(track, {streams: [streamingData]}) // array
        );
      } catch(err) {
        handleGetUserMediaError(err);
      }
    }
  }
  async function createPeerConnection() {
    log("Setting up a connection...");

    myPeerConnection = new RTCPeerConnection({
      iceServers: [
        {
          url: "stun:stun.l.google.com:19302",
        },
      ],
    });
  
    // Set up event handlers for the ICE negotiation process.
  
    myPeerConnection.onicecandidate = handleICECandidateEvent;
    myPeerConnection.oniceconnectionstatechange = handleICEConnectionStateChangeEvent;
    myPeerConnection.onicegatheringstatechange = handleICEGatheringStateChangeEvent;
    myPeerConnection.onsignalingstatechange = handleSignalingStateChangeEvent;
    myPeerConnection.onnegotiationneeded = handleNegotiationNeededEvent;
    myPeerConnection.ontrack = handleTrackEvent;

    
  }
  

  function handleTrackEvent(event) {
    log("*** Track event");
    document.getElementById("received_video").srcObject = event.streams[0];
    document.getElementById("hangup-button").disabled = false;
  }
  function handleICECandidateEvent(event) {
    if (event.candidate) {
      log("*** Outgoing ICE candidate: " + event.candidate.candidate);
  
      sendToServer({
        type: "new-ice-candidate",
        target: targetUsername,
        candidate: event.candidate
      });
    }
  }


  function handleICEConnectionStateChangeEvent(event) {
    log("*** ICE connection state changed to " + myPeerConnection.iceConnectionState);
  
    switch(myPeerConnection.iceConnectionState) {
      case "closed":
      case "failed":
      case "disconnected":
        closeVideoCall();
        break;
    }
  }
  
  
  function handleSignalingStateChangeEvent(event) {
    log("*** WebRTC signaling state changed to: " + myPeerConnection.signalingState);
    switch(myPeerConnection.signalingState) {
      case "closed":
        closeVideoCall();
        break;
    }
  } // 이 부분도 broad caster 쪽에서만 필요하다. 
  //peerconnection은 항상 scope 되어야 한다. 

  function handleICEGatheringStateChangeEvent(event) {
    log("*** ICE gathering state changed to: " + myPeerConnection.iceGatheringState);
  }
  

  function closeVideoCall() {
    var localVideo = document.getElementById("local_video");
  
    log("Closing the call");
  
    // Close the RTCPeerConnection
  
    if (myPeerConnection) {
      log("--> Closing the peer connection");
  
      // Disconnect all our event listeners; we don't want stray events
      // to interfere with the hangup while it's ongoing.
  
      myPeerConnection.ontrack = null;
      myPeerConnection.onnicecandidate = null;
      myPeerConnection.oniceconnectionstatechange = null;
      myPeerConnection.onsignalingstatechange = null;
      myPeerConnection.onicegatheringstatechange = null;
      myPeerConnection.onnotificationneeded = null;
  
      // Stop all transceivers on the connection
  
      //list의 transceiver를 만든 것을 가져와서 논다. 위의 트렌시버랑은 별개다. myPeerconnection 안에 있는 녀석들이다. 
      myPeerConnection.getTransceivers().forEach(transceiver => {
        transceiver.stop();
      });
  
      // Stop the webcam preview as well by pausing the <video>
      // element, then stopping each of the getUserMedia() tracks
      // on it.
  
      if (localVideo.srcObject) {
        // 왜 꼭 puase()를 먼저 해야만 하지?
        localVideo.pause();
        localVideo.srcObject.getTracks().forEach(track => {
          track.stop();
        });
      }
  
      // Close the peer connection
      //가장 마지막에 클로징 하네. 
      myPeerConnection.close();
      myPeerConnection = null;
      webcamStream = null;
    }
  
    // Disable the hangup button
  
    document.getElementById("hangup-button").disabled = true;
    targetUsername = null;
  }

  function handleHangUpMsg(msg) {
    log("*** Received hang up notification from other peer");
  
    closeVideoCall();
  }

  
function hangUpCall() {
  closeVideoCall();

  sendToServer({
    name: myUsername,
    target: targetUsername,
    type: "hang-up"
  });
}

function handleGetUserMediaError(e) {
  log_error(e);
  switch(e.name) {
    case "NotFoundError":
      alert("Unable to open your call because no camera and/or microphone" +
            "were found.");
      break;
    case "SecurityError":
    case "PermissionDeniedError":
      // Do nothing; this is the same as the user canceling the call.
      break;
    default:
      alert("Error opening your camera and/or microphone: " + e.message);
      break;
  }

  // Make sure we shut down our end of the RTCPeerConnection so we're
  // ready to try again.

  closeVideoCall();
}

function reportError(errMessage) {
  log_error(`Error ${errMessage.name}: ${errMessage.message}`);
}

  //   var msgJSON = JSON.stringify(msg); 등으로 메시지를 보내도록 하자. 
  socket.on('video-offer', (evt)=>{ var msg = JSON.parse(evt.data)
    handleVideoOfferMsg(msg)})
  socket.on('video-answer',(evt)=>{ var msg = JSON.parse(evt.data)
    handleVideoAnswerMsg(msg);})
  socket.on('new-ice-candidate',(evt)=>{ var msg = JSON.parse(evt.data)
    handleNewICECandidateMsg(msg);
  })
  socket.on('hang-up', (evt)=>{ var msg = JSON.parse(evt.data)
    handleHangUpMsg(msg)})
  useEffect(()=>{


  }, [])
  
  async function handleVideoOfferMsg(msg) {
    targetUsername = msg.name;
  
    log("Received video chat offer from " + targetUsername);
    if (!myPeerConnection) {
      createPeerConnection();
    }
  
    // We need to set the remote description to the received SDP offer
    // so that our local WebRTC layer knows how to talk to the caller.
  
    var desc = new RTCSessionDescription(msg.sdp);
  // 여기서 sdp는 
  // var msg = JSON.parse(evt.data); 에서 받은정보로 만든다. onmessage의 evt.data를 누가 어떻게 넣어줬는지 함 보자. 
  // sendToServer({
  //   name: myUsername,
  //   target: targetUsername,
  //   type: "video-offer",
  //   sdp: myPeerConnection
  
    // If the connection isn't stable yet, wait for it...
  
    if (myPeerConnection.signalingState != "stable") {
      log("  - But the signaling state isn't stable, so triggering rollback");
      // Set the local and remove descriptions for rollback; don't proceed
      // until both return.
      await Promise.all([
        myPeerConnection.setLocalDescription({type: "rollback"}),
        myPeerConnection.setRemoteDescription(desc)
      ]);
      return;
    } else {
      log ("  - Setting remote description");
      await myPeerConnection.setRemoteDescription(desc);
    }
  
    // Get the webcam stream if we don't already have it
  
    if (!webcamStream) {
      try {
        webcamStream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
      } catch(err) {
        handleGetUserMediaError(err);
        return;
      }
  
      document.getElementById("local_video").srcObject = webcamStream;
  
      // Add the camera stream to the RTCPeerConnection
  
      try {
        // debugger;
        // transceiver = 부분 생략 가능
        webcamStream.getTracks().forEach(
          transceiver = track => myPeerConnection.addTransceiver(track, {streams: [webcamStream]})
        );
  
        // Mediastream track 혹은 'video', 'audio' string == kind
        //  {streams: [webcamStream]} 이 부분은 옵션 부분이다. 
        //track은 그냥 트랙이고, mediaStream object는 전달 되서 나중에 저쪽에서 참조 한다. 
      } catch(err) {
        handleGetUserMediaError(err);
      }
    }
  
    log("---> Creating and sending answer to caller");
  
    await myPeerConnection.setLocalDescription(await myPeerConnection.createAnswer());
  
    sendToServer({
      name: myUsername,
      target: targetUsername,
      type: "video-answer",
      sdp: myPeerConnection.localDescription
    });
  }
  
  async function handleVideoAnswerMsg(msg) {
    log("*** Call recipient has accepted our call");
  
    // Configure the remote description, which is the SDP payload
    // in our "video-answer" message.
  
    var desc = new RTCSessionDescription(msg.sdp);
    await myPeerConnection.setRemoteDescription(desc).catch(reportError);
  }
  
  async function handleNewICECandidateMsg(msg) {
    var candidate = new RTCIceCandidate(msg.candidate);
  
    log("*** Adding received ICE candidate: " + JSON.stringify(candidate));
    try {
      await myPeerConnection.addIceCandidate(candidate)
    } catch(err) {
      reportError(err);
    }
  }


  const handleStart= ()=>{}
  const handleStop= ()=>{}

  useEffect(() => {
    return () => {
      if (streamingOn) {
        handleStop();
      }
    };
  }, [streamingOn]);
  return (
    <div>
      {!streamingOn ? (
        <StyledButton1 size={"1.2rem"} color="orange" onClick={handleStart}>
          <PlayCircleFilledIcon fontSize="large" />
          {owner ? "Start Streaming" : "Join Streaming"}
        </StyledButton1>
      ) : (
        <StyledButton1 size={"1.2rem"} color="red" onClick={handleStop}>
          <StopIcon fontSize="large" />
          {owner ? "Stop Streaming" : "Quit Streaming"}
        </StyledButton1>
      )}
    </div>
  );
})

export default WebRTCController;