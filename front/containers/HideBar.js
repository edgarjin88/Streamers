import React, { useState, useCallback } from "react";
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
import { SignInButton } from "./SignInButton";
import { MemoSearchInput, MemoMenuIcon } from "./MenuBarComponents";
import { LogoAndName } from "../components/MenuComponents";

///////// stylings to be seperated
const HideOnScroll = props => {
  const { children, window } = props;
  const trigger = useScrollTrigger({ target: window ? window() : undefined });
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
};

///////// stylings to be seperated

export default function HideAppBar(props) {
  const theme = useTheme();

  const { me } = useSelector(state => state.user);
  const { backDrop } = useSelector(({ menu }) => {
    return { backDrop: menu.backDrop };
  }, shallowEqual);

  const dispatch = useDispatch();

  const classes = useStyles();

  const [open, setOpen] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = event => {
    setMobileMoreAnchorEl(event.currentTarget);
  };
  const menuId = "primary-search-account-menu";
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
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
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
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="secondary">
            <MailIcon fontSize="large" />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton aria-label="show 11 new notifications" color="inherit">
          <Badge badgeContent={11} color="secondary">
            <NotificationsIcon fontSize="large" />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle fontSize="large" />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <React.Fragment>
      <div className={classes.root}>
        <CssBaseline />
        <Backdrop
          style={{ backgroundColor: "rgba(19, 19, 20, 0.72)", zIndex: 300 }}
          open={backDrop}
        />

        <HideOnScroll {...props}>
          <AppBar
            position="fixed"
            color="inherit"
            className={clsx(classes.appBar, {
              [classes.appBarShift]: open
            })}
          >
            <Toolbar
              className={classes.toolBar}
              style={{
                padding: "0 20px 0 20px",
                width: "80%",
                placeSelf: "center"
              }}
            >
              {/* memoMenu */}
              <MemoMenuIcon />
              <LogoAndName />
              <div className={classes.search}>
                <div>
                  <SearchIcon
                    style={{ fontSize: "10px", fontWeight: "bold" }}
                    className={classes.searchIcon}
                  />
                </div>
                <MemoSearchInput />
              </div>
              {me ? (
                <div className={classes.sectionDesktop}>
                  <IconButton aria-label="show 4 new mails" color="inherit">
                    <Badge badgeContent={4} color="secondary">
                      <MailIcon fontSize="large" />
                    </Badge>
                  </IconButton>
                  <IconButton
                    aria-label="show 17 new notifications"
                    color="inherit"
                  >
                    <Badge badgeContent={17} color="secondary">
                      <NotificationsIcon fontSize="large" />
                    </Badge>
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="account of current user"
                    aria-controls={menuId}
                    aria-haspopup="true"
                    onClick={handleProfileMenuOpen}
                    color="inherit"
                  >
                    <AccountCircle fontSize="large" />
                  </IconButton>
                </div>
              ) : (
                <SignInButton />
              )}
              {me && (
                <div className={classes.sectionMobile}>
                  <IconButton
                    aria-label="show more"
                    aria-controls={mobileMenuId}
                    aria-haspopup="true"
                    onClick={handleMobileMenuOpen}
                    color="inherit"
                  >
                    <MoreIcon fontSize="large" />
                  </IconButton>
                </div>
              )}
            </Toolbar>
          </AppBar>
        </HideOnScroll>
        <Drawers theme={theme} classes={classes} />

        {renderMobileMenu}
        {renderMenu}
      </div>
    </React.Fragment>
  );
}
