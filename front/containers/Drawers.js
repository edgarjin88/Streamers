import { useSelector, shallowEqual } from "react-redux";

import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import {
  MemoCloseButton,
  MemoUserItemList,
  MemoSystemItemList
} from "./DrawerSubComponents";

//actions

export const Drawers = ({ classes }) => {
  // const classes = useStyles();

  const { openDrawer } = useSelector(({ menu }) => {
    return { openDrawer: menu.openDrawer };
  }, shallowEqual);

  return (
    <>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={openDrawer}
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <MemoCloseButton />
        <Divider />
        <MemoUserItemList />
        <Divider />
        <MemoSystemItemList />
      </Drawer>
    </>
  );
};
