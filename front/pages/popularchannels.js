import React from "react";
import { useSelector, shallowEqual } from "react-redux";

import Head from "next/head";

import { IndexGlobalStyle } from "../styles/indexStyle";

import HideBar from "../containers/HideBar";
import RelatedVideos from "../components/RelatedVideos";
import { LOAD_POPULAR_VIDEOS_REQUEST } from "../reducers/video";
import { URL, FRONTURL } from "../config/config";

const PopularVideos = () => {
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
        <title>Currently trending channels</title>
        <meta
          name="description"
          content="You can find the most popular channels right here."
        />
        <meta property="og:title" content={"Currently trending channels"} />
        <meta
          property="og:description"
          content="You can find the most popular channels right here."
        />
        <meta property="og:url" content={`${FRONTURL}/popularchannels`} />
        <meta property="og:image" content={`${URL}/${videoImage}`} />
        <link rel="canonical" href={`${FRONTURL}/popularchannels`} />
      </Head>
      <IndexGlobalStyle />
      <HideBar style={{ zIndex: 3000 }} />

      <main>
        <RelatedVideos headers={`Currently trending channels`} />
      </main>
    </div>
  );
};

PopularVideos.getInitialProps = async (context) => {
  await context.store.dispatch({
    type: LOAD_POPULAR_VIDEOS_REQUEST,
  });
};

export default PopularVideos;
