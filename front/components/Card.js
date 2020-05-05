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
import { URL } from "../config/config";

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
// import FollowButton from "../containers/FollowButton";
moment.locale("en");

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "95rem",
    marginTop: "30px",
    fontSize: "14px",
  },
  button: {
    margin: "5px",
    width: "auto",
  },
  media: {
    height: 0,
    margin: "0 1.7refm",
    paddingTop: "56.25%", // 16:9
  },
  expand: {
    transform: "rotate(0deg)",

    transition: theme.transitions.create("transform", {
      duration: 200,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
    float: "left",
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
  const [expanded, setExpanded] = useState(false);
  const [user, setUser] = useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const {
    startedEditingNickname,
    startedChangingPassword,
    profilePhoto,
    nickname,
    userId,
    id,
    createdAt,
    Followers,
  } = useSelector(({ user }) => {
    return {
      startedEditingNickname: user.startedEditingNickname,
      startedChangingPassword: user.startedChangingPassword,
      profilePhoto: user.userInfo.profilePhoto,
      nickname: user.userInfo.nickname,
      userId: user.userInfo.userId,
      id: user.userInfo.id,
      createdAt: user.userInfo.createdAt,
      Followers: user.userInfo.Followers,
    };
  });

  useEffect(() => {
    dispatch({
      type: LOAD_USER_REQUEST,
      data: router.query.id,
    });
  }, [id]);

  const { me } = useSelector(({ user }) => user);

  const profileOwner = me && me.id === id && id === parseInt(queryId, 10);
  return (
    <Card className={classes.root}>
      <CardHeader
        titleTypographyProps={{ variant: "h5" }}
        avatar={
          <Avatar
            className={classes.avatar}
            src={profilePhoto && `${URL}/${profilePhoto}`}
          >
            {!profilePhoto && nickname && nickname.slice(0, 1)}{" "}
          </Avatar>
        }
        action={<IconButton aria-label="settings"></IconButton>}
        title={nickname}
        subheader={
          <div>
            Joined on {moment(createdAt).format("DD.MM.YYYY")} <br />
            {Followers} Subscribers
          </div>
        }
      ></CardHeader>
      {/* Profile Image here */}
      <CardMedia
        className={classes.media}
        image={
          profilePhoto
            ? process.env.NODE_ENV === "development"
              ? `http://localhost:3003/${profilePhoto}`
              : profilePhoto
            : "/images/profiles/noimage.png"
        }
        title="Profile Image"
      />
      <CardContent>
        <hr />
        <h1
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
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
                  float: "right",
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
            profileNickname={nickname ? nickname : "Enter your Nickname"}
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
