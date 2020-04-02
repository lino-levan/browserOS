function render(){
  for(let i = 0;i<processes.length;i++){
    own=processes[i];
    processes[i].render();
  }
}
