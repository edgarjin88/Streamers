import React, { useRef, useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";

import styled from "styled-components";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import DeleteIcon from "@material-ui/icons/Delete";
import {
  LIKE_COMMENT_REQUEST,
  DISLIKE_COMMENT_REQUEST,
  UNLIKE_COMMENT_REQUEST,
  UNDISLIKE_COMMENT_REQUEST,
  REMOVE_COMMENT_REQUEST,
} from "../../reducers/video";
import CommentForm from "../../containers/comment/CommentForm";
import ReplyCommentForm from "../../containers/comment/ReplyCommentForm";
import { URL } from "../../config/config";

import moment from "moment";
import CommentEditBox from "../../containers/comment/CommentEditBox";
moment.locale("en");

const ResponseComment = ({ commentId, Recomment, videoUserId }) => {
  const { me } = useSelector(({ user }) => {
    return { me: user.me };
  }, shallowEqual);

  return (
    <div className="response-list">
      {Recomment &&
        Recomment.map((eachRecomment) => {
          return (
            <div
              className={`comment ${
                eachRecomment.Recommenter.id == videoUserId ? "my-comment" : ""
              }`}
            >
              <img
                src={
                  eachRecomment &&
                  eachRecomment &&
                  eachRecomment.Recommenter &&
                  eachRecomment.Recommenter.profilePhoto
                    ? `${URL}/${eachRecomment.Recommenter.profilePhoto}`
                    : "/images/profiles/how-to-anything.png"
                }
                alt="Profile Photo"
              />
              <a href="#" title="Profile Photo">
                <span>
                  {eachRecomment &&
                    eachRecomment.Recommenter &&
                    eachRecomment.Recommenter.nickname}
                </span>
              </a>
              <p>{eachRecomment && eachRecomment.content}</p>
              <div
                style={{ display: "flex", justifyContent: "space-between" }}
                className="comment-statistics"
              >
                <p>
                  {" "}
                  {`${moment(eachRecomment && eachRecomment.createdAt).format(
                    "DD.MM.YYYY"
                  )}`}
                </p>
                <CommentEditBox
                  commentId={eachRecomment.id}
                  CommentLikers={eachRecomment.CommentLikers}
                  CommentDislikers={eachRecomment.CommentDislikers}
                  refCommentId={commentId}
                  commentOwner={eachRecomment.Recommenter.id}
                />
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default ResponseComment;
