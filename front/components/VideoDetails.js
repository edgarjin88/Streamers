import { useCallback, useEffect } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import SubscriptionsIcon from "@material-ui/icons/Subscriptions";
import StopScreenShareIcon from "@material-ui/icons/StopScreenShare";
import { URL } from "../config/config";
import { FOLLOW_USER_REQUEST, UNFOLLOW_USER_REQUEST } from "../reducers/user";
import Link from "next/link";
import {
  UNDISLIKE_VIDEO_REQUEST,
  DISLIKE_VIDEO_REQUEST,
  LOAD_VIDEO_REQUEST,
  UNLIKE_VIDEO_REQUEST,
  LIKE_VIDEO_REQUEST,
} from "../reducers/video";
import styled from "styled-components";

import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import ShareIcon from "@material-ui/icons/Share";
import ReportIcon from "@material-ui/icons/Report";
// id(pin):2
// description(pin):"fwaefawef"
// title(pin):"asdfasdf"
// videoImageURL(pin):null
// viewCount(pin):null
// createdAt(pin):"2020-04-22T04:13:04.000Z"
// updatedAt(pin):"2020-04-22T04:13:04.000Z"
// UserId(pin):1
// RetweetId(pin): null

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

  const FollowButton = () => {
    return !me || User.id === me.id ? null : me.Followings &&
      me.Followings.find((v) => v.id === User.id) ? (
      <button style={{ cursor: "pointer" }} onClick={onUnfollow}>
        <StopScreenShareIcon
          style={{ fontSize: "2.5rem", marginRight: "0.5rem" }}
        />
        <span>Unsubscribe</span>
      </button>
    ) : (
      <button style={{ cursor: "pointer" }} onClick={onFollow}>
        <SubscriptionsIcon
          style={{ fontSize: "2.5rem", marginRight: "0.5rem" }}
        />
        <span>Subscribe</span>
        {/* follow unfollow 여기다 달자 */}
      </button>
    );
  };

  const onUnfollow = useCallback(
    (e) => {
      dispatch({
        type: UNFOLLOW_USER_REQUEST,
        data: User.id,
      });
    },
    [User.id]
  );

  const onFollow = useCallback(
    (e) => {
      console.log("target id: ", User.id);
      dispatch({
        type: FOLLOW_USER_REQUEST,
        data: User.id,
      });
    },
    [User.id]
  );

  const liked = me && me.id && Likers && Likers.find((v) => v.id === me.id);
  const disliked =
    me && me.id && Dislikers && Dislikers.find((v) => v.id === me.id);

  console.log("liked: ", liked);
  const onToggleLike = useCallback(() => {
    console.log("liked: ", liked);
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

  console.log("liked: ", Dislikers);
  const onToggleDislike = useCallback(() => {
    console.log("liked: ", Dislikers);
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

  //스타일드로 트루 폴스, 블루 레드, report 까지만 해두자.
  const basicStyle = { width: "2.4rem", height: "2.4rem", cursor: "pointer" };
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
        <FollowButton />
      </div>
    );
  };
  const checkTarget = () => {
    console.log("current target id:", User.id);
  };
  return (
    <section id="video-details" onClick={checkTarget}>
      <header>
        <h4>#hash tags1 #hash tag2</h4>
        <h2>
          <strong>{title}</strong>
        </h2>
        <span style={{ fontSize: "1.4rem" }}>{description && description}</span>
        <div id="video-views-count">{viewCount ? viewCount : 0} views</div>
      </header>
      "folowings": {JSON.stringify(me.Followings)}
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
