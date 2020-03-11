import { IndexGlobalStyle } from "../styles/indexStyle";
import IndexMain from "../components/IndexMain";
import HideBar from "../components/HideBar";

const Index = () => {
  return (
    <div className="container">
      <IndexGlobalStyle />
      <HideBar />
      <IndexMain />
    </div>
  );
};

export default Index;
