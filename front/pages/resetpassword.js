import React, { useEffect, useState, useCallback } from "react";
import Router from "next/router";
import { useSelector, useDispatch, shallowEqual } from "react-redux";

import { LOG_IN_REQUEST, PASSWORD_RESET_REQUEST } from "../reducers/user";
import { CLEAR_INPUT_FIELDS } from "../reducers/input";

import Avatar from "@material-ui/core/Avatar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";

import Typography from "@material-ui/core/Typography";
import Toaster from "../components/Toaster";
import { useStyles } from "../styles/SigniningStyle";
// to be moved to styling folder later.

import Link from "../components/CustomLinks";
import Copyright from "../components/Copyright";

import { MemoEmail, MemoPassword, MemoSignIn } from "../containers/MemoForSign";
import { CustomButton1 } from "../components/CustomButtons";
export default function SignInSide() {
  //make sure only accessible when not logged in
  //make sure only accessible when not logged in

  const classes = useStyles();
  /////////Logic //////////
  // const { me, logInErrorReason } = useSelector(({ user }) => {
  //   return {.};
  // }, shallowEqual);
  const { email, emailError } = useSelector(({ input }) => {
    return { email: input.email, emailError: input.emailError };
  }, shallowEqual);
  const dispatch = useDispatch();
  //No shallow comparison required here.
  // useEffect(() => {
  //   dispatch({
  //     type: PASSWORD_RESET_REQUEST,
  //     data:password
  //   });
  // }, []);
  const handleClick = () => {
    if (email && !emailError) {
      dispatch({
        type: PASSWORD_RESET_REQUEST,
        data: email
      });
    }
  };

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      {/* {JSON.stringify(email)} */}
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Reset your password here
          </Typography>
          <form className={classes.form} noValidate>
            <MemoEmail />

            {/*       
            {logInErrorReason && (
              <Toaster
                message={logInErrorReason}
                type="error"
                whereTo={false}
              />
            )} */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                border: "none"
              }}
            >
              <CustomButton1
                onClick={handleClick}
                text="Reset password"
                size="1.4rem"
                color="#ff3300"
              />
            </div>

            <Box mt={5}>
              <Copyright text="Streamers" />
            </Box>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}
