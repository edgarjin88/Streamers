import React, { useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";

import { IndexGlobalStyle } from "../styles/indexStyle";

import HideBar from "../containers/HideBar";
import RelatedVideos from "../components/RelatedVideos";
import Toaster from "../components/Toaster";
import { NULLIFY_SIGN_OUT, NULLIFY_SIGN_IN_SUCCESS } from "../reducers/user";
import { LOAD_MAIN_VIDEOS_REQUEST } from "../reducers/video";

// import SimpleModal from "../containers/CreateChannel";

const Index = () => {
  const dispatch = useDispatch();
  const { me, signOutSuccess, signInSuccess, signoutErrorReason } = useSelector(
    ({ user }) => {
      return {
        me: user.me,
        signOutSuccess: user.signOutSuccess,
        signoutErrorReason: user.signoutErrorReason,
        signInSuccess: user.signInSuccess,
      };
    },
    shallowEqual
  );

  useEffect(() => {
    if (signOutSuccess) {
      setTimeout(() => {
        dispatch({
          type: NULLIFY_SIGN_OUT,
        });
      }, 1000);
    }
    if (signInSuccess) {
      setTimeout(() => {
        dispatch({
          type: NULLIFY_SIGN_IN_SUCCESS,
        });
      }, 1000);
    }
  }, [signOutSuccess, signInSuccess]);

  return (
    <div className="container">
      <IndexGlobalStyle />
      <HideBar style={{ zIndex: 3000 }} />

      <main>
        {/* <SimpleModal /> */}
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

Index.getInitialProps = async (context) => {
  const { id } = context.query;

  await context.store.dispatch({
    type: LOAD_MAIN_VIDEOS_REQUEST,
  });
};

export default Index;
