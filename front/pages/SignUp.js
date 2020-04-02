import React, { useEffect } from "react";
import Router from "next/router";
import { useSelector, shallowEqual } from "react-redux";
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
import {
  MemoEmail,
  MemoNickname,
  MemoPassword,
  MemoPasswordCheck,
  MemoTerm,
  MemoSignUp
} from "../containers/InputComponents";

import LinearDeterminate from "../components/Progressbar";
import { SocialLinks } from "../containers/SocialIconLinksFlat";
import { LogoAndName } from "../components/MenuComponents";

export default function SignInSide() {
  //make sure only accessible when not logged in

  const classes = useStyles();
  /////////Logic //////////

  const { isLoading, signUpErrorReason } = useSelector(({ user }) => {
    return {
      isLoading: user.isLoading,
      signUpErrorReason: user.signUpErrorReason
    };
  }, shallowEqual);
  useEffect(() => {
    if (isLoading) {
      setTimeout(() => {
        Router.push("/signin");
      }, 6000);
    }
  }, [isLoading]);

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />

      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <LogoAndName />
          <Typography component="h2" variant="h5">
            Welcome to the excitements!
          </Typography>
          <form className={classes.form} noValidate>
            <MemoEmail />
            <MemoNickname />
            <MemoPassword />
            <MemoPasswordCheck />
            <MemoTerm />
            {isLoading && (
              <Toaster
                message={`An email sent to your registered email. Please follow the instruction to activate your account`}
                type="success"
                whereTo="/signin"
              />
            )}
            {signUpErrorReason && (
              <Toaster
                message={signUpErrorReason}
                type="error"
                whereTo={false}
              />
            )}
            <MemoSignUp className={classes.submit} />
            {isLoading && <LinearDeterminate />}
            <SocialLinks />
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
