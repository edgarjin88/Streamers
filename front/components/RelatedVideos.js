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

  const { mainVideos, hasMoreVideos, isLoading, searchValue } = useSelector(
    (state) => {
      return {
        mainVideos: state.video.mainVideos,
        hasMoreVideos: state.video.hasMoreVideos,
        isLoading: state.video.isLoading,
        searchValue: state.input.searchValue,
      };
    },
    shallowEqual
  );
  let countRef = useRef([]);
  const videoLengthRef = useRef([]);
  const dispatch = useDispatch();
  console.log("pathname :", pathName, "targetId :", targetUserId);
  useEffect(() => {
    countRef.current = [];
  }, [pathName, targetUserId]);

  //일단 onscroll이 문제인지 먼저 확실히 파악하자.

  const onScroll = useCallback(
    (e) => {
      if (
        window.scrollY + document.documentElement.clientHeight >
          document.documentElement.scrollHeight - 350 &&
        e.deltaY > 0
      ) {
        if (hasMoreVideos) {
          const lastId =
            mainVideos &&
            mainVideos[mainVideos.length - 1] &&
            mainVideos[mainVideos.length - 1].id;

          if (!countRef.current.includes(lastId)) {
            if (pathName === "/" || pathName === "/index") {
              dispatch({
                type: LOAD_MAIN_VIDEOS_REQUEST,
                lastId, //
              });
              countRef.current.push(lastId);
            }
            if (pathName === "/mychannels") {
              dispatch({
                type: LOAD_USER_VIDEOS_REQUEST,
                lastId,
              });
              countRef.current.push(lastId);
            }

            if (pathName === "/profile/[id]") {
              dispatch({
                type: LOAD_USER_VIDEOS_REQUEST,
                data: targetUserId,
                lastId, //
              });
              countRef.current.push(lastId);
            }
            if (pathName === "/favorite") {
              dispatch({
                type: LOAD_FAVORITE_VIDEOS_REQUEST,
                data: targetUserId,
                lastId, //
              });
              countRef.current.push(lastId);
            }
            if (pathName === "/video/[id]") {
              // videoList = mainVideos;
              dispatch({
                type: LOAD_MAIN_VIDEOS_REQUEST,
                lastId, //
              });
              countRef.current.push(lastId);
            }

            if (pathName === "/hashtag/[tag]") {
              dispatch({
                type: LOAD_HASHTAG_VIDEOS_REQUEST,
                data: searchValue,
                lastId,
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
          }
        }
      }
    },
    [hasMoreVideos, mainVideos.length, pathName, targetUserId]
  );

  useEffect(() => {
    window.addEventListener("wheel", onScroll);
    // wheel event used to prevent scroll up event before unmount. Even though clean up code fires, scroll event still fire before unmount.
    return () => {
      window.removeEventListener("wheel", onScroll);
    };
  }, [mainVideos.length]);

  const renderVideoList = (videoInfoList) => {
    return (
      <ul>
        {videoInfoList.map((videoInfo) => {
          const { streaming } = videoInfo;
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
                        {streaming === "ON" ? (
                          <span style={{ color: "green" }}>ON</span>
                        ) : (
                          <span style={{ color: "red" }}>OFF</span>
                        )}
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
      {renderVideoList(mainVideos)}
      {isLoading && showLoading && <Loading />}
    </aside>
  );
};

export default RelatedVideo;
