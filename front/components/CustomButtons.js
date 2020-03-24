import React, { memo } from "react";
import Link from "next/link";
import styled from "styled-components";

const StyledButton = styled.button`
  color: ${({ color }) => (color ? color : "#55c57a")};
  font-size: ${({ size }) => (size ? size : "inherit")};
  cursor: pointer;
  background-color: transparent;
  display: inline-block;
  text-decoration: none;
  border: none;
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
    outline: none;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    transform: translateY(2px);
  }
  :focus {
    border: none;
    outline: none;
  }
`;

//props, dynamic color change
export const CustomButton1 = ({ text, size, color, onClick }) => {
  return (
    <StyledButton onClick={onClick} type="button" color={color} size={size}>
      {text}
    </StyledButton>
  );
};
