var cursorX;
var cursorY;
document.onmousemove = function(e){
    cursorX = e.pageX;
    cursorY = e.pageY;
}

document.addEventListener('mousedown', function (event) {
  if(event.button===0){
    element_clicked("onPressed");
  }
	event.preventDefault();
}, false);

document.addEventListener('dblclick', function (event) {
  element_clicked("onDoublePressed");
	event.preventDefault();
}, false);

document.addEventListener('mouseup', function (event) {
  element_clicked("onReleased");
	event.preventDefault();
}, false);

document.addEventListener("contextmenu", function(e) {
  e.preventDefault();
  onRightClick();
  element_clicked("onRightClicked");
});

let events = ["dragenter","dragstart","dragend","dragleave","dragover","drag", "drop"];

for(let i = 0;i<events.length;i++){
  canvas.addEventListener(events[i],(e)=>{
    e.preventDefault();
    return false;
  });
}
canvas.addEventListener("drop", function(e) {
  console.log('File(s) dropped');
  e.preventDefault();

  if (e.dataTransfer.items) {
    for (var i = 0; i < e.dataTransfer.items.length; i++) {
      if (e.dataTransfer.items[i].kind === 'file') {
        let file = e.dataTransfer.items[i].getAsFile();
        let reader = new FileReader();
        let fileType = file.name.split(".")[1].toLowerCase();
        reader.onload = function(event) {
          let contents = event.target.result;
          if(fileType==="app"){
            contents='('+contents.toString()+')'.replace(/(\r\n|\n|\r)/gm, "").replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g, '');
            console.log(contents);
            let app = eval(contents);
            console.log(app)
            storage.desktop[file.name.split(".")[0]] = {type:fileType,data:app};
          }else{
            storage.desktop[file.name.split(".")[0]] = {type:fileType,data:{code:contents}};
          }
        };

        reader.onerror = function(event) {
            console.error("File could not be read! Code " + event.target.error.code);
        };
        if(fileType==="txt" || fileType==="app"){
          reader.readAsText(file);
        }else if(fileType==="png" || fileType==="jpg" || fileType==="jpeg" || fileType==="gif" || fileType==="mp3" || fileType==="wav" || fileType==="svg" || fileType==="pdf"){
          reader.readAsDataURL(file);
        }else{
          reader.readAsText(file);
        }
      }
    }
  }
  return false;
});

document.addEventListener('keydown',function (e) {
  key.code=e.which;
  keyCode=e.which;
  keyIsPressed=true;
  if(processes[sendRequest("desktop","getSelected")].hasOwnProperty("keyPressed")){
    if(typeof processes[sendRequest("desktop","getSelected")]["keyPressed"] === 'function'){
      let own=processes[sendRequest("desktop","getSelected")];
      processes[sendRequest("desktop","getSelected")].keyPressed(e,own);
    }
  }
});
