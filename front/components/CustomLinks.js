import React, { memo } from "react";
import Link from "next/link";
import styled from "styled-components";

const StyledLink = styled.a`
  color: ${({ color }) => (color ? color : "#55c57a")};
  font-size: ${({ size }) => (size ? size : "inherit")};
  cursor: pointer;
  display: inline-block;
  text-decoration: none;
  border-bottom: 1px solid ${({ color }) => (color ? color : "#55c57a")};
  padding: 3px;
  transition: all 0.2s;
  :hover {
    background-color: ${({ color }) => (color ? color : "#55c57a")};
    color: #fff;
    box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
    cursor: pointer;
  }
  :active {
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    transform: translateY(2px);
  }
`;

//props, dynamic color change
const CustomLink = memo(function CustomLink({ href, text, size, color }) {
  return (
    <Link href={href}>
      <StyledLink color={color} size={size}>
        {text}
      </StyledLink>
    </Link>
  );
});

export default CustomLink;
