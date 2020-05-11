const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const dotenv = require("dotenv");
const passport = require("passport");
const path = require("path");

const hpp = require("hpp");
const helmet = require("helmet");

const passportConfig = require("./passport");
const db = require("./models");
const userAPIRouter = require("./routes/user");
const videoAPIRouter = require("./routes/video");
const videosAPIRouter = require("./routes/videos");
const hashtagAPIRouter = require("./routes/hashtag");
const webRTCRouter = require("./routes/connections");

const prod = process.env.NODE_ENV === "production";
const fs = require("fs");
var certsPath = path.join(__dirname, "path", "to");

const options =
  process.env.NODE_ENV === "production"
    ? {
        key: fs.readFileSync(
          path.join(certsPath, "api_websiteName_com_key.txt")
        ),

        cert: fs.readFileSync(path.join(certsPath, "api.websiteName.com.crt")),

        ca: fs.readFileSync(
          path.join(certsPath, "api.websiteName.com.ca-bundle")
        ),
      }
    : null;

dotenv.config();
//////////////////////For socket IO

const app = express();

const server =
  process.env.NODE_ENV === "production"
    ? require("https").Server(options, app)
    : require("http").Server(app);

const PORT = 3003;

const io = require("socket.io")(server);
const socketFunctions = require("./socket/socket");
try {
  socketFunctions(io);
} catch (e) {
  console.log("socket error:", e);
}

///////////////////////////////////end of socket

db.sequelize.sync();
passportConfig();

// app.use(require("express-status-monitor")());

if (prod) {
  app.use(hpp());
  app.use(helmet());
  app.use(morgan("combined"));
  app.use(
    cors({
      origin: "*",
      credentials: true,
    })
  );
} else {
  app.use(morgan("dev"));
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );
}

app.use("/", express.static("uploads")); //static file directory setting

app.use(express.json()); //중요
app.use(express.urlencoded({ extended: true })); //for formdata process
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? false : false,
      domain: prod && ".websiteName.com", // without '.'  api.sumotee won't work. For subdomain as well.
    },
    name: "websiteName", //cookie name to change. Name of cookie from browser
  })
);
app.use(passport.initialize()); //I will be initialized everytime. In real product, to be cached.

app.use(passport.session());

app.use("/api/user", userAPIRouter);
app.use("/api/video", videoAPIRouter);
app.use("/api/videos", videosAPIRouter);

app.use("/api/hashtag", hashtagAPIRouter);
app.use("/api/connections", webRTCRouter);

server.listen(prod ? 443 : PORT, () =>
  console.log(`Active on ${process.env.PORT}`)
);
