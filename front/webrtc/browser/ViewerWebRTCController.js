import { useEffect, useState, useRef, forwardRef, useCallback } from "react";
import { StyledButton1 } from "../../components/CustomButtons";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useRouter } from "next/router";
import uuid from "react-uuid";
import { JOIN_STREAMING, QUIT_STREAMING } from "../../reducers/video";

import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
import StopIcon from "@material-ui/icons/Stop";
import { socket } from "../../components/socket/socket";

const signalRoomId = uuid();
let rtcPeerConnection;

const WebRTCController = forwardRef(
  ({ currentVideoId, addStreamingDataToVideo }, ref) => {
    const videoRef = ref;
    const log = (message, order) => {
      console.log(`order [${order}]. message: ${message}`);
    };

    const dispatch = useDispatch();
    const { streamingOn, currentVideoOwner, me, onList } = useSelector(
      (state) => {
        return {
          onList: state.video.onList,
          streamingOn: state.video.streamingOn,
          currentVideoOwner: state.video.currentVideo.UserId,
          me: state.user && state.user.me,
        };
      },
      shallowEqual
    );

    const Router = useRouter();
    const chatRoomId = "a" + Router.query.id;

    const streaming = onList.includes(currentVideoId);
    console.log("streaming :", streaming);
    console.log("onList :", onList);
    console.log("currentVideoId :", currentVideoId);
    const handleNegotiationNeededEvent = async () => {
      log("*** Negotiation needed", 4);
      try {
        log("---> Creating offer");

        const offer = await rtcPeerConnection.createOffer();

        if (rtcPeerConnection.signalingState != "stable") {
          log("     -- The connection isn't stable yet; postponing...");
          return;
        }

        log("---> Setting local description to the offer");
        console.log("negotiationneeded signalroom  :", signalRoomId);
        await rtcPeerConnection.setLocalDescription(offer);
        // icecandidate would be made at this point
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

    const createPeerConnection = async () => {
      log("createPeerConnection fired :Setting up a connection...", 2);

      rtcPeerConnection = new RTCPeerConnection({
        sdpSemantics: "unified-plan",
      });
      // rtcPeerConnection = new RTCPeerConnection({
      //   sdpSemantics: "unified-plan",
      //   iceServers: [
      //     {
      //       urls: "stun:stun.l.google.com:19302",
      //     },
      //   ],
      // });

      rtcPeerConnection.addTransceiver("audio", {
        direction: "recvonly",
      });

      rtcPeerConnection.addTransceiver("video", {
        direction: "recvonly",
      });

      rtcPeerConnection.onicecandidate = handleICECandidateEvent;

      rtcPeerConnection.oniceconnectionstatechange = handleICEConnectionStateChangeEvent;
      rtcPeerConnection.onicegatheringstatechange = handleICEGatheringStateChangeEvent;
      rtcPeerConnection.onsignalingstatechange = handleSignalingStateChangeEvent;
      rtcPeerConnection.onnegotiationneeded = handleNegotiationNeededEvent;

      rtcPeerConnection.ontrack = handleTrackEvent;

      log(`handleNegotiationNeeded fired for createPeerConnection :`, 3);
      // handleNegotiationNeededEvent();
    };

    const handleTrackEvent = ({ transceiver, streams: [stream] }) => {
      log("*** Track event");
      console.log("ref.current :", videoRef);
      console.log("transceiver.receiver.track :", transceiver.receiver.track);

      transceiver.receiver.track.onunmute = () => {
        log("transceiver.receiver.track.onunmute");
        // ref.current.srcObject = stream;
        addStreamingDataToVideo(stream);
        // ref.current.srcObject = stream;
      };
    };

    console.log("signal before handleIcecandidate :", signalRoomId);

    const handleICECandidateEvent = (event) => {
      console.log("signal room :", signalRoomId);
      if (event.candidate) {
        log("*** Outgoing ICE candidate: " + event.candidate.candidate, 4);
        sendToServer({
          type: "new-ice-candidate",
          signalRoomId: signalRoomId,
          candidate: event.candidate,
        });
      }
    };

    const handleICEConnectionStateChangeEvent = (event) => {
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

    const handleSignalingStateChangeEvent = (event) => {
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

    const handleICEGatheringStateChangeEvent = (event) => {
      log(
        "*** ICE gathering state changed to: " +
          rtcPeerConnection.iceGatheringState
      );
    };

    const closeVideoCall = (rtcPeerConnection) => {
      log("Closing the call");
      // Close the RTCPeerConnection
      if (rtcPeerConnection) {
        log("--> Closing the peer connection");

        console.log("rtc before :", rtcPeerConnection);
        rtcPeerConnection.ontrack = null;
        rtcPeerConnection.onnicecandidate = null;
        rtcPeerConnection.oniceconnectionstatechange = null;
        rtcPeerConnection.onsignalingstatechange = null;
        rtcPeerConnection.onicegatheringstatechange = null;
        rtcPeerConnection.onnotificationneeded = null;

        rtcPeerConnection.close();
        rtcPeerConnection = null;
        console.log("rtc after :", rtcPeerConnection);
      }
    };

    const handleHangUpMsg = (msg) => {
      log("*** Received hang up notification from other peer");
      closeVideoCall();
    };

    const reportError = (errMessage) => {
      log_error(`Error ${errMessage.name}: ${errMessage.message}`);
    };
    const log_error = (text) => {
      var time = new Date();

      console.trace("[" + time.toLocaleTimeString() + "] " + text);
    };

    const handleVideoOfferMsg = async (msg) => {
      log("Received video chat offer from broadcaster");
      const signalRoomId = msg.signalRoomId;
      if (!rtcPeerConnection) {
        createPeerConnection();
      }
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
      await rtcPeerConnection.setLocalDescription(
        await rtcPeerConnection.createAnswer()
      );

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
      console.log("handleVideoAnswerMsg: ", msg);
      var desc = new RTCSessionDescription(msg.sdp);
      await rtcPeerConnection.setRemoteDescription(desc).catch(reportError);
      log(`rtcPeerConnection empty? : ${rtcPeerConnection}`);

      log("  -signal stable.  Setting remote description");
    };

    const handleNewICECandidateMsg = async (msg) => {
      var candidate = new RTCIceCandidate(msg.candidate);

      console.log('"*** Adding received ICE candidate , :', candidate);
      try {
        await rtcPeerConnection.addIceCandidate(candidate);
      } catch (err) {
        reportError(err);
      }
    };

    const sendToServer = (data) => {
      socket.emit("message_from_viewer", data);
    };

    useEffect(() => {
      socket.on("broadcaster_left_room", (data) => {
        console.log("broadcaster_left_room fired");
        handleStop();
      });
      socket.on("new_broadcaster_join_RTCConnection", (data) => {
        console.log("new_broadcaster_join_RTCConnection fired ", data);
        createPeerConnection();
      });
      socket.on("message_from_broadcaster", (data) => {
        var msg = data;
        console.log("message_from_broadcaster type of data :", typeof msg);
        log(`message_from_broadcaster data : ${data}, JSON msg :${msg}`);
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
    }, [signalRoomId, rtcPeerConnection]);

    const handleStart = useCallback(() => {
      if (streaming === true) {
        dispatch({
          type: JOIN_STREAMING,
        });
        socket.emit("new_viewer_join_RTCConnection", {
          userName: me.nickname,
          userId: me.id,
          chatRoom: chatRoomId,
          signalRoomId: signalRoomId,
          type: "offer_to_signal_room",
        });
      } else {
        alert("Currently this channel is not on live");
      }
    }, [streaming]);

    const handleStop = useCallback(() => {
      // console.log("usecallback  peerconnection : ", rtcPeerConnection);
      closeVideoCall(rtcPeerConnection);

      if (videoRef.current && videoRef.current.srcObject) {
        console.log("video src stopping");
        videoRef.current.pause();
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
        console.log("after :", videoRef.current.srcObject);
        videoRef.current.srcObject = null;
      }
      socket.emit("viewer_left_room", {
        userName: me.nickname,
        signalRoomId: signalRoomId,
      });

      dispatch({
        type: QUIT_STREAMING,
      });
    }, [rtcPeerConnection]);

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
            Join Streaming
          </StyledButton1>
        ) : (
          <StyledButton1 size={"1.2rem"} color="red" onClick={handleStop}>
            <StopIcon fontSize="large" />
            Quit Streaming
          </StyledButton1>
        )}
      </div>
    );
  }
);

export default WebRTCController;
