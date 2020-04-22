import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { LOAD_MAIN_VIDEOS_REQUEST } from "../reducers/video";
import Avatar from "@material-ui/core/Avatar";
import Link from "next/link";

import { URL } from "../config/config";
import moment from "moment";

moment.locale("en");
const MainVideos = () => {
  const { mainVideos, hasMoreVideos } = useSelector((state) => state.video);
  const countRef = useRef([]); //last id record

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({
      type: LOAD_MAIN_VIDEOS_REQUEST,
    });
  }, []);

  const onScroll = useCallback(() => {
    //action creator
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
      <div>Up next-next video </div>
      <div>decide</div>
      <div>Autoplay</div>
      <button>
        <span className="autoplay-slider"></span>
        <span className="autoplay-slider-toggle-button"></span>
      </button>
    </header>
  );

  // <Link
  //   href={{
  //     pathname: "/user",
  //     query: { id: post.Retweet.User.id }
  //   }}
  //   as={`/user/${post.Retweet.User.id}`}
  // >
  const renderVideoList = (videoInfoList) => {
    // console.log("render video fired", videoInfoList);
    return (
      <ul>
        {videoInfoList.map((videoInfo) => {
          return (
            <li>
              <Link href={`/video/${videoInfo && videoInfo.id}`}>
                <a title={videoInfo.title}>
                  <article>
                    <img
                      src={
                        videoInfo.Images && videoInfo.Images[0]
                          ? `${URL}/${videoInfo.Images[0].src}`
                          : "../static/images/videos/try-not-to-laugh.png"
                      }
                      alt="Why I laugh at most CEOs"
                    />
                    {`Created on ${moment(videoInfo.createdAt).format(
                      "DD.MM.YYYY"
                    )}`}
                    <div style={{ display: "flex" }}>
                      <h4 style={{ marginRight: "auto" }}>{videoInfo.title}</h4>
                      <strong>
                        Currently streaming{" "}
                        <span style={{ color: "red" }}>OFF</span>
                      </strong>
                    </div>

                    <p>3/5 joined</p>
                    <p>
                      {videoInfo.viewCount ? videoInfo.viewCount : "0"} views
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

      {renderVideoList(mainVideos)}
    </aside>
  );
};

MainVideos.getInitialProps = async (context) => {
  context.store.dispatch({
    type: LOAD_MAIN_VIDEOS_REQUEST,
  });
};

export default MainVideos;
