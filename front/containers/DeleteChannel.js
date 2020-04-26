import React from "react";

import { useCallback, useEffect } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";

import Modal from "@material-ui/core/Modal";
import styled from "styled-components";
import {
  INIT_REMOVE_VIDEO_REQUEST,
  REMOVE_VIDEO_REQUEST,
  NULLIFY_REMOVE_VIDEO_SUCCESS,
  STOP_REMOVE_VIDEO_REQUEST,
} from "../reducers/video";

import { StyledButton1 } from "../components/CustomButtons";
import { useRouter } from "next/router";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    maxWidth: "100%",
    minWidth: "30rem",
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    justifyItems: "center",
  },
}));

const StyledDiv = styled.div`
  display: flex;
  justify-content: center;
`;

export default function SimpleModal() {
  const modalStyle = getModalStyle();
  const Router = useRouter();
  const classes = useStyles();
  const dispatch = useDispatch();
  const {
    initRemoveVideo,
    removeVideoSuccess,
    removeVideoErrorReason,
    videoId,
  } = useSelector(({ video }) => {
    return {
      initRemoveVideo: video.initRemoveVideo,
      removeVideoSuccess: video.removeVideoSuccess,
      removeVideoErrorReason: video.removeVideoErrorReason,
      videoId: video.currentVideo.id,
    };
  }, shallowEqual);

  const handleClose = () => {
    dispatch({
      type: STOP_REMOVE_VIDEO_REQUEST,
    });
  };

  if (removeVideoSuccess) {
    Router.push("/");
    dispatch({
      type: NULLIFY_REMOVE_VIDEO_SUCCESS,
    });
  }
  const onClickDelete = () => {
    console.log("videoId :", videoId);
    dispatch({
      type: REMOVE_VIDEO_REQUEST,
      data: videoId,
    });
  };

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <h2 id="simple-modal-title">
        {" "}
        Do you really want to delete this channel?
      </h2>
      <StyledDiv>
        <StyledButton1 onClick={handleClose} color="orange" size={"2.5rem"}>
          No
        </StyledButton1>

        <StyledButton1 onClick={onClickDelete} size={"2.5rem"}>
          Yes
        </StyledButton1>
      </StyledDiv>
    </div>
  );

  return (
    <div>
      <Modal
        open={initRemoveVideo}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
}
