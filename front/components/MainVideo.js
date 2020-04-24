import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { URL } from "../config/config";
import { LOAD_VIDEO_REQUEST } from "../reducers/video";

const MainVideo = () => {
  const { src } = useSelector(({ video }) => {
    return {
      src: video.currentVideo.Images[0] && video.currentVideo.Images[0].src,
    };
  }, shallowEqual);

  console.log("inside src:", src);
  return (
    <div id="main-video">
      <img
        className={"main-content"}
        src={src ? `${URL}/${src}` : "../static/images/videos/main-video.png"}
        alt="How to film your course"
      />
      {/* or video contents later */}
      {/* <img
        className={"main-content"}
        src={src ? `${URL}/${src}` : "../static/images/videos/main-video.png"}
        alt="How to film your course"
      /> */}
    </div>
  );
};

export default MainVideo;
