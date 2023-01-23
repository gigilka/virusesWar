var socket = new WebSocket("ws://localhost:8443");

var turnscount = 0;
var whichturn = 1;

function iscorrect(x) {
  var xc = x.cellIndex;
  var idsar = x.id.split("-");
  var yc = idsar[1];
}

function myFunction(x) {
  var idsar = x.id.split("-");
  x.innerHTML =
    "<img src='./sprites/redall.png' height=35px width=35px alt='x'/>";
  console.log("x: " + x.cellIndex + " y: " + idsar[1]);
}

socket.onopen = function () {
  alert("Соединение установлено.");
  socket.send("connected");
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
  if (message == "first") {
    document.getElementById("whichturn").innerHTML = "first";
  }
  if (message == "second") {
    document.getElementById("whichturn").innerHTML = "second";
  }
  if (message == "") alert("Получены данные " + message.data);
};

socket.onerror = function (error) {
  alert("Ошибка " + error.message);
};
