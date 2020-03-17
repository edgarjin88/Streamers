module.exports = io => {
  io.on("connection", function(socket) {
    // socket.on("NewClient", function() {
    //   if (clients < 2) {
    //     //check the client number
    //     if (clients == 1) {
    //       this.emit("CreatePeer"); //
    //     }
    //   } else this.emit("SessionActive"); // session active
    //   clients++; //client nubmer to be increased  //
    // });

    socket.on("messageToServer", msg => {
      socket.to(msg.room).emit("messageFromServer", msg);
    });

    socket.on("ready", function(req) {
      socket.join(req.chat_room); //will be postId
      socket.join(req.signal_room);
      console.log("shake socketid", socket.id);
    });
    socket.on("send", function(req) {
      socket.to(req.room).emit("message", {
        message: req.message,
        author: req.author
      });
    });

    socket.on("signal", function(req) {
      //Note the use of req here for broadcasting so only the sender doesn't receive their own messages
      socket.to(req.room).emit("signaling_message", {
        type: req.type,
        message: req.message
      });
    });
    socket.on("close", data => {
      console.log("before leave room", data);
      socket.leave(data.signalRoom);
      socket.leave(data.room);
      //rejoin issue to be solved
    });
  });
};
