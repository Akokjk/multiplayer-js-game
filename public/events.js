// Add an event listener for the mousemove event
let held = false;
let old = 0;

window.addEventListener("mousemove", function(event) {
  // Get the canvas bounds
  let rect = canvas.getBoundingClientRect();
  // Calculate the cursor position relative to the canvas
  let x = event.clientX - rect.left; //gets the actual
  let y = event.clientY - rect.top;
  // update mousePosition element
  let xTranslate = (x - canvas.width/2)/camera.zoom + camera.x  //, y: (canvas.height/2 - (mouse.y*camera.zoom))}
  let yTranslate = (y - canvas.height/2)/camera.zoom + camera.y
  mouse = { x: x, y: y, xGame: xTranslate, yGame: yTranslate   }; //return the mouse position x,y format

  if(held){
    const x = Math.floor(mouse.xGame);
    const y = Math.floor(mouse.yGame);
    if(x != old.x){
      camera.x += Math.floor((old.x - x));
      //old.x = Math.floor(mouse.xGame)
    }
    if(y != old.y){
      camera.y += Math.floor((old.y - y));
      //old.y = Math.floor(mouse.yGame)
    }
  }
});


window.addEventListener('mousedown', (event) => {
event.preventDefault();
 //fire lasers event
  if(event.button === 0){
    player.firing = true;
  }

  if(event.button === 1 ){
    if(!held){
      old = {x: Math.floor(mouse.xGame), y: Math.floor(mouse.yGame)}
      held = true;
    }
  }
});
window.addEventListener('mouseup', (event) => {

  if(event.button === 1){
    if(held)
      held = false;
  }
  if(event.button === 0){
    player.firing = false;
  }
});

window.addEventListener("keydown", (event) => {
  //debug console output
  if (event.key === '`') {
    const style = "border-style: solid; font-size: 20px"
    console.log("%cMouse X: "+ Math.floor(mouse.xGame) + " Y: " + Math.floor(mouse.yGame), style);
    console.log("%cPlayer X: "+ player.x + " Y: " + player.y, style);
    console.log("%cLaser Angle: "+ laser.angle, style);
  }
  if(event.key === 'w'){
    player.acceleration.y = -.01;
  }
  if(event.key === 's'){
    player.acceleration.y = .01;
  }
  if(event.key === 'd'){
    //
    //console.log(delta);
    player.acceleration.x = .01;

  }
  if(event.key === 'a'){
    player.acceleration.x = -.01;
  }
});

window.addEventListener("keyup", (event) => {
  if(event.key === 'w'){
    player.acceleration.y = 0;
  }
  if(event.key === 's'){
    player.acceleration.y =0 ;
  }
  if(event.key === 'd'){
    player.acceleration.x = 0;

  }
  if(event.key === 'a'){
    player.acceleration.x = 0;
  }
});



//add this back into events because 🐛🤩
window.addEventListener('resize', (event) => {
  game();
});
//zoom
window.onwheel = ((event) => {
  //event.preventDefault();

  camera.zoom += (event.deltaY > 0 ? -1 : 1) * .1;
  // Restrict scale
  camera.zoom = Math.min(Math.max(.1, camera.zoom), 5);
  //camera.x =  mouse.xGame/camera.zoom
  //camera.y =   mouse.yGame
  // Apply scale transform
  //camera.zoom = camera.zoom.toFixed(2)

  game();
});


//Prompt for player before refreshing
window.onbeforeunload = function (e) {
    e = e || window.event;

    // For IE and Firefox prior to version 4
    if (e) {
        e.returnValue = 'Sure?';
    }
   return 'Reloading will reset the game. Are you sure?';
}
