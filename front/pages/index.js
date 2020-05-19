import React, { useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";

import { IndexGlobalStyle } from "../styles/indexStyle";

import HideBar from "../containers/HideBar";
import RelatedVideos from "../components/RelatedVideos";
import { LOAD_MAIN_VIDEOS_REQUEST } from "../reducers/video";
const Index = () => {
  console.log("fired here?");
  return (
    <div className="container">
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
