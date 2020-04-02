{
  app:()=>{
    let flock = own.properties.flock;

    let groupDist = 40;
    let closeDist = 10;
    noStroke();

    for(var j = 0;j<10;j++){
      for(var i = 0;i<flock.length;i++){
        pushMatrix();
        translate(flock[i][1],flock[i][2]);
        rotate(flock[i][0]);
        //noFill();
        //ellipse(0,0,groupDist*2,groupDist*2);
        fill(Math.pow((map(flock[i][0],0,own.properties.height,0,255)%255)/255,2)*255,255-(map(flock[i][0],0,own.properties.height,0,255)%255),map(flock[i][0],0,own.properties.height,0,255)%255);
        triangle(-5,-5,-5,5,5,0);
        popMatrix();
        //move forward
        flock[i][1]+=cos(flock[i][0])*flock[i][3];
        flock[i][2]+=sin(flock[i][0])*flock[i][3];
        //handle sides
        if(flock[i][1]>own.properties.width+10){
            flock[i][1]=-10;
        }
        if(flock[i][1]<-10){
            flock[i][1]=own.properties.width+10;
        }
        if(flock[i][2]>own.properties.height+10){
            flock[i][2]=-10;
        }
        if(flock[i][2]<-10){
            flock[i][2]=own.properties.height+10;
        }
        //do alignment
        for(var j = 0;j<flock.length;j++){
          if(i!==j){
            if(dist(flock[i][1],flock[i][2],flock[j][1],flock[j][2])<closeDist){
              if(flock[i][0]>flock[j][0]){
                flock[i][0]+=10;
              }else{
                flock[i][0]-=10;
              }
            }else if(dist(flock[i][1],flock[i][2],flock[j][1],flock[j][2])<groupDist){
              if(flock[i][0]>flock[j][0]){
                flock[i][0]-=2;
              }else if(flock[i][0]<flock[j][0]){
                flock[i][0]+=2;
              }
            }
          }
        }
      }
    }
  },
  init:()=>{
    own.properties.width=600;
    own.properties.height=600;
    own.properties.preferred={width:600,height:600};
    let population = 200;
    own.properties.flock=[];
    let speed = 1;
    for(var i=0;i<population;i++){
      own.properties.flock.push([round(random(0,360)),round(random(0,own.properties.width)),round(random(0,own.properties.width)),speed]);
    }
  },
  onPressed:()=>{
    let speed = 1;
    own.properties.flock.push([round(random(0,360)),cursorX-own.properties.x,cursorY-own.properties.y-20,speed]);
  },
  id:"boids"
}
