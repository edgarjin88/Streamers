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

    socket.on("NewClient", function () {
      if (clients < 2) {
        //check the client number
        if (clients == 1) {
          this.emit("CreatePeer"); // 이경우 CreatePee를 송출한다.
          //이거 받아서  MakePeer를 만든다. 처음 들어온 사람에게 적용.
        }
      } else this.emit("SessionActive"); //두명이면 session active
      clients++; //client nubmer to be increased  //이거는 셋을 해놔야 할듯.
    });

    socket.on("messageToServer", (msg) => {
      // console.log('msg from client', msg);
      socket.to(msg.room).emit("messageFromServer", msg);
    });

    socket.on("ready", function (req) {
      console.log('this is req', req);
      socket.join(req.chat_room); //will be postId
      socket.join(req.signal_room);
      console.log("shake socketid", socket.id);
    });

    socket.on("send", function (req) {
      socket.to(req.room).emit("message", {
        message: req.message,
        author: req.author,
      });
    });

    socket.on("viewer_signal", function (req) {
      if (req.room != "chatroom1") {
        // console.log("rtc signalling_message fired");

        // new request as to be here
        socket.to(req.room).emit("viewer_signaling_message", {
          type: req.type,
          message: req.message,
        });
      }
    });
    socket.on("broadcaster_signal", function (req) {
      //Note the use of req here for broadcasting so only the sender doesn't receive their own messages
      if (req.room != "chatroom1") {
        // console.log("rtc signalling_message fired");

        socket.to(req.room).emit("broadcaster_signaling_message", {
          type: req.type,
          message: req.message,
        });
      }
    });

    socket.on("newPeerConnection", ({signal_room})=>{
      console.log('data received :', signal_room);

      // this room has to be the chatting room. 
      socket.to('room1').emit    ("newPeerConnectionRequest", {signal_room})
    })

    socket.on("joinNewSignalRoom", ({signal_room})=>{
      socket.join(signal_room)

      console.log('joined in new signal room');

      socket.emit('connectWebRTC', {signal_room})
    })

    socket.on("close", (data) => {
      console.log("before leave room", data);
      socket.leave(signal_room);
      // socket.leave(data.room);
      socket.leave(data.room);
      //rejoin issue to be solved
    });

    //////rtc
    //////rtc
    //////rtc
    //////rtc
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
