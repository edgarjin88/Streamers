import ConnectionClient from "../client/index";
import { StyledButton1 } from "../../components/CustomButtons";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import {
  START_STREAMING_REQUEST,
  STOP_STREAMING_REQUEST,
} from "../../reducers/video";

import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
import StopIcon from "@material-ui/icons/Stop";
const WebRTCController = ({ type, options, currentVideoId }) => {
  const dispatch = useDispatch();
  const { streamingOn, currentVideoOwner, myId } = useSelector((state) => {
    return {
      streamingOn: state.video.streamingOn,
      currentVideoOwner: state.video.currentVideo.UserId,
      myId: state.user.me && state.user.me.id,
    };
  }, shallowEqual);
  const owner = myId === currentVideoOwner;
  const connectionClient = new ConnectionClient();
  let peerConnection = null;

  const onStart = async () => {
    console.log("onstart fired");
    peerConnection = await connectionClient.createConnection(
      options,
      type,
      currentVideoId
    );
    window.peerConnection = peerConnection;
  };

  const onStop = () => {
    if (window.peerConnection) {
      window.peerConnection.close();
    }
  };

  const handleStart = (e) => {
    try {
      dispatch({
        type: START_STREAMING_REQUEST,
      });
      onStart();
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
};

export default WebRTCController;
