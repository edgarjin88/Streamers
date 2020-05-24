import React, { useEffect } from "react";
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
  LOAD_FOLLOWINGS_REQUEST,
  LOAD_FOLLOWERS_REQUEST,
  LOAD_USER_REQUEST,
} from "../../../reducers/user";
import { LOAD_USER_VIDEOS_REQUEST } from "../../../reducers/video";

const Profile = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const queryId = router.query.id;

  const {
    nickname,
    changePasswordSuccess,
    editNicknameSuccess,
    editDescriptionSuccess,
    me,
    id,
    profilePhoto,
  } = useSelector((state) => {
    return {
      id: state.user.userInfo.id,
      profilePhoto: state.user.userInfo.profilePhoto,
      nickname: state.user.userInfo.nickname,
      editNicknameSuccess: state.user.editNicknameSuccess,
      changePasswordSuccess: state.user.changePasswordSuccess,
      editDescriptionSuccess: state.user.editDescriptionSuccess,
      me: state.user.me,
    };
  }, shallowEqual);

  const profileOwner = me && me.id === id && id === parseInt(queryId, 10);

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
        <Card profileOwner={profileOwner} />

        <RelatedVideos
          profilePhoto={profilePhoto}
          headers={`${
            profileOwner ? me.nickname : nickname
          }'s other streamings`}
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

  await context.store.dispatch({
    type: LOAD_FOLLOWERS_REQUEST,
    data: id,
  });
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
};

export default Profile;
