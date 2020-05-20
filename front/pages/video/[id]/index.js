import { VideoPageGlobalStyle } from "../../../styles/styles";
import HideBar from "../../../containers/HideBar";
import VideoDetails from "../../../components/VideoDetails";
import RelatedVideos from "../../../components/RelatedVideos";
import VideoComments from "../../../components/comment/VideoComments";
import MainVideo from "../../../components/MainVideo";
import { useRouter } from "next/router";
import {
  LOAD_VIDEO_REQUEST,
  LOAD_MAIN_VIDEOS_REQUEST,
  LOAD_COMMENTS_REQUEST,
} from "../../../reducers/video";

const VideoPage = () => {
  return (
    <div className="container">
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
