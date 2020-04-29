import React, { useRef, useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";

import Button from "@material-ui/core/Button";
import {
  ADD_COMMENT_REQUEST,
  LIKE_COMMENT_REQUEST,
  SET_CURRENT_COMMENT_ID,
} from "../../reducers/video";
import { URL } from "../../config/config";
import moment from "moment";

import styled from "styled-components";

import CommentForm from "../../containers/comment/CommentForm.js";
import CommentEditBox from "../../containers/comment/CommentEditBox";
import ResponseComment from "./ResponseComment";
import CommentList from "./CommentList";

moment.locale("en");

const VideoComments = () => {
  const [truefalse, setTruefalse] = useState({
    showComment: true,
    showResponse: false,

    liked: false,
    disliked: false,
  });

  const {
    showComment,
    showResponse,

    liked,
    disliked,
  } = truefalse;

  const handleBoolean = (e) => {
    setTruefalse({
      ...truefalse,
      [e.target.name]: !truefalse[e.target.name],
    });
  };

  const { id, currentVideoComments } = useSelector(({ video }) => {
    return {
      id: video.currentVideo.id,
      currentVideoComments: video.currentVideoComments,
    };
  }, shallowEqual);

  const { me } = useSelector(({ user }) => {
    return user;
  }, shallowEqual);

  const dispatch = useDispatch();

  const handleResponse = () => {
    setTruefalse(() => {
      return { ...truefalse, showResponse: !showResponse };
    });
    dispatch({
      type: SET_CURRENT_COMMENT_ID,
    });
  };

  const renderCommentHeader = () => {
    return (
      <header>
        <h2>Comments &middot; {currentVideoComments.length}</h2>
        {showComment ? (
          <img
            onClick={handleBoolean}
            name="showComment"
            id="comment-uptick"
            src="../static/images/icons/up-tick.svg"
            alt="Hide Comments"
          />
        ) : (
          <img
            onClick={handleBoolean}
            name="showComment"
            id="comment-downtick"
            src="../static/images/icons/down-tick.svg"
            alt="Show Comments"
          />
        )}
      </header>
    );
  };

  return (
    <section id="video-comments">
      {renderCommentHeader()}

      <div id="comment-list-container">
        {me && <CommentForm />}
        {showComment && (
          <CommentList
            showResponse={showResponse}
            handleResponse={handleResponse}
          />
        )}
      </div>
    </section>
  );
};

export default VideoComments;
