import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { LOAD_MAIN_VIDEOS_REQUEST } from "../reducers/video";
import Avatar from "@material-ui/core/Avatar";
import Link from "next/link";

import { URL } from "../config/config";
import moment from "moment";

moment.locale("en");
const MainVideos = ({ headers = "", videoData = null }) => {
  const { mainVideos, hasMoreVideos } = useSelector((state) => state.video);
  const countRef = useRef([]);

  const dispatch = useDispatch();
  if (!videoData) {
    useEffect(() => {
      dispatch({
        type: LOAD_MAIN_VIDEOS_REQUEST,
      });
    }, []);
  }

  const videoList = videoData && videoData.length > 0 ? videoData : mainVideos;

  const onScroll = useCallback(() => {
    if (
      window.scrollY + document.documentElement.clientHeight >
      document.documentElement.scrollHeight - 350
    ) {
      if (hasMoreVideos) {
        const lastId = mainVideos[mainVideos.length - 1].id; //
        if (!countRef.current.includes(lastId)) {
          // dispatch, if no current id
          dispatch({
            type: LOAD_MAIN_VIDEOS_REQUEST,
            lastId, // lastid : lastId
          });
          countRef.current.push(lastId);
        }
      }
    }
  }, [hasMoreVideos, mainVideos.length]);

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [mainVideos.length]);

  const headerPart = () => (
    <header>
      <div>{headers} </div>
      <div>Autoplay</div>
      <button>
        <span className="autoplay-slider"></span>
        <span className="autoplay-slider-toggle-button"></span>
      </button>
    </header>
  );

  const renderVideoList = (videoInfoList) => {
    return (
      <ul>
        {videoInfoList.map((videoInfo) => {
          console.log("each video id:", videoInfo.id);
          return (
            <li>
              <Link
                href={`/video/[id]`}
                as={`/video/${videoInfo && videoInfo.id}`}
              >
                <a title={videoInfo && videoInfo.title}>
                  <article>
                    <img
                      src={
                        videoInfo && videoInfo.Images && videoInfo.Images[0]
                          ? `${URL}/${videoInfo.Images[0].src}`
                          : "../static/images/videos/try-not-to-laugh.png"
                      }
                      alt="Why I laugh at most CEOs"
                    />
                    {`Created on ${moment(videoInfo.createdAt).format(
                      "DD.MM.YYYY"
                    )}`}
                    <div style={{ display: "flex" }}>
                      <h4 style={{ marginRight: "auto" }}>
                        {videoInfo && videoInfo.title}
                      </h4>
                      <strong>
                        Currently streaming{" "}
                        <span style={{ color: "red" }}>OFF</span>
                      </strong>
                    </div>

                    <p>3/5 joined</p>
                    <p>
                      {videoInfo && videoInfo.viewCount
                        ? videoInfo.viewCount
                        : "0"}{" "}
                      views
                    </p>
                  </article>
                </a>
              </Link>
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

MainVideos.getInitialProps = async (context) => {
  context.store.dispatch({
    type: LOAD_MAIN_VIDEOS_REQUEST,
  });
};

export default MainVideos;
