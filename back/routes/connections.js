const express = require("express");

const { isLoggedIn } = require("./middleware");

const router = express.Router();

const WebRtcConnectionManager = require("../webrtc/webrtcconnectionmanager");

const broadCasterServer = require("../webrtc/broadcasterServer");
const viewerServer = require("../webrtc/viewerServer");

const viewerConnectionManager = WebRtcConnectionManager.create(viewerServer);

const broadcasterConnectionManager = WebRtcConnectionManager.create(
  broadCasterServer
);

router.get("/", async (req, res, next) => {
  res.json({ test: "test" });
});

router.get(`/:type`, (req, res) => {
  const { type, id } = req.params;
  const connectionManager =
    type === "broadcaster"
      ? broadcasterConnectionManager
      : viewerConnectionManager;
  try {
    res.send(connectionManager.getConnections());
  } catch (e) {
    console.log(`Error while getting connetion list for type :${type} :`);
  }
});

router.post(`/:type/:room`, async (req, res) => {
  const { type, id, room } = req.params;

  const connectionManager =
    type === "broadcaster"
      ? broadcasterConnectionManager
      : viewerConnectionManager;

  try {
    const connection = await connectionManager.createConnection(room);

    res.send(connection);
  } catch (e) {
    console.error(`error creating connection for type: ${type} :`);
    res.sendStatus(500);
  }
});

router.delete(`/:type/:id`, (req, res) => {
  const { type, id } = req.params;
  const connectionManager =
    type === "broadcaster"
      ? broadcasterConnectionManager
      : viewerConnectionManager;
  try {
    const connection = connectionManager.getConnection(id);
    if (!connection) {
      res.sendStatus(404);
      return;
    }
    connection.close();
    res.send(connection);
  } catch (e) {
    console.log(`error deleting connection for type: ${type} :`);
  }
});

router.get(`/:type/:id`, (req, res) => {
  const { type, id } = req.params;
  const connectionManager =
    type === "broadcaster"
      ? broadcasterConnectionManager
      : viewerConnectionManager;
  try {
    const connection = connectionManager.getConnection(id);
    if (!connection) {
      res.sendStatus(404);
      return;
    }
    res.send(connection);
  } catch (e) {
    console.log(`error getting one connection for type: ${type} :`);
  }
});

router.get(`/:type/:id/local-description`, (req, res) => {
  const { type, id } = req.params;
  const connectionManager =
    type === "broadcaster"
      ? broadcasterConnectionManager
      : viewerConnectionManager;
  try {
    const connection = connectionManager.getConnection(id);
    if (!connection) {
      res.sendStatus(404);
      return;
    }
    res.send(connection.toJSON().localDescription);
  } catch (e) {
    console.log(
      `error getting getting a local-description for type: ${type} :`
    );
  }
});

router.get(`/:type/:id/remote-description`, (req, res) => {
  const { type, id } = req.params;
  const connectionManager =
    type === "broadcaster"
      ? broadcasterConnectionManager
      : viewerConnectionManager;
  try {
    const connection = connectionManager.getConnection(id);
    if (!connection) {
      console.log("no connection found :");
      res.sendStatus(404);

      return;
    }

    res.send(connection.toJSON().remoteDescription);
  } catch (e) {
    console.log(
      `error getting getting a remote-description for type: ${type} :`
    );
  }
});

router.post(`/:type/:id/remote-description`, async (req, res) => {
  const { type, id } = req.params;
  const connectionManager =
    type === "broadcaster"
      ? broadcasterConnectionManager
      : viewerConnectionManager;

  try {
    const connection = connectionManager.getConnection(id);

    if (!connection) {
      console.log("connection does not exist");
      res.sendStatus(404);
      return;
    }
    await connection.applyAnswer(req.body);
    res.send(connection.toJSON().remoteDescription);
  } catch (e) {
    console.log(
      `error getting creating a remote-description for type: ${type} :`
    );
    res.sendStatus(400);
  }
});

module.exports = router;
