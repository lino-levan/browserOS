{
  app:()=>{
    //set backdround color
    background(0,255,255);
    //draw the grass
    noStroke();
    fill(0, 255, 0);
    rect(0,300,400,100);
    //the sun
    fill(238, 255, 0);
    ellipse(9,9,100,100);
    //the horse`s body
    fill(255, 0, 187);
    ellipse(200,225,200,100);
    //the horse`s legs
    rect(130,260,15,75);
    rect(255,260,15,75);
    fill(0);
    rect(130,330,15,5);
    rect(255,330,15,5);
    //horse`s head
    fill(255, 0, 187);
    ellipse(300,225,100,40);
    ellipse(320,250,50,40);
  },
  init:()=>{
    own.properties.width=400;
    own.properties.height=400;
    own.properties.preferred={width:400,height:400,noResize:true};
  },
  id:"pony"
}
