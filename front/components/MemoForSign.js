import React, { memo } from "react";

import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";

import { SignUpError } from "../styles/SigniningStyle";

export const MemoEmail = memo(function MemoEmail({
  handleChange,
  email,
  emailError,
}) {
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

export const MemoNickname = memo(function MemoNickname({
  handleChange,
  nickname,
  nicknameError,
}) {
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

export const MemoPassword = memo(function MemoPassword({
  handleChange,
  password,
  passwordError,
}) {
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
      {passwordError && <SignUpError>Please enter your password</SignUpError>}
    </>
  );
});

export const MemoPasswordCheck = memo(function MemoPasswordCheck({
  handleChange,
  passwordCheck,
  passwordCheckError,
}) {
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
export const MemoTerm = memo(function MemoTerm({
  handleChange,
  term,
  termError,
}) {
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
export const MemoSubmit = memo(function MemoSubmit({
  onSubmit,
  className,
  isLoading,
  text,
}) {
  return (
    <>
      <Button
        // type="submit"
        fullWidth
        variant="contained"
        color="primary"
        className={className}
        onClick={onSubmit}
      >
        {isLoading && (
          <CircularProgress
            color="secondary"
            size={20}
            style={{ marginRight: "20px" }}
          />
        )}
        {text}
      </Button>
    </>
  );
});
