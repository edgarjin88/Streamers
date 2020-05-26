import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import SaveIcon from "@material-ui/icons/Save";
import EditIcon from "@material-ui/icons/Edit";

import { UPLOAD_PROFILE_REQUEST } from "../reducers/user";
import React, { useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";

const StyledProfileButton = styled.div`
  button {
    float: right;
    margin-right: 2rem;
    color: white;
  }
  @media (max-width: 410px) {
    button {
      margin-right: 0;
      margin-top: 2rem;
    }
  }
`;
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
      <StyledProfileButton>
        <Button
          onClick={onClickImageUpload}
          variant="contained"
          style={{ backgroundColor: "orange" }}
          startIcon={<EditIcon />}
        >
          Change Profile Photo
        </Button>
      </StyledProfileButton>
    </div>
  );
};

export default UploadProfile;
