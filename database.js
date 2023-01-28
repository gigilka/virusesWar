function init() {
  var req = new XMLHttpRequest();

  req.open("GET", "/results");
  req.send();
  req.onload = function () {
    if (req.status != 200) {
      alert(`Ошибка ${req.status}: ${req.statusText}`);
    } else {
      let response = JSON.parse(req.response);
      let table = document.getElementById("resultstable");
      table.innerHTML = "";
      let header = table.createTHead();
      let headerRow = header.insertRow();
      headerRow.insertCell().innerHTML = "id1";
      headerRow.insertCell().innerHTML = "id2";
      headerRow.insertCell().innerHTML = "Результат";
      let body = table.createTBody();
      for (row of response.rows) {
        let newRow = body.insertRow();
        for (let key in row) {
          let cell = newRow.insertCell();
          cell.innerHTML = row[key];
        }
      }
    }
  };
}
