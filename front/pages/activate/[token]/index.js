import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { SIGN_UP_REQUEST } from "../../../reducers/user";
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

import { CustomButton1 } from "../../../components/CustomButtons";
import Copyright from "../../../components/Copyright";

import jwt from "jsonwebtoken";

import { ACTIVATION_REQUEST } from "../../../reducers/user";
export default function SignInSide() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { token } = router.query;

  //make sure only accessible when not logged in

  const classes = useStyles();
  /////////Logic //////////
  //get token, and move to signin page. toaster.
  // when submit, use redux again. just token. It is OK.
  //make some more components with memo.

  let { nickname, userId, password } = jwt.decode(token);
  // console.log(token);

  const activationLink = () => (
    <div className="text-center">
      <div className="p-5" style={{ height: "7rem", margin: "auto" }}>
        Hey <strong>{nickname}</strong>, are you ready to enjoy? Click the
        Activate button below to activate your account
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

  const { isActivated, isActivating, activationErrorReason } = useSelector(
    ({ user }) => {
      return {
        isActivated: user.isActivated,
        isActivating: user.isActivating,
        activationErrorReason: user.activationErrorReason
      };
    },
    shallowEqual
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
            Activate your STREAMERS account.
          </Typography>

          {/* {JSON.stringify(activationErrorReason)} */}
          <form className={classes.form} noValidate>
            {activationLink()}

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                border: "none"
              }}
            >
              <CustomButton1
                onClick={handleClick}
                // href={"#"}

                text="Click to activate your account!"
                size="1.4rem"
                // backgroundColor="yellow"
                color="#ff3300"
              />
            </div>

            {isActivated && (
              <Toaster
                message={`Activation Success. Enjoy STREAMERS! `}
                type="success"
                whereTo={false}
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
