import React, { useEffect, useCallback } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import Head from "next/head";

import { IndexGlobalStyle } from "../../../styles/indexStyle";

import HideBar from "../../../containers/HideBar";
import RelatedVideos from "../../../components/RelatedVideos";

import { LOAD_HASHTAG_VIDEOS_REQUEST } from "../../../reducers/video";
import { FRONTURL, URL } from "../../../config/config";

const Hashtag = ({ tag }) => {
  const dispatch = useDispatch();

  const { mainVideos, hasMoreVideo, hashtagVideoImage } = useSelector(
    (state) => {
      return {
        mainVideos: state.video.mainVideos,
        hasMoreVideo: state.video.mainVideos,
        hashtagVideoImage:
          state.video &&
          state.video.mainVideos &&
          state.video.mainVideos[0] &&
          state.video.mainVideos[0].Images &&
          state.video.mainVideos[0].Images[0] &&
          state.video.mainVideos[0].Images[0].src,
      };
    }
  );

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

  return (
    <div className="container">
      <Head>
        <title>Search result of hashtag: {tag}</title>
        <meta
          name="description"
          content={`You can find all video streaming channels related to the hashtag : ${tag}`}
        />
        <meta
          property="og:title"
          content={`Search result of hashtag: ${tag}`}
        />

        <meta
          property="og:description"
          content={`You can find all video streaming channels related to the hashtag : ${tag}`}
        />

        <meta property="og:url" content={`${FRONTURL}/hashtag/${tag}`} />
        <meta property="og:image" content={`${URL}/${hashtagVideoImage}`} />
        <link rel="canonical" href={`${FRONTURL}/hashtag/${tag}`} />
      </Head>
      <IndexGlobalStyle />
      <HideBar style={{ zIndex: 3000 }} />

      <main>
        <RelatedVideos headers={`VIDEOS RELATED TO HASHTAG: ${tag}`} />
      </main>
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
