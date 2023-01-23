const http = require("http");
const express = require("express");
const WebSocket = require("ws");

const app = express();
app.use(express.static(__dirname));
const server = http.createServer(app);

const webSocketServer = new WebSocket.Server({ server });

const { Client } = require("pg");
gameStatus = "waiting";
moves = 3;

const client = new Client({
  user: "test",
  host: "localhost",
  database: "VirusesWarDB",
  password: "1234",
  port: 5432,
});

client.connect();
console.log("connection to db succesfull");
client.end();

var clients = [];
webSocketServer.on("connection", function (ws) {
  clients.push(ws);
  console.log("новое соединение " + ws);
  console.log(clients)
  if (clients.length === 2 && gameStatus === "waiting") {
    gameStatus = "started";
    clients[0].send()
  }
  ws.on("message", function (message) {
    console.log("получено сообщение " + message);

  });

  ws.on("close", function () {
    console.log("соединение закрыто " + ws);
  });
});

server.listen(8443, () => console.log("Server started"));
