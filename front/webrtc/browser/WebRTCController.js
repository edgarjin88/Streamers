import { useEffect, useState, forwardRef } from "react";
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

const WebRTCController = forwardRef(
  ({ currentVideoId, addStreamingDataToVideo }, ref) => {
    // forwardref 사용하기

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
    let streamingData;

    console.log("this is ref :", ref);

    const handlePlay = async () => {
      console.log("before handleplay :", streamingData);
      navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: true,
        })
        .then((stream) => {
          if (ref.current) {
            streamingData = stream;
            console.log("after handleplay :", streamingData);
            ref.current.srcObject = streamingData;
          }
        });
    };

    let peerConnection;

    // 이거 이대로는 안된다. peerconnection이 계속 끊길 것이다. 특히 broadcaster 쪽은 더욱.
    // peerconnection이 global 이어서는 안됨.

    const sendLocalDesc = async (desc, signalRoomName) => {
      console.log("sendLocaDescription  started :", signalRoomName);
      peerConnection.setLocalDescription;
      peerConnection.setLocalDescription(
        desc,
        () => {
          displaySignalMessage("sending local description");
          console.log("onner ?? :", owner);
          console.log(
            "peerConnection.localDescription ?? :",
            peerConnection.localDescription
          );
          // console.log('onner ?? :', owner);
          socket.emit(owner ? "broadcaster_signal" : "viewer_signal", {
            type: "SDP",
            message: JSON.stringify({ sdp: peerConnection.localDescription }),
            signal_room: signalRoomName,
          }); //browser video codecs, resovvlution, and so on, in localdescription
        },
        logError
      );
    };

    // 여기다 다 박고, ref를 아래로 보내주는게 최고인듯 하다.
    const displaySignalMessage = (message) => {
      console.log(message);
    };

    const startSignaling = async (signalRoomName) => {
      displaySignalMessage(
        "starting signaling...  signalroom name :" + signalRoomName
      );

      if (!owner) {
        console.log("new peerconnection fired on viewer side");
        socket.emit("newPeerConnection", {
          chatRoom: "a" + queryId,
          signal_room: signalRoomName,
        });
      }

      const configuration = {
        iceServers: [
          {
            url: "stun:stun.l.google.com:19302",
          },
        ],
      };

      // if(!owner){
      //   configuration.configuration = {
      //     offerToReceiveAudio: true,
      //     offerToReceiveVideo: true}

      //     console.log('configchange fired :', configuration)
      // }

      // localStream.getTracks().forEach(track => {
      //   peerConnection.addTrack(track, localStream)
      // })

      peerConnection = await new RTCPeerConnection(configuration);
      console.log("rtc undefined?? :", peerConnection);
      if (owner) {
        console.log("streaming data here on owner side :", streamingData);
      }
      // 자. 여기까지 문제 없음. 그렇다며 여기서 무엇을 할지 생각해야 한다.
      // RTCPeerConnection이 아무것도 안하는게 문제. createOffer 같은 부분을 생각해 보자.

      // pc.createOffer(function(session) { alert("Create offer ok"); }
      //            , function(error)   { alert("Create offer error:" + error);  }
      //            , mediaConstraints);

      peerConnection.onicecandidate = async (evt) => {
        console.log("onicecandidate fired");
        if (evt.candidate)
          socket.emit(
            owner ? "broadcaster_icecandidate" : "viewer_icecandidate",
            {
              type: "ice candidate",
              message: JSON.stringify({ candidate: evt.candidate }),
              signal_room: signalRoomName,
            }
          );
        displaySignalMessage("completed that ice candidate...");
        // video만 있어도 이 부분 까지는 파이어 된다.
      };

      peerConnection.onnegotiationneeded = async () => {
        const offer = await peerConnection.createOffer();
        sendLocalDesc(offer, signalRoomName);
        displaySignalMessage("on negotiation called");
        // displaySignalMessage("on negotiation called");
      };

      if (!owner) {
        var mediaConstraints = {
          mandatory: {
            OfferToReceiveAudio: true,
            OfferToReceiveVideo: true,
          },
          offerToReceiveAudio: true,
          offerToReceiveVideo: true,
        };

        const offer = await peerConnection.createOffer(mediaConstraints);
        sendLocalDesc(offer, signalRoomName);
        console.log("offer here ! :", offer);
      }

      if (owner && streamingData && peerConnection) {
        console.log("streaming data here on owner side :", streamingData);
        peerConnection.addStream(streamingData);
      }

      if (!owner && peerConnection) {
        peerConnection.ontrack = (evt) => {
          displaySignalMessage("going to add their stream...");
          addStreamingDataToVideo(evt.streams[0]);

          ref.current.srcObject = evt.streams[0];
        };
      }
    };

    const logError = (error) => {
      displaySignalMessage(error.name + ": " + error.message);
    };

    const broadcasterStart = async () => {
      console.log("brodcast start fired");
    };

    const startWebRTCRequest = (roomName) => {
      //이걸 받아서 방장은 데이터 체널을 연다
      console.log("startWebRTCRequest started. Room name :", roomName);
      socket.emit("joinNewSignalRoom", { signal_room: roomName });

      startSignaling(roomName);
      // socket.emit("viewer_signal", {
      //   type: "user_here",
      //   message: "viewer requested webRTC channel opening",
      //   signal_room:roomName
      // });

      // user_here 부분이 icecandidate이 되이야 하는 구먼.
    };

    const viewerStart = async () => {
      console.log("viewer start fired. myId :", myId);
      // only viewer to start
      startWebRTCRequest(myId + "signal"); // need turn into string?
    };

    const onStop = () => {
      // add logic to remove track and video device info as well.
      if (window.peerConnection) {
        window.peerConnection.close(currentVideoId);
      }
    };

    const handleStart = (e) => {
      try {
        dispatch({
          type: START_STREAMING_REQUEST,
        });
        if (owner) {
          broadcasterStart();
          handlePlay();
        }
        if (!owner) {
          viewerStart();
        }
      } catch (error) {
        throw error;
      }
    };
    const handleStop = (e) => {
      try {
        dispatch({
          type: STOP_STREAMING_REQUEST,
        });
        onStop();
      } catch (error) {
        throw error;
      }
    };

    // useEffect(()=>{
    //이거는 한번만 파이어 된다.
    if (owner) {
      socket.on("connectWebRTC", ({ signal_room }) => {
        console.log("connectWebRTC fired signal room :", signal_room);

        startSignaling(signal_room);
      });
    }

    if (owner) {
      socket.on("newPeerConnectionRequest", ({ signal_room }) => {
        displaySignalMessage(
          "new peer connection fired from signal room " + signal_room
        );
        socket.emit("joinNewSignalRoom", { signal_room });
      });
      socket.on("viewer_signaling_message", async (data) => {
        displaySignalMessage(
          "Signal received: from viewer_signaling_message : " + data
        );
        // const data = JSON.parse(data)
        if (data.type && data.type != "user_here") {
          console.log("data message here :", data);
          var message = JSON.parse(data.message);
          if (message.sdp) {
            console.log("message.sdp here :", message.sdp);

            await peerConnection.setRemoteDescription(
              new RTCSessionDescription(message.sdp)
            );

            console.log(
              "peerConnection.remoteDescription.type :",
              peerConnection.remoteDescription
            );
            if (peerConnection.remoteDescription.type == "offer") {
              console.log("create answer fired");

              const answer = await peerConnection.createAnswer();
              console.log("this is answer :", answer);
              sendLocalDesc(answer, data.signal_room);
            }
          }
        }
      });
      // if(globalStream) {rtcPeerConn.addStream(globalStream)}
    }
    // 비디오가 나왔다가 안나옴.
    // 이말은 setRemote가 처음에 한번은 되었다는 이야기.
    // 체크를 위해, consle 찍고
    // 그다음 리렌더링 고치자.

    if (!owner) {
      socket.on("broadcaster_signaling_message", async (data) => {
        console.log("why not fire?");
        displaySignalMessage("Signal received on viewer side: " + data.type);
        if (data.type != "user_here") {
          console.log("data message here on viewer side:", data);
          var message = JSON.parse(data.message);
          if (message.sdp) {
            await peerConnection.setRemoteDescription(
              await new RTCSessionDescription(message.sdp),
              async () => {
                if (peerConnection.remoteDescription.type == "offer") {
                  const answer = await peerConnection.createAnswer();
                  sendLocalDesc(answer, data.signal_room);
                }
              },
              logError
            );
          }
        }
      });
    }

    if (!owner) {
      socket.on("broadcaster_icecandidate", async (data) => {
        try {
          const message = await JSON.parse(data.message);
          // const candidate = message.message
          console.log("icecandidate receive fired on viewer side :", message);
          await peerConnection.addIceCandidate(
            await new RTCIceCandidate(message.candidate)
          );
        } catch (e) {
          console.log("peerconnection :", peerConnection);
          console.log("error broadcaster_icecandidate :", e);
        }
      });
    }

    if (owner) {
      socket.on("viewer_icecandidate", async (data) => {
        try {
          const message = JSON.parse(data.message);
          console.log("icecandidate receive fired on owner side :", message);
          await peerConnection.addIceCandidate(
            await new RTCIceCandidate(message.candidate)
          );
        } catch (e) {
          console.log("error viewer_icecandidate :", e);
        }
      });

      // 이 부분들이 setRemoteDescription 전에 있어야 한다.
    }

    // }, [])

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
