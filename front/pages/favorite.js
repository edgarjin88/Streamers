import React, { useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";

import { IndexGlobalStyle } from "../styles/indexStyle";

import HideBar from "../containers/HideBar";
import RelatedVideos from "../components/RelatedVideos";
import { LOAD_FAVORITE_VIDEOS_REQUEST } from "../reducers/video";
import Router from "next/router";
const Favorite = () => {
  const { userVideos, me } = useSelector((state) => {
    return {
      userVideos: state.video.userVideos,
      me: state.user && state.user.me,
    };
  }, shallowEqual);
  useEffect(() => {
    if (!me) {
      alert("Please login first to see your video channels");
      Router.push("/");
    }
  }, []);
  return (
    <div className="container">
      <IndexGlobalStyle />
      <HideBar style={{ zIndex: 3000 }} />
      <main>
        <RelatedVideos headers={`Your favorite video channels`} />
      </main>
    </div>
  );
};

Favorite.getInitialProps = async (context) => {
  await context.store.dispatch({
    type: LOAD_FAVORITE_VIDEOS_REQUEST,
  });
};

export default Favorite;
