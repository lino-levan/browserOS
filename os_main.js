onBoot();

function execution_loop(){
  //continue 60fps loop
  setTimeout(execution_loop,1000/60);

  //resize screen
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  //send render request
  render();
}
execution_loop();
