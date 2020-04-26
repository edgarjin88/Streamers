import React, { useRef, useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";

import Button from "@material-ui/core/Button";
import { ADD_COMMENT_REQUEST, LIKE_COMMENT_REQUEST } from "../reducers/video";
import { URL } from "../config/config";
import moment from "moment";

import styled from "styled-components";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";

import DeleteIcon from "@material-ui/icons/Delete";
moment.locale("en");
// color: ${props => props.theme.colors.text};

const StyledIconBox = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin: 0 0.5rem;
  color: ${(props) =>
    props.liked ? "#1a599c" : props.disliked ? "#DC143C" : ""};
`;

const VideoComments = () => {
  const [truefalse, setTruefalse] = useState({
    showComment: true,
    showResponse: false,
    showResponseContainer: true,
    liked: false,
    disliked: false,
  });

  const {
    showComment,
    showResponse,
    showResponseContainer,
    liked,
    disliked,
  } = truefalse;

  const handleBoolean = (e) => {
    console.log("event.target  :", e.target);
    console.log("event.target.name :", e.target.name);
    console.log("truefalse :", truefalse);

    setTruefalse({
      ...truefalse,
      [e.target.name]: !truefalse[e.target.name],
    });
    console.log("after :", truefalse);
  };
  const handleResponse = () => {
    setTruefalse(() => {
      return { ...truefalse, showResponse: !showResponse };
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

  const { id, currentVideoComments } = useSelector(({ video }) => {
    return {
      id: video.currentVideo.id,
      currentVideoComments: video.currentVideoComments,
    };
  }, shallowEqual);

  const { myProfilePhoto } = useSelector(({ user }) => {
    return {
      myProfilePhoto: user.me.profilePhoto,
    };
  });
  const [content, setContent] = useState("");
  const handleChange = (e) => {
    setContent(e.target.value);
  };

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    console.log("id :", id);
    if (e.key === "Enter") {
      console.log("event enter fired");
      dispatch({
        type: ADD_COMMENT_REQUEST,
        data: {
          videoId: id,
          content: content,
        },
      });
    }
  };

  const renderCommentForm = () => {
    return (
      <div id="comment-form">
        <img
          src={
            myProfilePhoto
              ? `${URL}/${myProfilePhoto}`
              : "../static/images/profiles/how-to-anything.png"
          }
          alt="User Profile Photo"
        />
        <textarea
          onChange={handleChange}
          onKeyDown={handleSubmit}
          placeholder="Add a public comment"
        >
          {content}
        </textarea>
      </div>
    );
  };

  // const sudoCommentList = [1, 2, 3, 4];

  const renderEachComment = (comments) => {
    return comments.map((comment) => {
      const { id, content, nickname, profilePhoto, createdAt } = {
        createdAt: comment.createdAt,
        content: comment.content,
        nickname: comment.User,
        profilePhoto: comment.User.profilePhoto,
        id: comment.id,
      };

      const onClickLike = () => {
        dispatch({
          type: LIKE_COMMENT_REQUEST,
          data: id,
        });
      };
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
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <StyledIconBox onClick={onClickLike}>
                <ThumbUpIcon /> &nbsp; 3
              </StyledIconBox>
              <StyledIconBox>
                <ThumbDownIcon /> &nbsp; 34
              </StyledIconBox>
              <DeleteIcon />
            </div>
          </div>
          {showResponseContainer && (
            <div className="see-response-container">
              <Button
                variant="contained"
                name="showResponse"
                onClick={handleResponse}
              >
                See the response
              </Button>
            </div>
          )}
          {showResponse && (
            <div className="response-list">
              <div className="response comment my-comment">
                <img
                  src="../static/images/profiles/how-to-anything.png"
                  alt="How To Anything"
                />
                <a href="#" title="How To Anything">
                  <span>How To Anything</span>
                </a>
                <p>
                  This is the cheapest way I can see to do it. I think if you go
                  any cheaper than this you risk having poor quality. If you
                  can't afford everything right now, maybe start working on a
                  bunch of things you want to talk about, and save up. Then when
                  you are ready to buy the equipment, you will have a bunch of
                  material, and you can just start recording immediately. Just a
                  thought :).
                </p>
                <div className="comment-statistics">
                  <p>10 minutes ago</p>
                  <p className="comment-status-separator">&middot;</p>
                  <p>2</p>
                  <img
                    src="../static/images/icons/thumbs-up-default.svg"
                    alt="Thumbs Up"
                  />
                  <img
                    src="../static/images/icons/thumbs-down-default.svg"
                    alt="Thumbs Down"
                  />
                </div>
              </div>
              <div className="response comment">
                <img
                  src="../static/images/profiles/douglas.png"
                  alt="Douglas Johannasen"
                />
                <a href="#" title="Douglas Johannasen">
                  <span>Douglas Johannasen</span>
                </a>
                <p>
                  Yeah I understand what you are saying, was just hoping to
                  start it sooner, but never mind.
                </p>
                <div className="comment-statistics">
                  <p>6 minutes ago</p>
                  <p className="comment-status-separator">&middot;</p>
                  <p>1</p>
                  <img
                    src="../static/images/icons/thumbs-up-default.svg"
                    alt="Thumbs Up"
                  />
                  <img
                    src="../static/images/icons/thumbs-down-default.svg"
                    alt="Thumbs Down"
                  />
                </div>
              </div>
              <div className="response comment my-comment">
                <img
                  src="../static/images/profiles/how-to-anything.png"
                  alt="How To Anything"
                />
                <a href="#" title="How To Anything">
                  <span>How To Anything</span>
                </a>
                <p>Good luck with everything. Wish you all the best.</p>
                <div className="comment-statistics">
                  <p>Less than a minute ago</p>
                  <p className="comment-status-separator">&middot;</p>
                  <p>1</p>
                  <img
                    src="../static/images/icons/thumbs-up-default.svg"
                    alt="Thumbs Up"
                  />
                  <img
                    src="../static/images/icons/thumbs-down-default.svg"
                    alt="Thumbs Down"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      );
    });
  };

  const renderCommentList = () => {
    return (
      <div id="comment-list">{renderEachComment(currentVideoComments)}</div>
    );
  };
  return (
    <section id="video-comments">
      {renderCommentHeader()}

      <div id="comment-list-container">
        {renderCommentForm()}
        {showComment && renderCommentList()}
      </div>
    </section>
  );
};

export default VideoComments;
