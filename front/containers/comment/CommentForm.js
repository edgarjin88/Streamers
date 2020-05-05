import React, { useRef, useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { ADD_COMMENT_REQUEST } from "../../reducers/video";
import { URL } from "../../config/config";

const CommentForm = () => {
  const [content, setContent] = useState("");
  const handleChange = (e) => {
    setContent(e.target.value);
  };

  const { id } = useSelector(({ video }) => {
    return {
      id: video.currentVideo.id,
    };
  }, shallowEqual);

  const { myProfilePhoto, me } = useSelector(({ user }) => {
    return {
      myProfilePhoto: user.me.profilePhoto,
      me: user.me,
    };
  });

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    console.log("id :", id);
    if (e.key === "Enter") {
      dispatch({
        type: ADD_COMMENT_REQUEST,
        data: {
          videoId: id,
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
            : "/images/profiles/how-to-anything.png"
        }
        alt="User Profile Photo"
      />
      <textarea
        onChange={handleChange}
        onKeyDown={handleSubmit}
        placeholder="Add a public comment"
        value={content}
      />
    </div>
  );
};

export default CommentForm;
