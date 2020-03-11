import { ProfileGlobalStyle } from "../styles/profileStyle";
import ProfileMain from "../components/ProfileMain";
import HideBar from "../components/HideBar";

const VideoPage = () => {
  return (
    <div className="container">
      <ProfileGlobalStyle />
      <HideBar />
      <ProfileMain />
    </div>
  );
};

export default VideoPage;
