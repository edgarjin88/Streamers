import React, { memo, useState, useCallback } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";

import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import Badge from "@material-ui/core/Badge";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MailIcon from "@material-ui/icons/Mail";
import NotificationsIcon from "@material-ui/icons/Notifications";
import MoreIcon from "@material-ui/icons/MoreVert";
import clsx from "clsx";

import { useStyles } from "../styles/HideBarStyle";
import { DELETE_NOTIFICATION_REQUEST } from "../reducers/user";
import Link from "next/link";
//actions

import { OPEN_DRAWER, CLOSE_DRAWER } from "../reducers/menu";
import { SET_SEARCH_VALUE } from "../reducers/input";
import { LOAD_HASHTAG_VIDEOS_REQUEST } from "../reducers/video";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";

import styled from "styled-components";

/////// MemoMenuIcon
/////// MemoMenuIcon
/////// MemoMenuIcon
export const MemoMenuIcon = memo(function MemoMenuIcon() {
  const dispatch = useDispatch();

  const handleDrawerOpen = useCallback(() => {
    dispatch({
      type: OPEN_DRAWER,
    });
  }, []);

  return (
    <IconButton
      color="inherit"
      aria-label="open drawer"
      onClick={handleDrawerOpen}
      edge="start"
      // className={clsx(classes.menuButton, open && classes.hide)}
    >
      {/* open side bar */}
      <MenuIcon
        style={{
          fontSize: "30px",
          color: "black",
        }}
      />
    </IconButton>
  );
});

///MemoSearchInput
///MemoSearchInput
///MemoSearchInput
export const MemoSearchInput = memo(function MemoSearchInput() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { searchValue } = useSelector(({ input }) => {
    return { searchValue: input.searchValue };
  }, shallowEqual);

  const handleEnter = (e) => {
    console.log("key chnage fired");
    if (e.key === "Enter") {
      console.log("enter  fired");
      dispatch({ type: LOAD_HASHTAG_VIDEOS_REQUEST, data: searchValue });
    }
  };

  const handleChange = useCallback(
    (e) => {
      dispatch({
        type: SET_SEARCH_VALUE,
        data: e.target.value,
      });
    },
    [searchValue]
  );
  return (
    <>
      <InputBase
        onChange={handleChange}
        onKeyDown={handleEnter}
        style={{ fontSize: "15px", fontWeight: "bold", color: "orange" }}
        placeholder="Search videos..."
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
        }}
        inputProps={{ "aria-label": "search" }}
      />
    </>
  );
});
