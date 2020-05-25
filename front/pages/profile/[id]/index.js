import React, { useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import Head from "next/head";
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

import { FRONTURL, URL } from "../../../config/config";

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
  console.log("user  profile :", profilePhoto);
  return (
    <div className="container">
      <Head>
        <title>Title : {nickname}'s profile</title>
        <meta
          name="description"
          content={`${nickname}'s profile page. You can find the user description and user's other video channels here.`}
        />
        <meta property="og:title" content={`${nickname}'s profile`} />

        <meta
          property="og:description"
          content={`${nickname}'s profile page. You can find the user description and user's other video channels here.`}
        />

        <meta property="og:url" content={`${FRONTURL}/profile/${queryId}`} />
        <meta property="og:image" content={`${URL}/${profilePhoto}`} />
        <link rel="canonical" href={`${FRONTURL}/profile/${queryId}`} />
      </Head>
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
