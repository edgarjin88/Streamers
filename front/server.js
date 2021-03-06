const express = require("express");
const next = require("next");
const cors = require("cors");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
// const handle = routes.getRequestHandler(app);
// app.use(cors());

app
  .prepare()
  .then(() => {
    const server = express();
    server.use(
      cors({
        origin: "*",
        credentials: true,
      })
    );
    server.get("*", (req, res) => {
      return handle(req, res);
    });
    console.log("currentmode : ", process.env.NODE_ENV);
    server.use(handle).listen(3000, (err) => {
      if (err) throw err;
      console.log("> Ready on http://localhost:3000");
    });
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });
