{
  app:()=>{
    if(own.properties.data!==""){
      if(own.properties.type==="image"){
        if(own.properties.data.width<64 || own.properties.data.height<64){
          ctx.imageSmoothingEnabled = false;
        }
        background(100)
        for(let i = 0;i<16;i++){
          for(let j = 0;j<16;j++){
            if(i%2===0 && j%2===0){
              fill(50);
            }else{
              if(i%2===1 && j%2===1){
                fill(50);
              }else{
                fill(100)
              }
            }
            noStroke();
            rect(i*(own.properties.width/16),j*(own.properties.height/16),own.properties.width/16,own.properties.height/16)
          }
        }
        ctx.save();
        ctx.scale(own.properties.width/own.properties.data.width,own.properties.height/own.properties.data.height);
        ctx.drawImage(own.properties.data,0,0)
        ctx.restore();
        ctx.imageSmoothingEnabled = true;
      }else if(own.properties.type==="audio"){
        ctx.save();
          ctx.translate(0,25);
          ctx.strokeStyle="rgb(0,0,0)"
          ctx.lineWidth=3;
          ctx.beginPath();
          ctx.moveTo(50, 100);
          ctx.lineTo(450, 100);
          ctx.stroke();
          ctx.font = "15px sans serif"
          textSize(15);
          fill(0);
          text("0:00",50-(ctx.measureText("0:00").width/2),120);

          line((own.properties.data.currentTime/own.properties.data.duration)*400+50,95,(own.properties.data.currentTime/own.properties.data.duration)*400+50,105);

          let seconds = Math.round(own.properties.data.currentTime%60);
          if(seconds<10){
              seconds="0"+seconds;
          }
          if(!own.properties.data.ended){
            text(Math.floor(own.properties.data.currentTime/60)+":"+seconds,(own.properties.data.currentTime/own.properties.data.duration)*400+50-(ctx.measureText(Math.floor(own.properties.data.currentTime/60)+":"+seconds).width/2),120);
          }

          seconds = Math.round(own.properties.data.duration%60);
          if(seconds<10){
              seconds="0"+seconds;
          }

          text(Math.floor(own.properties.data.duration/60)+":"+seconds,450-(ctx.measureText(Math.floor(own.properties.data.duration/60)+":"+seconds).width/2),120);
          ctx.lineWidth=1;
        ctx.restore();
        fill(0);
        if(own.properties.data.ended || own.properties.data.paused){
          rect(225,50,15,50);
          rect(260,50,15,50);
        }else{
          triangle(225,50,225,100,275,75)
        }
        if(own.properties.pressed && cursorY>140+own.properties.y && cursorY<150+own.properties.y && cursorX>50+own.properties.x && cursorX<450+own.properties.x){
          own.properties.data.currentTime=((cursorX-own.properties.x-50)/400)*own.properties.data.duration
        }
      }else if(own.properties.type==="text"){
        textSize(15);
        fill(0);
        text(own.properties.data,5,10);
      }
    }
  },
  init:()=>{
    own.properties.data ="";
    own.properties.type ="";
    own.properties.scale = 2;
    own.properties.width=500;
    own.properties.height=500;
    own.properties.preferred={width:500,height:500};
  },
  id:"preview",
  load:(data)=>{
    let has = (i)=>{return data.code.split(";")[0].includes(i)}
    own.properties.type=(has("png") || has("jpg") || has("jpeg") || has("gif") || has("svg"))?"image":((has("mp3") || has("wav") || has("ogg") || has("mpeg"))?"audio":"text");
    if(own.properties.type==="image"){
      let temp = new Image();
      temp.onload = ()=>{
        let width;
        let height;
        if(temp.width>500 || temp.height>500){
          if(temp.width>temp.height){
            width=500;
            height=(500/temp.width)*temp.height;
          }else{
            height=500;
            width=(500/temp.height)*temp.width;
          }
        }else
        if(temp.width<100 || temp.height<100){
          if(temp.width<temp.height){
            width=100;
            height=(100/temp.width)*temp.height;
          }else{
            height=100;
            width=(100/temp.height)*temp.width;
          }
        }else{
          width=temp.width;
          height=temp.height;
        }

        own.properties.data=temp;
        own.properties.preferred={width:width,height:height};
        own.properties.width=width;
        own.properties.height=height;
      }
      temp.src=data.code;
    }else if(own.properties.type==="audio"){
      own.properties.data=new Audio(data.code);
      own.properties.preferred={width:500,height:200,noResize:true};
      own.properties.width=500;
      own.properties.height=200;
      own.properties.data.play();
    }else if(own.properties.type==="text"){
      own.properties.data=data.code;
    }
  },
  onPressed:()=>{
    if(own.properties.type==="audio"){
      if(cursorX>225+own.properties.x && cursorX<275+own.properties.x && cursorY>50+own.properties.y && cursorY<100+own.properties.y){
        if(own.properties.data.ended || own.properties.data.paused){
          own.properties.data.play();
        }else{
          own.properties.data.pause();
        }
        if(own.properties.data.currentTime>0.2){
          //own.properties.data.currentTime=0;
        }
      }
    }
  },
  onKilled:()=>{
    if(own.properties.type==="audio"){
      own.properties.data.pause();
    }
  }
}
