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

const webSocket = (server, app, sessionMiddleware) => {
  const io = SocketIO(server, { path: "/socket.io" });
  app.set("io", io);

  io.use((socket, next) => {
    sessionMiddleware(socket.request, socket.request.res, next);
  });

  io.on("connection", (socket) => {
    const req = socket.request;

    req.session.socketInfo = socket.id;

    req.session.save();

    socket.on("loginInfo", (userId) => {
      socketList[userId] = socket.id;
      console.log("login info received :", userId);
      console.log("socketinfo :", socketList);
    });

    socket.on("join", (options, callback) => {
      const { error, user } = addUser({ id: socket.id, ...options });
      // addUser의 결과가 erro, user라고

      if (error) {
        console.log("join error: ", error);
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

      console.log("user: ", user);
      console.log("userList: ", userList);
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
        console.log("message sent :", message);
      }
    });

    socket.on("leaveRoom", (data) => {
      console.log("socket data :", data);
      socket.leave(data.room);
      const user = removeUser(socket.id);
      console.log("user removed fired :", user);
      generateMessage("Admin", `${data.username} has left!`);
    });

    socket.on("disconnect", () => {
      console.log("disconnection fired");
      const user = removeUser(socket.id);
      console.log("user removed fired :", user);

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
