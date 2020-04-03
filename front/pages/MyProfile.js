import React, { useEffect } from "react";
import { GlobalStyleOne } from "../styles/styles";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import HideBar from "../containers/HideBar";
import RelatedVideos from "../components/RelatedVideos";
import Card from "../components/Card";
import Toaster from "../components/Toaster";
import {
  NULLIFY_CHANGE_PASSWORD_SUCCESS,
  NULLIFY_EDIT_NICKNAME_SUCCESS,
  NULLIFY_EDIT_DESCRIPTION_SUCCESS
} from "../reducers/user";
import { useRouter } from "next/router";

const Profile = () => {
  const Router = useRouter();

  const dispatch = useDispatch();
  const {
    changePasswordSuccess,
    editNicknameSuccess,
    editDescriptionSuccess,
    me
  } = useSelector(({ user }) => {
    return {
      editNicknameSuccess: user.editNicknameSuccess,
      changePasswordSuccess: user.changePasswordSuccess,
      editDescriptionSuccess: user.editDescriptionSuccess,
      me: user.me
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
          : NULLIFY_EDIT_DESCRIPTION_SUCCESS
      });
    }, 1000);
  }, [changePasswordSuccess, editNicknameSuccess, editDescriptionSuccess, me]);
  return (
    <div className="container">
      <GlobalStyleOne />
      <HideBar />

      <main>
        {me && <Card />}
        <div>
          Dependnig on redux states, login, password change, profile update to
          show.{" "}
        </div>
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
