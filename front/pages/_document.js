import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";

import { ServerStyleSheet as StyledComponentSheets } from "styled-components";
import { ServerStyleSheets as MaterialUiServerStyleSheets } from "@material-ui/core/styles";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const styledComponentSheet = new StyledComponentSheets();
    const materialUiSheets = new MaterialUiServerStyleSheets();
    const originalRenderPage = ctx.renderPage;
    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            styledComponentSheet.collectStyles(
              materialUiSheets.collect(<App {...props} />)
            ),
        });
      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        // helmet: Helmet.renderStatic(),
        styles: (
          <React.Fragment key="styles">
            {initialProps.styles}
            {materialUiSheets.getStyleElement()}
            {styledComponentSheet.getStyleElement()}
          </React.Fragment>
        ),
      };
    } finally {
      styledComponentSheet.seal();
    }
  }

  render() {
    console.log("currentmode : ", process.env.NODE_ENV);

    return (
      <Html>
        <Head>{this.props.styles}</Head>

        <body>
          <Main />
          {process.env.NODE_ENV === "production" && (
            <script
              src="
          https://polyfill.io/v3/polyfill.min.js?features=es5%2Ces6%2Ces2015%2Ces2016%2Ces2017%2Cdefault%2Ces7%2CNodeList.prototype.%40%40iterator%2CNodeList.prototype.forEach%2CRegExp.prototype.flags%2CNode.prototype.contains"
            />
          )}
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
