function createPlayers(){
  for (let i = 0; i < 100; i++){
    socket.emit("joined", i);
  }
}

function move(id){

  const player = new Player(null,  [Math.floor(Math.random() * 765), Math.floor(Math.random() * 500)], id)
  const pdata = JSON.stringify(player);
  //console.log("Sending move update to serveir: " +pdata)
  socket.emit("input", pdata);
}

function easeTransition(canvas, element, startX, startY, endX, endY, duration) {
  // Calculate the distance between the start and end positions
  const distanceX = endX - startX;
  const distanceY = endY - startY;
  // Calculate the number of steps required to complete the transition
  const steps = Math.ceil(duration / 10);
  // Calculate the increment in X and Y for each step
  const incrementX = distanceX / steps;
  const incrementY = distanceY / steps;
  let currentX = startX;
  let currentY = startY;
  // Set a counter for the number of steps taken
  let step = 0;
  // Use setInterval to repeat the transition over a set duration
  const interval = setInterval(() => {
    // Increment the counter
    step++;
    // Update the current position
    currentX += incrementX;
    currentY += incrementY;
    // Clear the canvas
    canvas.clearRect(0, 0, canvas.canvas.width, canvas.canvas.height);
    // Draw the element at the updated position
    canvas.drawImage(element, currentX, currentY);
    // If the counter has reached the number of steps, clear the interval
    if (step >= steps) {
      clearInterval(interval);
    }
  }, 10);
}
