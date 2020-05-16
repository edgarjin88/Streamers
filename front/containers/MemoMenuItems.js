import React, { memo, useState, useCallback } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";

import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MailIcon from "@material-ui/icons/Mail";
import NotificationsIcon from "@material-ui/icons/Notifications";
import MoreIcon from "@material-ui/icons/MoreVert";

import { useStyles } from "../styles/HideBarStyle";
import {
  DELETE_NOTIFICATION_REQUEST,
  DELETE_SINGLE_NOTIFICATION_REQUEST,
} from "../reducers/user";

import Link from "next/link";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import { URL } from "../config/config";
import styled from "styled-components";

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
import { useTheme } from "@material-ui/core/styles";
import { OPEN_MODAL } from "../reducers/menu";

export const MemoMenuItems = memo(function MemoMenuItems() {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);

  const { userNotification } = useSelector(({ user }) => {
    return { userNotification: user.notificationCount };
  }, shallowEqual);

  const dispatch = useDispatch();

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const isNotificationOpen = Boolean(notificationAnchorEl);

  const handleClickNotification = (e) => {
    dispatch({
      type: DELETE_NOTIFICATION_REQUEST,
    });
    setNotificationAnchorEl(e.currentTarget);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMobileMoreAnchorEl(null);
    setNotificationAnchorEl(null);
  };
  const menuId = "test";

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const createChannel = () => {
    handleMenuClose();
    dispatch({ type: OPEN_MODAL });
  };
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>
        <h3>Profile</h3>
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>
        <h3>My Streaming Channels</h3>
      </MenuItem>
      <MenuItem onClick={createChannel}>
        <h3>Create a Streaming Channel</h3>
      </MenuItem>
    </Menu>
  );

  const { notificationList } = useSelector(({ user }) => {
    return { notificationList: user.notificationList };
  }, shallowEqual);

  const StyledMenuItem = styled.div`
    ul,
    li {
      &:active {
        outline: none;
      }
    }
    svg {
      font-size: 3rem;
      margin-right: 0.5rem;
      :hover {
        cursor: pointer;
        color: rgb(220, 20, 60);
      }
      :active {
        transform: translateY(2px);
      }
    }
    :hover {
      background-color: #eee;
    }
    &:not(:last-child) {
      border-bottom: 1px solid rgba(136, 136, 136, 0.4);
    }
    strong {
      font-size: 1.5rem;
    }
    .notificationItem {
      outline: none;
      display: flex;
      column-gap: 0.5rem;
      max-width: 35rem;
      font-size: 1.4rem;
      height: 100%;
      align-items: center;
      padding: 1rem 0;

      margin: 0;
    }
    .notificationItem > a {
      margin: 0 1rem;
      align-items: center;
    }
    .notificationItem img {
      width: 3.4rem;
      height: 3.4rem;
    }
  `;
  const deleteSingleNotification = (notificationId) => (e) => {
    console.log("this should be event :", e);
    console.log("this should be notificationId :", notificationId);
    dispatch({
      type: DELETE_SINGLE_NOTIFICATION_REQUEST,
      data: notificationId,
    });
  };

  const renderNotification = (
    <Menu
      anchorEl={notificationAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isNotificationOpen}
      onClose={handleMenuClose}
    >
      {notificationList.map((el) => {
        const wordIndex = el.content.indexOf(
          "liked" || "disliked" || "subscribed" || "unsubscribed"
        );
        const name = el.content.slice(0, wordIndex);
        const message = el.content.slice(wordIndex);
        return (
          <StyledMenuItem>
            <div className="notificationItem">
              {" "}
              <Link href={`/profile/[id]`} as={`/profile/${el && el.UserId}`}>
                <a>
                  <img
                    src={
                      el.userProfile
                        ? `${URL}/${el.userProfile}`
                        : `/images/profiles/how-to-anything.png`
                    }
                  />
                </a>
              </Link>
              <Link
                href={`/video/[id]`}
                as={`/video/${el && el.targetVideoId}`}
              >
                <a>
                  <span>
                    <strong>{name}</strong> {message}{" "}
                  </span>
                </a>
              </Link>
              <AssignmentTurnedInIcon
                onClick={deleteSingleNotification(el.id)}
              />
            </div>
          </StyledMenuItem>
        );
      })}
    </Menu>
  );
  const mobileMenuId = "primary-search-account-menu-mobile";

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem>
        <IconButton color="inherit">
          <Badge badgeContent={4} color="secondary">
            <MailIcon fontSize="large" />
          </Badge>
        </IconButton>
        <h3>Messages</h3>
      </MenuItem>

      <MenuItem onClick={handleClickNotification}>
        <IconButton color="inherit">
          <Badge badgeContent={userNotification} color="secondary">
            <NotificationsIcon fontSize="large" />
          </Badge>
        </IconButton>
        <h3>Notifications</h3>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle fontSize="large" />
        </IconButton>
        <h3>Profile</h3>
      </MenuItem>
    </Menu>
  );
  return (
    <>
      <div className={classes.sectionDesktop}>
        <IconButton color="inherit">
          <Badge badgeContent={4} color="secondary">
            <MailIcon fontSize="large" />
          </Badge>
        </IconButton>
        <IconButton onClick={handleClickNotification} color="inherit">
          <Badge badgeContent={userNotification} color="secondary">
            <NotificationsIcon fontSize="large" />
          </Badge>
        </IconButton>
        <IconButton
          edge="end"
          aria-controls={menuId}
          aria-haspopup="true"
          onClick={handleProfileMenuOpen}
          color="inherit"
        >
          <AccountCircle fontSize="large" />
        </IconButton>
        {renderMobileMenu}
        {renderMenu}
        {notificationList.length > 0 && renderNotification}
      </div>
      <div className={classes.sectionMobile}>
        <IconButton
          aria-controls={mobileMenuId}
          aria-haspopup="true"
          onClick={handleMobileMenuOpen}
          color="inherit"
        >
          <MoreIcon fontSize="large" />
        </IconButton>
      </div>
    </>
  );
});
