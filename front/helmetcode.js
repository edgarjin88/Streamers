import Helmet from "react-helmet";
//to be added to each _app or other pages
<Helmet
  title={`Video List page. To use string interpolation later`}
  description={"description of the page"}
  meta={[
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1"
    },
    {
      name: "description",
      content: "contents from Redux"
    },
    {
      property: "og:title",
      content: `Title from redux`
    },
    {
      property: "og:description",
      content: "contents from redux"
    },
    {
      property: "og:image",
      content: "image link"
    },
    {
      property: "og:url",
      content: `URL of the page`
    }
  ]}
  link={[
    {
      rel: "shortcut icon",
      href: "/favicon.ico"
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css?family=Roboto"
    }
  ]}
/>;
