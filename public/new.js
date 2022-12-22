const socket = io(); //create socket connecton back to server
const players = new Map(); //holds player data
const id = getCookie('id') ||  setCookie('id', Math.floor(generateUniqueId()));
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let mouse = {x: 0, y: 0, xGame: 0, yGame: 0}; //updated by mousemove event
const frameRate = 144;

//need to do this once to center the camera on the map at the start
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//testing values
let map = {players:4, gridSize: 100, grids: 0 }
map.grids = Math.round(map.players/2);
let player = {name: "Aaron", team: "red", x: 50, y: 50, id: 1, radius: 5, acceleration:{x: 0, y: 0}, showName: false, firing: false, velocity: {x: 0, y: 0}, friction: .05 }
let laser = {x: 0, y: 0, angle: 0, team: "red", width: 10, length: 5}
//let camera = {x: player.x, y: player.x, zoom: 1}
let camera = {x: 0, y: 0, zoom: 1}
/*Resources:
https://coolors.co/palette/f94144-f3722c-f8961e-f9844a-f9c74f-90be6d-43aa8b-4d908e-577590-277da1

*/



// Set the initial time
let lastTime = Date.now();
function game(){
  //get_updates();

  handle_input();
  //send_updates();
  draw();
  window.requestAnimationFrame(game);
}
window.requestAnimationFrame(game);

function handle_input(){
  let delta = getTimeSinceLastRun();
  let displacement = {
    x: player.velocity.x*delta + (1/2)*player.acceleration.x*(delta**2),
    y: player.velocity.y*delta + (1/2)*player.acceleration.y*(delta**2)
  }

  //collosion checks
  if(player.x-player.radius + displacement.x <= 0 || player.x+player.radius + displacement.x >= map.grids*map.gridSize){
    player.velocity.x = 0;
  }else{
    player.x += displacement.x
    player.velocity.x += player.acceleration.x*delta
    player.velocity.x *= 1-player.friction*delta
  }
  if(player.y-player.radius + displacement.y <= 0 || player.y+player.radius + displacement.y >= map.grids*map.gridSize){
    player.velocity.y = 0;
  }else{
    player.y += displacement.y
    player.velocity.y += player.acceleration.y*delta
    player.velocity.y *= 1-player.friction*delta
  }
}

// Create a function to return the time since the function last ran
function getTimeSinceLastRun() {
  // Get the current time
  let currentTime = Date.now();

  // Calculate the time since the function last ran
  let timeSinceLastRun = currentTime - lastTime;

  // Update the last time
  lastTime = currentTime;

  // Return the time since the function last ran
  return timeSinceLastRun;
}


function draw(){



  //resize and clear the window
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;


  draw_stars();

  function draw_stars(){
    let starSettings = {offset: 40, width: 5, angle: -45, origin: {x: 0, y: 0}, backgroundColor:[0,0,0], lineColor: [255,255,255]}

    //clear the screen to the background color
    ctx.fillStyle = `rgb( ${starSettings.backgroundColor[0]}, ${starSettings.backgroundColor[1]}, ${starSettings.backgroundColor[2]})`; //allows you to enter varibles between {😊}
    ctx.fillRect(0, 0, canvas.width, canvas.height);

     //draw two sets of line color lines going down at angle above and below based on offset
    ctx.fillStyle = `rgb( ${starSettings.lineColor[0]}, ${starSettings.lineColor[1]}, ${starSettings.lineColor[2]})`;
    ctx.rotate(starSettings.angle * Math.PI / 180); //hasve to cancel rotation
    const amount = Math.floor(Math.sqrt(canvas.width**2 + canvas.height**2))/(starSettings.width+starSettings.offset) + 1;
    for(let i = 0; i < amount; i++){
      ctx.fillRect(starSettings.origin.x + starSettings.offset*i, starSettings.origin.y , starSettings.width, canvas.width+canvas.height);
      ctx.fillRect(starSettings.origin.x  - starSettings.offset*i, starSettings.origin.y , starSettings.width, canvas.width+canvas.height);
    }
    //cancel out the rotation
    ctx.rotate(-starSettings.angle * Math.PI / 180);
  };

  //everything after stars should have some relational position changes based on camera data

  //testing values


  //ctx.translate(canvas.width/2 - player.x, canvas.height/2 - player.y);
  ctx.transform(camera.zoom, 0, 0, camera.zoom, canvas.width/2 - (camera.x*camera.zoom), canvas.height/2 - (camera.y*camera.zoom));
  draw_map();
  function draw_map(){
    map.grids = Math.round(map.players/2)
    if(map.players < 4) map.grids = 2
    let count = 1;
    for(let y = 0; y < map.grids; y++){
      for(let x = 0; x < map.grids; x++){
        ctx.fillStyle = "white"
        ctx.fillRect(x*map.gridSize , y*map.gridSize, map.gridSize, map.gridSize)
        ctx.font =   map.gridSize/5+ 'px Arial';
        ctx.textBaseline = 'top';
        ctx.fillStyle = "black"
        ctx.fillText(count, x*map.gridSize+5,  y*map.gridSize+5);
        ctx.fillRect(x*map.gridSize, y*map.gridSize, map.gridSize, 1)
        ctx.fillRect(x*map.gridSize, y*map.gridSize, 1, map.gridSize)
        count++;
      }
    }
  }
  draw_player();
  function draw_player(){

    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, 2 * Math.PI);
    ctx.fillStyle = "#90BE6D"
    ctx.fill();
    ctx.stroke();
    if(mouse.xGame >= player.x-player.radius && mouse.xGame <= player.x+player.radius && mouse.yGame >= player.y-player.radius && mouse.yGame <= player.y+player.radius) player.showName = true;
    else player.showName = false;
    if(player.showName){
      //Player Name Tag
      let name = {offset: 2, size: player.radius+2}
      //two black box drawn around text to make it stand out
      ctx.fillStyle = "black";
      ctx.fillRect(player.x, player.y+name.size+name.offset, (name.size*(player.name.length/4)), name.size)
      ctx.fillRect(player.x-((name.size*(player.name.length/4))), player.y+name.size +name.offset, (name.size*(player.name.length/4)), name.size)

      ctx.font =   name.size+ 'px Arial';
      ctx.textBaseline = 'top';
      ctx.textAlign = 'center';
      ctx.fillStyle = "#90BE6D"
      ctx.fillText(player.name, player.x,  player.y+name.size+name.offset);
    }

    //handling firing
    //basically add it to the map of lasers to be drawn seperately
    if(player.firing){


      laser.angle = Math.atan2(mouse.yGame - (player.x), mouse.xGame - (player.y))
      //laser.x = Math.cos(laser.angle)*player.radius
      //laser.y = Math.sin(laser.angle)*player.radius
      ctx.save();
      ctx.translate(player.x, player.y);
      laser.angle = Math.atan2(mouse.yGame - player.y, mouse.xGame - player.x)
      ctx.fillStyle = "red";

      ctx.rotate(laser.angle); //hasve to cancel rotation
      ctx.fillRect(player.radius, -laser.length/2, laser.width, laser.length)
      //ctx.translate(-player.x, -player.y);
      //ctx.rotate(-laser.angle); //hasve to cancel rotation
      ctx.restore();
    }

  }

}
