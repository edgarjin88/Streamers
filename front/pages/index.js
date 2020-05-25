import React, { useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import Head from "next/head";

import { IndexGlobalStyle } from "../styles/indexStyle";

import HideBar from "../containers/HideBar";
import RelatedVideos from "../components/RelatedVideos";
import { LOAD_MAIN_VIDEOS_REQUEST } from "../reducers/video";

import { FRONTURL, URL } from "../config/config";

const Index = () => {
  const { videoImage } = useSelector((state) => {
    return {
      videoImage:
        state.video &&
        state.video.mainVideos &&
        state.video.mainVideos[0] &&
        state.video.mainVideos[0].Images &&
        state.video.mainVideos[0].Images[0] &&
        state.video.mainVideos[0].Images[0].src,
    };
  }, shallowEqual);
  return (
    <div className="container">
      <Head>
        <title>STREAMERS.COM</title>
        <meta
          name="description"
          content={`You can find all any live streaming channels here in STREAMERS.COM`}
        />
        <meta property="og:title" content={`STREAMERS.COM`} />

        <meta
          property="og:description"
          content={`You can find all any live streaming channels here in STREAMERS.COM`}
        />
        <meta property="og:url" content={`${FRONTURL}`} />
        <meta property="og:image" content={`${URL}/${videoImage}`} />
        <link rel="canonical" href={`${FRONTURL}/`} />
      </Head>
      <IndexGlobalStyle />
      <HideBar style={{ zIndex: 3000 }} />

      <main>
        <RelatedVideos />
      </main>
    </div>
  );
};

Index.getInitialProps = async (context) => {
  await context.store.dispatch({
    type: LOAD_MAIN_VIDEOS_REQUEST,
  });
};

export default Index;
