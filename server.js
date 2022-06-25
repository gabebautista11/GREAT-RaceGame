// Node.js WebSocket server script
const http = require("http");
const WebSocketServer = require("websocket").server;
let connections = [];
const server = http.createServer();
server.listen(9898);

let redPos = 10;
let bluePos = 10;
let speed = 5;
let gameRunning = false;

const wsServer = new WebSocketServer({
  httpServer: server,
});

wsServer.on("request", function (request) {
  const connection = request.accept(null, request.origin);
  connections.push(connection);

  connection.on("message", function (message) {
    if (message.utf8Data == "red car moves") {
      redPos += speed;
    } else if (message.utf8Data == "blue car moves") {
      bluePos += speed;
    }
    connections.forEach((connection) => {
      console.log("Received Message:", message.utf8Data);
      if (message.utf8Data == "startgame") {
        gameRunning = true;
        redPos = 10;
        bluePos = 10;
        connection.sendUTF("pos " + redPos + " " + bluePos);
        console.log("game is now running");
        connection.sendUTF("startgame");
      }
      if (gameRunning == true) {
        if (message.utf8Data == "red car moves") {
          connection.sendUTF("pos " + redPos + " " + bluePos);
        } else if (message.utf8Data == "blue car moves") {
          connection.sendUTF("pos " + redPos + " " + bluePos);
        } else if (message.utf8Data == "gameover blue") {
          bluePos = 10;
          redPos = 10;
          connection.sendUTF("restartgame blue");
        } else if (message.utf8Data == "gameover red") {
          bluePos = 10;
          redPos = 10;
          connection.sendUTF("restartgame red");
        }
      }
    });
  });
  connection.on("close", function (reasonCode, description) {
    let oldClient = connections.indexOf(connection);
    delete connections[oldClient];
    console.log("Client has disconnected.");
  });
});
