import React, { useEffect, useState, useCallback } from "react";
import Router from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { LOG_IN_REQUEST } from "../reducers/user";

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
import { MemoEmail, MemoPassword, MemoSubmit } from "../components/MemoForSign";

export default function SignInSide() {
  //make sure only accessible when not logged in
  //make sure only accessible when not logged in

  const classes = useStyles();
  /////////Logic //////////
  const { isLoggingIn, me, logInErrorReason } = useSelector(
    state => state.user
  );
  const dispatch = useDispatch();

  const [values, setValues] = useState({
    email: "",
    emailError: false,
    nicknameError: false,
    password: "",
    passwordError: false
  });

  const { email, emailError, password, passwordError } = values;

  const handleChange = event => {
    event.persist();

    setValues(prevState => {
      return {
        ...prevState,
        [event.target.name]: event.target.value
      };
    });
  };

  useEffect(() => {
    if (password || email) {
      setValues(prevState => {
        return {
          ...prevState,
          emailError: !validateEmail(email),
          passwordError: !password
        };
      });
    }
  }, [password, email]);

  useEffect(() => {
    if (me) {
      setTimeout(() => {
        Router.push("/");
      }, 2000);
    }
  }, [me]);

  const onSubmit = e => {
    e.preventDefault();

    if (!passwordError && !emailError) {
      console.log("onsubmit fired");
      return dispatch({
        type: LOG_IN_REQUEST,
        data: {
          userId: email,
          password
        }
      });
    }

    setValues(() => {
      return {
        ...values,
        emailError: !validateEmail(email),
        passwordError: !password
      };
    });
  };

  const handleMemoEmail = useCallback(
    e => {
      handleChange(e);
    },
    [email]
  );

  const handleMemoPassword = useCallback(
    e => {
      handleChange(e);
    },
    [password]
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
            Sign In
          </Typography>
          <form className={classes.form} noValidate>
            <MemoEmail
              emailError={emailError}
              handleChange={handleMemoEmail}
              email={email}
            />

            <MemoPassword
              password={password}
              handleChange={handleMemoPassword}
              passwordError={passwordError}
            />

            {me && (
              <Toaster message="Login Success!" type="success" whereTo="/" />
            )}

            {logInErrorReason && (
              <Toaster
                message={logInErrorReason}
                type="error"
                whereTo={false}
              />
            )}

            <MemoSubmit
              onSubmit={onSubmit}
              text="Sign In"
              className={classes.submit}
              isSigningUp={isLoggingIn}
            />

            <Grid container>
              <Grid item xs>
                <Link href={"/passwordre"} text="For got password?" />
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
