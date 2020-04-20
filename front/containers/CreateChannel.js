import React, { useRef, useCallback } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { CLOSE_MODAL } from "../reducers/menu";
import Button from "@material-ui/core/Button";

import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";

import { StyledForm } from "../styles/FormStyle";

import VideocamIcon from "@material-ui/icons/Videocam";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import SaveIcon from "@material-ui/icons/Save";
// import { StyledLink } from "../components/CustomLinks";
import { UPLOAD_VIDEO_IMAGE_REQUEST } from "../reducers/video";
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
    width: "70%",
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

// Video title input
// Video description
// video picture
// submit button.
// video picture submit button.

// post to video.
export default function SimpleModal() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);

  const imageInput = useRef(); //
  const dispatch = useDispatch();
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

  const { openModal } = useSelector(({ menu }) => {
    return { openModal: menu.openModal };
  }, shallowEqual);

  const handleClose = () => {
    dispatch({
      type: CLOSE_MODAL,
    });
  };

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
            style={{ width: "100%" }}
            src="../static/images/profiles/noimage.png"
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
              type="text"
              className="form__input"
              placeholder="Title of the Channel"
              id="title"
              required
            />
            <label htmlFor="title" className="form__label">
              Title of the Channel
            </label>
          </div>

          <div className="form__group">
            <textarea
              type="text"
              className="form__input"
              placeholder="Description"
              name="description"
              id="description"
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
          style={{ float: "right" }}
        >
          Submit
        </Button>
        <Button
          variant="contained"
          color="primary"
          style={{ float: "right", marginRight: "1rem" }}
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
    </div>
  );
}
