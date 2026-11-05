const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const server = http.createServer(app);
const io = new Server(server);

const players = {};

io.on("connection", (socket) => {
  socket.on("move", (data) => {
    if (!data) return;

    const values = [data.x, data.y, data.z, data.r];
    if (!values.every(Number.isFinite)) return;

    players[socket.id] = {
      x: data.x,
      y: data.y,
      z: data.z,
      r: data.r
    };
  });

  socket.on("disconnect", () => {
    delete players[socket.id];
  });
});

setInterval(() => {
  io.emit("players", players);
}, 50);

const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => {
  console.log("Spielserver gestartet auf Port " + PORT);
});
