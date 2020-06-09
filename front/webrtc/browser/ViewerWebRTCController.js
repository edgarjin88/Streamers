import { useEffect, useState, forwardRef } from "react";
import { StyledButton1 } from "../../components/CustomButtons";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useRouter } from "next/router";
import uuid from "react-uuid";
import {
  START_STREAMING_REQUEST,
  STOP_STREAMING_REQUEST,
} from "../../reducers/video";

import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
import StopIcon from "@material-ui/icons/Stop";
import { socket } from "../../components/socket/socket";

// uuid to besed for each rtc myPeerConnection id.  + receiver option for here

const WebRTCController = forwardRef(
  ({ currentVideoId, addStreamingDataToVideo }, ref) => {
    const [signalRoomId, setSignalRoomId] = useState(uuid());

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
    const chatRoomId = "a" + Router.query.id;

    useEffect(() => {
      console.log("viewer controller fired");
      return () => {
        if (streamingOn) {
          handleStop();
        }
      };
    }, [streamingOn]);

    console.log("this is ref from viewer:", ref);

    let rtcPeerConnection;
    let inboundStream;

    // 다른점 uuid
    // 리스트 없다는 점.
    // video 받아야 한다는 점.
    //constraint
    //createOffer를 직접 만들어야 한다. negotiationneeded 부분을 그대로 쓰면 된다.
    //offer to receiveaudio 를 써야 하고,
    //letlocaldescription까지 해야 icecandidate이 발생한다.

    // let signalRoomId = uuid();

    //description 부분
    //icecandidate 부분
    //행업 부분 이 파트로 나눠서 돌격해 보자.
    const handleNegotiationNeededEvent = async () => {
      var mediaConstraints = {
        mandatory: {
          OfferToReceiveAudio: true,
          OfferToReceiveVideo: true,
        },
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      };
      // var mediaConstraints = {
      //   mandatory: {
      //     OfferToReceiveAudio: true,
      //     OfferToReceiveVideo: true,
      //   },
      //   offerToReceiveAudio: true,
      //   offerToReceiveVideo: true,
      // };

      log("*** Negotiation needed", 4);
      try {
        log("---> Creating offer");
        const offer = await rtcPeerConnection.createOffer(mediaConstraints);

        if (rtcPeerConnection.signalingState != "stable") {
          log("     -- The connection isn't stable yet; postponing...");
          return;
        }

        log("---> Setting local description to the offer");
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

    const createPeerConnection = () => {
      log("createPeerConnection fired :Setting up a connection...", 2);

      rtcPeerConnection = new RTCPeerConnection({
        iceServers: [
          {
            url: "stun:stun.l.google.com:19302",
          },
        ],
      });

      rtcPeerConnection.onicecandidate = handleICECandidateEvent;

      rtcPeerConnection.oniceconnectionstatechange = handleICEConnectionStateChangeEvent;
      rtcPeerConnection.onicegatheringstatechange = handleICEGatheringStateChangeEvent;
      rtcPeerConnection.onsignalingstatechange = handleSignalingStateChangeEvent;
      rtcPeerConnection.onnegotiationneeded = handleNegotiationNeededEvent;

      rtcPeerConnection.ontrack = handleTrackEvent;

      log(`handleNegotiationNeeded fired for createPeerConnection :`, 3);
      handleNegotiationNeededEvent();
    };

    // pc.ontrack = (ev) => {
    //   if (ev.streams && ev.streams[0]) {
    //     videoElem.srcObject = ev.streams[0];
    //   } else {
    //     if (!inboundStream) {
    //       inboundStream = new MediaStream();
    //       videoElem.srcObject = inboundStream;
    //     }
    //     inboundStream.addTrack(ev.track);
    //   }
    // };
    const handleTrackEvent = (event) => {
      log("*** Track event");
      console.log("ref.current :", ref.current);
      console.log("event :", event);
      console.log(" event.streams[0]:", event.streams[0]);
      if (ref.current) {
        // if (!inboundStream) {
        ref.current.srcObject = event.streams[0];
      }
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
    };

    const handleHangUpMsg = (msg) => {
      log("*** Received hang up notification from other peer");
      // 이 부분이 달라져야 할듯.원본 참조 하고,
      //   내가 상대방의 콜을 끊을 자격은 없게 하자.

      closeVideoCall();
    };

    const hangUpCall = () => {
      log("hangup call fired. video would be removed");
      var localVideo = ref.current;
      if (localVideo.srcObject) {
        localVideo.pause();
        localVideo.srcObject.getTracks().forEach((track) => {
          track.stop();
        });
        streamingData = null;
      }
      closeVideoCall();
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
      log("Received video chat offer from broadcaster");
      const signalRoomId = msg.signalRoomId;
      if (!rtcPeerConnection) {
        createPeerConnection(signalRoomId);
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

    const handleStart = () => {
      socket.emit("new_viewer_join_RTCConnection", {
        userName: me.nickname,
        userId: me.id,
        chatRoom: chatRoomId,
        signalRoomId: signalRoomId,
        type: "offer_to_signal_room",
      });
    };

    useEffect(() => {
      // setSignalRoomId(uuid());
      socket.on("new_broadcaster_join_RTCConnection", (data) => {
        console.log("new_broadcaster_join_RTCConnection fired ", data);
        createPeerConnection(signalRoomId);
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
    }, []);
    const handleStop = () => {};

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
