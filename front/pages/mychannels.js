import React, { useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import Router from "next/router";
import Head from "next/head";

import { IndexGlobalStyle } from "../styles/indexStyle";
import HideBar from "../containers/HideBar";

import RelatedVideos from "../components/RelatedVideos";
import { LOAD_USER_VIDEOS_REQUEST } from "../reducers/video";
import { URL, FRONTURL } from "../config/config";

const Mychannels = () => {
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
        <title>Your channels</title>
        <meta
          name="description"
          content="You can find all channels you created"
        />
        <meta property="og:title" content={"Your channels"} />
        <meta
          property="og:description"
          content="You can find all channels you created"
        />
        <meta property="og:url" content={`${FRONTURL}/mychannels`} />
        <meta property="og:image" content={`${URL}/${videoImage}`} />
        <link rel="canonical" href={`${FRONTURL}/mychannels`} />
      </Head>
      <IndexGlobalStyle />
      <HideBar style={{ zIndex: 3000 }} />
      <main>
        <RelatedVideos headers={`Your video channels`} />
      </main>
    </div>
  );
};

Mychannels.getInitialProps = async (context) => {
  await context.store.dispatch({
    type: LOAD_USER_VIDEOS_REQUEST,
  });
};

export default Mychannels;
