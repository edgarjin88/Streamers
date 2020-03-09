import { IndexGlobalStyle } from "../styles/indexStyle";
import Header from "../components/Header";
import IndexMain from "../components/IndexMain";
import styled from "styled-components";

const VideoPage = () => {
  return (
    <div className="container">
      <IndexGlobalStyle />
      <Header />
      <IndexMain />
    </div>
  );
};

export default VideoPage;
