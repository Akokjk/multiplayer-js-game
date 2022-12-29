const http = require('http');
const express = require('express');
const app = express();
const fs = require('fs');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
let nextClientId = 1;
app.use(express.static('public'))


class Player {
  constructor(color, position, id) {
    this.id = id;
    this.color = color;
    this.position = position;
  }
};

const players = new Map();

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {

  socket.on('input', function (data) {
    //console.log("Recieved input data")
    //console.log("Recieved input; " + data)
    const arr = JSON.parse(data);
    //console.log("Recieved input; " + arr.id)
    players.set(arr.id, {color: arr.color, position: arr.position })
    const pdata = JSON.stringify([...players]);
    //console.log("Sending updated player data to clients.")
    setTimeout(() => {  io.emit("players", pdata) }, 0);

  });

  socket.on('player', function (data) {
    //console.log("Recieved input data")
    //console.log("Recieved input; " + data)
    const arr = JSON.parse(data);
    //console.log("Recieved input from " + { x: arr.x, y: arr.y, name: arr.name, team: arr.team, firing: arr.firing, acceleration: arr.acceleration, velocity: arr.velocity})
    players.set(arr.id, { x: arr.x, y: arr.y, name: arr.name, team: arr.team, firing: arr.firing, acceleration: arr.acceleration, velocity: arr.velocity})
    const pdata = JSON.stringify([...players]);
    //console.log("Sending updated player data to clients.")
    setTimeout(() => {  io.emit("players", pdata) }, 0);

  });


  socket.on('joined', function (data) {
    if(!players.has(data)){
      console.log(data + " doesnt not exist. Creating a new player.");
        player = new Player([Math.floor(Math.random() * 255),Math.floor(Math.random() * 255),Math.floor(Math.random() * 255)], [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)], data);
        players.set(data, { color: player.color, position: player.position})
    }
    else{
      console.log(data + " has rejoined.")
    }
    const pdata = JSON.stringify([...players]);
    console.log("Sending player data: " + pdata)
    //console.log("Sending updated player data to clients.")
    io.emit("players", pdata)
  });
  socket.on('disconnect', () => {
   console.log('user disconnected');
 });


});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
