import React, { memo, useState, useCallback } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import Menu from "@material-ui/core/Menu";

import { useStyles } from "../styles/HideBarStyle";
import {
  DELETE_NOTIFICATION_REQUEST,
  DELETE_SINGLE_NOTIFICATION_REQUEST,
} from "../reducers/user";
import Link from "next/link";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import { URL } from "../config/config";
import styled from "styled-components";

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

const RenderNotification = () => {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);

  const dispatch = useDispatch();
  const isNotificationOpen = Boolean(notificationAnchorEl);

  const deleteSingleNotification = (notificationId) => (e) => {
    dispatch({
      type: DELETE_SINGLE_NOTIFICATION_REQUEST,
      data: notificationId,
    });
  };

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

  return (
    notificationList.length > 0 && (
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
                          : `../static/images/profiles/how-to-anything.png`
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
                <DeleteOutlineIcon onClick={deleteSingleNotification(el.id)} />
              </div>
            </StyledMenuItem>
          );
        })}
      </Menu>
    )
  );
};
