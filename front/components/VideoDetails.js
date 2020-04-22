import { useDispatch, useSelector, shallowEqual } from "react-redux";
import SubscriptionsIcon from "@material-ui/icons/Subscriptions";
import { URL } from "../config/config";
// id(pin):2
// description(pin):"fwaefawef"
// title(pin):"asdfasdf"
// videoImageURL(pin):null
// viewCount(pin):null
// createdAt(pin):"2020-04-22T04:13:04.000Z"
// updatedAt(pin):"2020-04-22T04:13:04.000Z"
// UserId(pin):1
// RetweetId(pin): null

const VideoDetails = () => {
  const { currentVideo } = useSelector(({ video }) => {
    return {
      currentVideo: video.currentVideo,
    };
  }, shallowEqual);

  const {
    title,
    description,
    viewCount,
    createdAt,
    Likers,
    User,
  } = currentVideo;

  const renderSocialContainer = () => {
    return (
      <div
        id="social-container"
        style={{ display: "flex", justifyContent: "space-around" }}
      >
        <div className="social-item active">
          <img
            src="../static/images/icons/thumbs-up-blue.svg"
            alt="Thumbs Up"
          />
          <p className="social-item-title">{Likers.length}</p>
        </div>

        <div className="social-item">
          <img src="../static/images/icons/share-default.svg" alt="Share" />
          <p className="social-item-title">Share</p>
        </div>
        <div className="social-item">
          <img src="../static/images/icons/save-default.svg" alt="Save" />
          <p className="social-item-title">Save</p>
        </div>
        <div className="social-item">
          <img src="../static/images/icons/report-default.svg" alt="Report" />
          <p className="social-item-title">Report</p>
        </div>
      </div>
    );
  };

  const renderChannelDetails = () => {
    return (
      <div id="channel-details">
        <a href="#">
          <img
            src={
              User.profilePhoto
                ? `${URL}/${User.profilePhoto}`
                : "../static/images/profiles/how-to-anything.png"
            }
            alt={`${User.nickname}`}
          />
          <div id="channel-metadata">
            <h3>{User.nickname}</h3>
            <div id="channel-subscriber-count">
              {User.Followers.length} subscribers
            </div>
          </div>
        </a>
        <button>
          <SubscriptionsIcon
            style={{ fontSize: "2.5rem", marginRight: "0.5rem" }}
          />
          <span>Subscribe</span>
          {/* follow unfollow 여기다 달자 */}
        </button>
      </div>
    );
  };
  return (
    <section id="video-details">
      <header>
        <h4>#hash tags1 #hash tag2</h4>
        <h2>
          <strong>{title}</strong>
        </h2>
        <span style={{ fontSize: "1.4rem" }}>{description}</span>
        <div id="video-views-count">{viewCount ? viewCount : 0} views</div>
      </header>

      {renderSocialContainer()}
      {renderChannelDetails()}
    </section>
  );
};

export default VideoDetails;
