var socket = new WebSocket("ws://localhost:8443");

var turnscount = 0;
var whichturn = 1;
var role = "und";

function myFunction(x) {
  var idsar = x.id.split("-");
  socket.send(x.id);
  console.log("x: " + x.cellIndex + " y: " + idsar[1]);
}

socket.onopen = function () {
  console.log("Соединение установлено.");
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
  console.log("Получены данные " + message.data);
  str = message.data.toString();
  splited = str.split("-");
  console.log(splited);

  if (splited[0] == "bl" || splited[0] == "re") {
    role = splited[0];
  } else if (splited[0] == "notyourturn") {
    console.log("Ход соперника");
  } else if (splited[0] == "correct") {
    console.log("gg");
    idx = splited[1];
    idy = splited[2];
    role = splited[3];
    console.log(role);
    tmpid = idx + "-" + idy;
    x = document.getElementById(tmpid);
    //1-blue 2-blueall 3-red 4-redall 0-empty
    switch (role) {
      case "1":
        x.innerHTML =
          "<img src='./sprites/cross.png' height=35px width=35px alt='x'/>";
        break;
      case "2":
        x.innerHTML =
          "<img src='./sprites/blueall.png' height=35px width=35px alt='x'/>";
        break;
      case "3":
        x.innerHTML =
          "<img src='./sprites/circle.png' height=35px width=35px alt='x'/>";
        break;
      case "4":
        x.innerHTML =
          "<img src='./sprites/redall.png' height=35px width=35px alt='x'/>";
        break;
    }
  } else if ((splited[0] = "notcorrect")) {
    console.log("Невозможный ход");
  }
};

socket.onerror = function (error) {
  alert("Ошибка " + error.message);
};
