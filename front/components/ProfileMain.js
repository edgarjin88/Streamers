import RelatedVideos from "./RelatedVideos";
import Card from "./Card";

const mainLayout = () => {
  return (
    <main>
      {/* <div>profile card section</div>
      <div>edit profile button</div>
      <div>Scrolle</div> */}
      <Card />
      <div>
        Dependnig on redux states, login, password change, profile update to
        show.{" "}
      </div>
      <RelatedVideos />
      {/* <VideoComments /> */}
    </main>
  );
};

export default mainLayout;
