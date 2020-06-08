const SocketIO = require("socket.io");
const { generateMessage } = require("./messages");
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
  userList,
} = require("./users");

const Filter = require("bad-words");

const socketList = {};

const RTCList = {};

const webSocket = (server, app, sessionMiddleware) => {
  const io = SocketIO(server);
  // const io = SocketIO(server, { path: "/socket.io" });
  app.set("io", io);

  io.use((socket, next) => {
    sessionMiddleware(socket.request, socket.request.res, next);
  });

  io.on("connection", (socket) => {
    //////rtc
    //////rtc
    //////rtc
    //////rtc

    // Pathnames of the SSL key and certificate files to use for
    // HTTPS connections.

    // client joinNewRTCConnection
    // -userName
    // -userId
    // -roomName
    // -videoId
    // -description
    // -data type
    // client send

    socket.on("new_viewer_join_RTCConnection", (data) => {
      const connectionId = data.connectionId;
      console.log("newRTCConnection fired. connectionId :", connectionId);

      if (!RTCList[connectionId]) {
        RTCList[connectionId] = [];
      }
      RTCList[connectionId].push(data.userId);
      socket.join(data.connectionId);
      console.log("updated RTCList :", RTCList);
      soekt.emit("invite_broadcaster", data);
    });
    socket.on("new_broadcaster_join_RTCConnection", (data) => {
      console.log("newRTCConnection fired. received Data :", data);
      const connectionId = data.connectionId;
      RTCList[connectionId].push(data.userId);
      socket.join(data.connectionId);
      console.log("updated RTCList :", RTCList);
    });

    socket.on("message_from_viewer", (data) => {
      console.log("message_from_viewer :", data);

      socket.broadcast.to(data.room).emit("message_from_viewer", {});
    });
    socket.on("message_from_broadcaster", (data) => {
      console.log("message_from_broadcaster :", data);
      socket.broadcast.to(data.room).emit("message_from_broadcaster", {});
    });

    //////rtc
    //////rtc
    const req = socket.request;

    req.session.socketInfo = socket.id;

    req.session.save();

    socket.on("loginInfo", (userId) => {
      socketList[userId] = socket.id;
    });

    socket.on("join", (options, callback) => {
      const { error, user } = addUser({ id: socket.id, ...options });

      if (error) {
        return callback(error);
      }

      socket.join(user.room);

      socket.emit(
        "message",
        generateMessage(
          "Streamers",
          "Admin",
          undefined,
          `Welcome ${user.username} !`
        )
      );

      socket.broadcast
        .to(user.room)
        .emit(
          "message",
          generateMessage(
            "Streamers",
            "Admin",
            undefined,
            `${user.username} has joined!`
          )
        );
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });

      callback();
    });

    socket.on("sendMessage", (message, callback) => {
      const user = getUser(socket.id);

      if (user && user.room !== undefined) {
        io.to(user.room).emit(
          "message",
          generateMessage(
            user.username,
            user.userId,
            user.profilePhoto,
            message.message
          )
        );
        callback();
      }
    });

    socket.on("leaveRoom", (data) => {
      socket.leave(data.room);
      const user = removeUser(socket.id);
      generateMessage("Admin", `${data.username} has left!`);
    });

    socket.on("disconnect", () => {
      const user = removeUser(socket.id);

      if (user) {
        io.to(user.room).emit(
          "message",
          generateMessage("Admin", `${user.username} has left!`)
        );
        io.to(user.room).emit("roomData", {
          room: user.room,
          users: getUsersInRoom(user.room),
        });
      }
    });
  });
};

module.exports = {
  socketList,
  webSocket,
};
