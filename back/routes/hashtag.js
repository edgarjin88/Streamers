const express = require("express");

const router = express.Router();
// use last id rather than offset due to performance reason

const { getHashtagVideo } = require("../controllers/hashtag");

router.get("/:tag", getHashtagVideo);

module.exports = router;
