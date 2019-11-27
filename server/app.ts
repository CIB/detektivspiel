import * as express from "express";
import * as socketio from "socket.io";

const app = require("express")() as express.Application;
app.set("port", process.env.PORT || 3000);

let http = require("http").Server(app);
let io = require("socket.io")(http, { path: "/napi" }) as socketio.Server;

const people: socketio.Socket[] = [];
let doorOpen = false;

io.on("connection", function(socket: socketio.Socket) {
  people.push(socket);
  console.log("new connection from", socket.id);
  socket.emit("doorOpen", doorOpen);

  socket.on("toggleDoor", value => {
    doorOpen = value;
    for (let person of people) {
      person.emit("doorOpen", doorOpen);
    }
  });
});

const server = http.listen(3000, function() {
  console.log("listening on *:3000");
});

// socket.on("createRoom", () => {
//     socket.emit("createdRoom", roomId++);
//   });
