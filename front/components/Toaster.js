import React, { useEffect } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";
import Router from "next/router";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2)
    }
  }
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function CustomizedSnackbars({ message, type, whereTo }) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    if (whereTo) {
      Router.push(whereTo);
    }
    setOpen(false);
  };
  useEffect(() => {
    if (message) {
      setOpen(true);
    }
  }, [message]);

  return (
    <div className={classes.root}>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        onClose={handleClose}
      >
        <Alert
          style={{ zIndex: 100000, fontSize: "16px" }}
          onClose={handleClose}
          severity={type}
        >
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}
