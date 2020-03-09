import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";

const VideoComments = () => {
  const [truefalse, setTruefalse] = useState({
    showComment: false,
    showResponse: false,
    showResponseContainer: true,
    liked: false,
    disliked: false
  });

  const {
    showComment,
    showResponse,
    showResponseContainer,
    liked,
    disliked
  } = truefalse;

  const handleBoolean = e => {
    console.log("event.target  :", e.target);
    console.log("event.target.name :", e.target.name);
    console.log("truefalse :", truefalse);

    setTruefalse({
      ...truefalse,
      [e.target.name]: !truefalse[e.target.name]
    });
    console.log("after :", truefalse);
  };
  const handleResponse = () => {
    setTruefalse(() => {
      return { ...truefalse, showResponse: !showResponse };
    });
  };
  const renderCommentHeader = () => {
    return (
      <header>
        <h2>Comments &middot; 3</h2>
        {showComment ? (
          <img
            onClick={handleBoolean}
            name="showComment"
            id="comment-uptick"
            src="../static/images/icons/up-tick.svg"
            alt="Hide Comments"
          />
        ) : (
          <img
            onClick={handleBoolean}
            name="showComment"
            id="comment-downtick"
            src="../static/images/icons/down-tick.svg"
            alt="Show Comments"
          />
        )}
      </header>
    );
  };

  const renderCommentForm = () => {
    return (
      <div id="comment-form">
        <img src="../static/images/profiles/kim.jpeg" alt="Kim" />
        <textarea placeholder="Add a public comment"></textarea>
      </div>
    );
  };

  const sudoCommentList = [1, 2, 3, 4];
  const renderEachComment = comments => {
    return comments.map(comment => {
      return (
        <div className="comment my-comment">
          <img
            src="../static/images/profiles/how-to-anything.png"
            alt="How To Anything"
          />
          <a href="#" title="How To Anything">
            <span>How To Anything</span>
          </a>
          <p>Test render each comment</p>
          <div className="comment-statistics">
            <p>1 week ago</p>
            <p className="comment-status-separator">&middot;</p>
            <p>301</p>
            <img
              src="../static/images/icons/thumbs-up-default.svg"
              alt="Thumbs Up"
            />
            <img
              src="../static/images/icons/thumbs-down-default.svg"
              alt="Thumbs Down"
            />
          </div>
          {showResponseContainer && (
            <div className="see-response-container">
              <Button
                variant="contained"
                name="showResponse"
                onClick={handleResponse}
              >
                See the response
              </Button>
            </div>
          )}
          {showResponse && (
            <div className="response-list">
              <div className="response comment my-comment">
                <img
                  src="../static/images/profiles/how-to-anything.png"
                  alt="How To Anything"
                />
                <a href="#" title="How To Anything">
                  <span>How To Anything</span>
                </a>
                <p>
                  This is the cheapest way I can see to do it. I think if you go
                  any cheaper than this you risk having poor quality. If you
                  can't afford everything right now, maybe start working on a
                  bunch of things you want to talk about, and save up. Then when
                  you are ready to buy the equipment, you will have a bunch of
                  material, and you can just start recording immediately. Just a
                  thought :).
                </p>
                <div className="comment-statistics">
                  <p>10 minutes ago</p>
                  <p className="comment-status-separator">&middot;</p>
                  <p>2</p>
                  <img
                    src="../static/images/icons/thumbs-up-default.svg"
                    alt="Thumbs Up"
                  />
                  <img
                    src="../static/images/icons/thumbs-down-default.svg"
                    alt="Thumbs Down"
                  />
                </div>
              </div>
              <div className="response comment">
                <img
                  src="../static/images/profiles/douglas.png"
                  alt="Douglas Johannasen"
                />
                <a href="#" title="Douglas Johannasen">
                  <span>Douglas Johannasen</span>
                </a>
                <p>
                  Yeah I understand what you are saying, was just hoping to
                  start it sooner, but never mind.
                </p>
                <div className="comment-statistics">
                  <p>6 minutes ago</p>
                  <p className="comment-status-separator">&middot;</p>
                  <p>1</p>
                  <img
                    src="../static/images/icons/thumbs-up-default.svg"
                    alt="Thumbs Up"
                  />
                  <img
                    src="../static/images/icons/thumbs-down-default.svg"
                    alt="Thumbs Down"
                  />
                </div>
              </div>
              <div className="response comment my-comment">
                <img
                  src="../static/images/profiles/how-to-anything.png"
                  alt="How To Anything"
                />
                <a href="#" title="How To Anything">
                  <span>How To Anything</span>
                </a>
                <p>Good luck with everything. Wish you all the best.</p>
                <div className="comment-statistics">
                  <p>Less than a minute ago</p>
                  <p className="comment-status-separator">&middot;</p>
                  <p>1</p>
                  <img
                    src="../static/images/icons/thumbs-up-default.svg"
                    alt="Thumbs Up"
                  />
                  <img
                    src="../static/images/icons/thumbs-down-default.svg"
                    alt="Thumbs Down"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      );
    });
  };

  const renderCommentList = () => {
    return <div id="comment-list">{renderEachComment(sudoCommentList)}</div>;
  };
  return (
    <section id="video-comments">
      <button name="showComment" onClick={handleBoolean}>
        Casdjoaisdfji
      </button>
      {JSON.stringify(showComment)}
      {renderCommentHeader()}

      <div id="comment-list-container">
        {renderCommentForm()}
        {showComment && renderCommentList()}
      </div>
    </section>
  );
};

export default VideoComments;
