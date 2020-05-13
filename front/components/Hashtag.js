import React from "react";
import Link from "next/link";
import styled from "styled-components";

import { styledButton1 } from "./CustomButtons";
const VideoDescription = ({ description }) => {
  const StyledSpan = styled.span`
    font-size: 1.4rem;
    a {
      color: grey;
      border-bottom: 1px solid grey;
      :hover {
        color: #1a599c;
        border-bottom: 1.6px solid #1a599c;
      }
    }

    .hashList {
      color: #55c57a;

      cursor: pointer;
      display: inline-block;
      text-decoration: none;
      border-bottom: none;
      padding: 3px;
      transition: all 0.2s;
      :hover {
        background-color: #55c57a;
        color: #fff;
        border-bottom: none;

        box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.15);
        transform: translateY(-2px);
        cursor: pointer;
      }
      :active {
        box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
        transform: translateY(2px);
        border-bottom: none;
      }
    }
  `;
  const hashtagList = [];

  return (
    <StyledSpan>
      <p>
        {description.split(/(#[^\s]+)/g).map((v) => {
          if (v.match(/#[^\s]+/)) {
            hashtagList.push(v);
            return (
              <Link
                href={`/hashtag/[tag]`}
                as={`/hashtag/${v.slice(1)}`}
                key={v}
              >
                <a>{v}</a>
              </Link>
            );
          }
          return v;
        })}
      </p>
      <br />
      <h5>All hashtags :</h5>{" "}
      {hashtagList.map((v) => (
        <Link href={`/hashtag/[tag]`} as={`/hashtag/${v.slice(1)}`} key={v + v}>
          <a className={"hashList"}>{v}; </a>
        </Link>
      ))}
    </StyledSpan>
  );
};

export default VideoDescription;
