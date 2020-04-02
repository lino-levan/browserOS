{
  app:()=>{
    if(own.properties.log.length>=1){
      own.properties.log.shift();
      console.log("bruh")
    }
    console.log(own.properties.log.length)
    background(0);
    fill(255);
    textSize(15);
    for(let i = 0;i<own.properties.log.length;i++){
      el=own.properties.log[i];
      text(el,5,i*20+10)
    }
    text(own.properties.cd+">"+own.properties.wrote,5,own.properties.log.length*20+10)
    if(own.properties.enter!==""){
      let actualDir = storage;
      for(let i = 1;i<own.properties.cd.split("/").length;i++){
        actualDir=actualDir[own.properties.cd.split("/")[i]];
      }
      own.properties.log.push(own.properties.cd+">"+own.properties.enter);
      let args = own.properties.enter.split(" ");
      let has = (e)=>{return args[0]===e}
      try{
        if(has("ls")){
          let temp = [];
          Object.keys(actualDir).forEach(function(key,index) {
            if(actualDir[key].hasOwnProperty('type')){
              temp.push(key+"."+actualDir[key].type)
            }else{
              temp.push(key)
            }
          });
          own.properties.log.push(temp.toString().split(",").join(" "));
        }else if(has("pwd")){
          own.properties.log.push(own.properties.cd);
        }else if(has("cd")){
          if(args[1]===".."){
            own.properties.cd=own.properties.cd.split("/").pop().join("/");
          }else{
            if(args[1].includes("./")){
              for(let i = 1;i<args[1].split("/").length;i++){
                actualDir=actualDir[own.properties.cd.split("/")[i]];
              }
              own.properties.cd+=args[1];
            }
          }
        }else if(has("mkdir")){
          actualDir[args[1]]={};
        }else if(has("rmdir")){
          if(!actualDir[args[1]].hasOwnProperty(type)){
            delete actualDir[args[1]]
          }else{
            own.properties.log.push("No such directory exists")
          }
        }else if(has("rm")){
          if(actualDir.hasOwnProperty(args[1].split(".")[0]) && actualDir[args[1].split(".")[0]].type===args[1].split(".")[1]){
            delete actualDir[args[1].split(".")[0]]
          }else{
            own.properties.log.push("No such file exists")
          }
        }else if(has("touch")){
          actualDir[args[1].split(".")[0]]={type:args[1].split(".")[1],data:{}};
        }else if(has("cat")){
          own.properties.log.push(JSON.stringify(actualDir[args[1].split(".")[0]].data));
        }else if(has("ping")){
          let started = new Date().getTime();
          let http = new XMLHttpRequest();
          let ip;
          let port;
          if(args[1].includes(":")){
            ip = args[1].split(":")[0];
            port = args[1].split(":")[1];
            http.open("GET", "http://" + ip + ":" + port, /*async*/true);
          }else{
            ip = args[1];
            port = undefined;
            http.open("GET", "http://" + ip, /*async*/true);
          }

          http.onreadystatechange = function() {
            if (http.readyState == 4) {
              let ended = new Date().getTime();

              let milliseconds = ended - started;
              let pong = (m)=>{
                if(args[1].includes(":")){
                  own.properties.log.push(ip+":"+port+" time="+m+" ms");
                }else{
                  own.properties.log.push(ip+" time="+m+" ms");
                }
              }
              if (pong != null) {
                console.log(http);
                pong(milliseconds);
              }
            }
          };
          http.send(null);
        }else if(has("kill")){
          if(/^\d+$/.test(args[1])){
            killProcess(parseInt(args[1]));
          }else{
            killProcess(args[1]);
          }
        }else if(has("ps")){
          if(args[1]==="aux"){
            for(let i = 0;i<processes.length;i++){
              own.properties.log.push(processes[i].pid+" "+processes[i].id)
            }
          }
        }else{
          own.properties.log.push("Error: Unknown command");
        }
      }
      catch(err){
        own.properties.log.push(err)
      }
      own.properties.enter="";
    }
  },
  init:()=>{
    own.properties.width=400;
    own.properties.height=400;
    own.properties.preferred={width:400,height:400,noResize:true};
    own.properties.log=[];
    own.properties.cd = "./desktop";
    own.properties.wrote="";
    own.properties.enter="";
  },
  keyPressed:(e,o)=>{
    own=o;
    let keycode = e.keyCode;
    var valid = (keycode > 47 && keycode < 58)||keycode == 32 || (keycode > 64 && keycode < 91)|| (keycode > 95 && keycode < 112)  || (keycode > 185 && keycode < 193) || (keycode > 218 && keycode < 223);
    if(valid && ctx.measureText(own.properties.cd+">"+own.properties.wrote+e.key).width<own.properties.width){
      own.properties.wrote+=e.key;
    }
    if(keycode===8){
      own.properties.wrote = own.properties.wrote.slice(0,-1);
    }
    if(keycode===13){
      own.properties.enter=own.properties.wrote;
      own.properties.wrote="";
    }
  },
  id:"terminal"
}
