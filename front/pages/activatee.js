import React, { useEffect, useState, memo, useCallback } from "react";
import Router from "next/router";
import { useSelector, shallowEqual } from "react-redux";
import { SIGN_UP_REQUEST } from "../reducers/user";
import Avatar from "@material-ui/core/Avatar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";

import Typography from "@material-ui/core/Typography";
import Toaster from "../components/Toaster";
import { useStyles, SignUpError } from "../styles/SigniningStyle";
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
  MemoSignUp
} from "../containers/MemoForSign";

import jwt from "jsonwebtoken";

export default function SignInSide() {
  //make sure only accessible when not logged in

  const classes = useStyles();
  /////////Logic //////////
  //get token, and move to signin page. toaster.
  // when submit, use redux again. just token. It is OK.
  //make some more components with memo.

  // useEffect(() => {
  //   let token = match.params.token;
  //   let { name } = jwt.decode(token);
  //   // console.log(token);
  //   if (token) {
  //     setValues({ ...values, name, token });
  //   }
  // }, []);

  const activationLink = () => (
    <div className="text-center">
      <h1 className="p-5">Hey userID, Ready to activate your account?</h1>
      <button className="btn btn-outline-primary">Activate Account</button>
    </div>
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
            Hi userID, Good to see you again!. Activate your account here.
          </Typography>
          <form className={classes.form} noValidate>
            {activationLink()}
            <MemoSignUp className={classes.submit} />
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
