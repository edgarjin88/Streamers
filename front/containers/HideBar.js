import React, { useState, useCallback } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import CssBaseline from "@material-ui/core/CssBaseline";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import Slide from "@material-ui/core/Slide";
import { useTheme } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import clsx from "clsx";
import { Backdrop } from "@material-ui/core";
import { useStyles } from "../styles/HideBarStyle";

import { Drawers } from "./Drawers";
import { SignInButton } from "./SignInButton";
import {
  MemoSearchInput,
  MemoMenuItems,
  MemoMenuIcon,
} from "./MenuBarSubComponents";
import { LogoAndName } from "../components/MenuComponents";

import { CLOSE_DRAWER } from "../reducers/menu";
///////// stylings to be seperated
const HideOnScroll = (props) => {
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
  const dispatch = useDispatch();

  const { backDrop } = useSelector(({ menu }) => {
    return { backDrop: menu.backDrop };
  }, shallowEqual);

  const classes = useStyles();

  const { me } = useSelector(({ user }) => {
    return { me: user.me };
  }, shallowEqual);
  const handleClose = useCallback(() => {
    dispatch({
      type: CLOSE_DRAWER,
    });
  }, [backDrop]);

  return (
    <>
      <div className={classes.root}>
        <CssBaseline />
        <Backdrop
          style={{ backgroundColor: "rgba(19, 19, 20, 0.72)", zIndex: 300 }}
          open={backDrop}
          onClick={handleClose}
        />

        <HideOnScroll {...props}>
          <AppBar
            position="fixed"
            color="inherit"
            className={clsx(classes.appBar, {
              [classes.appBarShift]: false,
            })}
          >
            <Toolbar
              className={classes.toolBar}
              style={{
                padding: "0 20px 0 20px",
                width: "80%",
                placeSelf: "center",
              }}
            >
              <MemoMenuIcon />
              <LogoAndName />
              <div className={classes.search}>
                <div>
                  <SearchIcon
                    style={{
                      fontSize: "25px",
                      fontWeight: "bold",
                    }}
                    className={classes.searchIcon}
                  />
                </div>
                <MemoSearchInput />
              </div>
              {me ? <MemoMenuItems /> : <SignInButton />}
            </Toolbar>
          </AppBar>
        </HideOnScroll>
        <Drawers theme={theme} classes={classes} />
      </div>
    </>
  );
}
