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
import { URL, FRONTURL } from "../../../config/config";

import { useRouter } from "next/router";

const VideoPage = () => {
  const router = useRouter();
  const { query } = router;
  // const query = router.query.id;

  const { videoTitle, videoImage, videoDescription } = useSelector((state) => {
    return {
      videoTitle: state.video.currentVideo.title,
      videoDescription: state.video.currentVideo.description,
      videoImage:
        state.video.currentVideo &&
        state.video.currentVideo.Images &&
        state.video.currentVideo.Images[0] &&
        state.video.currentVideo.Images[0].src,
    };
  }, shallowEqual);
  return (
    <div className="container">
      <Head>
        <title>Title : {videoTitle}</title>
        <meta name="description" content="Streaming service" />
        <meta property="og:title" content={videoTitle} />
        <meta property="og:description" content={videoDescription} />
        <meta property="og:url" content={`${FRONTURL}/video/${query.id}`} />
        <meta property="og:image" content={`${URL}/${videoImage}`} />
        <link rel="canonical" href={`${FRONTURL}/video/${query.id}`} />
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
  context.store.dispatch({
    type: LOAD_VIDEO_REQUEST,
    data: id,
  });
  context.store.dispatch({
    type: LOAD_MAIN_VIDEOS_REQUEST,
  });
  context.store.dispatch({
    type: LOAD_COMMENTS_REQUEST,
    data: id,
  });
};

export default VideoPage;
