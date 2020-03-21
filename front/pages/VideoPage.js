import { GlobalStyleOne } from "../styles/styles";
import HideBar from "../containers/HideBar";
import VideoDetails from "../components/VideoDetails";
import RelatedVideos from "../components/RelatedVideos";
import VideoComments from "../components/VideoComments";
import MainVideo from "../components/MainVideo";

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

export default VideoPage;
