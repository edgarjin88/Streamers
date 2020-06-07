import { useRef, useEffect } from "react";
// import { socket } from "../components/socket/socket";

import socketIOClient from "socket.io-client";
import { URL } from "../config/config";

const socket = socketIOClient(URL, {
  secure: true,
  rejectUnauthorized: false,
});


// broadcaster 쪽의 peercon 리퀘스트 받을 때 마다 만들어 진다. 
// 모든 것을 큰 펑션 안에 스코프 시켜 버리자. 

//일단 video 만 따로 빼 놓자. video on off, 한다음 start signal 할 때만 붙이기. 
// 그다음 start request가 올 때만 보내기. 

// 방장과 유저만 있는 방을 만드는 게 가장 편한 방법인듯 하다. 정보는 어떻게 전달?
// on request에, data channel 방만 따로 만든다. 처음에는 data channel 없이 가고, 
// 나중에 유저 이름과 같이 가자. 
const test = () => {
  const myVideoArea = useRef();
  const theirVideoArea = useRef();

  if (myVideoArea.current) myVideoArea.current.srcObject = null;
  if (myVideoArea.current) myVideoArea.current.srcObject = null;
  ///////webrtc
  ///////webrtc
  let globalStream; 

  const configuration = {
    iceServers: [
      {
        url: "stun:stun.l.google.com:19302",
      },
    ],
  };
  const displaySignalMessage = (message) => {
    console.log(message);
  };

  const logError = (error) => {
    displaySignalMessage(error.name + ": " + error.message);
  };

  const startSignaling = (signalRoomName) => {
    debugger
    displaySignalMessage("starting signaling...");
    const rtcPeerConn = new RTCPeerConnection(configuration);

    const sendLocalDesc = (desc) => {
      rtcPeerConn.setLocalDescription(
        desc,
        () => {
          displaySignalMessage("sending local description");
          socket.emit("broadcaster_signal", {
            type: "SDP",
            message: JSON.stringify({ sdp: rtcPeerConn.localDescription }),
            room: signalRoomName,
          }); 
        },
        logError
      );
    };

    rtcPeerConn.onicecandidate = (evt) => {
      if (evt.candidate)
        socket.emit("broadcaster_signal", {
          type: "ice candidate",
          message: JSON.stringify({ candidate: evt.candidate }),
          room: signalRoomName,
        }); //evt.candidate object 이 오직 하나 정해진 by rtc object
      displaySignalMessage("completed that ice candidate...");
    };

    rtcPeerConn.onnegotiationneeded = () => {
      displaySignalMessage("on negotiation called");
      rtcPeerConn.createOffer(sendLocalDesc, logError);
    };

    rtcPeerConn.ontrack = (evt) => {
      displaySignalMessage("going to add their stream...");
      // theirVideoArea.current.srcObject = evt.streams[0];
    };
    socket.on("viewer_signaling_message", (data) => {

      displaySignalMessage("Signal received: " + data.type);

      // if (!rtcPeerConn) startSignaling();

      if (data.type != "user_here") {
        console.log("data message here :", data);
        const newData = JSON.parse(data.message);
        var message = JSON.parse(data.message);
        if (message.sdp) {
          rtcPeerConn.setRemoteDescription(
            new RTCSessionDescription(message.sdp),
            () => {
              if (rtcPeerConn.remoteDescription.type == "offer") {
                rtcPeerConn.createAnswer(sendLocalDesc, logError);
              }
            },
            logError
          );
        } else {
          console.log('icecandidate fired on viewer side');

          rtcPeerConn.addIceCandidate(new RTCIceCandidate(message.candidate));
        }
      }
    });
    if(globalStream) {rtcPeerConn.addStream(globalStream)}

  };



  const testSocket = () => {

  };


  // emit 자체가 순서대로 파이어는 안하는 건가? multiple은 안되는 건가?
  useEffect(() => {
    socket.on("connect", () => {
      console.log("ready message fired");
    });

    
    socket.emit("broadcaster_signal", {
      type: "user_here",
      message: "Are you ready for a call?",
      room: "chatroom1",

    });

    socket.emit("ready", {
      chat_room: "chatroom1",
      signal_room: "room1",
    });


    // 단 한번만 쏴 주면 될듯. 
    socket.on("newPeerConnectionRequest", ({signal_room}) => {

      displaySignalMessage("new peer connection fired from signal room " + signal_room);

      socket.emit('joinNewSignalRoom', {signal_room})
        


    });

    socket.on("connectWebRTC", ({signal_room})=>{
      console.log('connectWebRTC fired');
      startSignaling(signal_room);
    })
    
  }, []);
  ///////webrtc
  ///////webrtc

  const handleStreaming = ()=>{
    testSocket();
  }

const handlePlay = ()=>{

  navigator.mediaDevices
  .getUserMedia({
    audio: false,
    video: true,
  })
  .then((stream) => {
    displaySignalMessage("going to display my stream...");
    globalStream = stream
    if (myVideoArea.current) myVideoArea.current.srcObject = globalStream;
    // if(rtcPeerConn)
    // rtcPeerConn.addStream(globalStream);
  });

}
  return (
    <div>
      <div>
        <video
        
        autoPlay={true}

          ref={myVideoArea}
          style={{
            height: "400px",
            width: "400px",
            padding: "1rem",
            backgroundColor: "grey",
          }}
        ></video>
        my video
      </div>
      <div>
        <video
          ref={theirVideoArea}
          style={{
            height: "400px",
            width: "400px",
            padding: "1rem",
            backgroundColor: "black",
          }}
        ></video>
        their video
      </div>
      <button onClick={handleStreaming}>streaming</button>
      <button onClick={handlePlay}>play</button>
    </div>
  );
};

export default test;
