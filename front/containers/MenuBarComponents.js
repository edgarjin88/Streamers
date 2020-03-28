import React, { memo, useState, useCallback } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import CssBaseline from "@material-ui/core/CssBaseline";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import Slide from "@material-ui/core/Slide";

import { useTheme } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import Badge from "@material-ui/core/Badge";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MailIcon from "@material-ui/icons/Mail";
import NotificationsIcon from "@material-ui/icons/Notifications";
import MoreIcon from "@material-ui/icons/MoreVert";
import clsx from "clsx";

import { Backdrop } from "@material-ui/core";

import Link from "next/link";
import { useStyles } from "../styles/HideBarStyle";

//actions
import { LOG_OUT_REQUEST } from "../reducers/user";

import { Drawers } from "./Drawers";
import { OPEN_DRAWER, CLOSE_DRAWER } from "../reducers/menu";
import { SET_SEARCH_VALUE } from "../reducers/input";
import { SignInButton } from "./SignInButton";

export const MemoMenuIcon = memo(function MemoMenuIcon() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const handleDrawerOpen = useCallback(() => {
    dispatch({
      type: OPEN_DRAWER
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
          fontSize: "30px"
        }}
      />
    </IconButton>
  );
});

export const MemoSearchInput = memo(function MemoSearchInput() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { searchValue } = useSelector(({ input }) => {
    return { searchValue: input.searchValue };
  }, shallowEqual);

  const handleChange = useCallback(
    e => {
      dispatch({
        type: SET_SEARCH_VALUE,
        data: e.target.value
      });
    },
    [searchValue]
  );
  return (
    <>
      <InputBase
        onChange={handleChange}
        style={{ fontSize: "15px", fontWeight: "bold" }}
        placeholder="Search videos"
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput
        }}
        inputProps={{ "aria-label": "search" }}
      />
    </>
  );
});
