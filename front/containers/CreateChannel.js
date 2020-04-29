import React, { useRef, useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { CLOSE_MODAL } from "../reducers/menu";
import Button from "@material-ui/core/Button";

import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";

import { StyledForm } from "../styles/FormStyle";

import VideocamIcon from "@material-ui/icons/Videocam";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import SaveIcon from "@material-ui/icons/Save";
import Toaster from "../components/Toaster";

// import { StyledLink } from "../components/CustomLinks";
import {
  UPLOAD_VIDEO_IMAGE_REQUEST,
  ADD_VIDEO_REQUEST,
  NULLIFY_VIDEO_ADDED,
} from "../reducers/video";
import { URL } from "../config/config";

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
    // maxWidth: "70%",
    maxHeight: "85%",
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function SimpleModal() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const imageInput = useRef(); //
  const dispatch = useDispatch();

  const { uploadedVideoImage, videoAdded } = useSelector(({ video }) => {
    return {
      uploadedVideoImage: video.uploadedVideoImage,
      videoAdded: video.videoAdded,
    };
  }, shallowEqual);

  const { openModal } = useSelector(({ menu }) => {
    return { openModal: menu.openModal };
  }, shallowEqual);

  const onChangeVideoImages = useCallback((e) => {
    const imageFormData = new FormData();
    imageFormData.append("image", e.target.files[0]);

    dispatch({
      type: UPLOAD_VIDEO_IMAGE_REQUEST,
      data: imageFormData,
    });
  }, []);

  const onClickImageUpload = useCallback(() => {
    imageInput.current.click();
  }, [imageInput.current]);

  const handleChange = (e) => {
    if (e.target.name === "title") {
      setTitle(e.target.value);
    } else {
      setDescription(e.target.value);
    }
  };

  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      if (!title || !title.trim()) {
        return alert("Please write title before submitting");
      }
      if (!description || !description.trim()) {
        return alert("Please write description before submitting");
      }

      const formData = new FormData();
      formData.append("image", uploadedVideoImage);

      formData.append("description", description);
      formData.append("title", title);
      dispatch({
        type: ADD_VIDEO_REQUEST,
        data: formData,
      });
      setDescription("");
      setTitle("");
    },
    [title, description, uploadedVideoImage]
  );

  const handleClose = () => {
    setDescription("");
    setTitle("");
    dispatch({
      type: CLOSE_MODAL,
    });
  };

  useEffect(() => {
    if (videoAdded) {
      dispatch({
        type: CLOSE_MODAL,
      });
      setTimeout(() => {
        dispatch({
          type: NULLIFY_VIDEO_ADDED,
        });
      }, 1000);
    }
  }, [videoAdded]);

  const body = (
    <StyledForm>
      <div style={modalStyle} className={classes.paper}>
        <h2
          id="simple-modal-title"
          style={{ display: "flex", alignItems: "center" }}
        >
          <VideocamIcon
            style={{ marginLeft: "15px", fontSize: "35px", color: "black" }}
          />
          Create Your Streaming Channel here!
        </h2>
        <div>
          <img
            style={{ width: "100%", maxHeight: "30rem", objectFit: "cover" }}
            src={
              uploadedVideoImage
                ? `${URL}/${uploadedVideoImage}`
                : "../static/images/profiles/noimage.png"
            }
            alt=""
          />
        </div>
        <input
          type="file"
          multiple
          hidden
          ref={imageInput}
          onChange={onChangeVideoImages}
        />
        <form action="#" className="form">
          <div className="form__group">
            <input
              onChange={handleChange}
              value={title}
              name="title"
              type="text"
              className="form__input"
              placeholder="Title of the Channel"
              htmlid="title"
              required
            />
            <label htmlFor="title" className="form__label">
              Title of the Channel
            </label>
          </div>

          <div className="form__group">
            <textarea
              onChange={handleChange}
              value={description}
              type="text"
              className="form__input"
              placeholder="Description"
              name="description"
              htmlid="description"
              required
            />
            <label htmlFor="description" className="form__label">
              Description
            </label>
          </div>
        </form>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          color="primary"
          style={{ float: "right", marginRight: "1rem", marginTop: "1rem" }}
          onClick={onSubmitForm}
        >
          Submit
        </Button>
        <Button
          variant="contained"
          color="primary"
          style={{ float: "right", marginRight: "1rem", marginTop: "1rem" }}
          startIcon={<CloudUploadIcon />}
          onClick={onClickImageUpload}
        >
          Upload Image
        </Button>
      </div>
    </StyledForm>
  );

  return (
    <div>
      <Modal
        style={{ zIndex: 99999 }}
        open={openModal}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
      {videoAdded && (
        <Toaster
          message="A new channel successfully created"
          whereTo={false}
          type="success"
        />
      )}
    </div>
  );
}
