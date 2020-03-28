import React, { useCallback, useEffect, useState } from "react";
import { LOG_OUT_REQUEST } from "../reducers/user";

import { OPEN_DRAWER, CLOSE_DRAWER } from "../reducers/menu";

import { useDispatch, useSelector } from "react-redux";

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
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import MyVideo from "@material-ui/icons/OndemandVideo";
import MessageIcon from "@material-ui/icons/Forum";
import LogOut from "@material-ui/icons/ExitToApp";
import SettingsIcon from "@material-ui/icons/Settings";
import PolicyIcon from "@material-ui/icons/Policy";
import { Backdrop } from "@material-ui/core";

import Link from "next/link";
import { useStyles } from "../styles/HideBarStyle";

//actions

//app bar와 draw가 독립적 스테이트를 가지고 있어야 한다.
//app 과 draw의 부모는 스테이트를 가지고 있어서는 안된다.
// state가 변할 경우, 자식 스테이트를 메모 + usecallback으로 감싸준다.
// 결국 리덕스가 답.

//리덕스로 하면 submit 버튼도 usecallback 없이 분리 가능. 기왕 하는거 트라이 해보자. 걍 각각의 스테이트를 박아 주고, memo 없이도 가능할듯.

export const Drawers = ({ theme, classes }) => {
  // const classes = useStyles();

  const dispatch = useDispatch();
  const { openDrawer } = useSelector(state => state.menu);

  const onLogout = useCallback(() => {
    dispatch({
      type: LOG_OUT_REQUEST
    });
  }, []);

  const handleDrawerClose = () => {
    dispatch({
      type: CLOSE_DRAWER
    });
  };

  return (
    <>
      {/* <CssBaseline /> */}
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={openDrawer}
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </div>
        <Divider />
        <List>
          {["My Profile", "My Video", "Messages", "Drafts"].map(
            (text, index) => (
              <ListItem button key={text}>
                <ListItemIcon>
                  {(text === "My Profile" && (
                    <AccountCircleIcon fontSize="large" />
                  )) ||
                    (text === "My Video" && <MyVideo fontSize="large" />) ||
                    (text === "Messages" && <MessageIcon fontSize="large" />) ||
                    (text === "Drafts" && <MyVideo fontSize="large" />)}
                </ListItemIcon>
                <ListItemText
                  primary={<Typography variant="h6">{text}</Typography>}
                />
              </ListItem>
            )
          )}
        </List>
        <Divider />
        <List>
          {["Log out", "Settings", "Privacy and Policies"].map(
            (text, index) => (
              <ListItem button key={text}>
                <ListItemIcon>
                  {(text === "Log out" && (
                    <LogOut onClick={onLogout} fontSize="large" />
                  )) ||
                    (text === "Settings" && (
                      <SettingsIcon fontSize="large" />
                    )) ||
                    (text === "Privacy and Policies" && (
                      <PolicyIcon fontSize="large" />
                    )) ||
                    (text === "Drafts" && <MyVideo fontSize="large" />)}
                </ListItemIcon>
                <ListItemText
                  primary={<Typography variant="h6">{text}</Typography>}
                />
              </ListItem>
            )
          )}
        </List>
      </Drawer>
    </>
  );
};
