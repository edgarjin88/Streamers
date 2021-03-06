import React, { memo, useCallback } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";

import { fade, makeStyles, useTheme } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import MenuIcon from "@material-ui/icons/Menu";

// import { useStyles } from "../styles/HideBarStyle";
//actions

import { OPEN_DRAWER, CLOSE_DRAWER } from "../reducers/menu";
import { SET_SEARCH_VALUE } from "../reducers/input";
import { LOAD_HASHTAG_VIDEOS_REQUEST } from "../reducers/video";

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

const useStyles = makeStyles((theme) => ({
  inputRoot: {
    color: "inherit",
    backgroundColor: "inherit",
  },
  inputInput: {
    display: "flex",
    padding: theme.spacing(1, 1, 1, 7),

    transition: theme.transitions.create("width"),
    width: "80%",
    [theme.breakpoints.up("sm")]: {
      width: 120,
      "&:focus": {
        width: 200,
      },
    },
  },
}));
export const MemoSearchInput = memo(function MemoSearchInput() {
  const classes = useStyles();

  const dispatch = useDispatch();

  const { searchValue } = useSelector(({ input }) => {
    return { searchValue: input.searchValue };
  }, shallowEqual);

  const handleEnter = (e) => {
    if (e.key === "Enter") {
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
