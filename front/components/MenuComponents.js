import React, { memo, useCallback } from "react";
import Link from "next/link";

import Typography from "@material-ui/core/Typography";
import styled from "styled-components";
import VideocamIcon from "@material-ui/icons/Videocam";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";

import { CLOSE_DRAWER } from "../reducers/menu";
import { useStyles } from "../styles/HideBarStyle";

export const LogoAndName = memo(function LogoAndName() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const handleClick = useCallback(() => {
    dispatch({ type: CLOSE_DRAWER });
  }, []);
  return (
    <Typography className={classes.title} variant="h4" noWrap>
      <Link href="/">
        <a
          onClick={handleClick}
          style={{
            display: "flex",
            justifyItems: "center",
            alignItems: "center",
            textDecoration: "none",
            color: "black",
          }}
        >
          <VideocamIcon
            style={{ marginLeft: "15px", fontSize: "35px", color: "black" }}
          />
          <strong style={{ color: "orange" }}>&nbsp; STREAMERS</strong>.com
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
