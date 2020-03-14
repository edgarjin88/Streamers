import React from "react";
import Helmet from "react-helmet";
import Document, { Main, NextScript } from "next/document";
import { ServerStyleSheet } from "styled-components";
import { ServerStyleSheets as MaterialUiServerStyleSheets } from "@material-ui/core/styles";

class MyDocument extends Document {
  static getInitialProps(context) {
    console.log("initiall props fired");
    const sheet = new ServerStyleSheet();
    const materialUI = new MaterialUiServerStyleSheets();
    try {
      const page = context.renderPage(App => props => {
        console.log("props in document :", props);
        return sheet.collectStyles(materialUI.collect(<App {...props} />));
      });

      const styleTags = sheet.getStyleElement();
      return { ...page, helmet: Helmet.renderStatic(), styleTags };
    } finally {
      sheet.seal();
      // to check memoryleackage
    }
  }

  render() {
    const { htmlAttributes, bodyAttributes, ...helmet } = this.props.helmet;

    const htmlAttrs = htmlAttributes.toComponent(); //
    const bodyAttrs = bodyAttributes.toComponent();

    return (
      <html {...htmlAttrs}>
        <head>
          {this.props.styleTags}
          {Object.values(helmet).map(el => el.toComponent())}
        </head>
        <body {...bodyAttrs}>
          <Main />
          {process.env.NODE_ENV === "production" && (
            <script
              src="
          https://polyfill.io/v3/polyfill.min.js?features=es5%2Ces6%2Ces2015%2Ces2016%2Ces2017%2Cdefault%2Ces7%2CNodeList.prototype.%40%40iterator%2CNodeList.prototype.forEach%2CRegExp.prototype.flags%2CNode.prototype.contains"
            />
          )}
          <NextScript />
        </body>
      </html>
    );
  }
}

export default MyDocument;
