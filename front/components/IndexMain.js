import VideoDetails from "./VideoDetails";
import RelatedVidoes from "./RelatedVidoes";
import VideoComments from "./VideoComments";
import styled from "styled-components";
import MainVideo from "./MainVideo";
import LeftMenu from "./LeftMenu";
// const mainLayout = () => {
//   return (
//     <main>
//       <RelatedVidoes />
//     </main>
//   );
// };

const mainLayout = () => {
  return (
    <main>
      {/* <MainVideo /> */}
      {/* <VideoDetails /> */}
      <LeftMenu />
      <RelatedVidoes />
      {/* <VideoComments /> */}
    </main>
  );
};

export default mainLayout;
