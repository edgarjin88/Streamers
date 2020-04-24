import React, { useCallback, useState, useEffect } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import {
  EDIT_NICKNAME_REQUEST,
  START_EDIT_NICKNAME,
  LOAD_USER_REQUEST,
} from "../reducers/user";

import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { red } from "@material-ui/core/colors";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";

import {
  MemoEmail,
  MemoEditNickname,
  MemoPassword,
  MemoSubmitPasswordChange,
  MemoRichTextEditor,
} from "../containers/InputComponents";
import UploadProfile from "../containers/UploadProfile";

import moment from "moment";
import { useRouter } from "next/router";
moment.locale("en");

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: "30px",
    fontSize: "14px",
  },
  button: {
    margin: "5px",
    width: "auto",
  },
  media: {
    height: 0,
    margin: "0 1.7rem",
    paddingTop: "56.25%", // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    // marginLeft: "auto",

    transition: theme.transitions.create("transform", {
      duration: 200,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
    // float: "left",
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

export default function RecipeReviewCard() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const router = useRouter();
  const queryId = router.query.id;
  const [expanded, setExpanded] = React.useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  ///logic
  const {
    startedEditingNickname,
    startedEditingDescription,
    startedChangingPassword,
    followingList,
    followerList,
    hasMoreFollower,
    hasMoreFollowing,
    nickname,
    userId,
    description,
    profilePhoto,
    createdAt,
    id,
    // profilePhoto,
  } = useSelector((state) => state.user.userInfo);

  useEffect(() => {
    dispatch({
      type: LOAD_USER_REQUEST,
      data: router.query.id,
    });
  }, [id]);

  const { me } = useSelector(({ user }) => user);

  const profileOwner = me && me.id === id && id === parseInt(queryId, 10);
  // console.log("profileOwnser :", profileOwner);
  // console.log("me :", me);
  // console.log("id :", id);
  // console.log("queryId :", queryId);
  return (
    <Card className={classes.root}>
      <CardHeader
        titleTypographyProps={{ variant: "h5" }}
        avatar={
          <Avatar
            className={classes.avatar}
            src={
              process.env.NODE_ENV === "development"
                ? `http://localhost:3003/${profilePhoto}`
                : profilePhoto
            }
          >
            {!profilePhoto && nickname && nickname.slice(0, 1)}{" "}
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={nickname}
        subheader={`Joined on ${moment(createdAt).format("DD.MM.YYYY")}`}
      ></CardHeader>
      {/* Profile Image here */}
      <CardMedia
        className={classes.media}
        image={
          profilePhoto
            ? process.env.NODE_ENV === "development"
              ? `http://localhost:3003/${profilePhoto}`
              : profilePhoto
            : "../static/images/profiles/noimage.png"
        }
        title="Profile Image"
      />
      <CardContent>
        <hr />
        <h1>
          <strong>User Description</strong>
        </h1>
        <hr />
        <MemoRichTextEditor profileOwner={profileOwner} />
      </CardContent>
      <CardActions disableSpacing>
        {/* <hr /> */}
        {profileOwner && (
          <>
            <IconButton
              className={clsx(classes.expand, {
                [classes.expandOpen]: expanded,
              })}
              onClick={handleExpandClick}
              size="medium"
              style={{
                fontSize: "5rem",
                color: "#fff",
                backgroundColor: "#fda026",
              }}
              aria-expanded={expanded}
              aria-label="User Details"
            >
              <ExpandMoreIcon
                style={{
                  float: "left",
                  fontSize: "2rem",
                }}
              />
            </IconButton>
            <h1> &nbsp; User Details </h1>
            <hr />{" "}
          </>
        )}
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <MemoEmail profileUserId={userId} size="16px" labelSize="16px" />
          <MemoEditNickname
            profileNickname={nickname}
            disabled={!startedEditingNickname}
            size="16px"
            labelSize="16px"
          />
          <MemoPassword
            disabled={!startedChangingPassword}
            size="16px"
            labelSize="16px"
          />
          <MemoSubmitPasswordChange />
        </CardContent>
      </Collapse>
      {profileOwner && <UploadProfile />}
    </Card>
  );
}
