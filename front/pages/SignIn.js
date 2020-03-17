import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Router from "next/router";

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";

//custom styles
import Link from "../components/CustomLinks";
import Copyright from "../components/Copyright";
import { SignUpError, useStyles } from "../styles/SigniningStyle";
import Toaster from "../components/Toaster";

//actions
import { LOG_IN_REQUEST } from "../reducers/user";

//make sure only accessible when not logged in
//make sure only accessible when not logged in
//make sure only accessible when not logged in
export default function SignInSide() {
  const classes = useStyles();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { isLoggingIn, me, logInErrorReason } = useSelector(
    state => state.user
  );
  const dispatch = useDispatch();

  const onSubmitForm = useCallback(
    e => {
      console.log("onsubmit fired");
      e.preventDefault();
      dispatch({
        type: LOG_IN_REQUEST,
        data: {
          userId: email,
          password
        }
      });
    },
    [email, password]
  );

  useEffect(() => {
    if (me) {
      setTimeout(() => {
        Router.push("/");
      }, 3000);
    }
  }, [me]);

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
            Sign in
          </Typography>
          <form className={classes.form}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              onChange={e => setEmail(e.target.value)}
              value={email}
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              onChange={e => setPassword(e.target.value)}
              value={password}
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              onClick={onSubmitForm}
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              {isLoggingIn && (
                <CircularProgress
                  color="secondary"
                  size={20}
                  style={{ marginRight: "20px" }}
                />
              )}
              Sign In
            </Button>

            {logInErrorReason && (
              <Toaster
                message={logInErrorReason}
                type="error"
                whereTo={false}
              />
            )}

            {me && (
              <Toaster message="Login Success! " type="success" whereTo="/" />
            )}
            <SignUpError>{logInErrorReason}</SignUpError>

            <Grid container>
              <Grid item xs>
                <Link href={"/passwordre"} text="For got password?" />
              </Grid>
              <Grid item>
                <Link href={"/signup"} text="Don't have an account? Sign Up" />
              </Grid>
            </Grid>
            <Box mt={5}>
              <Copyright />
            </Box>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}
