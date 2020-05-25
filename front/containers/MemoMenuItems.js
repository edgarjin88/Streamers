import React, { memo, useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import Router from "next/router";
import Link from "next/link";

import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MailIcon from "@material-ui/icons/Mail";
import NotificationsIcon from "@material-ui/icons/Notifications";
import MoreIcon from "@material-ui/icons/MoreVert";

import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import styled from "styled-components";

import { useStyles } from "../styles/HideBarStyle";
import {
  DELETE_NOTIFICATION_REQUEST,
  DELETE_SINGLE_NOTIFICATION_REQUEST,
} from "../reducers/user";
import { URL } from "../config/config";
import { OPEN_MODAL } from "../reducers/menu";
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
export const MemoMenuItems = memo(function MemoMenuItems() {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);

  const { userNotification, me } = useSelector(({ user }) => {
    return { userNotification: user.me && user.me.notification, me: user.me };
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

  const clickProfile = () => {
    Router.push(`/profile/[id]`, `/profile/${me.id}`);
    handleMenuClose();
  };

  const clickMyStreaming = () => {
    Router.push(`/mychannels`);
    handleMenuClose();
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
      <MenuItem onClick={clickProfile}>
        <h3>Profile</h3>
      </MenuItem>
      <MenuItem onClick={clickMyStreaming}>
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

  const deleteSingleNotification = (notificationId) => (e) => {
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
      {/* b.match(/( vid|audo)/).index */}
      {notificationList.map((el, i) => {
        const wordIndex = el.content.match(
          /( disliked|liked|unsubscribed|subscribed|commented|replied)/
        ).index;
        const name = el.content.slice(0, wordIndex);
        const message = el.content.slice(wordIndex);
        const { UserId, userProfile, targetVideoId } = el;
        return (
          <StyledMenuItem key={i}>
            <div className="notificationItem">
              {" "}
              <Link key={1} href={`/profile/[id]`} as={`/profile/${UserId}`}>
                <a>
                  <img
                    src={
                      el.userProfile
                        ? `${URL}/${userProfile}`
                        : `../static/images/profiles/how-to-anything.png`
                    }
                  />
                </a>
              </Link>
              <Link
                key={2}
                href={targetVideoId ? `/video/[id]` : `/profile/[id]`}
                as={
                  targetVideoId
                    ? `/video/${targetVideoId}`
                    : `/profile/${UserId}`
                }
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
          <Badge badgeContent={0} color="secondary">
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
          <Badge badgeContent={0} color="secondary">
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
