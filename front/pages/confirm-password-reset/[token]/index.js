import React, { useEffect, useState, useCallback } from "react";
import Router from "next/router";
import { useRouter } from "next/router";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { CONFIRM_PASSWORD_RESET_REQUEST } from "../../../reducers/user";
import Avatar from "@material-ui/core/Avatar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";

import Typography from "@material-ui/core/Typography";
import Toaster from "../../../components/Toaster";
import { useStyles } from "../../../styles/SigniningStyle";
// to be moved to styling folder later.

import { StyledButton1 } from "../../../components/CustomButtons";
import Copyright from "../../../components/Copyright";

import jwt from "jsonwebtoken";
import LinearDeterminate from "../../../components/Progressbar";

import { ACTIVATION_REQUEST } from "../../../reducers/user";
import {
  MemoEmail,
  MemoPassword,
  MemoPasswordCheck,
  MemoConfirmPasswordReset
} from "../../../containers/MemoForSign";
export default function SignInSide() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { token } = router.query;

  //make sure only accessible when not logged in

  const classes = useStyles();
  /////////Logic //////////
  //get token, and move to signin page. toaster.
  // when submit, use redux again. just token. It is OK.
  //make some more components with memo.
  let { userId } = jwt.decode(token);

  // const {
  //   password,
  //   passwordCheck,
  //   passwordError,
  //   passwordCheckError
  // } = useSelector(({ input }) => {
  //   return {
  //     password: input.password,
  //     passwordCheck: input.passwordCheck,
  //     passwordError: input.passwordError,
  //     passwordCheckError: input.passwordCheckError
  //   };
  // }, shallowEqual);
  // const handleClick = e => {
  //   e.preventDefault();
  //   if (password && passwordCheck && !passwordError && passwordCheckError)
  //     dispatch({
  //       type: CONFIRM_PASSWORD_RESET_REQUEST,
  //       data: {
  //         userId: userId,
  //         password: password
  //       }
  //     });
  // };

  const {
    confirmPasswordReset,
    isLoading,
    confirmPasswordResetErrorReason
  } = useSelector(({ user }) => {
    return {
      confirmPasswordReset: user.confirmPasswordReset,
      isLoading: user.isLoading,
      confirmPasswordResetErrorReason: user.confirmPasswordResetErrorReason
    };
  }, shallowEqual);

  useEffect(() => {
    if (confirmPasswordReset) {
      setTimeout(() => {
        Router.push("/signin");
      }, 6000);
    }
  }, [confirmPasswordReset]);

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
            Now, you can reset the password of your STREAMERS account{" "}
            <strong>{userId}</strong>.
          </Typography>
          {/* <MemoEmail /> */}
          <MemoPassword />
          <MemoPasswordCheck />
          <form className={classes.form} noValidate>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                border: "none"
              }}
            >
              <MemoConfirmPasswordReset userId={userId} />
            </div>
            {confirmPasswordReset && <LinearDeterminate />}

            {confirmPasswordReset && (
              <Toaster
                message={`Activation Success. Signin and enjoy STREAMERS! `}
                type="success"
                whereTo={"/signin"}
              />
            )}
            {confirmPasswordResetErrorReason && (
              <Toaster
                message={confirmPasswordResetErrorReason}
                type="error"
                whereTo={false}
              />
            )}
            {/* {JSON.stringify(token)} */}
            <Box mt={5}>
              <Copyright text="Streamers" />
            </Box>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}
