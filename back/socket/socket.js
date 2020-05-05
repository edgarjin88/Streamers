const { generateMessage, generateLocationMessage } = require("./messages");
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
  userList,
} = require("./users");
const Filter = require("bad-words");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("New WebSocket connection");

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
      console.log("message received :", message);

      console.log("what is socket.id :", socket.id);
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

// module.exports = (io) => {
//   io.on("connection", function (socket) {
//     console.log("socket connected ");

//     socket.emit("messageFromServer", { message: "Welcome!!" });

//     socket.on("messageToServer", (msg) => {
//       socket.to(msg.room).emit("messageFromServer", msg);
//     });

//     socket.on("ready", function (req) {
//       socket.join(req.chat_room); //will be postId
//       socket.join(req.signal_room);
//       console.log("shake socketid", socket.id);
//     });
//     socket.on("send", function (req) {
//       socket.to(req.room).emit("message", {
//         message: req.message,
//         author: req.author,
//       });
//     });

//     socket.on("signal", function (req) {
//       socket.to(req.room).emit("signaling_message", {
//         type: req.type,
//         message: req.message,
//       });
//     });
//     socket.on("close", (data) => {
//       console.log("before leave room", data);
//       socket.leave(data.signalRoom);
//       socket.leave(data.room);
//       //rejoin issue to be solved
//     });
//   });
// };
