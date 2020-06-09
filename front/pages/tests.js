import { useRef, useEffect, useState } from "react";
import { socket } from "../components/socket/socket";

const test = () => {
  const myVideoArea = useRef();
  const theirVideoArea = useRef();
  const [roomName, setRoomName] = useState("");

  if (myVideoArea.current) myVideoArea.current.srcObject = null;
  if (myVideoArea.current) myVideoArea.current.srcObject = null;
  ///////webrtc
  ///////webrtc
  let rtcPeerConn;
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

  const startSignaling = () => {
    // debugger
    displaySignalMessage("starting signaling...");
    socket.emit("newPeerConnection", { signal_room: roomName });

    rtcPeerConn = new RTCPeerConnection(configuration);

    rtcPeerConn.onicecandidate = (evt) => {
      if (evt.candidate)
        socket.emit("viewer_signal", {
          type: "ice candidate",
          message: JSON.stringify({ candidate: evt.candidate }),
          room: roomName,
        }); //evt.candidate object 이 오직 하나 정해진 by rtc object
      displaySignalMessage("completed that ice candidate...");
    };

    rtcPeerConn.onnegotiationneeded = () => {
      displaySignalMessage("on negotiation called");
      rtcPeerConn.createOffer(sendLocalDesc, logError);
    };

    rtcPeerConn.ontrack = (evt) => {
      displaySignalMessage("going to add their stream...");
      theirVideoArea.current.srcObject = evt.streams[0];
    };
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: true,
      })
      .then((stream) => {
        displaySignalMessage("going to display my stream...");
        if (myVideoArea.current) myVideoArea.current.srcObject = stream;
        rtcPeerConn.addStream(stream);
      });
  };

  const sendLocalDesc = (desc) => {
    rtcPeerConn.setLocalDescription(
      desc,
      () => {
        displaySignalMessage("sending local description");
        socket.emit("viewer_signal", {
          type: "SDP",
          message: JSON.stringify({ sdp: rtcPeerConn.localDescription }),
          room: roomName,
        }); //browser video codecs, resolution, and so on, in localdescription
      },
      logError
    );
  };

  const logError = (error) => {
    displaySignalMessage(error.name + ": " + error.message);
  };

  const testSocket = (name) => {
    socket.on("connect", () => {
      // socket.emit('ready', 'haha')
      console.log("ready message fired");
    });
    // 단순히 조인만 한다.
    socket.emit("ready", {
      chat_room: "chatroom1",
      signal_room: name,
    });

    socket.emit("viewer_signal", {
      type: "user_here1",
      message: "Are you ready for a call?",
      room: "chatroom1",
      signal_room: name,
    });
    startSignaling();

    socket.on("broadcaster_signaling_message", (data) => {
      displaySignalMessage("Signal received: " + data.type);

      // if (!rtcPeerConn) startSignaling();

      if (data.type != "user_here1") {
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
          console.log("icecandidate fired on viewer side");

          rtcPeerConn.addIceCandidate(new RTCIceCandidate(message.candidate));
        }
      }
    });
  };

  useEffect(() => {
    // testSocket();
  }, []);
  ///////webrtc
  ///////webrtc
  const handleJoin = () => {
    testSocket(roomName);
    console.log("handljoin fired. roomName :", roomName);
  };
  const handleChange = (e) => {
    console.log("changed room name :", e.target.value);
    setRoomName(e.target.value);
  };
  return (
    <div>
      <div>
        <video
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
          autoPlay={true}
          style={{
            height: "400px",
            width: "400px",
            padding: "1rem",
            backgroundColor: "black",
          }}
        ></video>
        their video
      </div>
      <button onClick={handleJoin}>join</button>

      <input onChange={handleChange} value={roomName} />
    </div>
  );
};

export default test;
