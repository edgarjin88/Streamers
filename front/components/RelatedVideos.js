const RelatedVideos = () => {
  const headerPart = () => (
    <header>
      <div>Up next-next video </div>
      <div>decide</div>
      <div>Autoplay</div>
      <button>
        <span className="autoplay-slider"></span>
        <span className="autoplay-slider-toggle-button"></span>
      </button>
    </header>
  );
  const videoList = [
    1,
    2,
    3,
    4,
    4,
    5,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
  ];
  const renderVideoList = (videoInfoList) => {
    // console.log("render video fired", videoInfoList);
    return (
      <ul>
        {videoInfoList.map((videoInfo) => {
          return (
            <li>
              <a href="#" title="Why I laugh at most CEOs">
                <article>
                  <img
                    src="../static/images/videos/try-not-to-laugh.png"
                    alt="Why I laugh at most CEOs"
                  />
                  {videoInfo}
                  <h4>Why I laugh at most CEOs</h4>
                  <p>Its Me</p>
                  <p>221 views</p>
                </article>
              </a>
            </li>
          );
        })}
      </ul>
    );
  };
  return (
    <aside id="related-videos">
      {headerPart()}

      {renderVideoList(videoList)}
    </aside>
  );
};

export default RelatedVideos;
