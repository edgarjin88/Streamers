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
import ReplyCommentForm from "../../containers/comment/ReplyCommentForm";

moment.locale("en");

const CommentList = () => {
  const { id, currentVideoComments, commentToReply } = useSelector(
    ({ video }) => {
      return {
        id: video.currentVideo.id,
        commentToReply: video.commentToReply,
        currentVideoComments: video.currentVideoComments,
      };
    },
    shallowEqual
  );

  const [showResponse, setShowResponse] = useState([]);

  // this.setState((prevState) => ({
  //   people: prevState.people.filter((person) => person !== e.target.value),
  // }));

  const toggleShowResponse = (commentId) => (e) => {
    console.log("togle fired, ID: ", commentId);

    const index = showResponse.findIndex((el) => el === commentId);
    if (index > -1) {
      const filteredList = showResponse.filter((el) => el !== commentId);
      setShowResponse(filteredList);
    } else {
      console.log("commentId not found. Will add this index :", index);

      setShowResponse((prev) => {
        return [...prev, commentId];
      });
    }
  };

  const ShowResponseButton = ({ id }) => {
    const show = !showResponse.includes(id);
    return (
      <div className="see-response-container">
        <Button
          variant="contained"
          name="showResponse"
          onClick={toggleShowResponse(id)}
        >
          {show ? "See the response" : "Close"}
        </Button>
      </div>
    );
  };

  const renderEachComment = (comments) => {
    const dispatch = useDispatch();
    return comments.map((comment) => {
      const {
        id,
        content,
        nickname,
        profilePhoto,
        createdAt,
        CommentLikers,
        CommentDislikers,
        Recomment,
      } = {
        createdAt: comment.createdAt,
        content: comment.content,
        nickname: comment.User,
        profilePhoto: comment.User.profilePhoto,
        id: comment.id,
        CommentLikers: comment.CommentLikers,
        CommentDislikers: comment.CommentDislikers,
        Recomment: comment.Recomment,
      };

      const showReplyForm = commentToReply === id;
      const showReplyComments = showResponse.includes(id);
      return (
        <div className="comment my-comment">
          <img
            src={
              profilePhoto
                ? `${URL}/${profilePhoto}`
                : "../static/images/profiles/how-to-anything.png"
            }
            alt="How To Anything"
          />
          <a href="#" title="How To Anything">
            <span>{comment.User.nickname}</span>
          </a>
          <p>{comment.content}</p>
          <div
            style={{ display: "flex", justifyContent: "space-between" }}
            className="comment-statistics"
          >
            <p> {`${moment(createdAt).format("DD.MM.YYYY")}`}</p>
            <CommentEditBox
              commentId={id}
              CommentLikers={CommentLikers}
              CommentDislikers={CommentDislikers}
            />
          </div>
          {showReplyForm && (
            <div className="response-list">
              <ReplyCommentForm commentId={id} />
            </div>
          )}

          {/* reply comments */}
          {/* reply comments */}
          {showReplyComments && (
            <ResponseComment commentId={id} Recomment={Recomment} />
          )}

          {comment && comment.Recomment && comment.Recomment.length > 0 && (
            <ShowResponseButton id={id} />
          )}
        </div>
      );
    });
  };

  return <div id="comment-list">{renderEachComment(currentVideoComments)}</div>;
};

export default CommentList;
