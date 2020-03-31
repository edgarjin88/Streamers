import React, { useEffect, useState, useCallback } from "react";
import Router from "next/router";
import { useRouter } from "next/router";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import Avatar from "@material-ui/core/Avatar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";

import Typography from "@material-ui/core/Typography";
import Toaster from "../../../components/Toaster";
import { useStyles } from "../../../styles/SigniningStyle";
// to be moved to styling folder later.

import { StyledButton1 } from "../../../components/CustomButtons";
import Copyright from "../../../components/Copyright";

import jwt from "jsonwebtoken";
import LinearDeterminate from "../../../components/Progressbar";

import { ACTIVATION_REQUEST } from "../../../reducers/user";
export default function SignInSide() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { token } = router.query;

  //make sure only accessible when not logged in

  const classes = useStyles();
  /////////Logic //////////

  let { nickname, userId, password } = jwt.decode(token);
  const activationLink = () => (
    <div className="text-center">
      <div className="p-5" style={{ height: "7rem", margin: "auto" }}>
        Hey <strong>{nickname}</strong>, are you ready to enjoy? Click the
        Activation button below to activate your account
      </div>
    </div>
  );
  const handleClick = e => {
    e.preventDefault();
    console.log("data  !!!!!!!!!:", userId, password, nickname);
    dispatch({
      type: ACTIVATION_REQUEST,
      data: {
        token
      }
    });
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

  useEffect(() => {
    if (isActivated) {
      setTimeout(() => {
        Router.push("/signin");
      }, 6000);
    }
  }, [isActivated]);

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
            Activate your STREAMERS account.
          </Typography>

          <form className={classes.form} noValidate>
            {activationLink()}

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                border: "none"
              }}
            >
              <StyledButton1
                onClick={handleClick}
                size="1.4rem"
                color="#ff3300"
              >
                {isActivated
                  ? "Your account is activated!"
                  : "Click to activate your account!"}
              </StyledButton1>
            </div>
            {isActivated && <LinearDeterminate />}

            {isActivated && (
              <Toaster
                message={`Activation Success. Signin and enjoy STREAMERS! `}
                type="success"
                whereTo={"/signin"}
              />
            )}
            {activationErrorReason && (
              <Toaster
                message={activationErrorReason}
                type="error"
                whereTo={false}
              />
            )}
            <Box mt={5}>
              <Copyright text="Streamers" />
            </Box>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}
