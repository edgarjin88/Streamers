"use strict";

const ConnectionManager = require("./connectionmanager");
const WebRtcConnection = require("./webrtcconnection");

class WebRtcConnectionManager {
  constructor(options = {}) {
    options = {
      Connection: WebRtcConnection,
      ...options,
    };

    const connectionManager = new ConnectionManager(options);

    this.createConnection = async () => {
      const connection = connectionManager.createConnection();
      await connection.doOffer();
      // 오퍼를 만든다.
      return connection;
    };

    this.getConnection = (id) => {
      return connectionManager.getConnection(id);
      // 아이디를 집어 너어, 커낵션을 연결한다 df\
    };

    this.getConnections = () => {
      return connectionManager.getConnections();
      // 위와 동일하나 멀티플
    };
  }

  toJSON() {
    return this.getConnections().map((connection) => {
      console.log(
        "connection toJSON in WebRtcConnectionManager: ",
        connection.toJSON()
      );
      return connection.toJSON();
    });
  }
}

WebRtcConnectionManager.create = function create(options) {
  return new WebRtcConnectionManager({
    Connection: function (id) {
      return new WebRtcConnection(id, options);
    },
  });
};

module.exports = WebRtcConnectionManager;
