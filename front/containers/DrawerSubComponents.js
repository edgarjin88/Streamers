import React, { memo, useCallback, useEffect, useState } from "react";
import Router from "next/router";
import { SIGN_OUT_REQUEST, NULLIFY_SIGN_OUT } from "../reducers/user";
import { OPEN_DRAWER, CLOSE_DRAWER, OPEN_MODAL } from "../reducers/menu";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import LogOut from "@material-ui/icons/PowerSettingsNew";
import Typography from "@material-ui/core/Typography";

import IconButton from "@material-ui/core/IconButton";

import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import TrendingUpIcon from "@material-ui/icons/TrendingUp";
import HistoryIcon from "@material-ui/icons/History";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import MyVideo from "@material-ui/icons/OndemandVideo";
import MessageIcon from "@material-ui/icons/Forum";
import SettingsIcon from "@material-ui/icons/Settings";
import PolicyIcon from "@material-ui/icons/Policy";
import VideoLibraryIcon from "@material-ui/icons/VideoLibrary";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import CreateIcon from "@material-ui/icons/Create";
import SignIn from "@material-ui/icons/ExitToApp";
import { useStyles } from "../styles/HideBarStyle";
import { useTheme } from "@material-ui/core/styles";

export const MemoSystemItemList = memo(function MemoSystemItemList() {
  const { me, signOutSuccess } = useSelector(({ user }) => {
    return { me: user.me, signOutSuccess: user.signOutSuccess };
  }, shallowEqual);

  const dispatch = useDispatch();

  const handleClick = useCallback(
    (target) => (e) => {
      console.log("clicking fired :", target);
      console.log("event ? :", e);
      if (target === "Sign Out") {
        dispatch({
          type: SIGN_OUT_REQUEST,
        });
      }
      if (target === "Sign In") {
        Router.push("/signin");
      }
    },
    [me]
  );

  const ItemList = me
    ? ["Sign Out", "Settings", "Privacy and Policies"]
    : ["Sign In", "Settings", "Privacy and Policies"];
  return (
    <>
      <List>
        {ItemList.map((text, index) => (
          <ListItem onClick={handleClick(text)} button key={text}>
            <ListItemIcon>
              {(text === "Sign Out" && <LogOut fontSize="large" />) ||
                (text === "Sign In" && (
                  <SignIn color="black" fontSize="large" />
                )) ||
                (text === "Settings" && <SettingsIcon fontSize="large" />) ||
                (text === "Privacy and Policies" && (
                  <PolicyIcon fontSize="large" />
                )) ||
                (text === "Drafts" && <MyVideo fontSize="large" />)}
            </ListItemIcon>
            <ListItemText
              primary={<Typography variant="h6">{text}</Typography>}
            />
          </ListItem>
        ))}
      </List>
    </>
  );
});

///MemoUserItemList

export const MemoUserItemList = memo(function MemoUserItemList() {
  const dispatch = useDispatch();
  const { me } = useSelector(({ user }) => {
    return { me: user.me };
  }, shallowEqual);

  const handleClick = useCallback(
    (target) => (e) => {
      if (target === "My Profile") {
        Router.push("/profile");
      }
      if (target === "Create a new channel") {
        dispatch({
          type: OPEN_MODAL,
        });
      }
    },
    [me]
  );

  const ItemList = me
    ? [
        "My Profile",
        "Messages",
        "My Channels",
        "Create a new channel",
        "Favorite Channels",
        "Popular Channels",
        "Library",
        "History",
      ]
    : ["Popular Channels", "Favorite Channels", "Library", "History"];
  //if signed in,
  return (
    <List>
      {ItemList.map((text, index) => (
        <ListItem onClick={handleClick(text)} button key={text}>
          <ListItemIcon>
            {(text === "My Profile" && (
              <AccountCircleIcon fontSize="large" />
            )) ||
              (text === "My Channels" && <MyVideo fontSize="large" />) ||
              (text === "Create a new channel" && (
                <CreateIcon fontSize="large" />
              )) ||
              (text === "Favorite Channels" && (
                <ThumbUpIcon fontSize="large" />
              )) ||
              (text === "Library" && <VideoLibraryIcon fontSize="large" />) ||
              (text === "History" && <HistoryIcon fontSize="large" />) ||
              (text === "Popular Channels" && (
                <TrendingUpIcon fontSize="large" />
              )) ||
              (text === "Favorite Channels" && <MyVideo fontSize="large" />) ||
              (text === "Messages" && <MessageIcon fontSize="large" />) ||
              (text === "Create a new channel" && <MyVideo fontSize="large" />)}
          </ListItemIcon>
          <ListItemText
            primary={<Typography variant="h6">{text}</Typography>}
          />
        </ListItem>
      ))}
    </List>
  );
});

//actions
/////MemoCloseButton;
/////MemoCloseButton;
/////MemoCloseButton;
export const MemoCloseButton = memo(function MemoCloseButton() {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const handleDrawerClose = () => {
    dispatch({
      type: CLOSE_DRAWER,
    });
  };
  return (
    <div className={classes.drawerHeader}>
      <IconButton onClick={handleDrawerClose}>
        {theme.direction === "ltr" ? (
          <ChevronLeftIcon fontSize="large" />
        ) : (
          <ChevronRightIcon fontSize="large" />
        )}
      </IconButton>
    </div>
  );
});
