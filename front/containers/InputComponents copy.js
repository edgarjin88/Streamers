import React, { useEffect, useState, useMemo, memo, useCallback } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import Router from "next/router";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";

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
  SET_NICKNAME_ERROR,
  SET_DESCRIPTION,
} from "../reducers/input";
import {
  SIGN_UP_REQUEST,
  SIGN_IN_REQUEST,
  PASSWORD_RESET_REQUEST,
  CONFIRM_PASSWORD_RESET_REQUEST,
  CHANGE_PASSWORD_REQUEST,
  START_CHANGE_PASSWORD,
  START_EDIT_DESCRIPTION,
  EDIT_DESCRIPTION_REQUEST,
} from "../reducers/user";
import { StyledButton1 } from "../components/CustomButtons";

import MUIRichTextEditor from "mui-rte";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import {
  EditorState,
  convertFromRaw,
  convertToRaw,
  ContentState,
} from "draft-js";

export const RichTextEditor = () => {
  const [editorState, setEditorState] = useState(null);

  const defaultTheme = createMuiTheme();
  Object.assign(defaultTheme, {
    overrides: {
      MUIRichTextEditor: {
        root: {
          marginTop: 20,
          width: "100%",
          height: "300px",
        },
        editor: {
          borderBottom: "1px solid red",
          height: "200px",
          overflowY: "scroll",
        },
      },
    },
  });
  const { description } = useSelector(({ input }) => input);

  const { startedEditingDescription, userDescription } = useSelector(
    ({ user }) => {
      return {
        startedEditingDescription: user.startedEditingDescription,
        userDescription: user.description,
      };
    }
  );
  const dispatch = useDispatch();

  const handleSaveDescription = (data) => {
    dispatch({
      type: EDIT_DESCRIPTION_REQUEST,
      data: data,
    });
  };

  const handleSaveDescriptionState = (e) => {
    dispatch({
      type: EDIT_DESCRIPTION_REQUEST,
      data: JSON.stringify(text),
    });
  };

  const handleEditDescription = useCallback(() => {
    dispatch({
      type: START_EDIT_DESCRIPTION,
    });
  }, [startedEditingDescription, description]);

  const handleChange = useCallback(
    (data) => {
      dispatch({
        type: SET_DESCRIPTION,
        data: convertToRaw(data.getCurrentContent()),
      });
    },
    [description]
  );
  const test1 = (data) => {
    setEditorState(JSON.stringify(convertToRaw(data.getCurrentContent())));
  };

  return (
    <>
      <MuiThemeProvider theme={defaultTheme}>
        <MUIRichTextEditor
          readOnly={false}
          toolbar={true}
          inlineToolbar={true}
          onSave={handleSaveDescription}
          label="Start typing..."
        />
      </MuiThemeProvider>
      <Button
        onClick={
          startedEditingDescription
            ? handleSaveDescriptionState
            : handleEditDescription
        }
        variant="contained"
        color="primary"
        style={{ float: "right" }}
        startIcon={<CloudUploadIcon />}
      >
        {!startedEditingDescription ? "Edit Description" : "Save"}
      </Button>
    </>
  );
};

export const MemoProfileDescription = memo(function MemoProfileDescription() {
  const { description } = useSelector(({ input }) => input);
  const { startedEditingDescription, userDescription } = useSelector(
    ({ user }) => {
      return {
        startedEditingDescription: user.startedEditingDescription,
        userDescription: user.description,
      };
    }
  );

  const dispatch = useDispatch();
  const handleSaveDescription = useCallback(() => {
    dispatch({
      type: EDIT_DESCRIPTION_REQUEST,
      data: description,
    });
  }, [description, startedEditingDescription]);

  const handleEditDescription = useCallback(() => {
    dispatch({
      type: START_EDIT_DESCRIPTION,
    });
  }, [startedEditingDescription, description]);

  const handleChange = useCallback(
    (e) => {
      dispatch({
        type: SET_DESCRIPTION,
        data: e.target.value,
      });
    },
    [description]
  );
  return (
    <>
      {startedEditingDescription && (
        <TextField
          id="standard-multiline-static"
          label="Description"
          multiline
          onChange={handleChange}
          value={userDescription ? userDescription : description}
          // defaultValue={description}
          InputProps={{
            style: { fontSize: "14px" },
          }}
          fullWidth
        />
      )}
      <Button
        onClick={
          startedEditingDescription
            ? handleSaveDescription
            : handleEditDescription
        }
        variant="contained"
        color="primary"
        style={{ float: "right" }}
        // className={classes.button}
        startIcon={<CloudUploadIcon />}
      >
        {!startedEditingDescription ? "Edit Description" : "Save"}
      </Button>
    </>
  );
});

export const MemoSubmitPasswordChange = memo(function MemoSubmitPasswordChange({
  className,
}) {
  const dispatch = useDispatch();
  const { isLoading, startedChangingPassword, resetPasswordLink } = useSelector(
    ({ user }) => {
      return {
        resetPasswordLink: user.resetPasswordLink,
        isLoading: user.isLoading,
        startedChangingPassword: user.startedChangingPassword,
      };
    },
    shallowEqual
  );
  const {
    password,
    passwordError,
    passwordCheck,
    passwordCheckError,
  } = useSelector(({ input }) => {
    return {
      passwordCheck: input.passwordCheck,
      passwordCheckError: input.passwordCheckError,
      password: input.password,
      passwordError: input.passwordError,
    };
  }, shallowEqual);

  const handleChangePassword = useCallback(() => {
    dispatch({
      type: START_CHANGE_PASSWORD,
    });
  }, [startedChangingPassword]);

  const handleSavePassword = useCallback(() => {
    if (password && !passwordError && !passwordCheckError && passwordCheck) {
      dispatch({
        type: CHANGE_PASSWORD_REQUEST,
        data: { password, resetPasswordLink },
      });
    }
  }, [password, passwordCheck]);

  return (
    <>
      <Button
        onClick={
          startedChangingPassword ? handleSavePassword : handleChangePassword
        }
        variant="contained"
        color="primary"
        style={{ float: "right" }}
        startIcon={<CloudUploadIcon />}
      >
        {startedChangingPassword ? "Save" : "Change Password"}
      </Button>
      {startedChangingPassword && (
        <MemoPasswordCheck size="16px" labelSize="16px" />
      )}
    </>
  );
});

export const MemoConfirmPasswordReset = memo(function MemoConfirmPasswordReset({
  userId,
}) {
  const dispatch = useDispatch();

  const {
    password,
    passwordCheck,
    passwordError,
    passwordCheckError,
    resetPasswordLink,
  } = useSelector(({ input }) => {
    return {
      password: input.password,
      passwordCheck: input.passwordCheck,
      passwordError: input.passwordError,
      passwordCheckError: input.passwordCheckError,
      resetPasswordLink: input.resetPasswordLink,
    };
  }, shallowEqual);

  const handleClick = (e) => {
    if (!password) {
      dispatch({
        type: SET_PASSWORD_ERROR,
      });
    }
    if (password && passwordCheck && !passwordError && !passwordCheckError) {
      dispatch({
        type: CONFIRM_PASSWORD_RESET_REQUEST,
        data: {
          resetPasswordLink,
          password,
        },
      });
    }
  };

  const { isActivated, isLoading, activationErrorReason } = useSelector(
    ({ user }) => {
      return {
        isActivated: user.isActivated,
        isLoading: user.isLoading,
        activationErrorReason: user.activationErrorReason,
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
      emailError: input.emailError,
    };
  }, shallowEqual);
  const handleClick = (e) => {
    e.preventDefault();
    if (email && !emailError) {
      return dispatch({
        type: PASSWORD_RESET_REQUEST,
        data: {
          userId: email,
        },
      });
    } else {
      return dispatch({
        type: SET_EMAIL_ERROR,
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

export const MemoEmail = memo(function MemoEmail({
  profileUserId,
  size,
  labelSize,
}) {
  const dispatch = useDispatch();
  const { email, emailError, untouchedEmail } = useSelector(({ input }) => {
    return {
      email: input.email,
      emailError: input.emailError,
      untouchedEmail: input.untouchedEmail,
    };
  }, shallowEqual);

  const handleChange = (e) =>
    dispatch({
      type: SET_EMAIL,
      data: e.target.value,
    });
  return (
    <>
      <TextField
        InputProps={{
          style: { fontSize: size },
        }}
        InputLabelProps={{
          style: { fontSize: labelSize },
        }}
        margin="normal"
        required={true}
        fullWidth
        type="email"
        id="email"
        label="User ID"
        value={profileUserId ? profileUserId : email}
        name="email"
        autoComplete="email"
        onChange={handleChange}
        autoFocus
        disabled={profileUserId}
      />
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

export const MemoNickname = memo(function MemoNickname({
  size,
  labelSize,
  disabled,
  profileNickname,
}) {
  const dispatch = useDispatch();

  const {
    startedEditingNickname,
    startedEditingDescription,
    startedChangingPassword,
  } = useSelector((state) => state.user);
  const { nickname, nicknameError, untouchedNickname } = useSelector(
    ({ input }) => {
      return {
        nickname: input.nickname,
        nicknameError: input.nicknameError,
        untouchedNickname: input.untouchedNickname,
      };
    },
    shallowEqual
  );

  const handleChange = (e) =>
    dispatch({
      type: SET_NICKNAME,
      data: e.target.value,
    });
  return (
    <>
      <TextField
        InputProps={{
          style: { fontSize: size },
        }}
        InputLabelProps={{
          style: { fontSize: labelSize },
        }}
        margin="normal"
        required={true}
        fullWidth
        id="nickname"
        value={untouchedNickname ? profileNickname : nickname}
        label="Nick Name"
        name="nickname"
        onChange={handleChange}
        disabled={disabled}
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

export const MemoPassword = memo(function MemoPassword({
  disabled,
  size,
  labelSize,
}) {
  const dispatch = useDispatch();
  const { password, passwordError, untouchedPassword } = useSelector(
    ({ input }) => {
      return {
        password: input.password,
        passwordError: input.passwordError,
        untouchedPassword: input.untouchedPassword,
      };
    },
    shallowEqual
  );

  const handleChange = (e) =>
    dispatch({
      type: SET_PASSWORD,
      data: e.target.value,
    });

  return (
    <>
      <TextField
        InputProps={{
          style: { fontSize: size },
        }}
        InputLabelProps={{
          style: { fontSize: labelSize },
        }}
        disabled={disabled}
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

export const MemoPasswordCheck = memo(function MemoPasswordCheck({
  size,
  labelSize,
}) {
  const dispatch = useDispatch();
  const {
    passwordCheck,
    passwordCheckError,
    untouchedPasswordCheck,
  } = useSelector(({ input }) => {
    return {
      passwordCheck: input.passwordCheck,
      passwordCheckError: input.passwordCheckError,
      untouchedPasswordCheck: input.untouchedPasswordCheck,
    };
  }, shallowEqual);

  const handleChange = (e) =>
    dispatch({
      type: SET_PASSWORD_CHECK,
      data: e.target.value,
    });
  return (
    <>
      <TextField
        InputProps={{
          style: { fontSize: size },
        }}
        InputLabelProps={{
          style: { fontSize: labelSize },
        }}
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
      untouchedTerm: input.untouchedTerm,
    };
  }, shallowEqual);

  const handleChange = () =>
    dispatch({
      type: SET_TERM,
      data: !term,
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

      <SignUpError
        show={untouchedTerm ? "untouched" : termError ? true : false}
      >
        You have to agree to terms.{" "}
      </SignUpError>
    </>
  );
});

export const MemoSignIn = memo(function MemoSignIn({ className }) {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.user, shallowEqual);
  const { email, emailError, password, passwordError } = useSelector(
    ({ input }) => {
      return {
        email: input.email,
        emailError: input.emailError,
        password: input.password,
        passwordError: input.passwordError,
      };
    },
    shallowEqual
  );

  const onSignIn = () => {
    if (!emailError && !passwordError && email && password) {
      return dispatch({
        type: SIGN_IN_REQUEST,
        data: {
          userId: email,
          password,
        },
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
    (state) => state.user,
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
    termError,
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
      termError: input.termError,
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
          nickname,
        },
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
