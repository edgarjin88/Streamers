import React, { useState } from "react";
import { useSelector, shallowEqual } from "react-redux";

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
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { red } from "@material-ui/core/colors";

import { URL } from "../config/config";
import {
  MemoEmail,
  MemoEditNickname,
  MemoPassword,
  MemoSubmitPasswordChange,
  MemoRichTextEditor,
} from "../containers/InputComponents";

import moment from "moment";
// import FollowButton from "../containers/FollowButton";
moment.locale("en");

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "95rem",
    marginTop: "3rem",
    fontSize: "1.4rem",
    marginBottom: "4rem",
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

const UserCard = ({ profileOwner }) => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
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
    myNickname,
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
      myNickname: user.me && user.me.nickname,
    };
  }, shallowEqual);

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
        title={profileOwner ? myNickname : nickname}
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
            ? `${URL}/${profilePhoto}`
            : "../static/images/profiles/noimage.png"
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
        <hr />
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
                marginBottom: "2rem",
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
      {/* {profileOwner && <UploadProfile />} */}
    </Card>
  );
};

export default UserCard;
