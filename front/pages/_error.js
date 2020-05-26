import React, { useEffect } from "react";
import { IndexGlobalStyle } from "../styles/indexStyle";
import HideBar from "../containers/HideBar";
import Router from "next/router";

const ErrorPage = ({ statusCode }) => {
  useEffect(() => {
    setTimeout(() => {
      Router.push("/");
    }, 3000);
  }, []);
  return (
    <div className="container">
      <IndexGlobalStyle />
      <HideBar style={{ zIndex: 3000 }} />

      <main>
        <h1
          style={{
            position: "absolute",
            top: "50vh",
            margin: "auto",
            fontSize: "4rem",
          }}
        >
          {statusCode} Unexpected Error occured. You are redirecting to the main
          page now. <strong>Happy Day! 🍕</strong>
        </h1>
      </main>
    </div>
  );
};

ErrorPage.defaultProps = {
  statusCode: 400,
};

ErrorPage.getInitialProps = async (context) => {
  const statusCode = (await context.res)
    ? context.res.statusCode
    : context.err
    ? context.err.statusCode
    : null;
  return { statusCode };
};

export default ErrorPage;
