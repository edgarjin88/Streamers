import React from "react";
import Link from "next/link";
import { IndexGlobalStyle } from "../styles/indexStyle";

import HideBar from "./HideBar";

const AppLayout = ({ children }) => {
  return (
    <>
      <div className="container">
        <IndexGlobalStyle />
        {/* <header> */}
        <HideBar />
        {/* </header> */}
        {children}
      </div>
    </>
  );
};

export default AppLayout;
