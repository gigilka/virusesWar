const http = require("http");
const express = require("express");
const WebSocket = require("ws");

const app = express();
app.use(express.static(__dirname));
const server = http.createServer(app);

const webSocketServer = new WebSocket.Server({ server });

const { Client } = require("pg");
const { table } = require("console");
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
//1-blue 2-blueall 3-red 4-redall 0-empty
var tablee = [];
for (let i = 0; i < 10; i++) {
  tablee[i] = new Array(10).fill(0);
}

function IsReachable(x, y, tablee, role) {
  neighbors = [
    [x - 1, y - 1],
    [x - 1, y],
    [x - 1, y + 1],
    [x, y + 1],
    [x + 1, y + 1],
    [x + 1, y],
    [x + 1, y - 1],
    [x, y - 1],
  ];
  console.log(neighbors);
  return true;
}

function IsCorrect(x, y, tablee, role) {
  flag = true;
  point = tablee[x - 1][y - 1];
  switch (point) {
    case 0:
      return true;
    case 1:
      if (role == "bl") {
        return false;
      } else {
        if (IsReachable(x, y, tablee, role)) {
          return true;
        } else {
          return false;
        }
      }
    case 2:
      return false;
    case 3:
      if (role == "red") {
        return false;
      } else {
        if (IsReachable(x - 1, y - 1, tablee, role)) {
          return true;
        } else {
          return false;
        }
      }
    case 4:
      return false;
  }
}
var clients = [];
webSocketServer.on("connection", function (ws) {
  clients.push(ws);
  console.log("новое соединение " + ws);
  //console.log(clients)
  if (clients.length == 2 && gameStatus == "waiting") {
    gameStatus = "started";
    clients[0].send("bl-f");
    clients[1].send("re-f");
  }
  ws.on("message", function (message) {
    console.log("получено сообщение " + message);
    if (clients[0] == ws) role = "bl";
    else {
      role = "re";
    }
    str = message.toString();
    idar = str.split("-");
    idx = idar[0];
    idy = idar[1];
    flag = IsCorrect(idx, idy, tablee, role);
    if (flag) {
      clients[0].send("correct-" + idx + "-" + idy + "-" + role);
      clients[1].send("correct-" + idx + "-" + idy + "-" + role);
    }
    console.log(idx + " " + idy + " " + role);
  });

  ws.on("close", function () {
    console.log("соединение закрыто " + ws);
  });
});

server.listen(8443, () => console.log("Server started"));
