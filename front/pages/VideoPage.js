import { GlobalStyleOne } from "../styles/styles";

import styled, { css } from "styled-components";
import Header from "../components/Header";
import Main from "../components/Main";

const VideoPage = () => {
  return (
    <div className="container">
      <GlobalStyleOne />
      <Header />
      <Main />
    </div>
  );
};

export default VideoPage;
