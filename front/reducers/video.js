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

export const LOAD_COMMENTS_REQUEST = "LOAD_COMMENTS_REQUEST";
export const LOAD_COMMENTS_SUCCESS = "LOAD_COMMENTS_SUCCESS";
export const LOAD_COMMENTS_FAILURE = "LOAD_COMMENTS_FAILURE";

export const RETWEET_REQUEST = "RETWEET_REQUEST";
export const RETWEET_SUCCESS = "RETWEET_SUCCESS";
export const RETWEET_FAILURE = "RETWEET_FAILURE";

export const REMOVE_VIDEO_REQUEST = "REMOVE_VIDEO_REQUEST";
export const REMOVE_VIDEO_SUCCESS = "REMOVE_VIDEO_SUCCESS";
export const REMOVE_VIDEO_FAILURE = "REMOVE_VIDEO_FAILURE";

export const EDIT_VIDEO_REQUEST = "EDIT_VIDEO_REQUEST";
export const EDIT_VIDEO_SUCCESS = "EDIT_VIDEO_SUCCESS";
export const EDIT_VIDEO_FAILURE = "EDIT_VIDEO_FAILURE";

export const LOAD_VIDEO_REQUEST = "LOAD_VIDEO_REQUEST";
export const LOAD_VIDEO_SUCCESS = "LOAD_VIDEO_SUCCESS";
export const LOAD_VIDEO_FAILURE = "LOAD_VIDEO_FAILURE";

export const EDIT_START_REQUEST = "EDIT_START_REQUEST";
export const FALSIFY_EDIT_VIDEO_COMPLETE = "FALSIFY_EDIT_VIDEO_COMPLETE";

import { UNFOLLOW_USER_SUCCESS, FOLLOW_USER_SUCCESS } from "./user";

export const initialState = {
  mainVideos: [],
  userVideos: [],
  hasMoreVideos: false,
  imagePaths: [],
  uploadedVideoImage: "",
  uploadVideoImageErrorReason: "",
  addVideoErrorReason: "",
  videoAdded: false,
  isLoading: false,
  currentVideo: null,
  loadCurrentVideoErrorReason: "",
  dislikeErrorReason: "",
};

// export const initialState = {
//   mainVideos: [],
//   imagePaths: [],
//   addPostErrorReason: "",
//   isAddingPost: false,
//   postAdded: false,
//   isAddingComment: false,
//   addCommentErrorReason: "",
//   commentAdded: false,
//   singlePost: null,
//   profilePhoto: null,
//   seledtedPost: null,
//   isEditingPost: false,
//   edittingPost: false,
//   editingPostErrorReason: "",
// };

export default (state = initialState, action) => {
  return produce(state, (draft) => {
    //draft is mutable state now.
    switch (action.type) {
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
