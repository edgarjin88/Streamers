import { useEffect, useState, forwardRef, useRef } from "react";
import { StyledButton1 } from "../../components/CustomButtons";
import { useDispatch, useSelector, shallowEqual, connect } from "react-redux";
import { useRouter } from "next/router";

import {
  START_STREAMING_REQUEST,
  STOP_STREAMING_REQUEST,
} from "../../reducers/video";

import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
import StopIcon from "@material-ui/icons/Stop";
import { socket } from "../../components/socket/socket";

const WebRTCController = forwardRef(
  ({ currentVideoId, addStreamingDataToVideo }, ref) => {
    // forwardref 사용하기

    const log = (message, order) => {
      console.log(`order [${order}]. message: ${message}`);
    };

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
    console.log("this is ref :", ref);

    // const webRTCList = {};
    const handlePlay = async () => {
      log("userMedia fired");
      navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: true,
        })
        .then((stream) => {
          if (ref.current) {
            streamingData = stream;
            ref.current.srcObject = streamingData;
          }
        })
        .catch((e) => {
          console.log("error getting usermedia :", e);
          handleGetUserMediaError(e);
        });
    };

    ///rtc start

    const RTCList = useRef({});
    // connection이 들어오면, 여기다가 push 한다.
    //client 쪽에서는 uuid로 아이디를 만들어서 메시지를 보낼때 같이 보낸다.

    const sendToServer = (data) => {
      socket.emit("message_from_broadcaster", data);
    };

    const handleNegotiationNeededEvent =(signalRoomId) =>{
      const rtcPeerConnection = RTCList[signalRoomId];
      log("*** Negotiation needed", 3);
      try {
        log("---> Creating offer");
        const offer = await rtcPeerConnection.createOffer();

        if (rtcPeerConnection.signalingState != "stable") {
          log("     -- The connection isn't stable yet; postponing...");
          return;
        }

        log("---> Setting local description to the offer");
        await rtcPeerConnection.setLocalDescription(offer);

        log("---> Sending the offer to the remote peer");
        sendToServer({
          userName: myUsername,
          signalRoomId: signalRoomId,
          type: "video-offer",
          sdp: rtcPeerConnection.localDescription,
        });
      } catch (err) {
        log(
          "*** The following error occurred while handling the negotiationneeded event:"
        );
        reportError(err);
      }
    }

    const addTrackToPeerConnection =(signalRoomId)=>{
      log(`this is signalRoomId :${signalRoomId}`, 3);
      if (streamingData && RTCList[signalRoomId]) {
        try {
          streamingData.getTracks().forEach(
            (transceiver = (track) =>
              RTCList[signalRoomId].addTransceiver(track, {
                streams: [streamingData],
              })) // array
          );
        } catch (err) {
          handleGetUserMediaError(err);
        }
      }
    }

    const createPeerConnection =(signalRoomId)=> {
      log("createPeerConnection fired :Setting up a connection...", 2);

      RTCList[signalRoomId] =new RTCPeerConnection({
        iceServers: [
          {
            url: "stun:stun.l.google.com:19302",
          },
        ],
      });

      const rtcPeerConnection = RTCList[signalRoomId];

      rtcPeerConnection.onicecandidate = (event) => {
        log(`onicecandidate fired. signalRoomId : ${signalRoomId}`, 9);
        handleICECandidateEvent(event, signalRoomId);
      };
      rtcPeerConnection.oniceconnectionstatechange = (event) => {
        log(
          `oniceconnectionstatechange fired. fired. signalRoomId :${signalRoomId}`
        );

        handleICEConnectionStateChangeEvent(event, rtcPeerConnection);
      };
      rtcPeerConnection.onicegatheringstatechange = (event) => {
        log(
          `onicegatheringstatechange fired. fired. signalRoomId :${signalRoomId}`,
          5
        );

        handleICEGatheringStateChangeEvent(event, rtcPeerConnection);
      };

      rtcPeerConnection.onsignalingstatechange = (event) => {
        log(
          `handleSignalingStateChangeEvent fired. signalRoomId :${signalRoomId}`,
          10
        );
        handleSignalingStateChangeEvent(event, rtcPeerConnection);
      };

      rtcPeerConnection.onnegotiationneeded = (event) => {
        log(`handleNegotiationNeededEvent fired. signalRoomId :`, 4);

        handleNegotiationNeededEvent(event, signalRoomId);
      };
      rtcPeerConnection.ontrack = (event) => {
        log(`ontrack fired. signalRoomId :`, 4);

        handleTrackEvent(event, signalRoomId);
      };

      addTrackToPeerConnection(signalRoomId);
    }

    const handleTrackEvent =(event)=> {
      log("handleTrackEvent fired, but not required for broadcaster");
    }

    const handleICECandidateEvent =(event, signalRoomId) =>{
      if (event.candidate) {
        log("*** Outgoing ICE candidate: " + event.candidate.candidate, 4);

        sendToServer({
          type: "new-ice-candidate",
          signalRoomId: signalRoomId,
          candidate: event.candidate,
        });
      }
    }

    const handleICEConnectionStateChangeEvent =(event, rtcPeerConnection)=> {
      log("*** rtcPeerConnection empty? " + rtcPeerConnection);

      log(
        "*** ICE connection state changed to " +
          rtcPeerConnection.iceConnectionState
      );

      switch (rtcPeerConnection.iceConnectionState) {
        case "closed":
        case "failed":
        case "disconnected":
          closeVideoCall();
          break;
      }
    }

    const handleSignalingStateChangeEvent =(event, rtcPeerConnection)=> {
      log("*** rtcPeerConnection empty? " + rtcPeerConnection);

      log(
        "*** WebRTC signaling state changed to: " +
          rtcPeerConnection.signalingState
      );
      switch (rtcPeerConnection.signalingState) {
        case "closed":
          closeVideoCall(rtcPeerConnection);
          break;
      }
    } // 이 부분도 broad caster 쪽에서만 필요하다.
    //peerconnection은 항상 scope 되어야 한다.
const handleICEGatheringStateChangeEvent=(event)=> {
      log(
        "*** ICE gathering state changed to: " +
          rtcPeerConnection.iceGatheringState
      );
    }

    const closeVideoCall=(rtcPeerConnection)=> {
      log("Closing the call");
      // Close the RTCPeerConnection
      if (rtcPeerConnection) {
        log("--> Closing the peer connection");

        // Disconnect all our event listeners; we don't want stray events
        // to interfere with the hangup while it's ongoing.
        rtcPeerConnection.ontrack = null;
        rtcPeerConnection.onnicecandidate = null;
        rtcPeerConnection.oniceconnectionstatechange = null;
        rtcPeerConnection.onsignalingstatechange = null;
        rtcPeerConnection.onicegatheringstatechange = null;
        rtcPeerConnection.onnotificationneeded = null;

        // Stop all transceivers on the connection

        //list의 transceiver를 만든 것을 가져와서 논다. 위의 트렌시버랑은 별개다. rtcPeerConnection 안에 있는 녀석들이다.
        rtcPeerConnection.getTransceivers().forEach((transceiver) => {
          transceiver.stop();
        });

        rtcPeerConnection.close();
        rtcPeerConnection = null;
        
      }

      // Disable the hangup button

      // document.getElementById("hangup-button").disabled = true;
      // targetUsername = null;
    }

    const handleHangUpMsg =(msg)=> {
      log("*** Received hang up notification from other peer");

      closeVideoCall();
    }

    const hangUpCall=()=> {
      log("hangup call fired. video would be removed");
      var localVideo = ref.current;
      if (localVideo.srcObject) {
        // pause first
        localVideo.pause();
        localVideo.srcObject.getTracks().forEach((track) => {
          track.stop();
        });
        streamingData = null;
      }
      closeVideoCall();
      sendHangUpMessageToEveryone();
    }

    const sendHangUpMessageToEveryone=()=> {
      const RTCListKeys = Object.keys(RTCList);
      console.log("RTCListKeys :", RTCListKeys);
      RTCListKeys.forEach((el) => {
        log("to signal room :" + el);
        socket.emit("hang_up_message", { signalRoomId: el, type: "hang-up" });
      });

      RTCList = useRef([]); //empty the rtc list here
    }
    const handleGetUserMediaError= (e)=> {
      log_error(e);
      switch (e.name) {
        case "NotFoundError":
          alert(
            "Unable to open your call because no camera and/or microphone" +
              "were found."
          );
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
      hangUpCall();
      sendHangUpMessageToEveryone();
    }

    const reportError= (errMessage)=> {
      log_error(`Error ${errMessage.name}: ${errMessage.message}`);
    }

    //   var msgJSON = JSON.stringify(msg); 등으로 메시지를 보내도록 하자.

    // client can only send offer to receive
    // each message should have signal room id
    socket.on("message_from_viewer", (data) => {
      var msg = JSON.parse(data);
      console.log("message_from_viewer type of data :", typeof msg);
      log(`message from viewer data : ${data}, JSON msg :${msg}`);
      if (msg.type === "video-offer") {
        handleVideoOfferMsg(msg);
      }
      if (msg.type === "video-answer") {
        handleVideoAnswerMsg(msg);
      }
      if (msg.type === "new-ice-candidate") {
        handleNewICECandidateMsg(msg);
      }
      if (msg.type === "hang-up") {
        handleHangUpMsg(msg);
      }
    });

    const handleVideoOfferMsg =(msg) =>{
      log("Received video chat offer from viewer");
      const signalRoomId = msg.signalRoomId;
      if (!RTCList[signalRoomId]) {
        createPeerConnection(signalRoomId)
      }
      const rtcPeerConnection = RTCList[signalRoomId];
      log(`rtcPeerConnection empty? : ${rtcPeerConnection}`);

      var desc = new RTCSessionDescription(msg.sdp);
      if (rtcPeerConnection.signalingState != "stable") {
        log("  - But the signaling state isn't stable, so triggering rollback");
        await Promise.all([
          rtcPeerConnection.setLocalDescription({ type: "rollback" }),
          rtcPeerConnection.setRemoteDescription(desc),
        ]);

        return;
      } else {
        log("  - Setting remote description");
        await rtcPeerConnection.setRemoteDescription(desc);
      }

      log("---> Creating and sending answer to caller");
      await rtcPeerConnection.setLocalDescription(
        await rtcPeerConnection.createAnswer()
      );

      sendToServer({
        userName: nickname,
        userId: me.id,
        type: "video-answer",
        signalRoomId: signalRoomId,
        sdp: rtcPeerConnection.localDescription,
      });
    }

    const handleVideoAnswerMsg =(msg)=> {
      log("*** Call recipient has accepted our call");
      var desc = new RTCSessionDescription(msg.sdp);
      await RTCList[msg.signalRoomId].setRemoteDescription(desc).catch(reportError);
    }

    const handleNewICECandidateMsg=(msg) =>{
      var candidate = new RTCIceCandidate(msg.candidate);

      log("*** Adding received ICE candidate: " + JSON.stringify(candidate));
      try {
        await RTCList[msg.signalRoomId].addIceCandidate(candidate);
      } catch (err) {
        reportError(err);
      }
    }

    const handleStart = () => {};
    const handleStop = () => {};

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
  }
);

export default WebRTCController;
