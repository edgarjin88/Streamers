import React, { useEffect, useCallback } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";

import { IndexGlobalStyle } from "../../../styles/indexStyle";

import HideBar from "../../../containers/HideBar";
import RelatedVideos from "../../../components/RelatedVideos";

import { LOAD_HASHTAG_VIDEOS_REQUEST } from "../../../reducers/video";

const Hashtag = ({ tag }) => {
  const dispatch = useDispatch();
  console.log("tag  here :", tag);

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

  return (
    <div className="container">
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
