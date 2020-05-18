import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import {
  LOAD_MAIN_VIDEOS_REQUEST,
  LOAD_HASHTAG_VIDEOS_REQUEST,
  LOAD_POPULAR_VIDEOS_REQUEST,
  LOAD_USER_VIDEOS_REQUEST,
  LOAD_FAVORITE_VIDEOS_REQUEST,
} from "../reducers/video";
import { useRouter } from "next/router";

import Link from "next/link";

import { URL } from "../config/config";
import moment from "moment";

import styled from "styled-components";
import Loading from "../components/Loading";

moment.locale("en");

const StyledHeader = styled.header`
  margin-top: ${({ headers }) => (headers ? "1rem" : "")};
  background-color: ${({ headers }) => (headers ? "#eee" : "")};
  border-radius: 0.2rem;
  margin-bottom: 0.2rem;
  width: 100%;
  margin-top: ${({ headers }) => (headers ? "3rem" : "")};
  display: grid;
  grid: 1fr / 4rem 1fr;
  grid-column-gap: 1rem;
  justify-content: start;
  align-items: center;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  font-size: 1.4rem;
  text-align: center;

  img {
    margin: 0;
    margin-left: 1rem;
    padding: 0;
    height: 4rem;
    width: 4rem;
    @media (max-width: 128rem) {
      margin-left: 0.5rem;
    }
  }
  span {
    text-transform: uppercase;
  }
`;

const RelatedVideo = ({
  profilePhoto = "",
  headers = "",
  videoData = null,
}) => {
  const router = useRouter();
  const pathName = router.pathname;
  const targetUserId = router.query.id;
  console.log("targetUserId :", targetUserId);

  const { mainVideos, hasMoreVideos, isLoading } = useSelector((state) => {
    return {
      mainVideos: state.video.mainVideos,
      hasMoreVideos: state.video.hasMoreVideos,
      isLoading: state.video.isLoading,
    };
  }, shallowEqual);
  const countRef = useRef([]);
  const videoLengthRef = useRef([]);
  const dispatch = useDispatch();

  let videoList = videoData && videoData.length > 0 ? videoData : mainVideos;
  console.log("videoData :", videoData);
  const onScroll = useCallback(() => {
    if (
      window.scrollY + document.documentElement.clientHeight >
      document.documentElement.scrollHeight - 350
    ) {
      if (hasMoreVideos) {
        const lastId =
          mainVideos &&
          mainVideos[mainVideos.length - 1] &&
          mainVideos[mainVideos.length - 1].id;

        if (!countRef.current.includes(lastId)) {
          if (pathName === "/mychannels") {
            dispatch({
              type: LOAD_USER_VIDEOS_REQUEST,
              lastId,
            });
            return countRef.current.push(lastId);
          }

          if (pathName === "/profile/[id]") {
            dispatch({
              type: LOAD_USER_VIDEOS_REQUEST,
              data: targetUserId,
              lastId, //
            });
            return countRef.current.push(lastId);
          }
          if (pathName === "/favorite") {
            dispatch({
              type: LOAD_FAVORITE_VIDEOS_REQUEST,
              data: targetUserId,
              lastId, //
            });
            return countRef.current.push(lastId);
          }
          if (pathName === "/video/[id]") {
            // videoList = mainVideos;
            dispatch({
              type: LOAD_MAIN_VIDEOS_REQUEST,
              lastId, //
            });
            countRef.current.push(lastId);
          }
        }

        if (
          videoLengthRef.current[videoLengthRef.current.length - 1] !==
          mainVideos.length
        ) {
          if (pathName === "/popularchannels") {
            dispatch({
              type: LOAD_POPULAR_VIDEOS_REQUEST,
              lastId: mainVideos.length,
            });
            videoLengthRef.current.push(mainVideos.length);
          }

          if (pathName === "/hashtag/[tag]") {
            // videoList = mainVideos;
            dispatch({
              type: LOAD_HASHTAG_VIDEOS_REQUEST,
              lastId: mainVideos.length,
            });
            countRef.current.push(lastId);

            videoLengthRef.current.push(mainVideos.length);
          }

          if (pathName === "/" || pathName === "/index") {
            dispatch({
              type: LOAD_MAIN_VIDEOS_REQUEST,
              lastId, //
            });
            countRef.current.push(lastId);
            videoLengthRef.current.push(mainVideos.length);
          }
        }
      }
    }
  }, [
    hasMoreVideos,
    mainVideos.length,
    pathName,
    countRef.current.length,
    videoLengthRef.current.length,
    targetUserId,
    videoData,
  ]);

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [mainVideos.length]);

  const renderVideoList = (videoInfoList) => {
    return (
      <ul>
        {videoInfoList.map((videoInfo) => {
          return (
            <li key={videoInfo && videoInfo.createdAt + videoInfo.id}>
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
                          : "/images/videos/noimage.png"
                      }
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
  const showLoading =
    pathName === "/popularchannels" ||
    pathName === "/" ||
    pathName === "/hashtag/[tag]" ||
    pathName === "/mychannels";
  return (
    <aside id="related-videos">
      <StyledHeader headers={headers} profilePhoto={profilePhoto}>
        {profilePhoto && <img src={`${URL}/${profilePhoto}`} />}
        <span>{headers} </span>
      </StyledHeader>
      {renderVideoList(videoList)}
      {isLoading && showLoading && <Loading />}
    </aside>
  );
};

export default RelatedVideo;

// const a = [
//   {
//     id: 2,
//     description: "chasldkfj\n",
//     title: "channel 2",
//     videoImageURL: null,
//     viewCount: 210,
//     streaming: "OFF",
//     createdAt: "2020-05-04T12:25:05.000Z",
//     updatedAt: "2020-05-18T07:20:02.000Z",
//     UserId: 1,
//     RetweetId: null,
//     Like: {
//       createdAt: "2020-05-16T17:24:36.000Z",
//       updatedAt: "2020-05-16T17:24:36.000Z",
//       VideoId: 2,
//       UserId: 1,
//     },
//   },
//   {
//     id: 3,
//     description: "#test  Let's go #beach",
//     title: "Test3",
//     videoImageURL: null,
//     viewCount: 341,
//     streaming: "OFF",
//     createdAt: "2020-05-13T15:21:02.000Z",
//     updatedAt: "2020-05-18T07:50:57.000Z",
//     UserId: 4,
//     RetweetId: null,
//     Like: {
//       createdAt: "2020-05-16T17:40:44.000Z",
//       updatedAt: "2020-05-16T17:40:44.000Z",
//       VideoId: 3,
//       UserId: 1,
//     },
//   },
// ];
