import { useCallback, useEffect } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";

import styled from "styled-components";

import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

import {
  INIT_EDIT_VIDEO_REQUEST,
  INIT_REMOVE_VIDEO_REQUEST,
} from "../reducers/video";
import DeleteChannel from "./DeleteChannel";
import EditChannel from "./EditChannel";

const StyledEditVideo = styled.div`
  display: flex;
  & button > div > * {
    align-items: center;
    color: grey;
  }
  & span {
    display: inline-block;
    text-align: center;
    font-size: 1rem;
    line-height: 100%;
  }
  .edit {
    cursor: pointer;
    &:hover {
      & div > * {
        color: rgb(26, 89, 156);
      }
    }
  }
  .delete {
    cursor: pointer;
    &:hover {
      & div > * {
        color: #dc143c;
      }
    }
  }
`;

const EditVideo = () => {
  const dispatch = useDispatch();
  const initEditVideo = () => {
    dispatch({
      type: INIT_EDIT_VIDEO_REQUEST,
    });
  };
  const initDeleteVideo = () => {
    dispatch({
      type: INIT_REMOVE_VIDEO_REQUEST,
    });
  };

  return (
    <StyledEditVideo>
      <button className={"edit"} onClick={initEditVideo}>
        <div>
          <EditIcon style={{ fontSize: "2.5rem" }} />
          <span>Edit Video</span>
        </div>
      </button>
      <button className={"delete"} onClick={initDeleteVideo}>
        <div>
          <DeleteIcon style={{ fontSize: "2.5rem" }} />
          <span>Delete Video</span>
        </div>
      </button>
      <DeleteChannel />
      <EditChannel />
    </StyledEditVideo>
  );
};

export default EditVideo;
