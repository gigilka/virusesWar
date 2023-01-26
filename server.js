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
firstTurn = true;
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

whichTurn = "bl";

//1-blue 2-blueall 3-red 4-redall 0-empty
var tablee = [];
for (let i = 0; i < 10; i++) {
  tablee[i] = new Array(10).fill(0);
}

function findNeighbors(x, y) {
  neighbors = [
    { x: x, y: y - 1 },
    { x: x, y: y + 1 },
    { x: x - 1, y: y - 1 },
    { x: x - 1, y: y },
    { x: x - 1, y: y + 1 },
    { x: x + 1, y: y - 1 },
    { x: x + 1, y: y },
    { x: x + 1, y: y + 1 },
  ];
  return neighbors;
}

function dfs(v) {
  this.dmarked[v] = true;
  console.log(v);
  var temp = this.verticesRe[v];
  for (var i = 0; i < temp.length; ++i) {
    if (!this.dmarked[temp[i]]) {
      this.dfs(temp[i]);
    }
  }
}

function bfs(v) {
  var queue = [];
  queue.push(v);
  this.bmarked[v] = true;
  while (queue.length) {
    var shift = queue.shift(); // Удаляем первый элемент очереди
    console.log(shift);
    var temp = this.verticesRe[shift];
    for (var i = 0; i < temp.length; ++i) {
      if (!this.bmarked[temp[i]]) {
        this.bmarked[temp[i]] = true;
        queue.push(temp[i]);
      }
    }
  }
}

function Graph(v) {
  this.vertices = v; // количество вершин
  this.edges = 0; // количество ребер
  this.verticesRe = []; // Двумерный массив для хранения вершин, смежных с текущей вершиной
  this.bmarked = []; // отмеченный массив
  this.dmarked = []; // отмеченный массив
  for (var i = 0; i < v; ++i) {
    this.verticesRe[i] = [];
    this.bmarked[i] = false;
    this.dmarked[i] = false;
  }
  this.addEdge = addEdge;
}

this.dfs = dfs; // поиск в глубину
this.bfs = bfs; // Поиск в ширину

function addEdge(v, w) {
  this.verticesRe[v].push(w);
  this.verticesRe[w].push(v);
  this.edges++;
}

function IsReachable(x, y, tablee, role) {
  neighbors = [
    { x: x, y: y - 1 },
    { x: x, y: y + 1 },
    { x: x - 1, y: y - 1 },
    { x: x - 1, y: y },
    { x: x - 1, y: y + 1 },
    { x: x + 1, y: y - 1 },
    { x: x + 1, y: y },
    { x: x + 1, y: y + 1 },
  ];

  console.log(neighbors);

  ends = [];
  bases = [];
  if (role == "bl") {
    intRole = 1;
    intChain = 2;
  } else {
    intRole = 3;
    intChain = 4;
  }

  for (i = 0; i < neighbors.length; i++) {
    if (tablee[neighbors[k].x][neighbors[k].y] == intRole) {
      return true;
    }
  }

  for (i = 0; i < neighbors.length; i++) {
    if (tablee[neighbors[k].x][neighbors[k].y] == intChain) {
      ends.push({ x: neighbors[k].x, y: neighbors[k].y });
    }
    if (ends.length == 0) {
      return false;
    }

    let count = 0;

    for (i = 0; i < 10; i++) {
      for (j = 0; j < 10; j++) {
        if (tablee[i][j] == intRole) {
          ends.push({ x: i, y: j });
          count++;
        }
        if (tablee[i][j] == intChain) {
          count++;
        }
      }
    }

    g = new Graph(count);
    for (i = 0; i < 10; i++) {
      for (j = 0; j < 10; j++) {
        if (tablee[i][j] == intRole || tablee[i][j] == intChain) {
          nei = findNeighbors(i, j);
          for (k = 0; k < nei.length; k++) {
            
          }
        }
      }
    }
  }
  console.log(neighbors);
  return true;
}
//1-blue 2-blueall 3-red 4-redall 0-empty
function IsCorrect(x, y, tablee, role, result) {
  flag = true;
  point = tablee[x - 1][y - 1];
  switch (point) {
    case 0:
      result.poi = role;
      return true;
    case 1:
      if (role == "bl") {
        return false;
      } else {
        if (IsReachable(x, y, tablee, role)) {
          result.poi = "redall";
          return true;
        } else {
          return false;
        }
      }
    case 2:
      return false;
    case 3:
      if (role == "re") {
        return false;
      } else {
        if (IsReachable(x - 1, y - 1, tablee, role)) {
          result.poi = "blueall";
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

    if (whichTurn != role) {
      switch (role) {
        case "bl":
          clients[0].send("notyourturn-error");
        case "re":
          clients[1].send("notyourturn-error");
      }
    }
    str = message.toString();
    idar = str.split("-");
    idx = idar[0];
    idy = idar[1];
    let result = { poi: "empty" };

    flag = IsCorrect(idx, idy, tablee, role, result);

    if (flag) {
      switch (result.poi) {
        case "bl":
          tablee[idx - 1][idy - 1] = 1;
          break;
        case "re":
          tablee[idx - 1][idy - 1] = 3;
          break;
        case "blueall":
          tablee[idx - 1][idy - 1] = 2;
          break;
        case "redall":
          tablee[idx - 1][idy - 1] = 4;
          break;
      }

      moves -= 1;
      if (moves == 0) {
        whichTurn = "re";
        moves = 3;
      }

      clients[0].send(
        "correct-" + idx + "-" + idy + "-" + tablee[idx - 1][idy - 1]
      );
      clients[1].send(
        "correct-" + idx + "-" + idy + "-" + tablee[idx - 1][idy - 1]
      );
    } else {
      clients[0].send("notcorrect-" + idx + "-" + idy);
      clients[1].send("notcorrect-" + idx + "-" + idy);
    }
    console.log(idx + " " + idy + " " + role);
  });

  ws.on("close", function () {
    console.log("соединение закрыто " + ws);
  });
});

server.listen(8443, () => console.log("Server started"));
