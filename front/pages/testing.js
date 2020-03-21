import React, { useEffect, useState, memo, useCallback } from "react";
import Router from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { SIGN_UP_REQUEST } from "../reducers/user";
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
import { validateEmail } from "../helpers/loginHelpers";
import {
  MemoEmail,
  MemoNickname,
  MemoPassword,
  MemoPasswordCheck,
  MemoTerm,
  MemoSubmit
} from "../containers/MemoForSign";

export default function SignInSide() {
  //make sure only accessible when not logged in
  //make sure only accessible when not logged in

  const classes = useStyles();
  /////////Logic //////////
  const dispatch = useDispatch();
  const { isSigningUp, isSignedUp } = useSelector(state => state.user);

  useEffect(() => {
    if (isSignedUp) {
      setTimeout(() => {
        Router.push("/signin");
      }, 2000);
    }
  }, [isSignedUp]);

  const onSubmit = e => {
    e.preventDefault();
    if (
      !termError &&
      !passwordError &&
      !passwordCheckError &&
      email &&
      nickname
    ) {
      console.log("onsubmit fired");
      console.log("dispatch fired");
      return dispatch({
        type: SIGN_UP_REQUEST,
        data: {
          userId: email,
          password,
          nickname
        }
      });
    }

    setValues(() => {
      return {
        ...values,
        termError: !term,
        emailError: !validateEmail(email),
        nicknameError: !nickname,
        passwordError: !password
      };
    });
  };

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
            Sign Up
          </Typography>
          <form className={classes.form} noValidate>
            <MemoEmail />
            <MemoNickname />
            <MemoPassword />

            <MemoPasswordCheck />

            {isSignedUp && (
              <Toaster
                message="You are signed up :). Please sign in now! "
                type="success"
                whereTo="/signin"
              />
            )}
            <MemoTerm />
            <MemoSubmit
              onSubmit={onSubmit}
              text="Sign Up"
              className={classes.submit}
              isSigningUp={isSigningUp}
            />

            <Grid container>
              <Grid item>
                <Link href={"signin"} text="Already a member? Sign in!" />
              </Grid>
            </Grid>
            <Box mt={5}>
              <Copyright text="Streamers" />
            </Box>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}
