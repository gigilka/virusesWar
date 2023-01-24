var socket = new WebSocket("ws://localhost:8443");

var turnscount = 0;
var whichturn = 1;
var role = "und";
function iscorrect(x, turnscount, whichturn) {
  var xc = x.cellIndex;
  var idsar = x.id.split("-");
  var yc = idsar[1];
}

function myFunction(x) {
  var idsar = x.id.split("-");
  socket.send(x.id + "-" + role);
  console.log("x: " + x.cellIndex + " y: " + idsar[1]);
}

socket.onopen = function () {
  alert("Соединение установлено.");
};

socket.onclose = function (event) {
  if (event.wasClean) {
    alert("Соединение закрыто чисто");
  } else {
    alert("Обрыв соединения");
  }
  alert("Код: " + event.code + " причина: " + event.reason);
};

socket.onmessage = function (message) {
  alert("Получены данные " + message.data);
  str = message.data.toString();
  splited = str.split("-");
  console.log(splited);

  if (splited[0] == "bl" || splited[0] == "re") {
    role = splited[0];
  }
  if (splited[0] == "correct") {
    alert("gg");
    idx = splited[1];
    idy = splited[2];
    role = splited[3];
    tmpid = idx + "-" + idy;
    x = document.getElementById(tmpid);
    if (role == "bl") {
      x.innerHTML =
        "<img src='./sprites/cross.png' height=35px width=35px alt='x'/>";
    } else {
      x.innerHTML =
        "<img src='./sprites/circle.png' height=35px width=35px alt='x'/>";
    }
  }
};

socket.onerror = function (error) {
  alert("Ошибка " + error.message);
};
