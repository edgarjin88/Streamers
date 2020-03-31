import React, { memo, useState, useCallback } from "react";
import Typography from "@material-ui/core/Typography";
import { useStyles } from "../styles/HideBarStyle";
import MovieIcon from "@material-ui/icons/Movie";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import VideocamIcon from "@material-ui/icons/Videocam";
import VideocamTwoToneIcon from "@material-ui/icons/VideocamTwoTone";

import VideocamOutlinedIcon from "@material-ui/icons/VideocamOutlined";
export const LogoAndName = memo(function LogoAndName() {
  const classes = useStyles();
  // to add animation log later
  return (
    <Typography className={classes.title} variant="h4" noWrap>
      <Link href="/index">
        <a
          style={{
            display: "flex",
            justifyItems: "center",
            alignItems: "center",
            textDecoration: "none",
            color: "black"
          }}
        >
          <VideocamIcon
            style={{ marginLeft: "15px", fontSize: "35px", color: "black" }}
          />
          <strong style={{ color: "orange" }}>STREAMERS</strong>.com
        </a>
      </Link>
    </Typography>
  );
});

export const StyledIcon = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 70px;
  place-items: center;
  transition: all 0.2s ease-out;

  & div {
    position: relative;
    transition: all 0.2s;
    :hover {
      transform: translate(0, -3px);
      + div span {
        opacity: 1;
        display: inline-block;
        width: 10rem;
        background-color: black;
      }
    }
    :active {
      transform: translate(0, -1px);
      + div span {
        opacity: 0;
        display: inline-block;
        width: 10rem;
      }
    }
  }

  & div span {
    position: absolute;
    width: 10rem;
    opacity: 0;
    font-size: 2rem;
    color: white;
    transition: all 0.4s;
    transform: translate(-50%, 10px);
    border-radius: 5%;
    text-align: center;
    background-color: grey;
  }
`;
export const SignInButton = memo(function SignInButton() {
  return (
    <StyledIcon title="Sign In">
      <div>
        <Link href="/signin">
          <a>
            <FontAwesomeIcon icon={faSignInAlt} size="3x" />
          </a>
        </Link>
      </div>
      <div>
        <span>Sign In</span>
      </div>
    </StyledIcon>
  );
});
