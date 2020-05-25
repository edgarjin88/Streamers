import React, { useEffect } from "react";
import Head from "next/head";
import Router from "next/router";

import { useSelector, shallowEqual, useDispatch } from "react-redux";

import { IndexGlobalStyle } from "../styles/indexStyle";

import HideBar from "../containers/HideBar";
import RelatedVideos from "../components/RelatedVideos";
import { LOAD_FAVORITE_VIDEOS_REQUEST } from "../reducers/video";
import { URL, FRONTURL } from "../config/config";

const Favorite = () => {
  const { me, videoImage } = useSelector((state) => {
    return {
      me: state.user && state.user.me,
      videoImage:
        state.video &&
        state.video.mainVideos &&
        state.video.mainVideos[0] &&
        state.video.mainVideos[0].Images &&
        state.video.mainVideos[0].Images[0] &&
        state.video.mainVideos[0].Images[0].src,
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
      <Head>
        <title>Your Favorite channels </title>
        <meta
          name="description"
          content="Your favorite channels. You can find all channels you liked here"
        />
        <meta property="og:title" content={"Your Favorite channels"} />
        <meta
          property="og:description"
          content="Your favorite channels. You can find all channels you liked here"
        />
        <meta property="og:url" content={`${FRONTURL}/favorite`} />
        <meta property="og:image" content={`${URL}/${videoImage}`} />
        <link rel="canonical" href={`${FRONTURL}/favorite`} />
      </Head>
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
