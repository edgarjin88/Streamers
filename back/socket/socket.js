module.exports = (io) => {
  io.on("connection", function (socket) {
    console.log("socket connected ");

    socket.on("messageToServer", (msg) => {
      socket.to(msg.room).emit("messageFromServer", msg);
    });

    socket.on("ready", function (req) {
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

    socket.on("signal", function (req) {
      socket.to(req.room).emit("signaling_message", {
        type: req.type,
        message: req.message,
      });
    });
    socket.on("close", (data) => {
      console.log("before leave room", data);
      socket.leave(data.signalRoom);
      socket.leave(data.room);
      //rejoin issue to be solved
    });
  });
};
