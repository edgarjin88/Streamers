const VideoDetails = () => {
  const renderSocialContainer = () => {
    return (
      <div id="social-container">
        <div className="social-item active">
          <img
            src="../static/images/icons/thumbs-up-blue.svg"
            alt="Thumbs Up"
          />
          <p className="social-item-title">9</p>
        </div>
        <div className="social-item">
          <img
            src="../static/images/icons/thumbs-down-default.svg"
            alt="Thumbs Down"
          />
          <p className="social-item-title">0</p>
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
            src="../static/images/profiles/how-to-anything.png"
            alt="How To Anything"
          />
          <div id="channel-metadata">
            <h3>How To Anything</h3>
            <div id="channel-subscriber-count">2K subscribers</div>
          </div>
        </a>
        <button>
          <img
            src="../static/images/icons/site-logo-blue.svg"
            alt="Lyrad Digital"
          />
          <span>Connect</span>
        </button>
      </div>
    );
  };
  return (
    <section id="video-details">
      <header>
        <h2>How to film your own course</h2>
        <div id="video-views-count">88 views</div>
      </header>

      {renderSocialContainer()}
      {renderChannelDetails()}
    </section>
  );
};

export default VideoDetails;
