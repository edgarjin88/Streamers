import React, { useEffect, useState, useMemo, memo, useCallback } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import Router from "next/router";

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
import {
  SIGN_UP_REQUEST,
  LOG_IN_REQUEST,
  PASSWORD_RESET_REQUEST,
  CONFIRM_PASSWORD_RESET_REQUEST
} from "../reducers/user";
import { StyledButton1 } from "../components/CustomButtons";

export const MemoConfirmPasswordReset = memo(function MemoConfirmPasswordReset({
  userId
}) {
  // let { userId } = jwt.decode(token);
  const dispatch = useDispatch();

  const {
    password,
    passwordCheck,
    passwordError,
    passwordCheckError
  } = useSelector(({ input }) => {
    return {
      password: input.password,
      passwordCheck: input.passwordCheck,
      passwordError: input.passwordError,
      passwordCheckError: input.passwordCheckError
    };
  }, shallowEqual);

  const handleClick = e => {
    if (!password) {
      console.log("password change confirm fired");
      dispatch({
        type: SET_PASSWORD_ERROR
      });
    }
    if (password && passwordCheck && !passwordError && !passwordCheckError) {
      dispatch({
        type: CONFIRM_PASSWORD_RESET_REQUEST,
        data: {
          userId,
          password
        }
      });
    }
  };

  const { isActivated, isLoading, activationErrorReason } = useSelector(
    ({ user }) => {
      return {
        isActivated: user.isActivated,
        isLoading: user.isLoading,
        activationErrorReason: user.activationErrorReason
      };
    },
    shallowEqual
  );

  return (
    <>
      <StyledButton1
        type="button"
        onClick={handleClick}
        size="1.5rem"
        color="#ff3300"
      >
        Confirm
      </StyledButton1>
    </>
  );
});

export const MemoSubmitPasswordReset = memo(function MemoSubmitPasswordReset() {
  // let { userId } = jwt.decode(token);
  const dispatch = useDispatch();
  const { email, emailError } = useSelector(({ input }) => {
    return {
      email: input.email,
      emailError: input.emailError
    };
  }, shallowEqual);
  const handleClick = e => {
    e.preventDefault();
    if (email && !emailError) {
      return dispatch({
        type: PASSWORD_RESET_REQUEST,
        data: {
          userId: email
        }
      });
    } else {
      return dispatch({
        type: SET_EMAIL_ERROR
      });
    }
  };
  return (
    <>
      <StyledButton1
        type="button"
        onClick={handleClick}
        size="1.5rem"
        color="#ff3300"
      >
        Send a password recovery link
      </StyledButton1>
    </>
  );
});

export const MemoEmail = memo(function MemoEmail() {
  const dispatch = useDispatch();
  const { email, emailError, untouchedEmail } = useSelector(({ input }) => {
    return {
      email: input.email,
      emailError: input.emailError,
      untouchedEmail: input.untouchedEmail
    };
  }, shallowEqual);

  const handleChange = e =>
    dispatch({
      type: SET_EMAIL,
      data: e.target.value
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
      {/* {JSON.stringify} */}
      {
        <SignUpError
          show={untouchedEmail ? "untouched" : emailError ? true : false}
        >
          Please enter proper email address
        </SignUpError>
      }
    </>
  );
});

export const MemoNickname = memo(function MemoNickname() {
  const dispatch = useDispatch();
  const { nickname, nicknameError, untouchedNickname } = useSelector(
    ({ input }) => {
      return {
        nickname: input.nickname,
        nicknameError: input.nicknameError,
        untouchedNickname: input.untouchedNickname
      };
    },
    shallowEqual
  );

  const handleChange = e =>
    dispatch({
      type: SET_NICKNAME,
      data: e.target.value
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
      {
        <SignUpError
          show={untouchedNickname ? "untouched" : nicknameError ? true : false}
        >
          Please enter Nick Name
        </SignUpError>
      }
    </>
  );
});

export const MemoPassword = memo(function MemoPassword() {
  const dispatch = useDispatch();
  const { password, passwordError, untouchedPassword } = useSelector(
    ({ input }) => {
      return {
        password: input.password,
        passwordError: input.passwordError,
        untouchedPassword: input.untouchedPassword
      };
    },
    shallowEqual
  );

  const handleChange = e =>
    dispatch({
      type: SET_PASSWORD,
      data: e.target.value
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
      {
        <SignUpError
          show={untouchedPassword ? "untouched" : passwordError ? true : false}
        >
          Please enter your password
        </SignUpError>
      }
    </>
  );
});

export const MemoPasswordCheck = memo(function MemoPasswordCheck() {
  const dispatch = useDispatch();
  const {
    passwordCheck,
    passwordCheckError,
    untouchedPasswordCheck
  } = useSelector(({ input }) => {
    return {
      passwordCheck: input.passwordCheck,
      passwordCheckError: input.passwordCheckError,
      untouchedPasswordCheck: input.untouchedPasswordCheck
    };
  }, shallowEqual);

  const handleChange = e =>
    dispatch({
      type: SET_PASSWORD_CHECK,
      data: e.target.value
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

      {
        <SignUpError
          show={
            untouchedPasswordCheck
              ? "untouched"
              : passwordCheckError
              ? true
              : false
          }
        >
          Entered password does not match.
        </SignUpError>
      }
    </>
  );
});
export const MemoTerm = memo(function MemoTerm() {
  const dispatch = useDispatch();
  const { term, termError, untouchedTerm } = useSelector(({ input }) => {
    return {
      term: input.term,
      termError: input.termError,
      untouchedTerm: input.untouchedTerm
    };
  }, shallowEqual);

  const handleChange = () =>
    dispatch({
      type: SET_TERM,
      data: !term
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
      {
        <SignUpError
          show={untouchedTerm ? "untouched" : termError ? true : false}
        >
          You have to agree to terms.{" "}
        </SignUpError>
      }
    </>
  );
});

export const MemoSignIn = memo(function MemoSignIn({ className }) {
  const dispatch = useDispatch();
  const { isLoading } = useSelector(state => state.user, shallowEqual);
  const { email, emailError, password, passwordError } = useSelector(
    ({ input }) => {
      return {
        email: input.email,
        emailError: input.emailError,
        password: input.password,
        passwordError: input.passwordError
      };
    },
    shallowEqual
  );

  const onSignIn = () => {
    if (!emailError && !passwordError && email && password) {
      return dispatch({
        type: LOG_IN_REQUEST,
        data: {
          userId: email,
          password
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
        onClick={onSignIn}
      >
        {isLoading && (
          <CircularProgress
            color="secondary"
            size={20}
            style={{ marginRight: "20px" }}
          />
        )}
        Sign In
      </Button>
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

  const onSignUp = () => {
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
