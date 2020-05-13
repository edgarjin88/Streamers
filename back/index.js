const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const dotenv = require("dotenv");
const passport = require("passport");
const path = require("path");

const hpp = require("hpp");
const helmet = require("helmet");

const passportConfig = require("./passport");
const db = require("./models");
const { webSocket, socketList } = require("./socket/socket");
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
//////////////////////For socket I

const app = express();

const server =
  process.env.NODE_ENV === "production"
    ? require("https").Server(options, app)
    : require("http").Server(app);

const PORT = prod ? 443 : 3003;

const sessionMiddleware = session({
  resave: true,
  saveUninitialized: true,
  autoSave: true,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
});

db.sequelize.sync();
passportConfig();

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

app.use(express.json());
app.use(express.urlencoded({ extended: true })); //for formdata process
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(sessionMiddleware);
app.use(passport.initialize());

app.use(passport.session());

webSocket(server, app, sessionMiddleware);
app.use("/api/user", userAPIRouter);
app.use("/api/video", videoAPIRouter);
app.use("/api/videos", videosAPIRouter);

app.use("/api/hashtag", hashtagAPIRouter);
app.use("/api/connections", webRTCRouter);

server.listen(PORT, () => console.log(`Active on ${process.env.PORT}`));
