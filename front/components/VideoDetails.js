import { useCallback } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";

import Link from "next/link";

import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import ShareIcon from "@material-ui/icons/Share";
import ReportIcon from "@material-ui/icons/Report";
import EditAndDeleteBox from "../containers/EditAndDeleteBox";
import FollowButton from "../containers/FollowButton";

import { URL } from "../config/config";

import {
  UNDISLIKE_VIDEO_REQUEST,
  DISLIKE_VIDEO_REQUEST,
  LOAD_VIDEO_REQUEST,
  UNLIKE_VIDEO_REQUEST,
  LIKE_VIDEO_REQUEST,
} from "../reducers/video";

import VideoDescription from "./Hashtag";

const VideoDetails = () => {
  const dispatch = useDispatch();
  const { me } = useSelector(({ user }) => {
    return { me: user.me };
  }, shallowEqual);

  const { currentVideo } = useSelector(({ video }) => {
    return {
      currentVideo: video.currentVideo,
    };
  }, shallowEqual);

  const {
    title,
    description,
    viewCount,
    createdAt,
    Likers,
    Dislikers,
    User,
    id,
  } = currentVideo;

  const liked = me && me.id && Likers && Likers.find((v) => v.id === me.id);
  const disliked =
    me && me.id && Dislikers && Dislikers.find((v) => v.id === me.id);

  const onToggleLike = useCallback(() => {
    if (!me) {
      return alert("Login required");
    }
    if (liked) {
      dispatch({
        type: UNLIKE_VIDEO_REQUEST,
        data: id, //video id
      });
    } else {
      dispatch({
        type: LIKE_VIDEO_REQUEST,
        data: id, //video id
      });
      if (disliked) {
        dispatch({
          type: UNDISLIKE_VIDEO_REQUEST,
          data: id,
        });
      }
    }
  }, [me, id, Likers, Dislikers]);

  const onToggleDislike = useCallback(() => {
    if (!me) {
      return alert("Login required");
    }
    if (disliked) {
      dispatch({
        type: UNDISLIKE_VIDEO_REQUEST,
        data: id, //video id
      });
    } else {
      dispatch({
        type: DISLIKE_VIDEO_REQUEST,
        data: id, //video id
      });
      if (liked) {
        dispatch({
          type: UNLIKE_VIDEO_REQUEST,
          data: id, //video id
        });
      }
    }
  }, [me, id, Dislikers, Likers]);

  const basicStyle = { width: "2.4rem", height: "2.4rem", cursor: "pointer" };

  const renderChannelDetails = () => {
    return (
      <div id="channel-details">
        <Link href={`/profile/[id]`} as={`/profile/${User && User.id}`}>
          <a>
            <img
              src={
                User && User.profilePhoto
                  ? `${URL}/${User.profilePhoto}`
                  : "../static/images/profiles/how-to-anything.png"
              }
              alt={`${User && User.nickname}`}
            />
            <div id="channel-metadata">
              <h3>{User && User.nickname}</h3>
              <div id="channel-subscriber-count">
                {User && User.Followers && User.Followers.length} Subscribers
              </div>
            </div>
          </a>
        </Link>
        {(User && User.id) === (me && me.id) && <EditAndDeleteBox />}
        <FollowButton idToFollow={User && User.id} />
      </div>
    );
  };

  const renderSocialContainer = () => {
    return (
      <div
        id="social-container"
        style={{ display: "flex", justifyContent: "space-around" }}
      >
        <div onClick={onToggleLike} className="social-item active">
          <ThumbUpIcon style={{ ...basicStyle, color: liked && "#1a599c" }} />
          <p className="social-item-title">{Likers && Likers.length}</p>
        </div>
        <div className="social-item">
          <ThumbDownIcon
            onClick={onToggleDislike}
            style={{ ...basicStyle, color: disliked && "#DC143C" }}
          />
          <p className="social-item-title">{Dislikers && Dislikers.length}</p>
        </div>
        <div className="social-item">
          <ShareIcon style={basicStyle} />
          <p className="social-item-title">Share</p>
        </div>

        <div className="social-item">
          <ReportIcon style={basicStyle} />
          <p className="social-item-title">Report</p>
        </div>
      </div>
    );
  };

  return (
    <section id="video-details">
      <header>
        <h2>
          <strong>{title}</strong>
        </h2>
        {description && <VideoDescription description={description} />}
        <div id="video-views-count">{viewCount ? viewCount : 0} views</div>
      </header>
      {renderSocialContainer()}
      {User && renderChannelDetails()}
    </section>
  );
};

VideoDetails.getInitialProps = async (context) => {
  const { id } = context.query;
  await context.store.dispatch({
    type: LOAD_VIDEO_REQUEST,
    data: id,
  });
};

export default VideoDetails;
