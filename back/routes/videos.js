const express = require("express");

const router = express.Router();

const { getPopularVideos, getVideos } = require("../controllers/video");

router.get("/popular", getPopularVideos);

router.get("/", getVideos);

module.exports = router;
