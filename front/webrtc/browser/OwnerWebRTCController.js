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
    let streamingData;
    let videoRef = ref;
    console.log("this is ref :", videoRef);

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
            videoRef.current.srcObject = streamingData;
          }
        })
        .catch((e) => {
          console.log("error getting usermedia :", e);
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

    // 문제가, 위에서 포워드 레프 하면 위의 컴퍼넌트가 변화되서 아래도 리렌더 되는 거임.
    const addTrackToPeerConnection = async (signalRoomId) => {
      log(
        `addTrackToPeerConnection fired. is signalRoomId :${signalRoomId}`,
        3
      );
      if (streamingData && RTCList[signalRoomId]) {
        console.log("we have stream here: ", streamingData);
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
        console.log("onicecandidate fired. signalRoomId", event);
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
          // closeVideoCall();
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

        // Disconnect all our event listeners; we don't want stray events
        // to interfere with the hangup while it's ongoing.
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

    // const hangUpCall = () => {
    //   log("hangup call fired. video would be removed");
    //   var localVideo = ref.current;
    //   if (localVideo.srcObject) {
    //     // pause first
    //     localVideo.pause();
    //     localVideo.srcObject.getTracks().forEach((track) => {
    //       track.stop();
    //     });
    //     streamingData = null;
    //   }
    //   closeVideoCall();
    //   sendHangUpMessageToEveryone();
    // };

    const sendHangUpMessageToEveryone = () => {
      const RTCListKeys = Object.keys(RTCList);

      if (RTCListKeys.length > 0) {
        console.log("RTCListKeys :", RTCListKeys);
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
      // hangUpCall();
      sendHangUpMessageToEveryone();
    };

    const reportError = (errMessage) => {
      log_error(`Error ${errMessage.name}: ${errMessage.message}`);
    };

    const log_error = (text) => {
      var time = new Date();

      console.trace("[" + time.toLocaleTimeString() + "] " + text);
    };

    //   var msgJSON = JSON.stringify(msg); 등으로 메시지를 보내도록 하자.

    // client can only send offer to receive
    // each message should have signal room id

    const handleVideoOfferMsg = async (msg) => {
      // log("Received video chat offer from viewer")
      console.log("handleVideoOfferMsg :", msg);
      const signalRoomId = msg.signalRoomId;
      if (!RTCList[signalRoomId]) {
        createPeerConnection(msg);
        console.log(
          "과연 싱크로너스 하게 흘러갈까? after Received video chat offer from viewer "
        );
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

      // addTrackToPeerConnection(signalRoomId);
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
      var desc = new RTCSessionDescription(msg.sdp);
      await RTCList[msg.signalRoomId]
        .setRemoteDescription(desc)
        .catch(reportError);
    };

    const handleNewICECandidateMsg = async (msg) => {
      var candidate = new RTCIceCandidate(msg.candidate);

      console.log('"*** Adding received ICE candidate , :', candidate);
      console.log(
        '"*** RTCList[msg.signalRoomId] , :',
        RTCList[msg.signalRoomId]
      );
      try {
        await RTCList[msg.signalRoomId].addIceCandidate(candidate);
      } catch (err) {
        reportError(err);
      }
    };

    const handleStart = () => {
      dispatch({
        type: START_STREAMING_REQUEST,
      });
      handlePlay();
    };

    const handleStop = useCallback(() => {
      const RTCListKeys = Object.keys(RTCList);
      console.log("handle stop fired :", RTCListKeys);
      if (RTCListKeys.length > 0) {
        RTCListKeys.forEach((el) => {
          console.log("this is el :", el);
          closeVideoCall(RTCList[el]);
        });
        sendHangUpMessageToEveryone();
      }

      if (videoRef.current.srcObject) {
        console.log("inside ");
        videoRef.current.pause();
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
        console.log("after :", videoRef.current.srcObject);
      }
      dispatch({
        type: STOP_STREAMING_REQUEST,
      });
    }, [RTCList, streamingOn]);

    useEffect(() => {
      socket.on("broadcaster_join_completed", (data) => {
        console.log("broadcaster_join_completed fired :", data);
        createPeerConnection(data);
      });
      socket.on("invite_broadcaster", (data) => {
        console.log("data :", data);
        log(`invite_brodcaster  fired data ${data}`);
        socket.emit("new_broadcaster_join_RTCConnection", {
          userName: me.nickname,
          userId: me.id,
          signalRoomId: data.signalRoomId,
          type: "answer_to_signal_room",
        });
      });
      socket.on("message_from_viewer", (data) => {
        var msg = data;
        console.log("message_from_viewer type of data :", typeof msg);
        console.log(" message_from_viewer data: ", data);
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
    }, []);

    useEffect(() => {
      return () => {
        if (streamingOn) {
          handleStop();
        }
      };
    }, []);
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
