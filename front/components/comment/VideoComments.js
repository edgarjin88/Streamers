import React, { useState } from "react";
import { useSelector, shallowEqual } from "react-redux";

import moment from "moment";

import CommentForm from "../../containers/comment/CommentForm.js";
import CommentList from "./CommentList";

moment.locale("en");

const VideoComments = () => {
  const [truefalse, setTruefalse] = useState({
    showComment: true,
    showResponse: false,
  });

  const { showComment, showResponse } = truefalse;

  const handleBoolean = (e) => {
    setTruefalse({
      ...truefalse,
      [e.target.name]: !truefalse[e.target.name],
    });
  };

  const { currentVideoComments } = useSelector(({ video }) => {
    return {
      currentVideoComments: video.currentVideoComments,
    };
  }, shallowEqual);

  const { me } = useSelector(({ user }) => {
    return user;
  }, shallowEqual);

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
        {showComment && <CommentList />}
      </div>
    </section>
  );
};

export default VideoComments;
