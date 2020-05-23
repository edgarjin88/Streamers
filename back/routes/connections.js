const express = require("express");
const { isLoggedIn } = require("./middleware");
const router = express.Router();

const {
  getWebRTCConnection,
  createWebRTCConnection,
  deleteConnection,
  getWebRTCConnectionWithId,
  getLocalDescription,
  getRemoteDescription,
  createRemoteDescription,
} = require("../controllers/webrtc");

router.get(`/:type`, isLoggedIn, getWebRTCConnection);
router.post(`/:type/:room`, isLoggedIn, createWebRTCConnection);
router.delete(`/:type/:id/:room`, isLoggedIn, deleteConnection);
router.get(`/:type/:id`, isLoggedIn, getWebRTCConnectionWithId);
router.get(`/:type/:id/local-description`, isLoggedIn, getLocalDescription);
router.get(`/:type/:id/remote-description`, isLoggedIn, getRemoteDescription);
router.post(
  `/:type/:id/remote-description`,
  isLoggedIn,
  createRemoteDescription
);

module.exports = router;
