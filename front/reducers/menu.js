import produce from "immer";

export const initialState = {
  openDrawer: false,
  backDrop: false,
  openModal: false,
};

export const OPEN_DRAWER = "OPEN_DRAWER";
export const CLOSE_DRAWER = "CLOSE_DRAWER";
export const CLOSE_MODAL = "CLOSE_MODAL";
export const OPEN_MODAL = "OPEN_MODAL";

export default (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case OPEN_MODAL: {
        draft.openModal = true;
        break;
      }
      case CLOSE_MODAL: {
        draft.openModal = false;
        break;
      }
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
