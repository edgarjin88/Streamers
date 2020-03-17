import React, { useEffect, useState, useMemo, memo, useCallback } from "react";
import Router from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { SIGN_UP_REQUEST } from "../reducers/user";
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

import Toaster from "../components/Toaster";
import { SignUpError, useStyles } from "../styles/SigniningStyle";
// to be moved to styling folder later.

import Link from "../components/CustomLinks";
import Copyright from "../components/Copyright";
import { validateEmail } from "../helpers/loginHelpers";

const MemoButton = memo(function MemoTest({ changeItem }) {
  return (
    <button
      className="Tetris"
      style={{
        backgroundColor: "grey",
        width: "200px",
        height: "400px",
        zIndex: 30000
      }}
      onClick={changeItem}
      // fff={func}
    >
      useCallback Test
    </button>
  );
});

export default function SignInSide() {
  //make sure only accessible when not logged in
  //make sure only accessible when not logged in
  //make sure only accessible when not logged in

  //  render part can be a separate component.
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
      // alert("You are signed up :). Please sign in now");
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
      passwordCheckError &&
      email &&
      nickname
    ) {
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
  //현재 스테이트 체인지로 다른 콤포넌트들은 전부 바뀌는 상황.
  // 이 컴퍼넌트가 바뀌지 않는 이유는?
  // 콜백에 대한 레퍼런스가 바뀌지 않는 다는 이야기. 그 이유는?
  //memo가 같은 부모 안에 있으면 레퍼런스도 안 바뀌는 구나.
  const [test, setTest] = useState(false);
  const callbackTest = () => {
    console.log("onClick!!");
    console.log("test :", test);
    setTest(!test);
  };

  // 그럼 리렌더링 방지가 되는 경우는 왜 되는지, 정말 되는건지 도 프로파일링으로 한번 보자.
  // 또한 리덕스 없이도테스트 해 보자.
  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <MemoButton changeItem={callbackTest} />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />

      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              margin="normal"
              required={true}
              fullWidth
              type="email"
              id="email"
              label="Email Address"
              value={email}
              name="email"
              autoComplete="email"
              onChange={handleChange}
              autoFocus
            />
            {emailError && (
              <SignUpError>Please enter proper email address</SignUpError>
            )}
            <TextField
              margin="normal"
              required={true}
              fullWidth
              id="nickname"
              value={nickname}
              label="Nick Name"
              name="nickname"
              onChange={handleChange}
            />
            {nicknameError && <SignUpError>Please enter Nick Name</SignUpError>}
            <TextField
              margin="normal"
              required={true}
              fullWidth
              name="password"
              value={password}
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={handleChange}
            />
            {passwordError && (
              <SignUpError>Please enter your password</SignUpError>
            )}
            <TextField
              margin="normal"
              required={true}
              fullWidth
              value={passwordCheck}
              name="passwordCheck"
              label="Confirm your password"
              type="password"
              id="passwordCheck"
              onChange={handleChange}
            />
            {isSignedUp && (
              <Toaster
                message="You are signed up :). Please sign in now! "
                type="success"
                whereTo="/signin"
              />
            )}

            {passwordCheckError && (
              <SignUpError>Entered password does not match.</SignUpError>
            )}
            <FormControlLabel
              control={
                <Checkbox
                  onChange={handleChange}
                  name="term"
                  checked={term}
                  color="primary"
                />
              }
              label="I read and agree to the terms and conditions"
            />
            {termError && (
              <SignUpError>You have to agree to terms. </SignUpError>
            )}
            <Button
              // type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={onSubmit}
            >
              {isSigningUp && (
                <CircularProgress
                  color="secondary"
                  size={20}
                  style={{ marginRight: "20px" }}
                />
              )}
              Sign Up
            </Button>
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

//
