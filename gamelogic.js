var socket = new WebSocket("ws://localhost:8443");

var turnscount = 0;
var whichturn = 1;

function click(id) {
  socket.send(id);
  document.getElementById(
    id
  ).innerHTML = `<div class='cell' id='${id}' onclick='click()'> 
    <img id='$8' src='/sprites/1st.png' style='width: 100%; max-height:100% draggable="false"'>  
</div>\n`;
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
