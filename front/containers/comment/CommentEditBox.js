import React, { useRef, useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";

import styled from "styled-components";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import DeleteIcon from "@material-ui/icons/Delete";
import ReplyAllIcon from "@material-ui/icons/ReplyAll";
import BackspaceIcon from "@material-ui/icons/Backspace";

import {
  LIKE_COMMENT_REQUEST,
  DISLIKE_COMMENT_REQUEST,
  UNLIKE_COMMENT_REQUEST,
  UNDISLIKE_COMMENT_REQUEST,
  REMOVE_COMMENT_REQUEST,
  TOGGLE_REPLY_COMMENT_FORM,
} from "../../reducers/video";

const StyledIconBox = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin: 0 0.5rem;
  color: ${(props) =>
    props.liked ? "#1a599c" : props.disliked ? "#DC143C" : ""};

  &:hover {
    color: orange;
  }
`;

const StyledIcon = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;

  margin: 0 0.5rem;

  &:hover {
    color: orange;
  }
`;

const CommentEditBox = ({
  commentId,
  refCommentId,
  CommentDislikers,
  CommentLikers,
}) => {
  const dispatch = useDispatch();

  const { me } = useSelector(({ user }) => {
    return { me: user.me };
  }, shallowEqual);

  const { commentToReply } = useSelector(({ video }) => {
    return { commentToReply: video.commentToReply };
  }, shallowEqual);

  const liked =
    me && me.id && CommentLikers && CommentLikers.find((v) => v.id === me.id);
  const disliked =
    me &&
    me.id &&
    CommentDislikers &&
    CommentDislikers.find((v) => v.id === me.id);

  const onToggleLike = () => {
    if (!me) {
      return alert("Login required");
    }
    if (liked) {
      dispatch({
        type: UNLIKE_COMMENT_REQUEST,
        data: commentId,
        refCommentId,
      });
    } else {
      dispatch({
        type: LIKE_COMMENT_REQUEST,
        data: commentId,
        refCommentId,
      });
      if (disliked) {
        dispatch({
          type: UNDISLIKE_COMMENT_REQUEST,
          data: commentId,
          refCommentId,
        });
      }
    }
  };

  const onToggleDislike = () => {
    if (!me) {
      return alert("Login required");
    }
    if (disliked) {
      dispatch({
        type: UNDISLIKE_COMMENT_REQUEST,
        data: commentId,
        refCommentId,
      });
    } else {
      dispatch({
        type: DISLIKE_COMMENT_REQUEST,
        data: commentId,
        refCommentId,
      });
      if (liked) {
        dispatch({
          type: UNLIKE_COMMENT_REQUEST,
          data: commentId,
          refCommentId,
        });
      }
    }
  };

  const onClickDelete = useCallback(() => {
    dispatch({
      type: REMOVE_COMMENT_REQUEST,
      data: commentId,
    });
  }, [commentId]);

  const showReplyCommentForm = () => {
    dispatch({
      type: TOGGLE_REPLY_COMMENT_FORM,
      data: commentId,
    });
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-around" }}>
      {commentId === commentToReply ? (
        <StyledIcon onClick={showReplyCommentForm}>
          <BackspaceIcon /> &nbsp; Cancel
        </StyledIcon>
      ) : (
        <StyledIcon onClick={showReplyCommentForm}>
          <ReplyAllIcon />
          &nbsp; Reply
        </StyledIcon>
      )}
      <StyledIconBox liked={liked} onClick={onToggleLike}>
        <ThumbUpIcon /> &nbsp; {CommentLikers && CommentLikers.length}
      </StyledIconBox>
      <StyledIconBox disliked={disliked} onClick={onToggleDislike}>
        <ThumbDownIcon /> &nbsp; {CommentDislikers && CommentDislikers.length}
      </StyledIconBox>
      <StyledIcon onClick={onClickDelete}>
        <DeleteIcon />
      </StyledIcon>
    </div>
  );
};

export default CommentEditBox;
