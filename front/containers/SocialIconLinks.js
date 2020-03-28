import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LOG_OUT_REQUEST } from "../reducers/user";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faFacebook,
  faInstagram,
  faLinkedin,
  faGoogle,
  faFacebookF
} from "@fortawesome/free-brands-svg-icons";
import styled from "styled-components";
// <FontAwesomeIcon icon={faTwitter} size="6x" />;

const StyledIconList = styled.li`

    position: relative;
    list-style: none;
    width: 40px;
    height: 40px;
    margin: 15px 15px;
    transform: rotate(-30deg) skew(20deg);
    
    border-radious: 20%;
    
  
    &:hover span {
      box-shadow: -1px 1px 1px rgba(0, 0, 0, 0.1);
  
    }

    :hover span:nth-child(5) {
      transform: translate(20px, -20px);
      opacity: 1;
   
    }

    :active span:nth-child(5) {
      transform: translate(10px, -10px);
      opacity: 1;
   
    }
    :hover span:nth-child(4) {
      transform: translate(15px, -15px);
      opacity: 0.8;
    }
    :active span:nth-child(4) {
      transform: translate(7.25px, -7.25px);
      opacity: 0.8;
    }
    :hover span:nth-child(3){
      transform: translate(10px, -10px);
      opacity: 0.6;
    }
    :active span:nth-child(3) {
      transform: translate(5px, -5px);
      opacity: 0.6;
    }

    :hover span:nth-child(2) {
      transform: translate(5px, -5px);
      opacity: 0.4;
    }

      :active span:nth-child(2) {
      transform: translate(2.5px, -2.5px);
      opacity: 0.4;
    }
    

    :hover span:nth-child(1), :active span:nth-child(1) span:nth-child(1) {
      transform: translate(0, 0);
      opacity: 0.2;
    }

    & span {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: ${({ backgroundColor }) => backgroundColor};
      transition: 0.3s ease-out;
      display: flex !important;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 30px !important;
      border-radius: 10%
    }
  }
`;

export const TwitterOAUTH = () => {
  return (
    <StyledIconList backgroundColor={"#55acee"}>
      <a href="#">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span>
          <FontAwesomeIcon icon={faTwitter} size="sm" />
        </span>
      </a>
    </StyledIconList>
  );
};
export const FacebookOAUTH = () => {
  return (
    <>
      <StyledIconList backgroundColor={"#3b5999"}>
        <a href="#">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span>
            <FontAwesomeIcon icon={faFacebookF} size="sm" />
          </span>
        </a>
      </StyledIconList>
    </>
  );
};
export const GoogleOAUTH = () => {
  return (
    <>
      <StyledIconList backgroundColor={"#dd4b39"}>
        <a href="#">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
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
        <a href="#">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span>
            <FontAwesomeIcon icon={faLinkedin} size="sm" />
          </span>
        </a>
      </StyledIconList>
    </>
  );
};

export const InstagramOAUTH = () => {
  return (
    <>
      <StyledIconList backgroundColor={"#e4405f"}>
        <a href="#">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
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
    <ul
      style={{ position: "relative", margin: 0, padding: 0, display: "flex" }}
    >
      <FacebookOAUTH />
      {/* <InstagramOAUTH /> */}
      <GoogleOAUTH />
      {/* <LinkedInOAUTH /> */}
      <TwitterOAUTH />
    </ul>
  );
};
