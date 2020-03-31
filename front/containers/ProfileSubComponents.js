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
import user, {
  SIGN_UP_REQUEST,
  SIGN_IN_REQUEST,
  PASSWORD_RESET_REQUEST,
  CONFIRM_PASSWORD_RESET_REQUEST
} from "../reducers/user";
import { StyledButton1 } from "../components/CustomButtons";


// export const MemoProfilUpdate = memo(function MemoProfilUpdate({ className }) {
//          const dispatch = useDispatch();
//          const { isLoading } = useSelector(state => state.user, shallowEqual);
//          const { nickname, nicknameError, password, passwordError } = useSelector(
//            ({ input }) => {
//              return {
//                nickname: user.nickname,
//                nicknameError:
//                password: input.password,
//                passwordError: input.passwordError
//              };
//            },
//            shallowEqual
//          );

//          const onSignIn = () => {
//            if (!emailError && !passwordError && email && password) {
//              return dispatch({
//                type: SIGN_IN_REQUEST,
//                data: {
//                  userId: email,
//                  password
//                }
//              });
//            }
//          };
//          return (
//            <>
//              <Button
//                fullWidth
//                variant="contained"
//                color="primary"
//                className={className}
//                onClick={onSignIn}
//              >
//                {isLoading && (
//                  <CircularProgress
//                    color="secondary"
//                    size={20}
//                    style={{ marginRight: "20px" }}
//                  />
//                )}
//                Sign In
//              </Button>
//            </>
//          );
//        });

// export const MemoSignUp = memo(function MemoSignUp({ className }) {
//   const dispatch = useDispatch();
//   const { isSigningUp, isSignedUp } = useSelector(
//     state => state.user,
//     shallowEqual
//   );
//   const {
//     email,
//     emailError,
//     nickname,
//     nicknameError,
//     password,
//     passwordCheck,
//     passwordCheckError,
//     passwordError,
//     term,
//     termError
//   } = useSelector(({ input }) => {
//     return {
//       email: input.email,
//       emailError: input.emailError,
//       nickname: input.nickname,
//       nicknameError: input.emailError,
//       password: input.password,
//       passwordError: input.passwordError,
//       passwordCheck: input.passwordCheck,
//       passwordCheckError: input.passwordCheckError,
//       term: input.term,
//       termError: input.termError
//     };
//   }, shallowEqual);

//   const onSignUp = () => {
//     if (
//       !emailError &&
//       !nicknameError &&
//       !passwordCheckError &&
//       !passwordError &&
//       !termError &&
//       nickname &&
//       email &&
//       password &&
//       passwordCheck &&
//       term
//     ) {
//       return dispatch({
//         type: SIGN_UP_REQUEST,
//         data: {
//           userId: email,
//           password,
//           nickname
//         }
//       });
//     }
//   };

//   return (
//     <>
//       <Button
//         fullWidth
//         variant="contained"
//         color="primary"
//         className={className}
//         onClick={onSignUp}
//       >
//         {isSigningUp && (
//           <CircularProgress
//             color="secondary"
//             size={20}
//             style={{ marginRight: "20px" }}
//           />
//         )}
//         Sign Up
//       </Button>
//     </>
//   );
// });
