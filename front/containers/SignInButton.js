import React, { memo, useState, useCallback } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

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
        rgba(0, 0, 0, 0.60)
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
    background-color: orange;
  }
`;
export const SignInButton = memo(function SignInButton() {
  return (
    <StyledIcon>
      <div>
        <Link href="/signin">
          <a>
            <FontAwesomeIcon
              color="black"
              // color="rgba(0, 0, 0, 0.60)"
              icon={faSignInAlt}
              size="3x"
            />
          </a>
        </Link>
      </div>
      <div>
        <span>Sign In</span>
      </div>
    </StyledIcon>
  );
});
