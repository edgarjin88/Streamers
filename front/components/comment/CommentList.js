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

import CommentEditBox from "../../containers/comment/CommentEditBox";
import ResponseComment from "./ResponseComment";
import ReplyCommentForm from "../../containers/comment/ReplyCommentForm";
import Link from "next/link";
moment.locale("en");

const CommentList = () => {
  const { videoUserId, currentVideoComments, commentToReply } = useSelector(
    ({ video }) => {
      return {
        videoUserId:
          video &&
          video.currentVideo &&
          video.currentVideo.User &&
          video.currentVideo.User.id,
        commentToReply: video.commentToReply,
        currentVideoComments: video.currentVideoComments,
      };
    }
  );

  const [showResponse, setShowResponse] = useState([]);

  const toggleShowResponse = (commentId) => (e) => {
    const index = showResponse.findIndex((el) => el === commentId);
    if (index > -1) {
      const filteredList = showResponse.filter((el) => el !== commentId);
      setShowResponse(filteredList);
    } else {
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
          style={{ margin: "1rem" }}
          onClick={toggleShowResponse(id)}
        >
          {show ? "See the response" : "Close"}
        </Button>
      </div>
    );
  };

  const renderEachComment = (comments, videoUserId) => {
    return comments.map((comment) => {
      const {
        id,

        profilePhoto,
        createdAt,
        CommentLikers,
        CommentDislikers,
        Recomment,
        UserId,
      } = {
        UserId: comment.UserId,
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
        <div
          key={id}
          className={`comment ${
            comment.User.id == videoUserId ? "my-comment" : ""
          }`}
        >
          <Link href={`/profile/${comment.User.id}`}>
            <img
              // style={{ cursor: "pointer" }}
              src={
                profilePhoto
                  ? `${URL}/${profilePhoto}`
                  : "../static/images/profiles/how-to-anything.png"
              }
              alt="Profile Photo"
            />
          </Link>

          <Link href={`/profile/${comment.User.id}`}>
            <a title="Profile Photo">
              <span>{comment.User.nickname}</span>
            </a>
          </Link>

          <p>{comment.content}</p>
          <div
            style={{ display: "flex", justifyContent: "space-between" }}
            className="comment-statistics"
          >
            <p> {`${moment(createdAt).format("DD.MM.YYYY")}`}</p>
            <CommentEditBox
              refCommentId={undefined}
              commentId={id}
              commentOwner={UserId}
              CommentLikers={CommentLikers}
              CommentDislikers={CommentDislikers}
            />
          </div>
          {showReplyForm && (
            <div className="response-list">
              <ReplyCommentForm commentId={id} />
            </div>
          )}
          {showReplyComments && (
            <ResponseComment
              commentId={id}
              Recomment={Recomment}
              videoUserId={videoUserId}
            />
          )}
          {comment && comment.Recomment && comment.Recomment.length > 0 && (
            <ShowResponseButton id={id} />
          )}
        </div>
      );
    });
  };

  return (
    <div id="comment-list">
      {renderEachComment(currentVideoComments, videoUserId)}
    </div>
  );
};

export default CommentList;
