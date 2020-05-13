import React, { useEffect, useCallback } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";

import { IndexGlobalStyle } from "../../../styles/indexStyle";

import HideBar from "../../../containers/HideBar";
import RelatedVideos from "../../../components/RelatedVideos";
import Toaster from "../../../components/Toaster";
import {
  NULLIFY_SIGN_OUT,
  NULLIFY_SIGN_IN_SUCCESS,
} from "../../../reducers/user";
import { LOAD_HASHTAG_VIDEOS_REQUEST } from "../../../reducers/video";

const Hashtag = ({ tag }) => {
  const dispatch = useDispatch();

  const { mainVideos, hasMoreVideo } = useSelector((state) => state.video);

  const onScroll = useCallback(() => {
    if (
      window.scrollY + document.documentElement.clientHeight >
      document.documentElement.scrollHeight - 300
    ) {
      if (hasMoreVideo) {
        dispatch({
          type: LOAD_HASHTAG_VIDEOS_REQUEST,
          lastId:
            mainVideos[mainVideos.length - 1] &&
            mainVideos[mainVideos.length - 1].id,

          data: tag,
        });
      }
    }
  }, [hasMoreVideo, mainVideos.length]);

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [mainVideos.length]);

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

Hashtag.getInitialProps = async (context) => {
  const tag = context.query.tag;
  context.store.dispatch({
    type: LOAD_HASHTAG_VIDEOS_REQUEST,
    data: tag,
  });

  return { tag };
};

export default Hashtag;
