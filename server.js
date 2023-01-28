const http = require("http");
const express = require("express");
const WebSocket = require("ws");

const app = express();
app.use(express.static(__dirname));
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({
  extended: false,
});

app.use(bodyParser.json());
const server = http.createServer(app);

const webSocketServer = new WebSocket.Server({ server });

const { Client } = require("pg");
const uuid = require("uuid");
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

//client.connect();
//console.log("connection to db succesfull");
//client.end();

whichTurn = "bl";

//1-blue 2-blueall 3-red 4-redall 0-empty 5-frame
var tablee = [];
for (let i = 0; i < 12; i++) {
  tablee[i] = new Array(12).fill(0);
}

for (k = 0; k < 12; k++) {
  tablee[0][k] = 5;
  tablee[11][k] = 5;
  tablee[k][0] = 5;
  tablee[k][11] = 5;
}

function findNeighbors(x, y) {
  neighbors = [
    { x: Number(x), y: Number(y) - 1 },
    { x: Number(x), y: Number(y) + 1 },
    { x: Number(x) - 1, y: Number(y) - 1 },
    { x: Number(x) - 1, y: Number(y) },
    { x: Number(x) - 1, y: Number(y) + 1 },
    { x: Number(x) + 1, y: Number(y) - 1 },
    { x: Number(x) + 1, y: Number(y) },
    { x: Number(x) + 1, y: Number(y) + 1 },
  ];
  return neighbors;
}
function IsReachable(x, y, tablee, role) {
  neighbors = findNeighbors(x, y);

  if (role == "bl") {
    intRole = 1;
    intChain = 2;
  } else {
    intRole = 3;
    intChain = 4;
  }

  for (k = 0; k < neighbors.length; k++) {
    if (
      tablee[Number(neighbors[k].x)][Number(neighbors[k].y)] == intRole ||
      tablee[Number(neighbors[k].x)][Number(neighbors[k].y)] == intChain
    ) {
      return true;
    }
  }
  return false;
}

function haveAvailable(whichTurn, tablee) {
  id = 0;
  potential = [];
  switch (whichTurn) {
    case "bl":
      id = 3;
      myid = 1;
      myDead = 2;
      break;
    case "re":
      id = 1;
      myid = 3;
      myDead = 4;
      break;
  }

  for (i = 1; i < 11; i++) {
    for (j = 1; j < 11; j++) {
      if (tablee[i][j] == 0 || tablee[i][j] == id) {
        potential.push({ x: Number(i), y: Number(j) });
      }
    }
  }

  for (k = 0; k < potential.length; k++) {
    neighbors = findNeighbors(potential[k].x, potential[k].y);

    for (l = 0; l < neighbors.length; l++) {
      if (
        tablee[neighbors[l].x][neighbors[l].y] == myid ||
        tablee[neighbors[l].x][neighbors[l].y] == myDead
      ) {
        return true;
      }
    }
  }
  return false;
}

function GameFinished(tablee, winner, whichTurn) {
  countX = 0;
  countO = 0;
  for (k = 1; k < 11; k++) {
    for (l = 1; l < 11; l++) {
      switch (tablee[k][l]) {
        case 1:
          countX++;
          break;
        case 3:
          countO++;
          break;
        default:
          break;
      }
    }
  }
  if (countX == 0) {
    winner.win = "red";
    return true;
  } else if (countO == 0) {
    winner.win = "blue";
    return true;
  } else {
    switch (whichTurn) {
      case "bl":
        if (haveAvailable(whichTurn, tablee)) {
          return false;
        } else {
          winner.win = "red";
          return true;
        }

      case "re":
        if (haveAvailable(whichTurn, tablee)) {
          return false;
        } else {
          winner.win = "blue";
          return true;
        }
    }
  }
  return false;
}
//1-blue 2-blueall 3-red 4-redall 0-empty
function IsCorrect(x, y, tablee, role, result) {
  flag = true;
  point = tablee[x][y];
  switch (point) {
    case 0:
      if (IsReachable(x, y, tablee, role)) {
        result.poi = role;

        return true;
      } else {
        return false;
      }
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
        if (IsReachable(x, y, tablee, role)) {
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
var ids = [];

var clients = [];

webSocketServer.on("connection", function (ws) {
  ws.uuid = uuid.v4();
  ids.push(ws.uuid);
  clients.push(ws);
  console.log("новое соединение " + ws);
  //console.log(clients)
  if (clients.length == 2 && gameStatus == "waiting") {
    gameStatus = "firstTurn";
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
    let result = { poi: "empty" };

    flag = IsCorrect(idx, idy, tablee, role, result);

    if (whichTurn != role) {
      switch (role) {
        case "bl":
          clients[0].send("notyourturn-error");
        case "re":
          clients[1].send("notyourturn-error");
      }
      flag = false;
    }

    if (gameStatus == "firstTurn") {
      if (moves == 3) {
        switch (role) {
          case "bl":
            if (Number(idx) != 1 || Number(idy) != 1) {
              flag = false;
            } else {
              flag = true;
              result.poi = role;
            }
            break;
          case "re":
            if (Number(idx) != 10 || Number(idy) != 10) {
              flag = false;
            } else {
              flag = true;
              result.poi = role;
            }
            break;
        }
      }
      if (moves == 1 && whichTurn == "re") {
        gameStatus = "cont";
      }
    }

    if (flag) {
      switch (result.poi) {
        case "bl":
          tablee[idx][idy] = 1;
          break;
        case "re":
          tablee[idx][idy] = 3;
          break;
        case "blueall":
          tablee[idx][idy] = 2;
          break;
        case "redall":
          tablee[idx][idy] = 4;
          break;
      }

      moves -= 1;
      if (moves == 0) {
        switch (whichTurn) {
          case "re":
            whichTurn = "bl";
            moves = 3;
            break;
          case "bl":
            whichTurn = "re";
            moves = 3;
            break;
        }
      }

      clients[0].send("correct-" + idx + "-" + idy + "-" + tablee[idx][idy]);
      clients[1].send("correct-" + idx + "-" + idy + "-" + tablee[idx][idy]);
    } else {
      clients[0].send("notcorrect-" + idx + "-" + idy);
      clients[1].send("notcorrect-" + idx + "-" + idy);
    }
    console.log(idx + " " + idy + " " + role);

    let winner = { win: "empty" };
    if (gameStatus == "cont") {
      if (GameFinished(tablee, winner, whichTurn)) {
        clients[0].send("winner-" + winner.win);
        clients[1].send("winner-" + winner.win);
        clients[0].close();
        clients[1].close();
        client.connect();
        gameRes = "";
        if (winner.win == "red") {
          gameRes = "0-1";
        } else if (winner.win == "blue") {
          gameRes = "1-0";
        }
        idf = ids[0];
        idse = ids[1];
        client.query(
          `INSERT INTO results (id1, id2, matchres) VALUES ($1, $2, $3);`,
          [idf, idse, gameRes],
          (err, res) => {
            if (err) {
              console.error(err);
              return;
            }
          }
        );
      }
    }
  });

  ws.on("close", function () {
    console.log("соединение закрыто " + ws);
    ids.clear;
    while (clients.length > 0) {
      clients.pop();
    }
    moves = 3;
    whichturn = "blue";
    gameStatus = "waiting";
  });
});

server.listen(8443, () => console.log("Server started"));

app.get("/results", function (req, res) {
  console.log("qwewqeqw");
  const query = ` 
  SELECT * 
  FROM results     
  `;
  client1 = new Client({
    user: "test",
    host: "localhost",
    database: "VirusesWarDB",
    password: "1234",
    port: 5432,
  });

  client1.connect();
  client1.query(query, function (err, rows) {
    if (err) {
      console.log(err);
      return;
    }

    res.end(JSON.stringify(rows));
  });
});

app.get("/", function (req, res) {
  res.redirect(301, "index.html");
});

app.listen(3000);
