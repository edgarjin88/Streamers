import React, { useEffect, useCallback } from "react";
import { ProfileStyle } from "../styles/profileStyle";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import HideBar from "../containers/HideBar";
import RelatedVideos from "../components/RelatedVideos";
import Card from "../components/Card";
import Toaster from "../components/Toaster";
import {
  NULLIFY_CHANGE_PASSWORD_SUCCESS,
  NULLIFY_EDIT_NICKNAME_SUCCESS,
  NULLIFY_EDIT_DESCRIPTION_SUCCESS,
  UNFOLLOW_USER_REQUEST,
  REMOVE_FOLLOWER_REQUEST,
  LOAD_FOLLOWINGS_REQUEST,
  LOAD_FOLLOWERS_REQUEST,
} from "../reducers/user";
import { useRouter } from "next/router";

const Profile = () => {
  const Router = useRouter();

  const dispatch = useDispatch();

  ///////////logic 1//
  ///////////logic 1//
  const {
    followingList,
    followerList,
    hasMoreFollower,
    hasMoreFollowing,
  } = useSelector((state) => state.user);
  const { mainVideos } = useSelector((state) => state.video);

  // console.log('mainposts', mainPosts)
  const onUnfollow = useCallback(
    (userId) => () => {
      dispatch({
        type: UNFOLLOW_USER_REQUEST,
        data: userId,
      });
    },
    []
  );

  const onRemoveFollower = useCallback(
    (userId) => () => {
      dispatch({
        type: REMOVE_FOLLOWER_REQUEST,
        data: userId,
      });
    },
    []
  );

  const loadMoreFollowings = useCallback(() => {
    dispatch({
      type: LOAD_FOLLOWINGS_REQUEST,
      offset: followingList.length,
    });
  }, [followingList.length]);

  const loadMoreFollowers = useCallback(() => {
    dispatch({
      type: LOAD_FOLLOWERS_REQUEST,
      offset: followerList.length,
    });
  }, [followerList.length]);

  ///////////logic 2//
  ///////////logic 2//
  ///////////logic 2//
  const {
    changePasswordSuccess,
    editNicknameSuccess,
    editDescriptionSuccess,
    me,
  } = useSelector(({ user }) => {
    return {
      editNicknameSuccess: user.editNicknameSuccess,
      changePasswordSuccess: user.changePasswordSuccess,
      editDescriptionSuccess: user.editDescriptionSuccess,
      me: user.me,
    };
  }, shallowEqual);
  useEffect(() => {
    if (!me) {
      Router.push("/");
    }
  });
  useEffect(() => {
    setTimeout(() => {
      dispatch({
        type: changePasswordSuccess
          ? NULLIFY_CHANGE_PASSWORD_SUCCESS
          : editNicknameSuccess
          ? NULLIFY_EDIT_NICKNAME_SUCCESS
          : NULLIFY_EDIT_DESCRIPTION_SUCCESS,
      });
    }, 1000);
  }, [changePasswordSuccess, editNicknameSuccess, editDescriptionSuccess, me]);

  return (
    <div className="container">
      <ProfileStyle />
      <HideBar />

      <main>
        {me && <Card />}

        <RelatedVideos />
      </main>
      {(changePasswordSuccess ||
        editNicknameSuccess ||
        editDescriptionSuccess) && (
        <Toaster
          message={
            changePasswordSuccess
              ? "Password Updated Successfully"
              : editNicknameSuccess
              ? "Nickname Updated Successfully"
              : "Profile Description Updated Successfully"
          }
          type="success"
          whereTo={false}
        />
      )}
    </div>
  );
};

export default Profile;
