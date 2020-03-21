import React, { useEffect, useState, useMemo, memo, useCallback } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";

import TextField from "@material-ui/core/TextField";
import { SignUpError } from "../styles/SigniningStyle";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import {
  SET_NICKNAME,
  SET_EMAIL,
  SET_EMAIL_ERROR,
  SET_PASSWORD,
  SET_PASSWORD_ERROR,
  SET_PASSWORD_CHECK,
  SET_PASSWORD_CHECK_ERROR,
  SET_TERM,
  SET_TERM_ERROR,
  SET_NICKNAME_ERROR
} from "../reducers/input";
import { SIGN_UP_REQUEST, LOG_IN_REQUEST } from "../reducers/user";

export const MemoEmail = memo(function MemoEmail() {
  const dispatch = useDispatch();
  const { email, emailError } = useSelector(({ input }) => {
    return { email: input.email, emailError: input.emailError };
  }, shallowEqual);

  const handleChange = e =>
    dispatch({
      type: SET_EMAIL,
      payload: e.target.value
    });
  return (
    <>
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
      ;
      {emailError && (
        <SignUpError>Please enter proper email address</SignUpError>
      )}
    </>
  );
});

export const MemoNickname = memo(function MemoNickname() {
  const dispatch = useDispatch();
  const { nickname, nicknameError } = useSelector(({ input }) => {
    return {
      nickname: input.nickname,
      nicknameError: input.nicknameError
    };
  }, shallowEqual);

  const handleChange = e =>
    dispatch({
      type: SET_NICKNAME,
      payload: e.target.value
    });
  return (
    <>
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
    </>
  );
});

export const MemoPassword = memo(function MemoPassword() {
  const dispatch = useDispatch();
  const password = useSelector(({ input }) => input.password, shallowEqual);

  const handleChange = e =>
    dispatch({
      type: SET_PASSWORD,
      payload: e.target.value
    });

  return (
    <>
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
      {/* {passwordError && <SignUpError>Please enter your password</SignUpError>} */}
    </>
  );
});

export const MemoPasswordCheck = memo(function MemoPasswordCheck() {
  const dispatch = useDispatch();
  const { passwordCheck, passwordCheckError } = useSelector(({ input }) => {
    return {
      passwordCheck: input.passwordCheck,
      passwordCheckError: input.passwordCheckError
    };
  }, shallowEqual);

  const handleChange = e =>
    dispatch({
      type: SET_PASSWORD_CHECK,
      payload: e.target.value
    });
  return (
    <>
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
    </>
  );
});
export const MemoTerm = memo(function MemoTerm() {
  const dispatch = useDispatch();
  const { term, termError } = useSelector(({ input }) => {
    return {
      term: input.term,
      termError: input.termError
    };
  }, shallowEqual);

  const handleChange = e =>
    dispatch({
      type: SET_TERM,
      payload: !term
    });
  return (
    <>
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
      {termError && <SignUpError>You have to agree to terms. </SignUpError>}
    </>
  );
});

export const MemoSignUp = memo(function MemoSignUp({ className }) {
  const dispatch = useDispatch();
  const { isSigningUp, isSignedUp } = useSelector(
    state => state.user,
    shallowEqual
  );
  const {
    email,
    emailError,
    nickname,
    nicknameError,
    password,
    passwordCheck,
    passwordCheckError,
    passwordError,
    term,
    termError
  } = useSelector(({ input }) => {
    return {
      email: input.email,
      emailError: input.emailError,
      nickname: input.nickname,
      nicknameError: input.emailError,
      password: input.password,
      passwordError: input.passwordError,
      passwordCheck: input.passwordCheck,
      passwordCheckError: input.passwordCheckError,
      term: input.term,
      termError: input.termError
    };
  }, shallowEqual);
  // isSigningUp

  const onSignUp = e => {
    // e.preventDefault()
    if (
      !emailError &&
      !nicknameError &&
      !passwordCheckError &&
      !passwordError &&
      !termError &&
      nickname &&
      email &&
      password &&
      passwordCheck &&
      term
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
  };

  return (
    <>
      <Button
        fullWidth
        variant="contained"
        color="primary"
        className={className}
        onClick={onSignUp}
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
    </>
  );
});
