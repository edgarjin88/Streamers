import produce from "immer";

// export const initialState = {
//   isLoggingOut: false,
//   isLoggingIn: false,
//   logInErrorReason: "",
//   isSignedUp: false,
//   isSigningUp: false,
//   signUpErrorReason: "",
//   me: null,
//   followingList: [],
//   followerList: [],
//   userInfo: "test",
//   isEditingNickname: false,
//   editNicknameErrorReason: "",
//   hasMoreFollower: false,
//   hasMoreFollowing: false
// };
export const initialState = {
  openDrawer: false,
  backDrop: false
};

export const OPEN_DRAWER = "OPEN_DRAWER";
export const CLOSE_DRAWER = "CLOSE_DRAWER";
// export const OPEN_BACKDROP = "OPEN_BACKDROP";
// export const CLOSE_BACKDROP = "CLOSE_BACKDROP";

// export const ADD_POST_TO_ME = "ADD_POST_TO_ME";
// export const REMOVE_POST_OF_ME = "REMOVE_POST_OF_ME";

export default (state = initialState, action) => {
  return produce(state, draft => {
    switch (action.type) {
      case OPEN_DRAWER: {
        draft.openDrawer = true;
        draft.backDrop = true;
        break;
      }
      case CLOSE_DRAWER: {
        draft.openDrawer = false;
        draft.backDrop = false;
        break;
      }

      default: {
        break;
      }
    }
  });
};
