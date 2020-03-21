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
  MemoSubmit,
  Redux
} from "../components/test";

export default function SignInSide() {
  //make sure only accessible when not logged in
  //make sure only accessible when not logged in

  // const allStates = useSelector(state => state);
  // useEffect(() => {
  //   console.log("all state :", allStates);
  // });

  const classes = useStyles();
  /////////Logic //////////
  const dispatch = useDispatch();
  const { isSigningUp, isSignedUp } = useSelector(state => state.user);

  const [values, setValues] = useState({
    email: "",
    emailError: false,
    nickname: "",
    nicknameError: false,
    password: "",
    passwordError: false,
    termError: false,
    passwordCheck: "",
    passwordCheckError: false
  });

  const {
    nickname,
    nicknameError,
    email,
    emailError,
    password,
    passwordError,
    passwordCheck,
    passwordCheckError,
    termError
  } = values;
  const [term, setTerm] = useState(false);

  const handleChange = event => {
    event.persist();
    if (event.target.name === "term") {
      setTerm(!term);
    }
    setValues(prevState => {
      return {
        ...prevState,
        [event.target.name]: event.target.value
      };
    });
  };

  useEffect(() => {
    if (nickname || password || email) {
      setValues(prevState => {
        const check = password !== passwordCheck;
        return {
          ...prevState,
          passwordCheckError: check,
          emailError: !validateEmail(email),
          nicknameError: !nickname,
          passwordError: !password,
          termError: !term
        };
      });
    }
  }, [nickname, password, passwordCheck, email, term]);

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

  const handleMemoEmail = useCallback(
    e => {
      handleChange(e);
    },
    [email]
  );

  const handleMemoNickname = useCallback(
    e => {
      handleChange(e);
    },
    [nickname]
  );
  const handleMemoPassword = useCallback(
    e => {
      handleChange(e);
    },
    [password]
  );

  const handleMemoPasswordCheck = useCallback(
    e => {
      handleChange(e);
    },
    [passwordCheck]
  );
  const handleMemoTerm = useCallback(
    e => {
      handleChange(e);
    },
    [term]
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
            Sign Up
          </Typography>
          <form className={classes.form} noValidate>
            <MemoEmail
              emailError={emailError}
              handleChange={handleMemoEmail}
              email={email}
            />
            <MemoNickname
              handleChange={handleMemoNickname}
              nickname={nickname}
              nicknameError={nicknameError}
            />
            <MemoPassword
              password={password}
              handleChange={handleMemoPassword}
              passwordError={passwordError}
            />

            <MemoPasswordCheck
              handleChange={handleMemoPasswordCheck}
              passwordCheck={passwordCheck}
              passwordCheckError={passwordCheckError}
            />

            {isSignedUp && (
              <Toaster
                message="You are signed up :). Please sign in now! "
                type="success"
                whereTo="/signin"
              />
            )}
            <MemoTerm
              handleChange={handleMemoTerm}
              term={term}
              termError={termError}
            />
            <MemoSubmit
              onSubmit={onSubmit}
              text="Sign Up"
              className={classes.submit}
              isSigningUp={isSigningUp}
            />

            <Redux />

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
