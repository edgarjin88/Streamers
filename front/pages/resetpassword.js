import React, { useEffect, useState, useCallback } from "react";
import Router, { useRouter } from "next/router";
import { useSelector, useDispatch, shallowEqual } from "react-redux";

import { LOG_IN_REQUEST, PASSWORD_RESET_REQUEST } from "../reducers/user";
import { CLEAR_INPUT_FIELDS } from "../reducers/input";
import jwt from "jsonwebtoken";

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

import Copyright from "../components/Copyright";

import {
  MemoEmail,
  MemoPassword,
  MemoSignIn,
  MemoSubmitPasswordReset
} from "../containers/MemoForSign";
export default function SignInSide() {
  const classes = useStyles();
  /////Logic //////////
  const { resetPasswordErrorReason, resetPasswordSuccess } = useSelector(
    ({ user }) => {
      return {
        resetPasswordErrorReason: user.resetPasswordErrorReason,
        resetPasswordSuccess: user.resetPasswordSuccess
      };
    },
    shallowEqual
  );

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Please enter your registered email address.
          </Typography>
          <form className={classes.form} noValidate>
            <MemoEmail />

            {resetPasswordErrorReason && (
              <Toaster
                message={resetPasswordErrorReason}
                type="error"
                whereTo={false}
              />
            )}
            {resetPasswordSuccess && (
              <Toaster
                message={resetPasswordSuccess}
                type="success"
                whereTo={"/signin"}
              />
            )}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                border: "none"
              }}
            >
              <MemoSubmitPasswordReset />
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
