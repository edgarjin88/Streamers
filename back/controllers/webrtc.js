const WebRtcConnectionManager = require("../webrtc/webrtcconnectionmanager");
const broadCasterServer = require("../webrtc/broadcasterServer");
const viewerServer = require("../webrtc/viewerServer");
const viewerConnectionManager = WebRtcConnectionManager.create(viewerServer);
const broadcasterConnectionManager = WebRtcConnectionManager.create(
  broadCasterServer
);

const db = require("../models");

exports.createRemoteDescription = async (req, res) => {
  const { type, id } = req.params;
  const connectionManager =
    type === "broadcaster"
      ? broadcasterConnectionManager
      : viewerConnectionManager;

  try {
    const connection = connectionManager.getConnection(id);
    console.log("connection exist : ", connection);
    if (!connection) {
      console.log("connection does not exist");
      res.sendStatus(404);
      return;
    }
    await connection.applyAnswer(JSON.parse(req.body.body));
    res.send(connection.toJSON().remoteDescription);
  } catch (e) {
    console.log(
      `error getting creating a remote-description for type: ${type} :`
    );
    res.sendStatus(400);
  }
};

exports.getRemoteDescription = async (req, res) => {
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
};

exports.getLocalDescription = async (req, res) => {
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
};

exports.getWebRTCConnectionWithId = async (req, res) => {
  const { type, id } = req.params;
  const connectionManager =
    type === "broadcaster"
      ? broadcasterConnectionManager
      : viewerConnectionManager;
  try {
    const connection = connectionManager.getConnection(id);
    if (!connection) {
      return res.sendStatus(404);
    }
    res.send(connection);
  } catch (e) {
    console.log(`error getting one connection for type: ${type} :`);
  }
};

exports.deleteConnection = async (req, res) => {
  const { type, id, room } = req.params;
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

    if (type === "broadcaster") {
      const io = req.app.get("io");
      await db.Video.update({ streaming: "OFF" }, { where: { id: room } });
      io.sockets.emit("streamingOff", { id: room });
    }

    res.send(connection);
  } catch (e) {
    console.log(`error deleting connection for type: ${type} :`);
  }
};

exports.createWebRTCConnection = async (req, res) => {
  const { type, id, room } = req.params;

  const connectionManager =
    type === "broadcaster"
      ? broadcasterConnectionManager
      : viewerConnectionManager;

  try {
    const connection = await connectionManager.createConnection(room);
    if (type === "broadcaster") {
      const io = req.app.get("io");
      await db.Video.update({ streaming: "ON" }, { where: { id: room } });
      io.sockets.emit("streamingOn", { id: room });
    }
    res.send(connection);
  } catch (e) {
    console.error(`error creating connection for type: ${type} :`);
    res.sendStatus(500);
  }
};

exports.getWebRTCConnection = async (req, res) => {
  const { type, id } = req.params;
  const connectionManager =
    type === "broadcaster"
      ? broadcasterConnectionManager
      : viewerConnectionManager;
  try {
    // const result = await connectionManager.getConnections()
    res.send(connectionManager.getConnections());
  } catch (e) {
    console.log("error connecting :", e);
  }
};
