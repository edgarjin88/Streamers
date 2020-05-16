import produce from "immer";

export const initialState = {
  signInErrorReason: "",
  isSignedUp: false,
  signInSuccess: false,
  signUpErrorReason: "",
  signOutSuccess: false,
  signOutErrorReason: "",
  me: null,
  followingList: [],
  followerList: [],
  userInfo: "dummy user",
  isEditingNickname: false,
  editNicknameErrorReason: "",
  editNicknameSuccess: false,
  isUpdatingProfile: false,
  updateProfileErrorReason: "",
  hasMoreFollower: false,
  hasMoreFollowing: false,
  isActivated: false,
  resetPasswordSuccess: false,
  resetPasswordErrorReason: "",
  activationErrorReason: "",
  confirmPasswordReset: false,
  confirmPasswordResetErrorReason: "",
  isLoading: false,
  startedEditingNickname: false,
  startedChangingPassword: false,
  changePasswordSuccess: false,
  changePasswordErrorReason: "",
  startedEditingDescription: false,
  editDescriptionSuccess: false,
  editDescriptionErrorReason: "",
  deleteNotificationErrorReason: "",
  notificationList: [],
  notificationCount: 0,
  // profilePhoto: null,
};

export const NULLIFY_CHANGE_PASSWORD_SUCCESS =
  "NULLIFY_CHANGE_PASSWORD_SUCCESS";
export const NULLIFY_EDIT_NICKNAME_SUCCESS = "NULLIFY_CHANGE_PASSWORD_SUCCESS";

export const NULLIFY_SIGN_OUT = "NULLIFY_SIGN_OUT";
export const NULLIFY_SIGN_IN_SUCCESS = "NULLIFY_SIGN_IN_SUCCESS";

export const UPLOAD_PROFILE_REQUEST = "UPLOAD_PROFILE_REQUEST";
export const UPLOAD_PROFILE_FAILURE = "UPLOAD_PROFILE_FAILURE";
export const UPLOAD_PROFILE_SUCCESS = "UPLOAD_PROFILE_SUCCESS";

export const START_CHANGE_PASSWORD = "START_CHANGE_PASSWORD";
export const CHANGE_PASSWORD_REQUEST = "CHANGE_PASSWORD_REQUEST";
export const CHANGE_PASSWORD_FAILURE = "CHANGE_PASSWORD_FAILURE";
export const CHANGE_PASSWORD_SUCCESS = "CHANGE_PASSWORD_SUCCESS";

export const NULLIFY_EDIT_DESCRIPTION_SUCCESS =
  "NULLIFY_EDIT_DESCRIPTION_SUCCESS";
export const EDIT_DESCRIPTION_REQUEST = "EDIT_DESCRIPTION_REQUEST";
export const EDIT_DESCRIPTION_FAILURE = "EDIT_DESCRIPTION_FAILURE";
export const EDIT_DESCRIPTION_SUCCESS = "EDIT_DESCRIPTION_SUCCESS";

export const START_EDIT_NICKNAME = "START_EDIT_NICKNAME";
export const START_EDIT_DESCRIPTION = "START_EDIT_DESCRIPTION";

export const SIGN_UP_REQUEST = "SIGN_UP_REQUEST";
export const SIGN_UP_SUCCESS = "SIGN_UP_SUCCESS";
export const SIGN_UP_FAILURE = "SIGN_UP_FAILURE";

export const SIGN_IN_REQUEST = "SIGN_IN_REQUEST";
export const SIGN_IN_SUCCESS = "SIGN_IN_SUCCESS";
export const SIGN_IN_FAILURE = "SIGN_IN_FAILURE";

export const LOAD_USER_REQUEST = "LOAD_USER_REQUEST";
export const LOAD_USER_SUCCESS = "LOAD_USER_SUCCESS";
export const LOAD_USER_FAILURE = "LOAD_USER_FAILURE";

export const SIGN_OUT_REQUEST = "SIGN_OUT_REQUEST";
export const SIGN_OUT_SUCCESS = "SIGN_OUT_SUCCESS";
export const SIGN_OUT_FAILURE = "SIGN_OUT_FAILURE";

export const LOAD_FOLLOWERS_REQUEST = "LOAD_FOLLOWERS_REQUEST";
export const LOAD_FOLLOWERS_SUCCESS = "LOAD_FOLLOWERS_SUCCESS";
export const LOAD_FOLLOWERS_FAILURE = "LOAD_FOLLOWERS_FAILURE";

export const LOAD_FOLLOWINGS_REQUEST = "LOAD_FOLLOWINGS_REQUEST";
export const LOAD_FOLLOWINGS_SUCCESS = "LOAD_FOLLOWINGS_SUCCESS";
export const LOAD_FOLLOWINGS_FAILURE = "LOAD_FOLLOWINGS_FAILURE";

export const FOLLOW_USER_REQUEST = "FOLLOW_USER_REQUEST";
export const FOLLOW_USER_SUCCESS = "FOLLOW_USER_SUCCESS";
export const FOLLOW_USER_FAILURE = "FOLLOW_USER_FAILURE";

export const UNFOLLOW_USER_REQUEST = "UNFOLLOW_USER_REQUEST";
export const UNFOLLOW_USER_SUCCESS = "UNFOLLOW_USER_SUCCESS";
export const UNFOLLOW_USER_FAILURE = "UNFOLLOW_USER_FAILURE";

export const REMOVE_FOLLOWER_REQUEST = "REMOVE_FOLLOWER_REQUEST";
export const REMOVE_FOLLOWER_SUCCESS = "REMOVE_FOLLOWER_SUCCESS";
export const REMOVE_FOLLOWER_FAILURE = "REMOVE_FOLLOWER_FAILURE";

export const EDIT_NICKNAME_REQUEST = "EDIT_NICKNAME_REQUEST";
export const EDIT_NICKNAME_SUCCESS = "EDIT_NICKNAME_SUCCESS";
export const EDIT_NICKNAME_FAILURE = "EDIT_NICKNAME_FAILURE";

export const ADD_VIDEO_TO_ME = "ADD_VIDEO_TO_ME";
export const REMOVE_VIDEO_FROM_ME = "REMOVE_VIDEO_FROM_ME";

export const ADD_POST_TO_ME = "ADD_POST_TO_ME";
export const REMOVE_POST_OF_ME = "REMOVE_POST_OF_ME";
export const ACTIVATION_REQUEST = "ACTIVATION_REQUEST";
export const ACTIVATION_SUCCESS = "ACTIVATION_SUCCESS";
export const ACTIVATION_FAILURE = "ACTIVATION_FAILURE";

export const PASSWORD_RESET_REQUEST = "PASSWORD_RESET_REQUEST";
export const PASSWORD_RESET_FAILURE = "PASSWORD_RESET_FAILURE";
export const PASSWORD_RESET_SUCCESS = "PASSWORD_RESET_SUCCESS";

export const CONFIRM_PASSWORD_RESET_REQUEST = "CONFIRM_PASSWORD_RESET_REQUEST";
export const CONFIRM_PASSWORD_RESET_FAILURE = "CONFIRM_PASSWORD_RESET_FAILURE";
export const CONFIRM_PASSWORD_RESET_SUCCESS = "CONFIRM_PASSWORD_RESET_SUCCESS";

export const UPDATE_PROFILE_REQUEST = "UPDATE_PROFILE_REQUEST";
export const UPDATE_PROFILE_FAILURE = "UPDATE_PROFILE_FAILURE";
export const UPDATE_PROFILE_SUCCESS = "UPDATE_PROFILE_SUCCESS";

export const OAUTH_SIGN_IN_REQUEST = "OAUTH_SIGN_IN_REQUEST";
export const OAUTH_SIGN_IN_SUCCESS = "OAUTH_SIGN_IN_SUCCESS";
export const OAUTH_SIGN_IN_FAILURE = "OAUTH_SIGN_IN_FAILURE";

export const UPDATE_NOTIFICATION = "UPDATE_NOTIFICATION";

export const DELETE_NOTIFICATION_REQUEST = "DELETE_NOTIFICATION_REQUEST";
export const DELETE_NOTIFICATION_SUCCESS = "DELETE_NOTIFICATION_SUCCESS";
export const DELETE_NOTIFICATION_FAILURE = "DELETE_NOTIFICATION_FAILURE";

export const DELETE_SINGLE_NOTIFICATION_REQUEST =
  "DELETE_SINGLE_NOTIFICATION_REQUEST";
export const DELETE_SINGLE_NOTIFICATION_SUCCESS =
  "DELETE_SINGLE_NOTIFICATION_SUCCESS";
export const DELETE_SINGLE_NOTIFICATION_FAILURE =
  "DELETE_SINGLE_NOTIFICATION_FAILURE";

export default (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case DELETE_SINGLE_NOTIFICATION_REQUEST: {
        break;
      }
      case DELETE_SINGLE_NOTIFICATION_SUCCESS: {
        const index = draft.notificationList.findIndex(
          (v) => v.id === action.data
        );

        draft.notificationList.splice(index, 1);
        break;
      }
      case DELETE_SINGLE_NOTIFICATION_FAILURE: {
        break;
      }

      case DELETE_NOTIFICATION_REQUEST: {
        break;
      }
      case DELETE_NOTIFICATION_SUCCESS: {
        draft.notificationList = action.data.reverse();
        draft.notificationCount = 0;
        break;
      }
      case DELETE_NOTIFICATION_FAILURE: {
        draft.deleteNotificationErrorReason = action.error;
        break;
      }

      case UPDATE_NOTIFICATION: {
        draft.notificationCount++;
        break; //
      }

      case UPLOAD_PROFILE_REQUEST: {
        break; //
      }
      case UPLOAD_PROFILE_SUCCESS: {
        draft.me.profilePhoto = action.data;
        draft.userInfo.profilePhoto = action.data;

        break;
      }
      case UPLOAD_PROFILE_FAILURE: {
        break;
      }

      case NULLIFY_EDIT_DESCRIPTION_SUCCESS: {
        draft.startedEditingDescription = false;
        draft.editDescriptionErrorReason = "";
        draft.editDescriptionSuccess = false;
        // draft.nickname = action.data;
        break;
      }
      case START_EDIT_DESCRIPTION: {
        draft.startedEditingDescription = true;
        draft.editDescriptionErrorReason = "";
        draft.editDescriptionSuccess = false;

        // draft.nickname = action.data;
        break;
      }
      case EDIT_DESCRIPTION_REQUEST: {
        draft.startedEditingDescription = true;
        draft.editDescriptionErrorReason = "";
        draft.editDescriptionSuccess = false;

        break;
      }
      case EDIT_DESCRIPTION_SUCCESS: {
        draft.startedEditingDescription = false;
        draft.editDescriptionErrorReason = "";
        draft.editDescriptionSuccess = true;
        draft.me.description = action.data;

        break;
      }
      case EDIT_DESCRIPTION_FAILURE: {
        draft.startedEditingDescription = false;
        draft.changePasswordSuccess = false;
        draft.changePasswordErrorReason = action.error;
        break;
      }

      case NULLIFY_CHANGE_PASSWORD_SUCCESS: {
        draft.startedChangingPassword = false;
        draft.changePasswordSuccess = false;
        // draft.nickname = action.data;
        break;
      }
      case START_CHANGE_PASSWORD: {
        draft.startedChangingPassword = true;
        draft.changePasswordSuccess = false;
        // draft.nickname = action.data;
        break;
      }
      case CHANGE_PASSWORD_REQUEST: {
        draft.startedChangingPassword = true;
        draft.changePasswordErrorReason = "";
        draft.changePasswordSuccess = false;

        break;
      }
      case CHANGE_PASSWORD_SUCCESS: {
        draft.startedChangingPassword = false;
        draft.changePasswordErrorReason = "";
        draft.changePasswordSuccess = true;

        break;
      }
      case CHANGE_PASSWORD_FAILURE: {
        draft.startedChangingPassword = false;
        draft.changePasswordSuccess = false;

        draft.changePasswordErrorReason = action.error;
        break;
      }

      case START_EDIT_NICKNAME: {
        draft.startedEditingNickname = true;
        // draft.nickname = action.data;
        break;
      }
      case OAUTH_SIGN_IN_REQUEST: {
        draft.isLoading = true;
        draft.signInErrorReason = "";
        draft.signInSuccess = false;

        break;
      }
      case OAUTH_SIGN_IN_SUCCESS: {
        draft.isLoading = false;
        draft.signOutSuccess = false;
        draft.signInErrorReason = "";
        draft.signInSuccess = true;
        draft.me = action.data;
        draft.notificationCount = action.data.notification;
        break;
      }
      case OAUTH_SIGN_IN_FAILURE: {
        draft.isLoading = false;
        draft.signInErrorReason = action.reason;
        draft.signInSuccess = false;

        draft.me = null;
        break;
      }
      case NULLIFY_SIGN_IN_SUCCESS: {
        draft.signInSuccess = false;
        break;
      }
      case NULLIFY_SIGN_OUT: {
        draft.signOutSuccess = false;
        break;
      }
      case CONFIRM_PASSWORD_RESET_REQUEST: {
        draft.confirmPasswordReset = false;
        draft.confirmPasswordResetErrorReason = "";
        draft.isLoading = true;
        break;
      }
      case CONFIRM_PASSWORD_RESET_SUCCESS: {
        draft.confirmPasswordReset = true;
        draft.confirmPasswordResetErrorReason = "";
        draft.isLoading = false;

        break;
      }
      case CONFIRM_PASSWORD_RESET_FAILURE: {
        draft.confirmPasswordReset = false;
        draft.confirmPasswordResetErrorReason = action.reason;
        draft.isLoading = false;

        break;
      }

      case PASSWORD_RESET_REQUEST: {
        draft.resetPasswordSuccess = false;
        draft.resetPasswordErrorReason = "";
        draft.isLoading = true;
        break;
      }
      case PASSWORD_RESET_SUCCESS: {
        draft.resetPasswordSuccess = true;
        draft.resetPasswordErrorReason = "";
        draft.isLoading = false;
        break;
      }
      case PASSWORD_RESET_FAILURE: {
        draft.resetPasswordSuccess = false;
        draft.resetPasswordErrorReason = action.reason;
        draft.isLoading = false;

        break;
      }
      case ACTIVATION_REQUEST: {
        draft.isLoading = true;
        draft.isActivated = false;
        draft.activationErrorReason = "";
        break;
      }
      case ACTIVATION_SUCCESS: {
        draft.isLoading = false;
        draft.isActivated = true;
        draft.activationErrorReason = "";
        // draft.me = action.data;
        break;
      }
      case ACTIVATION_FAILURE: {
        draft.isLoading = false;
        draft.isActivated = false;
        draft.activationErrorReason = action.reason;
        draft.me = null;
        break;
      }
      case SIGN_IN_REQUEST: {
        draft.isLoading = true;
        draft.signInErrorReason = "";
        draft.signInSuccess = false;
        break;
      }
      case SIGN_IN_SUCCESS: {
        draft.signInSuccess = true;
        draft.isLoading = false;
        draft.signOutSuccess = false;
        draft.signInErrorReason = "";
        draft.me = action.data;
        draft.notificationCount = action.data.notification;
        //to prevent rerendering issue when notification updated
        break;
      }
      case SIGN_IN_FAILURE: {
        draft.isLoading = false;
        draft.signInSuccess = false;

        draft.signInErrorReason = action.reason;
        draft.me = null;
        break;
      }
      case SIGN_OUT_REQUEST: {
        draft.isLoading = true;
        break;
      }
      case SIGN_OUT_SUCCESS: {
        draft.isLoading = false;
        draft.signOutSuccess = true;
        draft.me = null;
        draft.signInSuccess = false;

        break;
      }
      case SIGN_UP_REQUEST: {
        draft.isSignedUp = false;
        draft.isLoading = true;
        draft.signUpErrorReason = "";
        break;
      }
      case SIGN_UP_SUCCESS: {
        draft.isLoading = false;
        draft.signOutSuccess = false;
        draft.isSignedUp = true;
        break;
      }
      case SIGN_UP_FAILURE: {
        draft.isLoading = false;
        draft.signUpErrorReason = action.reason;
        break;
      }
      case LOAD_USER_REQUEST: {
        break;
      }
      case LOAD_USER_SUCCESS: {
        if (action.me) {
          draft.me = action.data;
          break;
        }
        draft.userInfo = action.data;
        break;
      }
      case LOAD_USER_FAILURE: {
        break;
      }
      case FOLLOW_USER_REQUEST: {
        break;
      }
      case FOLLOW_USER_SUCCESS: {
        draft.me.Followings.unshift({ id: action.data });
        draft.userInfo = action.data;
        break;
      }

      case FOLLOW_USER_FAILURE: {
        break;
      }
      case UNFOLLOW_USER_REQUEST: {
        break;
      }
      case UNFOLLOW_USER_SUCCESS: {
        const index = draft.me.Followings.findIndex(
          (v) => v.id === action.data
        );
        draft.me.Followings.splice(index, 1);
        draft.userInfo = action.data;

        // const index2 = draft.followingList.findIndex(
        //   (v) => v.id === action.data
        // );
        // draft.followingList.splice(index2, 1);
        break;
      }
      case UNFOLLOW_USER_FAILURE: {
        break;
      }
      case ADD_VIDEO_TO_ME: {
        draft.me.Videos.unshift({ id: action.data });
        break;
      }
      case REMOVE_VIDEO_FROM_ME: {
        const index = draft.me.Videos.findIndex((v) => v.id === action.data);
        draft.me.Videos.splice(index, 1);
        break;
      }
      case LOAD_FOLLOWERS_REQUEST: {
        draft.followerList = !action.offset ? [] : draft.followerList; //decide readmore //0 == undefined
        draft.hasMoreFollower = action.offset ? draft.hasMoreFollower : true;
        break;
      }
      case LOAD_FOLLOWERS_SUCCESS: {
        action.data.forEach((d) => {
          draft.followerList.push(d);
        });
        draft.hasMoreFollower = action.data.length === 3;
        break;
      }
      case LOAD_FOLLOWERS_FAILURE: {
        break;
      }
      case LOAD_FOLLOWINGS_REQUEST: {
        draft.followingList = !action.offset ? [] : draft.followingList;
        draft.hasMoreFollowing = action.offset ? draft.hasMoreFollowing : true;
        break;
      }
      case LOAD_FOLLOWINGS_SUCCESS: {
        action.data.forEach((d) => {
          draft.followingList.push(d);
        });
        draft.hasMoreFollowing = action.data.length === 3;
        break;
      }
      case LOAD_FOLLOWINGS_FAILURE: {
        break;
      }
      case REMOVE_FOLLOWER_REQUEST: {
        // no action required as it is just request
        break;
      }
      case REMOVE_FOLLOWER_SUCCESS: {
        const index = draft.me.Followers.findIndex((v) => v.id === action.data);

        draft.me.Followers.splice(index, 1);
        const index2 = draft.followerList.findIndex(
          (v) => v.id === action.data
        );
        draft.followerList.splice(index2, 1);
        break;
      }
      case REMOVE_FOLLOWER_FAILURE: {
        break;
      }
      case EDIT_NICKNAME_REQUEST: {
        draft.isEditingNickname = true;
        draft.editNicknameErrorReason = "";
        draft.editNicknameSuccess = false;

        break;
      }
      case EDIT_NICKNAME_SUCCESS: {
        draft.isEditingNickname = false;
        draft.editNicknameSuccess = true;
        draft.startedEditingNickname = false;
        draft.me.nickname = action.data;
        break;
      }
      case EDIT_NICKNAME_FAILURE: {
        draft.isEditingNickname = false;
        draft.editNicknameSuccess = false;

        draft.editNicknameErrorReason = action.error;
        break;
      }
      case NULLIFY_EDIT_NICKNAME_SUCCESS: {
        draft.isEditingNickname = false;
        draft.editNicknameSuccess = false;

        draft.editNicknameErrorReason = "";
        break;
      }
      default: {
        break;
      }
    }
  });
};
