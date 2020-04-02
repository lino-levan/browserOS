{
  app:()=>{
    fill(0)
    textSize(15);
    text("Storage",5,10)
    Object.keys(storage).forEach(function(key,index) {
      text(key,10,(index*15)+27.5);
    })
    text(own.properties.cd,100,10)
    ctx.strokeStyle="rgb(150,150,150)";
    ctx.lineWidth=2;
    ctx.beginPath();
    ctx.moveTo(95,5);
    ctx.lineTo(95,own.properties.height-5);
    ctx.stroke();
    ctx.lineWidth=1;
    stroke(0);
    ctx.save();
    ctx.translate(100,20)
    Object.keys(own.properties.actualDir).forEach(function(key,index) {
      if(cursorX>own.properties.x+100 && cursorX<own.properties.x+own.properties.width){
        if(cursorY>own.properties.y+index*20+44 && cursorY<own.properties.y+index*20+64){
          fill(0,0,0,100)
          rect(0,index*20+4,own.properties.width-95,20)
        }
      }
      fill(0)
      let img = new Image();
      if(storage.desktop[key].type===undefined){
        img.src=storage.os.logos.data["folder"];
      }else{
        img.src=storage.os.logos.data[storage.desktop[key].type];
      }

      if(own.properties.actualDir[key].hasOwnProperty('type')){
        text(key+"."+storage.desktop[key].type,20,index*20+15)
      }else{
        text(key,20,index*20+15)
      }
      ctx.drawImage(img,0,index*20+6,16,16)
    });
    ctx.restore();
  },
  init:()=>{
    own.properties.cd = "./desktop";
    own.properties.actualDir = storage;
    for(let i = 1;i<own.properties.cd.split("/").length;i++){
      own.properties.actualDir=own.properties.actualDir[own.properties.cd.split("/")[i]];
    }
    let height = 300;
    if(Object.keys(own.properties.actualDir).length*20+30>height){
      height=Object.keys(own.properties.actualDir).length*20+30;
    }
    own.properties.width=400;
    own.properties.height=height;
    own.properties.preferred={width:400,height:height};
  },
  onDoublePressed:()=>{
    Object.keys(own.properties.actualDir).forEach(function(key,index) {
      if(cursorX>own.properties.x+100 && cursorX<own.properties.x+own.properties.width){
        if(cursorY>own.properties.y+index*20+44 && cursorY<own.properties.y+index*20+64){
          sendRequest("desktop","open",{folder:own.properties.actualDir,key:key});
        }
      }
    });
  },
  load:(data)=>{
    console.log(data);
  },
  id:"files"
}
