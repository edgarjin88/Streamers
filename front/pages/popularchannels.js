import React, { useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";

import { IndexGlobalStyle } from "../styles/indexStyle";

import HideBar from "../containers/HideBar";
import RelatedVideos from "../components/RelatedVideos";
import {
  LOAD_USER_VIDEOS_REQUEST,
  LOAD_POPULAR_VIDEOS_REQUEST,
} from "../reducers/video";
const PopularVideos = () => {
  return (
    <div className="container">
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
