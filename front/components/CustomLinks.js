import React, { memo } from "react";
import Link from "next/link";
import styled from "styled-components";

const StyledLink = styled.a`
  color: #55c57a;
  display: inline-block;
  text-decoration: none;
  border-bottom: 1px solid #55c57a;
  padding: 3px;
  transition: all 0.2s;
  :hover {
    background-color: #55c57a;
    color: #fff;
    box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
  :active {
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    transform: translateY(0);
  }
`;

//props, dynamic color change
const CustomLink = memo(function CustomLink(props) {
  return (
    <Link href={props.href}>
      <StyledLink>{props.text}</StyledLink>
    </Link>
  );
});

export default CustomLink;
