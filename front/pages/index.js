import { IndexGlobalStyle } from "../styles/indexStyle";

import HideBar from "../components/HideBar";
import RelatedVideos from "../components/RelatedVideos";

const Index = () => {
  return (
    <div className="container">
      <IndexGlobalStyle />
      <HideBar />
      <main>
        <RelatedVideos />
      </main>
    </div>
  );
};

export default Index;
