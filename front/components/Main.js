import VideoDetails from "./VideoDetails";
import RelatedVideos from "./RelatedVideos";
import VideoComments from "./VideoComments";
import MainVideo from "./MainVideo";

const mainLayout = () => {
  return (
    <main>
      <MainVideo />
      <VideoDetails />
      <RelatedVideos />
      <VideoComments />
    </main>
  );
};

export default mainLayout;
