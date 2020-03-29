import React, { useCallback, useEffect, useState } from "react";
import { LOG_OUT_REQUEST } from "../reducers/user";
import { OPEN_DRAWER, CLOSE_DRAWER } from "../reducers/menu";
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
import {
  MemoCloseButton,
  MemoUserItemList,
  MemoSystemItemList
} from "./DrawerSubComponents";

//actions

export const Drawers = ({ theme, classes }) => {
  // const classes = useStyles();

  const { openDrawer } = useSelector(({ menu }) => {
    return { openDrawer: menu.openDrawer };
  }, shallowEqual);

  return (
    <>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={openDrawer}
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <MemoCloseButton />
        <Divider />
        <MemoUserItemList />
        <Divider />
        <MemoSystemItemList />
      </Drawer>
    </>
  );
};
