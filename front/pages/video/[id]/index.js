import { GlobalStyleOne } from "../../../styles/styles";
import HideBar from "../../../containers/HideBar";
import VideoDetails from "../../../components/VideoDetails";
import RelatedVideos from "../../../components/RelatedVideos";
import VideoComments from "../../../components/VideoComments";
import MainVideo from "../../../components/MainVideo";
import { useRouter } from "next/router";
import { LOAD_VIDEO_REQUEST } from "../../../reducers/video";

const VideoPage = () => {
  return (
    <div className="container">
      <GlobalStyleOne />
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
};

export default VideoPage;

// User.getInitialProps = async (context) => {
//   const id = parseInt(context.query.id, 10);
//   context.store.dispatch({
//     type: LOAD_USER_REQUEST,
//     data: id,
//   });
//   context.store.dispatch({
//     type: LOAD_USER_POSTS_REQUEST,
//     data: id,
//   });

//   return { id };
// };

// export default User;
