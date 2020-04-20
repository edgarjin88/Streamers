const multer = require("multer");
const AWS = require("aws-sdk");
const multerS3 = require("multer-s3");
const path = require("path");

AWS.config.update({
  region: "ap-southeast-2", //sydney
  accessKeyId: process.env.S3_ACCESS_KEY_ID, // to access s3 from node
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
});

exports.imageLink =
  process.env.NODE_ENV === "production" ? "location" : "filename";

const multerStorage = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, "uploads");
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname);
      const basename = path.basename(file.originalname, ext); // put filename, jpg,
      done(null, basename + new Date().valueOf() + ext); //done callback function create new name
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 },
});

const multerServer = multer({
  storage: multerS3({
    s3: new AWS.S3(),
    bucket: "sumontee",
    key(req, file, cb) {
      cb(null, `original/${+new Date()}${path.basename(file.originalname)}`);
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 },
});

exports.upload =
  process.env.NODE_ENV === "production" ? multerServer : multerStorage;
