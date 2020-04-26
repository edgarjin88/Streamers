import React, { useEffect, useCallback } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { useRouter } from "next/router";

import { ProfileStyle } from "../../../styles/profileStyle";
import HideBar from "../../../containers/HideBar";
import RelatedVideos from "../../../components/RelatedVideos";
import Card from "../../../components/Card";
import Toaster from "../../../components/Toaster";
import {
  NULLIFY_CHANGE_PASSWORD_SUCCESS,
  NULLIFY_EDIT_NICKNAME_SUCCESS,
  NULLIFY_EDIT_DESCRIPTION_SUCCESS,
  UNFOLLOW_USER_REQUEST,
  REMOVE_FOLLOWER_REQUEST,
  LOAD_FOLLOWINGS_REQUEST,
  LOAD_FOLLOWERS_REQUEST,
  LOAD_USER_REQUEST,
} from "../../../reducers/user";
import { LOAD_USER_VIDEOS_REQUEST } from "../../../reducers/video";

const Profile = () => {
  const Router = useRouter();

  const dispatch = useDispatch();

  ///////////logic 1//
  ///////////logic 1//
  //id로 유저 정보 불러오기.
  //내 정보는 me.id로 클릭하기.

  // 내 프로필이 아니면 저장 못하게 하기.

  const { nickname } = useSelector((state) => state.user.userInfo);

  const { userVideos } = useSelector((state) => state.video);

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

  // const { mainPosts } = useSelector((state) => state.post);

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
        <Card />

        <RelatedVideos
          videoData={userVideos}
          headers={`${nickname}'s other streamings`}
        />
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

Profile.getInitialProps = async (context) => {
  const state = context.store.getState();

  const { id } = context.query;
  // await context.store.dispatch({
  //   type: LOAD_VIDEO_REQUEST,
  //   data: id,
  // });

  await context.store.dispatch({
    type: LOAD_FOLLOWERS_REQUEST,
    data: id,
  });
  // console.log('this is store', context.store);
  await context.store.dispatch({
    type: LOAD_FOLLOWINGS_REQUEST,
    data: id,
  });
  await context.store.dispatch({
    type: LOAD_USER_VIDEOS_REQUEST,
    data: id,
  });

  await context.store.dispatch({
    type: LOAD_USER_REQUEST,
    data: id,
  });

  // return { id };
};

export default Profile;
