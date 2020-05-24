import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import SaveIcon from "@material-ui/icons/Save";
import EditIcon from "@material-ui/icons/Edit";

import { UPLOAD_PROFILE_REQUEST } from "../reducers/user";
import React, { useCallback, useRef } from "react";
import { useDispatch } from "react-redux";

const UploadProfile = () => {
  const imageInput = useRef(); //
  const dispatch = useDispatch();
  const onChangeProfileImages = useCallback((e) => {
    const imageFormData = new FormData();
    [].forEach.call(e.target.files, (f) => {
      imageFormData.append("image", f);
    });
    dispatch({
      type: UPLOAD_PROFILE_REQUEST,
      data: imageFormData,
    });
  }, []);

  const onClickImageUpload = useCallback(() => {
    imageInput.current.click();
  }, [imageInput.current]);

  return (
    <div>
      <input
        type="file"
        multiple
        hidden
        ref={imageInput}
        onChange={onChangeProfileImages}
      />
      <Button
        onClick={onClickImageUpload}
        style={{
          float: "right",
          marginRight: "2rem",
          backgroundColor: "orange",
          color: "white",
        }}
        variant="contained"
        startIcon={<EditIcon />}
      >
        Change Profile Photo
      </Button>
    </div>
  );
};

export default UploadProfile;
