import React, { useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";

import { IndexGlobalStyle } from "../styles/indexStyle";

import HideBar from "../containers/HideBar";
import RelatedVideos from "../components/RelatedVideos";
import Toaster from "../components/Toaster";
import { NULLIFY_SIGN_OUT } from "../reducers/user";

const Index = () => {
  const dispatch = useDispatch();
  const { me, signOutSuccess, signoutErrorReason } = useSelector(({ user }) => {
    return {
      me: user.me,
      signOutSuccess: user.signOutSuccess,
      signoutErrorReason: user.signoutErrorReason
    };
  }, shallowEqual);

  useEffect(() => {
    console.log("nulifyfired");
    if (signOutSuccess) {
      dispatch({
        type: NULLIFY_SIGN_OUT
      });
    }
  }, [NULLIFY_SIGN_OUT]);

  return (
    <div className="container">
      <IndexGlobalStyle />
      <HideBar style={{ zIndex: 3000 }} />

      <main>
        <RelatedVideos />
      </main>

      {signOutSuccess && (
        <Toaster
          message="You are signed out successfully"
          whereTo={false}
          type="success"
        />
      )}
      {signoutErrorReason && (
        <Toaster message={signoutErrorReason} whereTo={false} type="error" />
      )}
    </div>
  );
};

export default Index;
