import React, { useEffect } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import Toaster from "../components/Toaster";
import { NULLIFY_SIGN_OUT, NULLIFY_SIGN_IN_SUCCESS } from "../reducers/user";

const Toasters = () => {
  const dispatch = useDispatch();

  const {
    signOutSuccess,
    signInSuccess,
    signInErrorReason,
    signoutErrorReason,
    signUpErrorReason,
    isActivated,
    activationErrorReason,
  } = useSelector(({ user }) => {
    return {
      signOutSuccess: user.signOutSuccess,
      signoutErrorReason: user.signoutErrorReason,
      signInSuccess: user.signInSuccess,
      signInErrorReason: user.signInErrorReason,
      signUpErrorReason: user.signUpErrorReason,
      isActivated: user.isActivated,
      activationErrorReason: user.activationErrorReason,
    };
  }, shallowEqual);

  useEffect(() => {
    if (signOutSuccess) {
      setTimeout(() => {
        dispatch({
          type: NULLIFY_SIGN_OUT,
        });
      }, 1000);
    }
    if (signInSuccess) {
      setTimeout(() => {
        dispatch({
          type: NULLIFY_SIGN_IN_SUCCESS,
        });
      }, 3000);
    }
  }, [signOutSuccess, signInSuccess]);

  return (
    <>
      {signInSuccess && (
        <Toaster
          message="You are signed in succesfully. Redirecting to the main page."
          type="success"
          whereTo="/"
        />
      )}
      {signInErrorReason && (
        <Toaster message={signInErrorReason} type="error" whereTo={false} />
      )}
      {signOutSuccess && (
        <Toaster
          message="You are signed out successfully"
          whereTo={false}
          type="success"
        />
      )}
      {signoutErrorReason && (
        <Toaster message={signoutErrorReason} whereTo={false} type="error" />
      )}
      {signUpErrorReason && (
        <Toaster message={signUpErrorReason} type="error" whereTo={false} />
      )}
      {isActivated && (
        <Toaster
          message={`Activation Success. Signin and enjoy STREAMERS! `}
          type="success"
          whereTo={"/signin"}
        />
      )}
      {activationErrorReason && (
        <Toaster message={activationErrorReason} type="error" whereTo={false} />
      )}
    </>
  );
};

export default Toasters;
