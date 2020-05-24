import Head from "next/head";

import { useSelector, shallowEqual } from "react-redux";

import { VideoPageGlobalStyle } from "../../../styles/styles";

import HideBar from "../../../containers/HideBar";
import VideoDetails from "../../../components/VideoDetails";
import RelatedVideos from "../../../components/RelatedVideos";
import VideoComments from "../../../components/comment/VideoComments";
import MainVideo from "../../../components/MainVideo";
import {
  LOAD_VIDEO_REQUEST,
  LOAD_MAIN_VIDEOS_REQUEST,
  LOAD_COMMENTS_REQUEST,
} from "../../../reducers/video";

const VideoPage = () => {
  const { videoTitle, videoImage, videoDescription } = useSelector((state) => {
    return {
      videoTitle: state.video.currentVideo.title,
      videoDescription: state.video.currentVideo.description,
      videoImage:
        state.video.currentVideo &&
        state.video.currentVideo.images &&
        state.video.currentVideo.images[0].src,
    };
  }, shallowEqual);
  return (
    <div className="container">
      <Head>
        <title>Title : {videoTitle}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="shortcut icon" href="/static/favicon.ico" />
        {/* og to be added later */}
      </Head>
      <VideoPageGlobalStyle />
      <HideBar />
      <main>
        <MainVideo />
        <VideoDetails />
        <RelatedVideos />
        <VideoComments />
      </main>
    </div>
  );
};

VideoPage.getInitialProps = async (context) => {
  const { id } = context.query;
  await context.store.dispatch({
    type: LOAD_VIDEO_REQUEST,
    data: id,
  });
  await context.store.dispatch({
    type: LOAD_MAIN_VIDEOS_REQUEST,
  });
  await context.store.dispatch({
    type: LOAD_COMMENTS_REQUEST,
    data: id,
  });
};

export default VideoPage;
