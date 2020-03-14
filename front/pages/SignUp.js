import React, { useCallback, useEffect, useState } from "react";
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
import { makeStyles } from "@material-ui/core/styles";
import styled from "styled-components";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.min.css";

import Link from "../components/CustomLinks";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link href="/" text="Streamers.com" /> {new Date().getFullYear()}
    </Typography>
  );
}

const SignUpError = styled.div`
  color: red;
`;

const useStyles = makeStyles(theme => ({
  root: {
    height: "100vh"
  },
  image: {
    backgroundImage: "url(https://source.unsplash.com/random)",
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "dark"
        ? theme.palette.grey[900]
        : theme.palette.grey[50],
    backgroundSize: "cover",
    backgroundPosition: "center"
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

export default function SignInSide() {
  const classes = useStyles();

  /////////Logic //////////
  /////////Logic //////////

  const dispatch = useDispatch();
  const { isSigningUp, me, isSignedUp } = useSelector(state => state.user);

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
      setValues({ ...values, termError: term });
    }

    setValues(prevState => {
      return {
        ...prevState,
        [event.target.name]: event.target.value,
        // termError: !term,
        emailError: !validateEmail(email),
        nicknameError: !nickname,
        passwordError: !password
      };
    });
  };

  useEffect(() => {
    setValues(() => {
      const check = password !== passwordCheck;
      return { ...values, passwordCheckError: check };
    });
  }, [password, passwordCheck]);

  console.log("values ", values);
  // useEffect(() => {
  //   if (me) {
  //     alert("Now you logged in, moving to the main page.");
  //     Router.push("/");
  //   }
  // }, [me && me.id]);

  // useEffect(() => {
  //   if (isSignedUp) {
  //     alert("You are signed up :). Please log in");
  //     Router.push("/");
  //   }
  // }, [isSignedUp]);
  const validateEmail = email => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const onSubmit = e => {
    e.preventDefault();
    setValues(() => {
      return {
        ...values,
        termError: !term,
        emailError: !validateEmail(email),
        nicknameError: !nickname,
        passwordError: !password
      };
    });

    if (!termError && !passwordError && email && nickname) {
      return dispatch({
        type: SIGN_UP_REQUEST,
        data: {
          userId: email,
          password,
          nickname
        }
      });
    }
  };

  if (me) {
    return null;
  }

  /////////Logic //////////

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
              Sign Up
            </Button>
            <Grid container>
              <Grid item>
                <Link href={"signin"} text="Already a member? Sign in!" />
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
