import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LOG_OUT_REQUEST } from "../reducers/user";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faFacebook,
  faInstagram,
  faLinkedin,
  faGoogle
} from "@fortawesome/free-brands-svg-icons";
import styled from "styled-components";
// <FontAwesomeIcon icon={faTwitter} size="6x" />;

const StyledIconList = styled.ul`
  position: relative;
  margin: 0;
  padding: 0;
  display: flex;
  & li {
    position: relative;
    list-style: none;
    width: 60px;
    height: 60px;
    margin: 0 30px;
    transform: rotate(-30deg) skew(25deg);
    // background-color: #ccc;
    border-radious: 20%;
    
  }
    &:hover span {
      box-shadow: -1px 1px 1px rgba(0, 0, 0, 0.1);
  
    }

    & li:hover span:nth-child(5) {
      transform: translate(40px, -40px);
      opacity: 1;
   
    }
    & li:hover span:nth-child(4) {
      transform: translate(30px, -30px);
      opacity: 0.8;
    }
    & li:hover span:nth-child(3) {
      transform: translate(20px, -20px);
      opacity: 0.6;
    }
    & li:hover span:nth-child(2) {
      transform: translate(10px, -10px);
      opacity: 0.4;
    }
    & li:hover span:nth-child(1) {
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
      transition: 0.5s;
      display: flex !important;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 30px !important;
      border-radius: 20%
    }
  }
`;

export const TwitterOAUTH = () => {
  return (
    <StyledIconList backgroundColor={"#55acee"}>
      <li>
        <a href="#">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span>
            <FontAwesomeIcon icon={faTwitter} size="lg" />
          </span>
        </a>
      </li>
    </StyledIconList>
  );
};
export const FacebookOAUTH = () => {
  return (
    <>
      <StyledIconList backgroundColor={"#3b5999"}>
        <li>
          <a href="#">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span>
              <FontAwesomeIcon icon={faFacebook} size="lg" />
            </span>
          </a>
        </li>
      </StyledIconList>
    </>
  );
};
export const GoogleOAUTH = () => {
  return (
    <>
      <StyledIconList backgroundColor={"#dd4b39"}>
        <li>
          <a href="#">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span>
              <FontAwesomeIcon icon={faGoogle} size="lg" />
            </span>
          </a>
        </li>
      </StyledIconList>
    </>
  );
};
export const LinkedInOAUTH = () => {
  return (
    <>
      <StyledIconList backgroundColor={"#0077b5"}>
        <li>
          <a href="#">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span>
              <FontAwesomeIcon icon={faLinkedin} size="lg" />
            </span>
          </a>
        </li>
      </StyledIconList>
    </>
  );
};

export const InstagramOAUTH = () => {
  return (
    <>
      <StyledIconList backgroundColor={"#e4405f"}>
        <li>
          <a href="#">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span>
              <FontAwesomeIcon icon={faInstagram} size="lg" />
            </span>
          </a>
        </li>
      </StyledIconList>
    </>
  );
};
