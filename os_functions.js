var i = {};
function load_image(src){
  let img = new Image;
  img.src = src;
  img.crossOrigin="anonymous";
  i[src] = img;
  console.log(img);
  return img;
}

function element_clicked(run){
  if(cursorX===undefined){
    return processes[0];
  }
  for (var i = processes.length - 1; i >= 0; i--) {
    if(processes[i]===undefined){
        continue;
    }

    if(processes[i].hasOwnProperty("clickBox")){
      own=processes[i];
      let e = {};
      e.x=define(processes[i].clickBox.x);
      e.y=define(processes[i].clickBox.y);
      e.width=define(processes[i].clickBox.width);
      e.height=define(processes[i].clickBox.height);

      if(cursorX>e.x && cursorX<e.x+e.width){
        if(cursorY>e.y && cursorY<e.y+e.height){
          sendRequest("desktop","setSelected",i)
          if(processes[i].id!=="right_click" && run!=="onRightClicked"){
            killProcess("right_click");
          }

          if(processes[i].hasOwnProperty(run)){
            own=processes[i];
            processes[i][run]();
          }
          return processes[i];
        }
      }
    }
  }
}

function killProcess(id){
  if(typeof id === "string"){
    for (var i = processes.length - 1; i >= 0; i--) {
      if(processes[i].id===id){
        if(processes[i].hasOwnProperty("onKilled")){
          own=processes[i];
          processes[i]["onKilled"]();
        }
        processes.splice(i,1);
      }
    }
    for (var i = processes.length - 1; i >= 0; i--) {
      processes[i].pid=i;
    }
  }else{
    for (var i = processes.length - 1; i >= 0; i--) {
      if(processes[i].pid===id){
        if(processes[i].hasOwnProperty("onKilled")){
          own=processes[i];
          processes[i]["onKilled"]();
        }
        processes.splice(i,1);
      }
    }
    for (var i = processes.length - 1; i >= 0; i--) {
      processes[i].pid=i;
    }
  }
}

function addProcess(process){
  process.pid=processes.length;
  processes.push(process);
  own=processes[processes.length-1];
  if(processes[processes.length-1].hasOwnProperty("init")){
    processes[processes.length-1].init();
  }
}

function addApplication(app){
  let build = {
    id:"app",
    render:()=>{
      if(own.properties.tracking){
        own.properties.x=cursorX+own.properties.offset.x;
        own.properties.y=cursorY+own.properties.offset.y;
      }
      ctx.save();
        //top bar
        ctx.fillStyle="rgba(0,0,0,0.3)";
        ctx.fillRect(own.properties.x,own.properties.y,own.properties.width,20);
        ctx.strokeStyle="rgb(255,255,255)";

        ctx.lineWidth = "2";
        ctx.beginPath();
        ctx.moveTo(own.properties.x+5, own.properties.y+5);
        ctx.lineTo(own.properties.x+15, own.properties.y+15);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(own.properties.x+5, own.properties.y+15);
        ctx.lineTo(own.properties.x+15, own.properties.y+5);
        ctx.stroke();

        ctx.strokeStyle="rgb(150,150,150)";
        if(!(own.properties.hasOwnProperty("preferred") && own.properties.preferred.noResize)){
          ctx.strokeStyle="rgb(255,255,255)";
        }
        ctx.beginPath();
        ctx.rect(own.properties.x+25,own.properties.y+5,10,10)
        ctx.stroke();

        ctx.strokeStyle="rgb(255,255,255)";
        ctx.beginPath();
        ctx.moveTo(own.properties.x+45, own.properties.y+10);
        ctx.lineTo(own.properties.x+55, own.properties.y+10);
        ctx.stroke();
        ctx.lineWidth = "1";

        //application
        ctx.fillStyle="rgb(255,255,255)";
        ctx.fillRect(own.properties.x,own.properties.y+20,own.properties.width,own.properties.height);
        ctx.beginPath();
        ctx.rect(own.properties.x,own.properties.y+20,own.properties.width,own.properties.height);
        ctx.clip();
        ctx.closePath();
        ctx.translate(own.properties.x,own.properties.y+20);
        app.app();
      ctx.restore();
    },
    properties:{
      x:40,
      y:40,
      width:500,
      height:200,
      tracking: false,
      pressed: false,
      offset: {x:0,y:0}
    },
    clickBox: {x:()=>{return own.properties.x},y:()=>{return own.properties.y},height:()=>{return own.properties.height+20},width:()=>{return own.properties.width}},
    onPressed:()=>{
      if(cursorY<own.properties.y+20){
        if(cursorX>own.properties.x+60){
          own.properties.tracking=true;
          own.properties.offset={x:own.properties.x-cursorX,y:own.properties.y-cursorY};
        }else{
          if(cursorX<own.properties.x+20){
            //x button
            killProcess(own.pid);
          }else if(cursorX<own.properties.x+40){
            //full screen button
            if(own.properties.x===0 && own.properties.y===0 && own.properties.width===canvas.width && own.properties.height===canvas.height-60){
              own.properties.x=40;
              own.properties.y=40;
              if(own.properties.hasOwnProperty("preferred")){
                if(own.properties.preferred.hasOwnProperty("width")){
                  own.properties.width=own.properties.preferred.width;
                }
                if(own.properties.preferred.hasOwnProperty("height")){
                  own.properties.height=own.properties.preferred.height;
                }
              }else{
                own.properties.width=500;
                own.properties.height=200;
              }
            }else{
              if(own.properties.hasOwnProperty("preferred") && own.properties.preferred.noResize){

              }else{
                own.properties.x=0;
                own.properties.y=0;
                own.properties.width=canvas.width;
                own.properties.height=canvas.height-60;
              }
            }
          }else{
            //minimize button
            killProcess(own.pid);
          }
        }
      }else{
        own.properties.pressed=true;
        if(app.hasOwnProperty('onPressed')){
          app.onPressed();
        }
      }
    },
    onReleased:()=>{
      own.properties.tracking=false;
      own.properties.pressed=false;
    }
  };
  if(app.hasOwnProperty('init')){
    build.init=app.init;
  }
  Object.keys(app).forEach(function(key,index) {
    if(key!=="app" && key!=="onReleased" && key!=="onPressed" && key!=="clickBox" && key!=="properties" && key!=="render"){
      build[key]=app[key];
    }
  });
  addProcess(build);
}

function sendRequest(otherprocess,req,data){
  let otherProcess = otherprocess;
  if(typeof otherprocess === "string"){
    for (var i = processes.length - 1; i >= 0; i--) {
      if(processes[i].id===otherprocess){
        otherProcess=i;
        break;
      }
    }
  }
  if(processes[otherProcess].hasOwnProperty(req)){
    own=processes[otherProcess];
    if(data===undefined){
      return processes[otherProcess][req]();
    }else{
      return processes[otherProcess][req](data);
    }
  }
}

function define(input){
  if(typeof input === "function"){
    return(input());
  }else{
    return(input);
  }
}

function collision(x1,y1,w1,h1,x2,y2,w2,h2,callback){
  if(x1<x2+w2 && x1+w1>x2 && y1<y2+h2 && y1+h1>y2){
    callback();
  }
}

function onBoot(){
  if(window.navigator.vendor!=="Google Inc."){
    alert("Your browser may not be supported")
  }

  addProcess({
    id:"desktop",
    render:()=>{
      ctx.drawImage(define(own.properties.img), 0, 0, define(own.properties.img).width, define(own.properties.img).height, 0, 0, canvas.width, canvas.height);

      let x = 20;
      let y = 20;
      ctx.lineWidth = "2";
      ctx.font = "15px sans-serif"
      Object.keys(storage.desktop).forEach(function(key,index) {
        ctx.fillStyle="rgba(0,0,0,0.5)";
        ctx.strokeStyle="rgb(255,255,255)";
        if(y+84>canvas.height-40){
          y=20;
          x+=84;
        }
        let img = new Image();
        if(storage.desktop[key].type===undefined){
          img.src=storage.os.logos.data["folder"];
        }else{
          img.src=storage.os.logos.data[storage.desktop[key].type];
        }
        if(own.properties.dragging){
          let box = own.properties.drag;
          let touched = false;
          if(box.x<box.newX){
            if(box.y<box.newY){
              collision(x,y,64,64,box.x,box.y,box.newX-box.x,box.newY-box.y,()=>{
                own.properties.highlight[key]=true;
                touched=true;
              })
            }else{
              collision(x,y,64,64,box.x,box.newY,box.newX-box.x,box.y-box.newY,()=>{
                own.properties.highlight[key]=true;
                touched=true;
              })
            }
          }else{
            if(box.y<box.newY){
              collision(x,y,64,64,box.newX,box.y,box.x-box.newX,box.newY-box.y,()=>{
                own.properties.highlight[key]=true;
                touched=true;
              })
            }else{
              collision(x,y,64,64,box.newX,box.newY,box.x-box.newX,box.y-box.newY,()=>{
                own.properties.highlight[key]=true;
                touched=true;
              })
            }
          }
          if(!touched){
            own.properties.highlight[key]=false;
          }
        }
        if(own.properties.highlight[key]){
          ctx.fillRect(x,y,64,64);
          ctx.strokeRect(x,y,64,64);
        }
        ctx.drawImage(img,x,y)
        ctx.fillStyle="rgba(255,255,255)";
        if(storage.desktop[key].hasOwnProperty('type')){
          ctx.fillText(key+"."+storage.desktop[key].type,x+32-(ctx.measureText(key+"."+storage.desktop[key].type).width/2),y+77)
        }else{
          ctx.fillText(key,x+32-(ctx.measureText(key).width/2),y+77)
        }
        y+=84;
      });
      ctx.lineWidth = "1";
      if(own.properties.dragging){
        own.properties.drag.newX=cursorX;
        own.properties.drag.newY=cursorY;
        let box = own.properties.drag;
        ctx.fillStyle="rgba(0,200,255,0.5)";
        ctx.strokeStyle="rgb(0,200,255)"
        ctx.fillRect(box.x,box.y,box.newX-box.x,box.newY-box.y);
        ctx.strokeRect(box.x,box.y,box.newX-box.x,box.newY-box.y);
        if(processes[own.properties.selected].id!=="desktop"){
          own.properties.dragging=false;
        }
      }
    },
    init: ()=>{
      load_image("./src/background2.png");
      load_image("./src/background.png");
    },
    properties:{
      img:()=>{return i["./src/background.png"]},
      name:"./src/background.png",
      selected:0,
      highlight:{}
    },
    clickBox: {x:0,y:0,height:()=>{return canvas.height},width:()=>{return canvas.width}},
    onDoublePressed: ()=>{
      Object.keys(own.properties.highlight).forEach(function(key) {
        if(own.properties.highlight[key]){
          own.properties.highlight[key]=false;
          sendRequest("desktop","open",{folder:storage.desktop,key:key});
        }
      });
    },
    open:(data)=>{
      if(data.key===undefined){
        storage.os.settings.data["folder"]("");
      }else{
        storage.os.settings.data[data.folder[data.key].type](data.folder[data.key].data);
      }
    },
    onPressed: ()=>{
      own.properties.dragging=true;
      own.properties.drag = {x:cursorX,y:cursorY};
    },
    onReleased: ()=>{
      own.properties.dragging=false;
    },
    onRightClicked:()=>{
      Object.keys(own.properties.highlight).forEach(function(key) {
        if(own.properties.highlight[key]){
          sendRequest("right_click","setContextMenu",
            [
              {
                name:"open",
                action:()=>{
                  sendRequest("desktop","onDoublePressed");
                }
              },
              {
                name:"delete",
                action:()=>{
                  delete storage.desktop[key]
                }
              },
              {
                name:"download",
                action:()=>{
                  if(storage.desktop[key].type===undefined || storage.desktop[key].type==="app"){
                    return;
                  }

                  let link = document.createElement("a");
                  link.download = key+"."+storage.desktop[key].type;
                  link.href = storage.desktop[key].data.code;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  delete link;
                }
              }
            ]
          )
        }
      });
    },
    onKilled:()=>{
      alert("Well frick, you or a program just killed the main process. This will crash the entire OS.");
    },
    setSelected: (data)=>{
      own.properties.selected=data;
    },
    getSelected: ()=>{
      return(own.properties.selected);
    }
  });
  addProcess({
    id:"bottom_bar",
    render:()=>{
      ctx.fillStyle="rgba(0,0,0,0.3)";
      ctx.fillRect(0, canvas.height-40,40,40);
      ctx.strokeStyle="rgb(255,255,255)";
      ctx.fillStyle="rgba(0,0,0,0.5)";
      ctx.fillRect(0, canvas.height-40,canvas.width,40);
      ctx.lineWidth = "2";
      ctx.beginPath();
      ctx.ellipse(20, canvas.height-20, Math.abs(15/2), Math.abs(15/2), 0, 0, Math.PI*2);
      ctx.stroke();
      ctx.lineWidth = "1";
      let x = 50;
      ctx.font = "15px sans-serif";
      for(let i = 0;i<processes.length;i++){
        if(processes[i].id==="desktop" || processes[i].id==="bottom_bar" || processes[i].id==="right_click")
          continue;
        ctx.fillStyle="rgb(255,255,255)";;
        ctx.fillText(processes[i].id,x,canvas.height-15)
        if(cursorX>x-5 && cursorX<x+ctx.measureText(processes[i].id).width+5){
          if(cursorY>canvas.height-40){
            ctx.fillStyle="rgba(0,0,0,0.5)";
            ctx.fillRect(x-5, canvas.height-40,ctx.measureText(processes[i].id).width+10,40);
          }
        }
        x+=ctx.measureText(processes[i].id).width+10
      }
      //date and time
      let today = new Date();
      let date = (today.getMonth()+1)+'/'+today.getDate()+'/'+today.getFullYear();
      let hours = today.getHours();
      let ext = "AM";
      if(hours>12){
        hours-=12;
        ext="PM";
      }
      let time = hours + ":" + (today.getMinutes()<10?"0"+today.getMinutes():today.getMinutes())+" "+ext;
      ctx.fillStyle="rgb(255,255,255)";;
      ctx.fillText(date,canvas.width-50-(ctx.measureText(date).width/2),canvas.height-7.5)
      ctx.fillText(time,canvas.width-50-(ctx.measureText(time).width/2),canvas.height-22.5)
    },
    clickBox: {x:0,y:()=>{return canvas.height-40},height:40,width:40},
    onPressed:()=>{

    }
  })
}

function onRightClick(){
  killProcess("right_click");
  addProcess({
    id:"right_click",
    render:()=>{
      ctx.fillStyle="rgba(0,0,0,0.5)";
      ctx.fillRect(own.properties.x,own.properties.y,own.properties.width,own.properties.options.length*20);
      for(let i = 0;i<own.properties.options.length;i++){
        ctx.font = "15px sans-serif";
        ctx.fillStyle="rgb(255,255,255)";
        ctx.fillText(own.properties.options[i].name,5+own.properties.x,i*20+15+own.properties.y)
      }
    },
    clickBox: {x:cursorX,y:cursorY,height:100,width:100},
    properties:{
      x:cursorX,
      y:cursorY,
      width:0,
      options:[]
    },
    onReleased:()=>{
      for(let i = 0;i<own.properties.options.length;i++){
        if(cursorY>i*20+own.properties.y && cursorY<i*20+15+own.properties.y){
          if(own.properties.options[i].hasOwnProperty("action")){
            own.properties.options[i].action();
            killProcess("right_click");
          }
        }
      }
    },
    setContextMenu:(list)=>{
      own.properties.options=[];
      let max = 0;
      ctx.font="15px sans-serif";
      for(let i = 0;i<list.length;i++){
        own.properties.options.push(list[i]);
        if(max<ctx.measureText(list[i].name).width){
          max=ctx.measureText(list[i].name).width;
        }
      }
      own.properties.width=max+10<100?100:max+10;
    }
  })
}
