import { makeStyles } from "@material-ui/core/styles";
import styled from "styled-components";
export const SignUpError = styled.div`
  color: red;
  display: inline-block;

  visibility: ${({ show }) => {
    return show === "untouched"
      ? "hidden"
      : show == true
      ? "visible"
      : "hidden";
  }};

  animation-name: ${({ show }) => {
    return show === "untouched"
      ? ""
      : show === true
      ? "fadeInOpacity"
      : "fadeOutOpacity";
  }};
  animation-timing-function: ease-in;
  animation-duration: 0.4s;
  transition: visibility 1s linear;
  @keyframes fadeInOpacity {
    0% {
      opacity: 0;
      visibility: hidden;
    }
    100% {
      opacity: 1;
      visibility: visible;
    }
  }
  @keyframes fadeOutOpacity {
    0% {
      opacity: 1;
      visibility: visible;
    }
    100% {
      opacity: 0;
      visibility: hidden;
    }
  }
`;

export const useStyles = makeStyles(theme => ({
  root: {
    height: "100vh",
    overflow: "hidden",
    maxWidth: "1437px",
    margin: "auto"
  },
  image: {
    backgroundImage: "url(https://source.unsplash.com/random)",
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "dark"
        ? theme.palette.grey[900]
        : theme.palette.grey[50],
    backgroundSize: "cover",
    backgroundPosition: "center"
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));
