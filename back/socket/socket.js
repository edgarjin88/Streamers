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

  function getRoomClients(room) {
    return new Promise((resolve, reject) => {
      io.of("/")
        .in(room)
        .clients((error, clients) => {
          resolve(clients);
        });
    });
  }

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

    socket.on("viewer_left_room", async (data) => {
      socket.broadcast.to(data.signalRoomId).emit("viewer_left_room", data);
      socket.leave(data.signalRoomId);
      console.log("viewer_left_room fire");
      console.log("viewer socket :", socket.id);
      const clients = await getRoomClients(data.signalRoomId);
      console.log("client list in the current signalroom ", clients);
    });

    socket.on("broadcaster_left_room", async (data) => {
      socket.broadcast
        .to(data.signalRoomId)
        .emit("broadcaster_left_room", data);
      socket.leave(data.signalRoomId);

      console.log("broadcaster_left_room fire");
      console.log("broadcaster socket :", socket.id);

      const clients = await getRoomClients(data.signalRoomId);
      console.log("client list in the current signalroom ", clients);
    });

    socket.on("new_viewer_join_RTCConnection", async (data) => {
      const signalRoomId = data.signalRoomId;
      const chatRoom = data.chatRoom;
      console.log("newRTCConnection fired. connectionId :", signalRoomId);

      console.log("new_viewer_join_RTCConnection fire");
      const clients = await getRoomClients(data.signalRoomId);
      console.log("client list in the current signalroom ", clients);

      if (!RTCList[signalRoomId]) {
        RTCList[signalRoomId] = [];
      }
      RTCList[signalRoomId].push(data.userId);
      socket.join(data.signalRoomId);
      console.log("updated RTCList :", RTCList);
      socket.broadcast.to(chatRoom).emit("invite_broadcaster", data);
    });

    socket.on("new_broadcaster_join_RTCConnection", async (data) => {
      console.log("newRTCConnection fired. received Data :", data);
      const signalRoomId = data.signalRoomId;
      RTCList[signalRoomId].push(data.userId);
      socket.join(data.signalRoomId);
      console.log("updated RTCList :", RTCList);

      console.log("new_broadcaster_join_RTCConnection fire");
      const clients = await getRoomClients(data.signalRoomId);
      console.log("client list in the current signalroom ", clients);
      socket.broadcast
        .to(signalRoomId)
        .emit("new_broadcaster_join_RTCConnection", data);

      socket.to(signalRoomId).emit("broadcaster_join_completed", data);
    });

    socket.on("message_from_viewer", (data) => {
      // console.log("message_from_viewer :", data);

      socket.broadcast.to(data.signalRoomId).emit("message_from_viewer", data);
    });
    socket.on("message_from_broadcaster", (data) => {
      // console.log("message_from_broadcaster :", data);
      socket.broadcast
        .to(data.signalRoomId)
        .emit("message_from_broadcaster", data);
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
