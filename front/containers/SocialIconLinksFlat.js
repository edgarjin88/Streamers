import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faInstagram,
  faLinkedin,
  faGoogle,
  faFacebookF,
} from "@fortawesome/free-brands-svg-icons";
import styled from "styled-components";
import {
  GOOGLE_SIGN_IN_REQUEST,
  KAKAO_SIGN_IN_REQUEST,
  FACEBOOK_SIGN_IN_REQUEST,
  LINKEDIN_SIGN_IN_REQUEST,
  OAUTH_SIGN_IN_REQUEST,
} from "../reducers/user";

const StyledIconList = styled.li`
  list-style: none;
  margin: 0 5px;

  img {
    width: 30px;
  }

  a {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    text-decoration: none;
    font-size: 30px;
    color: ${({ backgroundColor }) => backgroundColor};
    transition: all 0.3s;
    z-index: 1;
    :active {
      transform: translateY(2px);
    }
    :hover {
      color: #ffff;
    }

    :before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: ${({ backgroundColor }) => backgroundColor};
      border-radius: 50%;
      z-index: -2;
      transition: all 0.3s cubic-bezier(0.95, 0.32, 0.37, 1.31);
      transform: scale(0);
      :hover {
        transform: scale(1);
        background: ${({ backgroundColor }) => backgroundColor};
      }
    }

    :hover:before {
      transform: scale(1);
      background: ${({ backgroundColor }) => backgroundColor};
    }
  }
`;

export const KakaoOAUTH = () => {
  return (
    <StyledIconList backgroundColor={"#ffe812"}>
      <a href="http://localhost:3003/api/user/auth/kakao">
        <img src="/images/icons/kakaotalk.svg" />
      </a>
    </StyledIconList>
  );
};
export const FacebookOAUTH = () => {
  return (
    <>
      <StyledIconList backgroundColor={"#3b5999"}>
        <a href="http://localhost:3003/api/user/auth/facebook">
          <FontAwesomeIcon icon={faFacebookF} size="sm" />
        </a>
      </StyledIconList>
    </>
  );
};
export const GoogleOAUTH = () => {
  return (
    <>
      <StyledIconList backgroundColor={"#dd4b39"}>
        <a href="http://localhost:3003/api/user/auth/google">
          {/* <a onClick={handleClick} href="#"> */}
          <span>
            <FontAwesomeIcon icon={faGoogle} size="sm" />
          </span>
        </a>
      </StyledIconList>
    </>
  );
};
export const LinkedInOAUTH = () => {
  return (
    <>
      <StyledIconList backgroundColor={"#0077b5"}>
        <a href="http://localhost:3003/api/user/auth/linkedin">
          <span>
            <FontAwesomeIcon icon={faLinkedin} size="sm" />
          </span>
        </a>
      </StyledIconList>
    </>
  );
};

export const TwitterOAUTH = () => {
  return (
    <StyledIconList backgroundColor={"#55acee"}>
      <a href="#">
        <span>
          <FontAwesomeIcon icon={faTwitter} size="sm" />
        </span>
      </a>
    </StyledIconList>
  );
};

export const InstagramOAUTH = () => {
  return (
    <>
      <StyledIconList backgroundColor={"#e4405f"}>
        <a href="#">
          <span>
            <FontAwesomeIcon icon={faInstagram} size="sm" />
          </span>
        </a>
      </StyledIconList>
    </>
  );
};

export const SocialLinks = () => {
  return (
    <div>
      <div style={{ textAlign: "center" }}>
        <strong>Or Sign in With:</strong>
      </div>
      <ul
        style={{
          position: "relative",
          margin: 0,
          padding: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <FacebookOAUTH />
        <GoogleOAUTH />
        <LinkedInOAUTH />
        <KakaoOAUTH />
      </ul>
    </div>
  );
};
