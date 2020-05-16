import React, { useEffect } from "react";
import Router from "next/router";
import { useSelector, useDispatch } from "react-redux";

import { CLEAR_INPUT_FIELDS } from "../reducers/input";

import Avatar from "@material-ui/core/Avatar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";

import Typography from "@material-ui/core/Typography";
import { useStyles } from "../styles/SigniningStyle";
// to be moved to styling folder later.

import Link from "../components/CustomLinks";
import Copyright from "../components/Copyright";

import {
  MemoEmail,
  MemoPassword,
  MemoSignIn,
} from "../containers/InputComponents";
import { SocialLinks } from "../containers/SocialIconLinksFlat";
import { LogoAndName } from "../components/MenuComponents";

export default function SignInSide() {
  //make sure only accessible when not logged in
  //make sure only accessible when not logged in

  const classes = useStyles();
  /////////Logic //////////
  const { me, signInErrorReason } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  //No shallow comparison required here.
  useEffect(() => {
    dispatch({
      type: CLEAR_INPUT_FIELDS,
    });
  }, []);
  useEffect(() => {
    if (me) {
      Router.push("/");
    }
  }, [me]);

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
            <MemoPassword />

            <MemoSignIn className={classes.submit} />
            <SocialLinks />
            <Grid container>
              <Grid item xs>
                <Link href={"/passwordreset"} text="For got password?" />
              </Grid>

              <Grid item>
                <Link
                  href={"signup"}
                  text="Don't have an account? Sign Up here."
                />
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
