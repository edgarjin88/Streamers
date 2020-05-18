import React, { useEffect, useCallback } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";

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
  const dispatch = useDispatch();

  const {
    userVideos,
    nickname,
    changePasswordSuccess,
    editNicknameSuccess,
    editDescriptionSuccess,
    me,
    profilePhoto,
  } = useSelector((state) => {
    return {
      profilePhoto: state.user.userInfo.profilePhoto,
      userVideos: state.video.userVideos,
      nickname: state.user.userInfo.nickname,
      editNicknameSuccess: state.user.editNicknameSuccess,
      changePasswordSuccess: state.user.changePasswordSuccess,
      editDescriptionSuccess: state.user.editDescriptionSuccess,
      me: state.user.me,
    };
  }, shallowEqual);

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
  console.log("userVideos value: ", userVideos);
  return (
    <div className="container">
      <ProfileStyle />
      <HideBar />

      <main>
        <Card />

        <RelatedVideos
          profilePhoto={profilePhoto}
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
