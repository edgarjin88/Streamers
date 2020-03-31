import React, { useCallback, useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import {
  LOAD_FOLLOWERS_REQUEST,
  LOAD_FOLLOWINGS_REQUEST,
  REMOVE_FOLLOWER_REQUEST,
  UNFOLLOW_USER_REQUEST,
  EDIT_NICKNAME_REQUEST,
  START_EDIT_NICKNAME,
  START_CHANGE_PASSWORD,
  CHANGE_PASSWORD_REQUEST
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
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";

import TextField from "@material-ui/core/TextField";

import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import KeyboardVoiceIcon from "@material-ui/icons/KeyboardVoice";
import Icon from "@material-ui/core/Icon";
import SaveIcon from "@material-ui/icons/Save";
import {
  MemoEmail,
  MemoNickname,
  MemoPassword,
  MemoPasswordCheck,
  MemoTerm,
  MemoSignUp,
  MemoSubmitPasswordChange
} from "../containers/MemoForSign";

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: "600px",
    marginTop: "30px",
    fontSize: "14px"
  },
  button: {
    margin: "5px",
    width: "auto"
  },
  media: {
    height: 0,
    paddingTop: "56.25%" // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: "rotate(180deg)"
  },
  avatar: {
    backgroundColor: red[500]
  }
}));

export default function RecipeReviewCard() {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  // const [description, setDescription] = useState(dummyText);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  ///logic

  ///logic
  const dispatch = useDispatch();

  const {
    followingList,
    followerList,
    hasMoreFollower,
    hasMoreFollowing,
    startedEditingNickname,
    startedChangingPassword,
    me
  } = useSelector(state => state.user);
  const {
    nickname,
    userId,
    description,
    Followings,
    Followers,
    Posts
  } = useSelector(({ user }) => user.me);

  const { inputNickname } = useSelector(({ input }) => {
    return {
      inputNickname: input.nickname
    };
  }, shallowEqual);
  const { mainPosts } = useSelector(state => state.post);

  ///logic
  const handleEditNickname = useCallback(() => {
    dispatch({
      type: START_EDIT_NICKNAME,
      data: nickname
    });
  }, [nickname]);

  const handleSaveNickname = useCallback(() => {
    dispatch({
      type: EDIT_NICKNAME_REQUEST,
      data: inputNickname
    });
  }, [inputNickname]);

  // 111

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            R
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={nickname}
        subheader="September 14, 2016"
      />
      {/* Profile Image here */}
      <CardMedia
        className={classes.media}
        image="../static/images/videos/main-video.png"
        title="Paella dish"
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          This impressive paella is a perfect party dish and a fun meal to cook
          together with your guests. Add 1 cup of frozen peas along with the
          mussels, if you like.
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>
            <h1>{description}</h1>{" "}
          </Typography>
          {/* if edit button clicked */}
          user infos
          <TextField
            id="standard-multiline-static"
            label="Description"
            multiline
            defaultValue={description}
            InputProps={{
              style: { fontSize: "14px" }
            }}
            fullWidth
          />
          <MemoEmail profileUserId={userId} size="16px" labelSize="16px" />
          {/* <div style={{ display: "flex" }}> */}
          <MemoNickname
            profileNickname={nickname}
            disabled={!startedEditingNickname}
            size="16px"
            labelSize="16px"
          />
          <Button
            onClick={
              startedEditingNickname ? handleSaveNickname : handleEditNickname
            }
            variant="contained"
            color="primary"
            style={{ float: "right" }}
            className={classes.button}
            startIcon={<CloudUploadIcon />}
          >
            {startedEditingNickname ? "Save" : "Edit Nickname"}
          </Button>
          {/* </div> */}
          <MemoPassword
            disabled={!startedChangingPassword}
            size="16px"
            labelSize="16px"
          />
          <MemoSubmitPasswordChange />
        </CardContent>
      </Collapse>
      <div
        style={{
          display: "flex",
          margin: "16px 15px",
          justifyContent: "flex-end" // justifyItems: "center"
        }}
      >
        <Button
          variant="contained"
          color="default"
          className={classes.button}
          startIcon={<CloudUploadIcon />}
        >
          Upload Profile Image
        </Button>
        <Button
          variant="contained"
          color="secondary"
          className={classes.button}
          startIcon={<DeleteIcon />}
        >
          Cancel
        </Button>
        {/* This Button uses a Font Icon, see the installation instructions in the Icon component docs. */}

        <Button
          // onClick={handleUpdateProfile}
          variant="contained"
          color="primary"
          className={classes.button}
          startIcon={<SaveIcon />}
        >
          Save
        </Button>
        {/* {me && (
          <Toaster
            message="Password Updated Successfully"
            type="success"
            whereTo={false}
          />
        )}
      */}
      </div>
    </Card>
  );
}
