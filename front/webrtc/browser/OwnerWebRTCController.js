import { useEffect, useState, useCallback, forwardRef, useRef } from "react";
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

let RTCList = {};
let streamingData;

const WebRTCController = forwardRef(
  ({ currentVideoId, addStreamingDataToVideo }, ref) => {
    const log = (message, order) => {
      console.log(`order [${order}]. message: ${message}`);
    };

    const dispatch = useDispatch();
    const { streamingOn, currentVideoOwner, me } = useSelector((state) => {
      return {
        streamingOn: state.video.streamingOn,
        currentVideoOwner: state.video.currentVideo.UserId,
        me: state.user && state.user.me,
      };
    }, shallowEqual);
    const owner = me.id === currentVideoOwner;
    const Router = useRouter();
    const queryId = Router.query.id;
    let videoRef = ref;

    const handlePlay = async () => {
      log("userMedia fired");
      navigator.mediaDevices
        .getUserMedia({
          audio: true,
          video: { width: 1280, height: 720 },
        })
        .then((stream) => {
          if (videoRef.current) {
            streamingData = stream;
            // console.log("streaming data here : ", streamingData);
            videoRef.current.srcObject = streamingData;
          }
        })
        .catch((e) => {
          // console.log("error getting usermedia :", e);
          handleGetUserMediaError(e);
        });
    };

    const sendToServer = (data) => {
      socket.emit("message_from_broadcaster", data);
    };

    const handleNegotiationNeededEvent = async (
      event,
      signalRoomId,
      rtcPeerConnection
    ) => {
      log("*** Negotiation needed", 4);
      try {
        log("---> Creating offer");
        const offer = await rtcPeerConnection.createOffer();

        if (rtcPeerConnection.signalingState != "stable") {
          log("     -- The connection isn't stable yet; postponing...");
          return;
        }

        log("---> Setting local description to the offer");
        await rtcPeerConnection.setLocalDescription(offer);
        // icecandidate will fire here
        log("---> Sending the offer to the remote peer");
        sendToServer({
          userName: me.nickname,
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
    };

    const addTrackToPeerConnection = async (signalRoomId) => {
      log(
        `addTrackToPeerConnection fired. is signalRoomId :${signalRoomId}`,
        3
      );
      if (streamingData && RTCList[signalRoomId]) {
        try {
          let audio = await streamingData.getAudioTracks()[0];
          let video = await streamingData.getVideoTracks()[0];

          RTCList[signalRoomId].addTransceiver(audio, {
            direction: "sendonly",
            streams: [streamingData],
          });

          RTCList[signalRoomId].addTransceiver(video, {
            direction: "sendonly",
            streams: [streamingData],
          });
        } catch (err) {
          handleGetUserMediaError(err);
        }
      }
    };
    const createPeerConnection = (data) => {
      // console.log("streaming data here inside peerconnection: ", streamingData);

      log("createPeerConnection fired :Setting up a connection...", 2);
      const signalRoomId = data.signalRoomId;
      RTCList[signalRoomId] = new RTCPeerConnection({
        sdpSemantics: "unified-plan",
        iceServers: [
          {
            urls: "stun:stun.l.google.com:19302",
          },
        ],
      });

      const rtcPeerConnection = RTCList[signalRoomId];
      addTrackToPeerConnection(signalRoomId);

      rtcPeerConnection.onicecandidate = (event) => {
        log(`onicecandidate fired. signalRoomId : ${signalRoomId}`, 5);
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
        handleNegotiationNeededEvent(event, signalRoomId, rtcPeerConnection);
      };
      rtcPeerConnection.ontrack = (event) => {
        log(`ontrack fired. signalRoomId :`, 4);

        handleTrackEvent(event);
      };
    };

    const handleTrackEvent = (event) => {
      log("handleTrackEvent fired, but not required for broadcaster");
    };

    const handleICECandidateEvent = (event, signalRoomId) => {
      if (event.candidate) {
        log("*** Outgoing ICE candidate: " + event.candidate.candidate, 4);

        sendToServer({
          type: "new-ice-candidate",
          signalRoomId: signalRoomId,
          candidate: event.candidate,
        });
      }
    };

    const handleICEConnectionStateChangeEvent = (event, rtcPeerConnection) => {
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
    };

    const handleSignalingStateChangeEvent = (event, rtcPeerConnection) => {
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
    };

    const handleICEGatheringStateChangeEvent = (event, rtcPeerConnection) => {
      log(
        "*** ICE gathering state changed to: " +
          rtcPeerConnection.iceGatheringState
      );
    };

    const closeVideoCall = (rtcPeerConnection) => {
      log("Closing the call");
      // Close the RTCPeerConnection
      if (rtcPeerConnection) {
        log("--> Closing the peer connection fired :");

        rtcPeerConnection.ontrack = null;
        rtcPeerConnection.onnicecandidate = null;
        rtcPeerConnection.oniceconnectionstatechange = null;
        rtcPeerConnection.onsignalingstatechange = null;
        rtcPeerConnection.onicegatheringstatechange = null;
        rtcPeerConnection.onnotificationneeded = null;

        rtcPeerConnection.close();
        rtcPeerConnection = null;
      }
    };

    const sendHangUpMessageToEveryone = () => {
      const RTCListKeys = Object.keys(RTCList);

      if (RTCListKeys.length > 0) {
        // console.log("RTCListKeys :", RTCListKeys);
        RTCListKeys.forEach((el) => {
          log("to signal room :" + el);
          socket.emit("hang_up_message", { signalRoomId: el, type: "hang-up" });
        });

        RTCList = {}; //empty the rtc list here
      }
    };
    const handleGetUserMediaError = (e) => {
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
      sendHangUpMessageToEveryone();
    };

    const reportError = (errMessage) => {
      log_error(`Error ${errMessage.name}: ${errMessage.message}`);
    };

    const log_error = (text) => {
      var time = new Date();

      console.trace("[" + time.toLocaleTimeString() + "] " + text);
    };

    const handleVideoOfferMsg = async (msg) => {
      // console.log("handleVideoOfferMsg :", msg);
      const signalRoomId = msg.signalRoomId;
      if (!RTCList[signalRoomId]) {
        createPeerConnection(msg);
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
        log("  -signal stable.  Setting remote description");
        await rtcPeerConnection.setRemoteDescription(desc);
      }

      log("---> Creating and sending answer to caller");
      const answer = await rtcPeerConnection.createAnswer();
      await rtcPeerConnection.setLocalDescription(answer);

      sendToServer({
        userName: me.nickname,
        userId: me.id,
        type: "video-answer",
        signalRoomId: signalRoomId,
        sdp: rtcPeerConnection.localDescription,
      });
    };

    const handleVideoAnswerMsg = async (msg) => {
      log("*** Call recipient has accepted our call");
      // console.log("rtc List !!!: ", RTCList);

      var desc = new RTCSessionDescription(msg.sdp);
      await RTCList[msg.signalRoomId]
        .setRemoteDescription(desc)
        .catch(reportError);
    };

    const handleNewICECandidateMsg = async (msg) => {
      // console.log("rtc List !!!: ", RTCList);

      var candidate = new RTCIceCandidate(msg.candidate);

      // console.log('"*** Adding received ICE candidate , :', candidate);
      // console.log(
      //   '"*** RTCList[msg.signalRoomId] , :',
      //   RTCList[msg.signalRoomId]
      // );
      try {
        await RTCList[msg.signalRoomId].addIceCandidate(candidate);
      } catch (err) {
        reportError(err);
      }
    };

    const handleStart = () => {
      dispatch({
        type: START_STREAMING_REQUEST,
        videoId: currentVideoId,
        data: "ON",
      });
      handlePlay();
    };

    const handleStop = useCallback(() => {
      const RTCListKeys = Object.keys(RTCList);
      if (RTCListKeys.length > 0) {
        RTCListKeys.forEach((el) => {
          closeVideoCall(RTCList[el]);

          socket.emit("broadcaster_left_room", {
            userName: me.nickname,
            signalRoomId: el,
          });
        });
        sendHangUpMessageToEveryone();
      }

      if (streamingData) {
        streamingData.getTracks().forEach((track) => track.stop());
      }

      dispatch({
        type: STOP_STREAMING_REQUEST,
        videoId: currentVideoId,
        data: "OFF",
      });
    }, [RTCList, streamingOn]);

    useEffect(() => {
      socket.on("viewer_left_room", (data) => {
        const signalRoomId = data.signalRoomId;
        socket.emit("broadcaster_left_room", {
          userName: me.nickname,
          signalRoomId: data.signalRoomId,
        });

        if (RTCList[signalRoomId]) {
          closeVideoCall(RTCList[signalRoomId]);
          delete RTCList[signalRoomId];
        }
      });
      socket.on("broadcaster_join_completed", (data) => {
        createPeerConnection(data);
      });
      socket.on("invite_broadcaster", (data) => {
        socket.emit("new_broadcaster_join_RTCConnection", {
          userName: me.nickname,
          userId: me.id,
          signalRoomId: data.signalRoomId,
          type: "answer_to_signal_room",
        });
      });
      socket.on("message_from_viewer", (data) => {
        var msg = data;
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
          // handleHangUpMsg(msg);
        }
      });
    }, [streamingData, RTCList, queryId]);

    useEffect(() => {
      return () => {
        handleStop();
      };
    }, []);
    useEffect(() => {
      handleStop();
    }, [queryId]);
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
