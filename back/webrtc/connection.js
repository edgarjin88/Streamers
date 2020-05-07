"use strict";

const EventEmitter = require("events");

class Connection extends EventEmitter {
  constructor(id, room) {
    super();
    this.id = id;
    this.state = "open";
    this.room = room;
  }

  close() {
    this.state = "closed";
    this.emit("closed");
  }

  toJSON() {
    return {
      id: this.id,
      state: this.state,
      room: this.room,
    };
  }
}

module.exports = Connection;
