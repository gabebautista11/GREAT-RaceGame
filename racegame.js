let redPos = 10;
let bluePos = 10;
const speed = 9;

let redKey = true;
let blueKey = true;

let racing = false;

//SERVER CONNECTION CODE
//to get IP open terminal and type IPCONFIG
//to run it on VScode open up a terminal by the top bar or ctrl shift  `
//then type node server.js to run the server file
//from there the server should be running
//if server breaks restart it
//if client breaks refresh

//do "npm i" in terminal
const ws = new WebSocket("wss://192.168.86.23:9898/" {secure: true});

ws.onopen = function () {
  console.log("WebSocket Client Connected");
  ws.send("Hi this is web client.");
};

ws.onmessage = function (e) {
  console.log("Received: '" + e.data + "'");
  let data = e.data.split(" ");
  if (data[0] == "pos") {
    redPos = parseInt(data[1]);
    bluePos = parseInt(data[2]);
  } else if (data[0] == "restartgame") {
    //see if red or blue win
    if (data[1] == "blue") {
      console.log("blue won");
      detectWin();
    }
    if (data[1] == "red") {
      console.log("red won");
      detectWin();
    }
  } else if (data[0] == "startgame") {
    startGame();
  }
};

//END SERVER CONNECTION CODE

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const resultsDisplay = document.getElementById("results");
document.addEventListener("keydown", keyboardHandler);
document.body.style.backgroundColor = "#b3ccf5";

const redCar = document.getElementById("redcar");
const blueCar = document.getElementById("bluecar");
const btn = document.getElementById("startbutton");

const finishLine = canvas.width - 15;

let drawID = setInterval(draw, 33);

function runGame() {
  ws.send("startgame");
}

function startGame() {
  btn.style.visibility = "hidden";
  redPos = 10;
  bluePos = 10;
  redKey = true;
  blueKey = true;
  racing = false;
  countDown(3);
}

function countDown(time) {
  if (time == 0) {
    resultsDisplay.innerHTML = "GO!";
    racing = true;
    return;
  }
  resultsDisplay.innerHTML = time;
  setTimeout(countDown, 1000, time - 1);
}

function drawTrack() {
  ctx.fillStyle = "gray";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#ccac39"; // yellow
  for (let i = 0; i < canvas.width; i += 14) {
    ctx.fillRect(i, canvas.height / 2, 7, 2);
  }
  ctx.fillStyle = "black";
  ctx.fillRect(finishLine, 0, 7, canvas.height);
}

function draw() {
  drawTrack();
  ctx.drawImage(redCar, redPos, 7);
  ctx.drawImage(blueCar, bluePos, 46);
}

function detectWin() {
  if (bluePos + 32 > finishLine) {
    racing = false;
    ws.send("gameover blue");
    resultsDisplay.innerHTML = "Blue wins!";
    btn.innerHTML = "Play again";
    btn.style.visibility = "visible";
  } else if (redPos + 32 > finishLine) {
    ws.send("gameover red");
    racing = false;
    resultsDisplay.innerHTML = "Red wins!";
    btn.innerHTML = "Play again";
    btn.style.visibility = "visible";
  }
}

function keyboardHandler(event) {
  if (!racing) {
    return;
  }

  if (event.keyCode == 65) {
    // a
    if (redKey) {
      ws.send("red car moves");
      //redPos += speed;
      redKey = false;
    }
  } else if (event.keyCode == 83) {
    // s

    if (!redKey) {
      ws.send("red car moves");
      // redPos += speed;
      redKey = true;
    }
  } else if (event.keyCode == 74) {
    // j
    if (blueKey) {
      //bluePos += speed;
      blueKey = false;
      ws.send("blue car moves");
    }
  } else if (event.keyCode == 75) {
    // k
    if (!blueKey) {
      //bluePos += speed;
      blueKey = true;
      ws.send("blue car moves");
    }
  }

  detectWin();
}
