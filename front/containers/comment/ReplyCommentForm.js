import React, { useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { ADD_REPLY_TO_COMMENT_REQUEST } from "../../reducers/video";
import { URL } from "../../config/config";

const ReplyCommentForm = ({ commentId }) => {
  const [content, setContent] = useState("");
  const handleChange = (e) => {
    setContent(e.target.value);
  };

  const { id } = useSelector(({ video }) => {
    return {
      id: video.currentVideo.id,
    };
  }, shallowEqual);

  const { myProfilePhoto } = useSelector(({ user }) => {
    return {
      myProfilePhoto: user.me.profilePhoto,
    };
  });

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    if (e.key === "Enter") {
      dispatch({
        type: ADD_REPLY_TO_COMMENT_REQUEST,
        data: {
          videoId: id,
          commentId: commentId,
          content: content,
        },
      });
      setTimeout(() => {
        setContent("");
      }, 200);
    }
  };

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
        placeholder="Add a reply to the comment"
        value={content}
      />
    </div>
  );
};

export default ReplyCommentForm;
