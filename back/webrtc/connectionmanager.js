"use strict";

const uuidv4 = require("uuid/v4");

const DefaultConnection = require("./connection");
class ConnectionManager {
  constructor(options = {}) {
    options = {
      Connection: DefaultConnection,
      // defaultconnection, just event and state.
      generateId: uuidv4,
      ...options,
    };

    const { Connection, generateId } = options;

    const connections = new Map();
    const closedListeners = new Map();

    function createId() {
      do {
        const id = generateId();
        if (!connections.has(id)) {
          return id;
        }
        // eslint-disable-next-line
      } while (true);
    }

    function deleteConnection(connection) {
      // 1. Remove "closed" listener.
      const closedListener = closedListeners.get(connection);
      closedListeners.delete(connection);
      connection.removeListener("closed", closedListener);

      // 2. Remove the Connection from the Map.
      connections.delete(connection.id);
    }

    this.createConnection = (room) => {
      console.log("room info fired in createConnection:", room);
      const id = createId();
      console.log("id craeted :", id);
      // 여기까지는 이상 무.
      const connection = new Connection(id, room);
      // console.log("creating Connection :", e);

      // 1. Add the "closed" listener.
      //to listen "clesed" event.
      function closedListener() {
        deleteConnection(connection);
      }
      closedListeners.set(connection, closedListener);
      connection.once("closed", closedListener);

      connections.set(connection.id, connection);

      return connection;
    };

    this.getConnection = (id) => {
      console.log("getConnection fired connections:", connections);
      return connections.get(id) || null;
    };

    this.getConnections = () => {
      return [...connections.values()];
      // beautiful
    };
  }

  toJSON() {
    return this.getConnections().map((connection) => {
      return connection.toJSON();
    });
  }
}

module.exports = ConnectionManager;
