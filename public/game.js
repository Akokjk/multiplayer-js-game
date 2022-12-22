/*
1. get player id cookie, if exist reset the expiration time and tell server player has rejoined/refreshed
else it doesnt exist, create a new id and tell server new player has joined
2. server adds id to list of clients, send it a radom position and unique color
3. client recieves packet from server and set circle to color and location
*/


/*
1. Restructure code for functions
2. Move events to own file
3. come up with new game loop
4. work on implementing camera
5. rework network to only send necessary changes on game update

structure of code
1. define static game varibles
2. game loop

Structure of game loop
intila
get_updates();// get
handle_input/events(); which will call up send updates as needed
send_updates()  // sends server updates for player driven imputs
draw(); //setinterval to be called for 144fps or cap it refresh rate of monitor

draw function
1. clear screen
2. draw hud elements
3. draw applicable game elements
*/
var socket = io(); //create socket connecton back to server
const players = new Map();
function generateUniqueId() {
  return Date.now() + Math.random();
}
//find id cookie if not create else reset expirary on existing cookie
let id = getCookie('id') || false;
if(!id){
  id = Math.floor(generateUniqueId());
  setCookie('id', id);
}
setCookie('id', id);
//tell server that player id: x has joined/rejoined by sending id, server will then update an array of players
socket.emit("joined", id);

/*When  A player connects send a join ping to server*/


const canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');
let shiftX = 0;
let shiftY = 0;
let radius = (window.innerHeight > window.innerWidth ? window.innerWidth*.05 : window.innerHeight*.05);
radius = 5;
let x = canvas.width / 2;
let y = canvas.height / 2;
let mousePos = 0;
let fillcolor = [255, 0,0];
// Create a function to return the cursor position
function getCursorPosition(event) {
// Get the canvas bounds
let rect = canvas.getBoundingClientRect();

// Calculate the cursor position relative to the canvas
let x = event.clientX - rect.left;
let y = event.clientY - rect.top;

// Return the cursor position as an object
return { x: x, y: y };
}

// Add an event listener for the mousemove event
canvas.addEventListener("mousemove", function(event) {
// Get the cursor position
mousePos = getCursorPosition(event);
});





function resizeCanvas() {
  //console.log("resize called, window x: "+ window.innerWidth + " window y: "+ window.innerHeight )
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  players.forEach(player => {
    //console.log(player.position)
    x = player.position[0];
    y = player.position[1];
    ctx.beginPath();
    ctx.arc(x+shiftX, y+shiftY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = `rgb(
    ${player.color[0]},
    ${player.color[1]},
    ${player.color[2]})`;
    ctx.fill();
    ctx.stroke();
  });

  ctx.font = (window.innerHeight > window.innerWidth ? window.innerWidth*.1 : window.innerHeight*.1) + 'px Arial';
  ctx.textBaseline = 'bottom';
  ctx.fillText('Players: ' + players.size, 0, canvas.height);
}

window.addEventListener('resize', resizeCanvas);

socket.on('players', function (data) {
  //console.log("Recieved updated player data: "+ data);
  const arr = JSON.parse(data);
  //players = new Map();
  for (const obj of arr) {
      players.set(obj[0], { position: obj[1].position , color: obj[1].color})
  }
  resizeCanvas();

});
let old = mousePos;
canvas.addEventListener('mousedown', (event) => {

  event.preventDefault();
  console.log(old);
  if (event.button === 0) {
    //console.log(players.values())
    //console.log(id+" Wants to move to " + event.clientX + "," + event.clientY);
    //players.set(id, {color: players.get(id).color, position: [event.clientX, event.clientY]})
    const player = new Player(players.get(id).color,  [event.clientX, event.clientY], id)
    const pdata = JSON.stringify(player);
    //console.log("Sending move update to server: " +pdata)
    socket.emit("input", pdata);
    resizeCanvas();
  }
  if(event.button === 1){
    old = mousePos;

  }
});
canvas.addEventListener('mouseup', (event) => {
  if(event.button === 1){
    if(mousePos.x != old.x){
      console.log("shigting");
      shiftX -= old.x - mousePos.x
      resizeCanvas();
    }
    console.log(shiftX);
  }
});
  // Get the canvas element
