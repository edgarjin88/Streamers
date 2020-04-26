import { useCallback, useEffect } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import SubscriptionsIcon from "@material-ui/icons/Subscriptions";
import StopScreenShareIcon from "@material-ui/icons/StopScreenShare";
import { UNFOLLOW_USER_REQUEST, FOLLOW_USER_REQUEST } from "../reducers/user";

const FollowButton = ({ idToFollow }) => {
  const dispatch = useDispatch();
  const { me } = useSelector(({ user }) => {
    return { me: user.me };
  }, shallowEqual);

  const onUnfollow = useCallback(
    (e) => {
      dispatch({
        type: UNFOLLOW_USER_REQUEST,
        data: idToFollow,
      });
    },
    [idToFollow]
  );

  const onFollow = useCallback(
    (e) => {
      dispatch({
        type: FOLLOW_USER_REQUEST,
        data: idToFollow,
      });
    },
    [idToFollow]
  );

  return !me || idToFollow === me.id ? null : me.Followings &&
    me.Followings.find((v) => v.id === idToFollow) ? (
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

export default FollowButton;
