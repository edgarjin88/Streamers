import { GlobalStyleOne } from "../../../styles/styles";
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

import { useRouter } from "next/router";

const VideoPage = () => {
  const router = useRouter();
  const queryId = router.query.id;
  return (
    <div className="container">
      {/* <GlobalStyleOne />
      <HideBar /> */}

      <main>
        <div>Page number : {queryId}</div>
        {/* <MainVideo />
        <VideoDetails />
        <RelatedVideos />
        <VideoComments /> */}
      </main>
    </div>
  );
};

// VideoPage.getInitialProps = async (context) => {
//   const { id } = context.query;
//   console.log("server side LOAD_VIDEO_REQUEST fired");
//   await context.store.dispatch({
//     type: LOAD_VIDEO_REQUEST,
//     data: id,
//   });
//   await context.store.dispatch({
//     type: LOAD_MAIN_VIDEOS_REQUEST,
//   });
//   await context.store.dispatch({
//     type: LOAD_COMMENTS_REQUEST,
//     data: id,
//   });
// };

export default VideoPage;
