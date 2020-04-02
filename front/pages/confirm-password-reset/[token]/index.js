import React, { useEffect } from "react";
import Router from "next/router";
import { useRouter } from "next/router";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
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

import Copyright from "../../../components/Copyright";

import jwt from "jsonwebtoken";
import LinearDeterminate from "../../../components/Progressbar";

import {
  MemoEmail,
  MemoPassword,
  MemoPasswordCheck,
  MemoConfirmPasswordReset
} from "../../../containers/InputComponents";

import { SET_RESET_PASSWORD_LINK } from "../../../reducers/input";

export default function SignInSide() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { token } = router.query;

  //make sure only accessible when not logged in

  const classes = useStyles();

  let { userId } = jwt.decode(token);

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
    if (token) {
      dispatch({
        type: SET_RESET_PASSWORD_LINK,
        data: token
      });
    }
    if (confirmPasswordReset) {
      setTimeout(() => {
        Router.push("/signin");
      }, 6000);
    }
  }, [confirmPasswordReset, token]);

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
                message={`Password changed. Enjoy STREAMERS! `}
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
            <Box mt={5}>
              <Copyright text="Streamers" />
            </Box>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}
