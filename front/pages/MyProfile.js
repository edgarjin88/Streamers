import React, { useEffect } from "react";
import { GlobalStyleOne } from "../styles/styles";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import HideBar from "../containers/HideBar";
import RelatedVideos from "../components/RelatedVideos";
import Card from "../components/Card";
import Toaster from "../components/Toaster";
import {
  NULLIFY_CHANGE_PASSWORD_SUCCESS,
  NULLIFY_EDIT_NICKNAME_SUCCESS
} from "../reducers/user";
import { NULLIFY_SIGN_IN_SUCCESS } from "../reducers/user";

const Profile = () => {
  const dispatch = useDispatch();
  const { changePasswordSuccess, editNicknameSuccess } = useSelector(
    ({ user }) => {
      return {
        editNicknameSuccess: user.editNicknameSuccess,
        changePasswordSuccess: user.changePasswordSuccess
      };
    },
    shallowEqual
  );

  useEffect(() => {
    setTimeout(() => {
      dispatch({
        type: changePasswordSuccess
          ? NULLIFY_CHANGE_PASSWORD_SUCCESS
          : NULLIFY_EDIT_NICKNAME_SUCCESS
      });
    }, 2000);
  }, [changePasswordSuccess, editNicknameSuccess]);
  return (
    <div className="container">
      <GlobalStyleOne />
      <HideBar />

      <main>
        <Card />
        <div>
          Dependnig on redux states, login, password change, profile update to
          show.{" "}
        </div>
        <RelatedVideos />
      </main>
      {changePasswordSuccess && (
        <Toaster
          message="Password Updated Successfully"
          type="success"
          whereTo={false}
        />
      )}
      {editNicknameSuccess && (
        <Toaster
          message="Nickname Updated Successfully"
          type="success"
          whereTo={false}
        />
      )}
    </div>
  );
};

export default Profile;
