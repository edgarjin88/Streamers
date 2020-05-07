import produce from "immer";

export const UPLOAD_VIDEO_IMAGE_REQUEST = "UPLOAD_VIDEO_IMAGE_REQUEST";
export const UPLOAD_VIDEO_IMAGE_FAILURE = "UPLOAD_VIDEO_IMAGE_FAILURE";
export const UPLOAD_VIDEO_IMAGE_SUCCESS = "UPLOAD_VIDEO_IMAGE_SUCCESS";

export const LOAD_MAIN_VIDEOS_REQUEST = "LOAD_MAIN_VIDEOS_REQUEST";
export const LOAD_MAIN_VIDEOS_SUCCESS = "LOAD_MAIN_VIDEOS_SUCCESS";
export const LOAD_MAIN_VIDEOS_FAILURE = "LOAD_MAIN_VIDEOS_FAILURE";

export const LOAD_HASHTAG_VIDEOS_REQUEST = "LOAD_HASHTAG_VIDEOS_REQUEST";
export const LOAD_HASHTAG_VIDEOS_SUCCESS = "LOAD_HASHTAG_VIDEOS_SUCCESS";
export const LOAD_HASHTAG_VIDEOS_FAILURE = "LOAD_HASHTAG_VIDEOS_FAILURE";

export const LOAD_USER_VIDEOS_REQUEST = "LOAD_USER_VIDEOS_REQUEST";
export const LOAD_USER_VIDEOS_SUCCESS = "LOAD_USER_VIDEOS_SUCCESS";
export const LOAD_USER_VIDEOS_FAILURE = "LOAD_USER_VIDEOS_FAILURE";

export const UPLOAD_IMAGES_REQUEST = "UPLOAD_IMAGES_REQUEST";
export const UPLOAD_IMAGES_SUCCESS = "UPLOAD_IMAGES_SUCCESS";
export const UPLOAD_IMAGES_FAILURE = "UPLOAD_IMAGES_FAILURE";

export const REMOVE_IMAGE = "REMOVE_IMAGE"; //

export const INCREASE_SUBSCRIPTION = "INCREASE_SUBSCRIPTION"; //
export const DECREASE_SUBSCRIPTION = "DECREASE_SUBSCRIPTION"; //

export const ADD_VIDEO_REQUEST = "ADD_VIDEO_REQUEST";
export const ADD_VIDEO_SUCCESS = "ADD_VIDEO_SUCCESS";
export const ADD_VIDEO_FAILURE = "ADD_VIDEO_FAILURE";
export const NULLIFY_VIDEO_ADDED = "NULLIFY_VIDEO_ADDED";

export const LIKE_COMMENT_REQUEST = "LIKE_COMMENT_REQUEST";
export const LIKE_COMMENT_SUCCESS = "LIKE_COMMENT_SUCCESS";
export const LIKE_COMMENT_FAILURE = "LIKE_COMMENT_FAILURE";

export const UNLIKE_COMMENT_REQUEST = "UNLIKE_COMMENT_REQUEST";
export const UNLIKE_COMMENT_SUCCESS = "UNLIKE_COMMENT_SUCCESS";
export const UNLIKE_COMMENT_FAILURE = "UNLIKE_COMMENT_FAILURE";

export const DISLIKE_COMMENT_REQUEST = "DISLIKE_COMMENT_REQUEST";
export const DISLIKE_COMMENT_SUCCESS = "DISLIKE_COMMENT_SUCCESS";
export const DISLIKE_COMMENT_FAILURE = "DISLIKE_COMMENT_FAILURE";

export const UNDISLIKE_COMMENT_REQUEST = "UNDISLIKE_COMMENT_REQUEST";
export const UNDISLIKE_COMMENT_SUCCESS = "UNDISLIKE_COMMENT_SUCCESS";
export const UNDISLIKE_COMMENT_FAILURE = "UNDISLIKE_COMMENT_FAILURE";

export const REMOVE_COMMENT_REQUEST = "REMOVE_COMMENT_REQUEST";
export const REMOVE_COMMENT_SUCCESS = "REMOVE_COMMENT_SUCCESS";
export const REMOVE_COMMENT_FAILURE = "REMOVE_COMMENT_FAILURE";

export const LIKE_VIDEO_REQUEST = "LIKE_VIDEO_REQUEST";
export const LIKE_VIDEO_SUCCESS = "LIKE_VIDEO_SUCCESS";
export const LIKE_VIDEO_FAILURE = "LIKE_VIDEO_FAILURE";

export const UNLIKE_VIDEO_REQUEST = "UNLIKE_VIDEO_REQUEST";
export const UNLIKE_VIDEO_SUCCESS = "UNLIKE_VIDEO_SUCCESS";
export const UNLIKE_VIDEO_FAILURE = "UNLIKE_VIDEO_FAILURE";

export const DISLIKE_VIDEO_REQUEST = "DISLIKE_VIDEO_REQUEST";
export const DISLIKE_VIDEO_SUCCESS = "DISLIKE_VIDEO_SUCCESS";
export const DISLIKE_VIDEO_FAILURE = "DISLIKE_VIDEO_FAILURE";

export const UNDISLIKE_VIDEO_REQUEST = "UNDISLIKE_VIDEO_REQUEST";
export const UNDISLIKE_VIDEO_SUCCESS = "UNDISLIKE_VIDEO_SUCCESS";
export const UNDISLIKE_VIDEO_FAILURE = "UNDISLIKE_VIDEO_FAILURE";

export const ADD_COMMENT_REQUEST = "ADD_COMMENT_REQUEST";
export const ADD_COMMENT_SUCCESS = "ADD_COMMENT_SUCCESS";
export const ADD_COMMENT_FAILURE = "ADD_COMMENT_FAILURE";

export const ADD_REPLY_TO_COMMENT_REQUEST = "ADD_REPLY_TO_COMMENT_REQUEST";
export const ADD_REPLY_TO_COMMENT_SUCCESS = "ADD_REPLY_TO_COMMENT_SUCCESS";
export const ADD_REPLY_TO_COMMENT_FAILURE = "ADD_REPLY_TO_COMMENT_FAILURE";

export const LOAD_COMMENTS_REQUEST = "LOAD_COMMENTS_REQUEST";
export const LOAD_COMMENTS_SUCCESS = "LOAD_COMMENTS_SUCCESS";
export const LOAD_COMMENTS_FAILURE = "LOAD_COMMENTS_FAILURE";

export const SET_CURRENT_COMMENT_ID = "SET_CURRENT_COMMENT_ID";

export const RETWEET_REQUEST = "RETWEET_REQUEST";
export const RETWEET_SUCCESS = "RETWEET_SUCCESS";
export const RETWEET_FAILURE = "RETWEET_FAILURE";

export const LOAD_VIDEO_REQUEST = "LOAD_VIDEO_REQUEST";
export const LOAD_VIDEO_SUCCESS = "LOAD_VIDEO_SUCCESS";
export const LOAD_VIDEO_FAILURE = "LOAD_VIDEO_FAILURE";

export const EDIT_START_REQUEST = "EDIT_START_REQUEST";

export const FALSIFY_EDIT_VIDEO_COMPLETE = "FALSIFY_EDIT_VIDEO_COMPLETE";

export const INIT_EDIT_VIDEO_REQUEST = "INIT_EDIT_VIDEO_REQUEST";
export const STOP_EDIT_VIDEO_REQUEST = "STOP_EDIT_VIDEO_REQUEST";
export const NULLIFY_EDIT_VIDEO_SUCCESS = "NULLIFY_EDIT_VIDEO_SUCCESS";
export const EDIT_VIDEO_REQUEST = "EDIT_VIDEO_REQUEST";
export const EDIT_VIDEO_SUCCESS = "EDIT_VIDEO_SUCCESS";
export const EDIT_VIDEO_FAILURE = "EDIT_VIDEO_FAILURE";

export const INIT_REMOVE_VIDEO_REQUEST = "INIT_REMOVE_VIDEO_REQUEST";
export const STOP_REMOVE_VIDEO_REQUEST = "STOP_REMOVE_VIDEO_REQUEST";
export const NULLIFY_REMOVE_VIDEO_SUCCESS = "NULLIFY_REMOVE_VIDEO_SUCCESS";

export const REMOVE_VIDEO_REQUEST = "REMOVE_VIDEO_REQUEST";
export const REMOVE_VIDEO_SUCCESS = "REMOVE_VIDEO_SUCCESS";
export const REMOVE_VIDEO_FAILURE = "REMOVE_VIDEO_FAILURE";

export const TOGGLE_REPLY_COMMENT_FORM = "TOGGLE_REPLY_COMMENT_FORM";
export const EMPTY_CHAT_MESSAGE_LIST = "EMPTY_CHAT_MESSAGE_LIST";
export const UPDATE_CHAT_MESSAGE_LIST = "UPDATE_CHAT_MESSAGE_LIST";

export const SEND_CHAT_MESSAGE = "SEND_CHAT_MESSAGE";

export const NULLIFY_SEND_CHAT_MESSAGE = "NULLIFY_SEND_CHAT_MESSAGE";

import { UNFOLLOW_USER_SUCCESS, FOLLOW_USER_SUCCESS } from "./user";

export const START_STREAMING_REQUEST = "START_STREAMING_REQUEST";
export const START_STREAMING_FAILURE = "START_STREAMING_FAILURE";
export const START_STREAMING_SUCCESS = "START_STREAMING_SUCCESS";
export const STOP_STREAMING_REQUEST = "STOP_STREAMING_REQUEST";
export const STOP_STREAMING_FAILURE = "STOP_STREAMING_FAILURE";
export const STOP_STREAMING_SUCCESS = "STOP_STREAMING_SUCCESS";

export const initialState = {
  currentCommentId: null,
  mainVideos: [],
  userVideos: [],
  hasMoreVideos: false,
  imagePaths: [],
  uploadedVideoImage: "",
  uploadVideoImageErrorReason: "",
  addVideoErrorReason: "",
  videoAdded: false,
  isLoading: false,
  currentVideo: {},
  currentVideoComments: [],
  loadCurrentVideoErrorReason: "",
  dislikeErrorReason: "",
  initEditVideo: false,
  editVideoSuccess: false,
  editVideoErrorReason: "",

  initRemoveVideo: false,
  removeVideoSuccess: false,
  removeVideoErrorReason: "",

  //  isAddingComment: false,
  addCommentErrorReason: "",
  commentAdded: false,
  //reply to comment
  commentToReply: null,

  //Chat message in video
  messageList: [],

  //chat message end
  sendChatMessage: true,
  streamingOn: false,
};

export default (state = initialState, action) => {
  return produce(state, (draft) => {
    //draft is mutable state now.
    switch (action.type) {
      case STOP_STREAMING_REQUEST: {
        draft.streamingOn = false;
        break;
      }
      case START_STREAMING_REQUEST: {
        draft.streamingOn = true;
        break;
      }

      case SEND_CHAT_MESSAGE: {
        draft.sendChatMessage = true;
        break;
      }
      case NULLIFY_SEND_CHAT_MESSAGE: {
        draft.sendChatMessage = false;
        break;
      }

      case EMPTY_CHAT_MESSAGE_LIST: {
        draft.messageList = [];

        break;
      }

      case UPDATE_CHAT_MESSAGE_LIST: {
        draft.messageList.unshift(action.data);
        break;
      }
      case ADD_REPLY_TO_COMMENT_SUCCESS: {
        // const index = draft.commentToReply
        const index = draft.currentVideoComments.findIndex((eachComment) => {
          return eachComment.id === draft.commentToReply;
        });
        if (index !== -1) {
          draft.currentVideoComments[index].Recomment.unshift(
            action.data.comment
          );
          draft.isLoading = false;
          draft.commentAdded = true;
          break;
        }
        break;
      }

      case TOGGLE_REPLY_COMMENT_FORM: {
        if (draft.commentToReply === action.data) {
          draft.commentToReply = null;
          break;
        }
        draft.commentToReply = action.data;
        break;
      }

      case REMOVE_COMMENT_REQUEST: {
        draft.isLoading = true;
        break;
      }
      case REMOVE_COMMENT_SUCCESS: {
        if (action.data.refCommentId) {
          const refIndex = draft.currentVideoComments.findIndex(
            (v) => v.id === action.data.refCommentId
          );
          console.log("action.data.refCommentId :", action.data.refCommentId);
          console.log("commentId :", action.data.id);
          console.log("refIndex :", refIndex);
          console.log(
            "draft.currentVideoComments.refIndex.Recomment1 :",
            draft.currentVideoComments[refIndex].Recomment[1]
          );
          const recommentIndex = draft.currentVideoComments[
            refIndex
          ].Recomment.findIndex((v) => {
            console.log("inside v:", v);
            return v.id === action.data.id;
          });

          console.log("recommentIndex :", recommentIndex);

          draft.currentVideoComments[refIndex].Recomment.splice(
            recommentIndex,
            1
          );

          break;
        }

        console.log("remove action:", action);
        const index = draft.currentVideoComments.findIndex(
          (v) => v.id === action.data.id
        );
        draft.currentVideoComments.splice(index, 1);
        draft.isLoading = false;

        break;
      }
      case REMOVE_COMMENT_FAILURE: {
        draft.isLoading = false;
        break;
      }

      case UNDISLIKE_COMMENT_REQUEST: {
        break;
      }
      case UNDISLIKE_COMMENT_SUCCESS: {
        if (action.data.refCommentId) {
          const refIndex = draft.currentVideoComments.findIndex(
            (v) => v.id === action.data.refCommentId
          );
          const recommentIndex = draft.currentVideoComments[
            refIndex
          ].Recomment.findIndex((v) => v.id === action.data.commentId);

          const userIndex = draft.currentVideoComments[refIndex].Recomment[
            recommentIndex
          ].CommentDislikers.findIndex((v) => v.id === action.data.userInfo.id);

          draft.currentVideoComments[refIndex].Recomment[
            recommentIndex
          ].CommentDislikers.splice(userIndex, 1);
          break;
        }
        const index = draft.currentVideoComments.findIndex(
          (v) => v.id === action.data.commentId
        );
        const userIndex = draft.currentVideoComments[
          index
        ].CommentDislikers.findIndex((v) => v.id === action.data.userInfo.id);
        draft.currentVideoComments[index].CommentDislikers.splice(userIndex, 1);
        break;
      }

      case UNDISLIKE_COMMENT_FAILURE: {
        break;
      }
      case DISLIKE_COMMENT_REQUEST: {
        break;
      }

      case DISLIKE_COMMENT_SUCCESS: {
        if (action.data.refCommentId) {
          const refIndex = draft.currentVideoComments.findIndex(
            (v) => v.id === action.data.refCommentId
          );
          const recommentIndex = draft.currentVideoComments[
            refIndex
          ].Recomment.findIndex((v) => v.id === action.data.commentId);

          draft.currentVideoComments[refIndex].Recomment[
            recommentIndex
          ].CommentDislikers.push(action.data.userInfo);
          break;
        }

        const index = draft.currentVideoComments.findIndex(
          (v) => v.id === action.data.commentId
        );
        draft.currentVideoComments[index].CommentDislikers.push(
          action.data.userInfo
        );
        break;
      }
      case DISLIKE_COMMENT_FAILURE: {
        break;
      }

      case UNLIKE_COMMENT_REQUEST: {
        break;
      }
      case UNLIKE_COMMENT_SUCCESS: {
        if (action.data.refCommentId) {
          const refIndex = draft.currentVideoComments.findIndex(
            (v) => v.id === action.data.refCommentId
          );
          const recommentIndex = draft.currentVideoComments[
            refIndex
          ].Recomment.findIndex((v) => v.id === action.data.commentId);

          const userIndex = draft.currentVideoComments[refIndex].Recomment[
            recommentIndex
          ].CommentLikers.findIndex((v) => v.id === action.data.userInfo.id);

          draft.currentVideoComments[refIndex].Recomment[
            recommentIndex
          ].CommentLikers.splice(userIndex, 1);
          break;
        }

        const index = draft.currentVideoComments.findIndex(
          (v) => v.id === action.data.commentId
        );

        const userIndex = draft.currentVideoComments[
          index
        ].CommentLikers.findIndex((v) => v.id === action.data.userInfo.id);

        draft.currentVideoComments[index].CommentLikers.splice(userIndex, 1);
        break;
        // 여기서 인덱스는 comment index스기 때문에 안 먹는다.
      }
      case UNLIKE_COMMENT_FAILURE: {
        break;
      }

      case LIKE_COMMENT_REQUEST: {
        break;
      }

      case LIKE_COMMENT_SUCCESS: {
        if (action.data.refCommentId) {
          const refIndex = draft.currentVideoComments.findIndex(
            (v) => v.id === action.data.refCommentId
          );
          const recommentIndex = draft.currentVideoComments[
            refIndex
          ].Recomment.findIndex((v) => v.id === action.data.commentId);

          draft.currentVideoComments[refIndex].Recomment[
            recommentIndex
          ].CommentLikers.push(action.data.userInfo);
          break;
        }

        const index = draft.currentVideoComments.findIndex(
          (v) => v.id === action.data.commentId
        );
        draft.currentVideoComments[index].CommentLikers.push(
          action.data.userInfo
        );
        break;
      }
      case LIKE_COMMENT_FAILURE: {
        break;
      }
      case LOAD_COMMENTS_SUCCESS: {
        draft.currentVideoComments = action.data.comments;
        break;
      }
      case ADD_COMMENT_REQUEST: {
        draft.isLoading = true;
        draft.addCommentErrorReason = "";
        draft.commentAdded = false;
        break;
      }
      case ADD_COMMENT_SUCCESS: {
        draft.currentVideoComments.unshift(action.data.comment);
        draft.isLoading = false;
        draft.commentAdded = true;
        break;
      }
      case ADD_COMMENT_FAILURE: {
        draft.isLoading = false;
        draft.addCommentErrorReason = action.error;
        break;
      }

      case REMOVE_VIDEO_REQUEST: {
        draft.isLoading = true;
        draft.removeVideoErrorReason = "";
        draft.removeVideoSuccess = false;
        break;
      }
      case REMOVE_VIDEO_SUCCESS: {
        const index = draft.mainVideos.findIndex((v) => v.id === action.data);
        draft.mainVideos.splice(index, 1);

        draft.isLoading = false;
        draft.removeVideoSuccess = true;
        draft.uploadedVideoImage = ""; // to empty the image path
        draft.initRemoveVideo = false;
        break;
      }
      case REMOVE_VIDEO_FAILURE: {
        draft.isLoading = false;
        draft.removeVideoSuccess = false;
        draft.removeVideoErrorReason = action.error;
        break;
      }

      case NULLIFY_REMOVE_VIDEO_SUCCESS: {
        draft.isLoading = false;
        draft.removeVideoSuccess = false;
        break;
      }
      case STOP_REMOVE_VIDEO_REQUEST: {
        draft.initRemoveVideo = false;
        draft.uploadedVideoImage = "";
        break;
      }
      case INIT_REMOVE_VIDEO_REQUEST: {
        draft.initRemoveVideo = true;
        draft.isLoading = false;
        break;
      }

      //
      //
      //
      case EDIT_VIDEO_REQUEST: {
        draft.isLoading = true;
        draft.editVideoErrorReason = "";
        draft.editVideoSuccess = false;
        break;
      }
      case EDIT_VIDEO_SUCCESS: {
        const index = draft.mainVideos.findIndex(
          (v) => v.id === action.data.id
        );
        draft.mainVideos.splice(index, 1, action.data);
        draft.isLoading = false;

        draft.editVideoSuccess = true;
        draft.uploadedVideoImage = ""; // to empty the image path
        draft.initEditVideo = false;
        break;
      }
      case EDIT_VIDEO_FAILURE: {
        draft.isLoading = false;
        draft.editVideoSuccess = false;
        draft.editVideoErrorReason = action.error;
        break;
      }

      case NULLIFY_EDIT_VIDEO_SUCCESS: {
        draft.isLoading = false;
        draft.editVideoSuccess = false;
        break;
      }
      case STOP_EDIT_VIDEO_REQUEST: {
        draft.initEditVideo = false;
        draft.uploadedVideoImage = "";
        break;
      }
      case INIT_EDIT_VIDEO_REQUEST: {
        draft.initEditVideo = true;

        break;
      }

      case LOAD_USER_VIDEOS_REQUEST: {
        draft.userVideos = !action.lastId ? [] : draft.userVideos;

        draft.hasMoreVideos = action.lastId ? draft.hasMoreVideos : true;

        break;
      }
      case LOAD_USER_VIDEOS_SUCCESS: {
        action.data.forEach((d) => {
          draft.userVideos.push(d);
        });
        draft.hasMoreVideos = action.data.length === 10;
        break;
      }
      case LOAD_USER_VIDEOS_FAILURE: {
        break;
      }

      case INCREASE_SUBSCRIPTION: {
        draft.currentVideo.User.Followers.unshift(action.data);

        break;
      }
      case DECREASE_SUBSCRIPTION: {
        const userIndex = draft.currentVideo.User.Followers.findIndex(
          (v) => v.id === action.data
        );
        draft.currentVideo.User.Followers.splice(userIndex, 1);

        break;
      }

      case UNDISLIKE_VIDEO_REQUEST: {
        break;
      }
      case UNDISLIKE_VIDEO_SUCCESS: {
        const disLikeIndex = draft.currentVideo.Dislikers.findIndex(
          (v) => v.id === action.data.userId
        );
        draft.currentVideo.Dislikers.splice(disLikeIndex, 1);
        break;
      }
      case UNDISLIKE_VIDEO_FAILURE: {
        break;
      }

      case DISLIKE_VIDEO_REQUEST: {
        break;
      }
      case DISLIKE_VIDEO_SUCCESS: {
        draft.currentVideo.Dislikers.unshift({ id: action.data.userId });
        break;
      }
      case DISLIKE_VIDEO_FAILURE: {
        draft.dislikeErrorReason = action.error;
        break;
      }

      case UNLIKE_VIDEO_REQUEST: {
        break;
      }
      case UNLIKE_VIDEO_SUCCESS: {
        const likeIndex = draft.currentVideo.Likers.findIndex(
          (v) => v.id === action.data.userId
        );
        draft.currentVideo.Likers.splice(likeIndex, 1);
        break;
      }
      case UNLIKE_VIDEO_FAILURE: {
        break;
      }

      case LIKE_VIDEO_REQUEST: {
        break;
      }
      case LIKE_VIDEO_SUCCESS: {
        draft.currentVideo.Likers.unshift({ id: action.data.userId });
        break;
      }
      case LIKE_VIDEO_FAILURE: {
        break;
      }
      case LOAD_VIDEO_REQUEST: {
        draft.isLoading = true;
        // draft.currentVideo = null;
        break;
      }
      case LOAD_VIDEO_SUCCESS: {
        draft.currentVideo = action.data;

        break;
      }
      case LOAD_VIDEO_FAILURE: {
        draft.loadCurrentVideoErrorReason = action.error;
        draft.currentVideo = action.data;
        break;
      }
      case LOAD_MAIN_VIDEOS_REQUEST: {
        draft.mainVideos = !action.lastId ? [] : draft.mainVideos;

        draft.hasMorePost = action.lastId ? draft.hasMorePost : true;

        break;
      }
      case LOAD_MAIN_VIDEOS_SUCCESS: {
        action.data.forEach((d) => {
          draft.mainVideos.push(d);
        });
        draft.hasMorePost = action.data.length === 10;
        break;
      }
      case LOAD_MAIN_VIDEOS_FAILURE: {
        break;
      }
      case NULLIFY_VIDEO_ADDED: {
        draft.isLoading = false;
        draft.addVideoErrorReason = "";
        draft.videoAdded = false;
        break;
      }
      case ADD_VIDEO_REQUEST: {
        draft.isLoading = true;
        draft.addVideoErrorReason = "";
        draft.videoAdded = false;
        break;
      }
      case ADD_VIDEO_SUCCESS: {
        draft.isLoading = false;
        draft.mainVideos.unshift(action.data);
        draft.videoAdded = true;
        draft.uploadedVideoImage = ""; // to empty the image path
        break;
      }
      case ADD_VIDEO_FAILURE: {
        draft.isLoading = false;
        draft.addVideoErrorReason = action.error;
        break;
      }

      case UPLOAD_VIDEO_IMAGE_REQUEST: {
        draft.isLoading = true;
        draft.uploadVideoImageErrorReason = "";
        break;
      }
      case UPLOAD_VIDEO_IMAGE_SUCCESS: {
        draft.uploadedVideoImage = action.data;
        draft.isLoading = false;
        draft.uploadVideoImageErrorReason = "";

        break;
      }
      case UPLOAD_VIDEO_IMAGE_FAILURE: {
        draft.uploadedVideoImage = "";

        draft.isLoading = false;
        draft.uploadVideoImageErrorReason = action.error;
        break;
      }

      default: {
        break;
      }
    }
  });
};
