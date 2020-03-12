import { GlobalStyleOne } from "../styles/styles";
import ProfileMain from "../components/ProfileMain";
import HideBar from "../components/HideBar";
import RelatedVideos from "../components/RelatedVideos";
import Card from "../components/Card";

const VideoPage = () => {
  return (
    <div className="container">
      <GlobalStyleOne />
      <HideBar />
      <ProfileMain />
      <main>
        <Card />
        <div>
          Dependnig on redux states, login, password change, profile update to
          show.{" "}
        </div>
        <RelatedVideos />
      </main>
    </div>
  );
};

export default VideoPage;
