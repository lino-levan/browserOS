//Initiate Storage
var storage = {
  desktop:{
    info:{
      type:"app",
      data:{
        app:()=>{
          ctx.save();
            ctx.drawImage(i["./src/logo.jpg"],own.properties.width/8,own.properties.height/2-own.properties.width/8,own.properties.width/4,own.properties.width/4);
            ctx.globalCompositeOperation='destination-in';
            ctx.beginPath();
            ctx.ellipse(own.properties.width/4, own.properties.height/2, Math.abs(own.properties.width/8), Math.abs(own.properties.width/8), 0, 0, Math.PI*2);
            ctx.closePath();
            ctx.fill();
          ctx.restore();
          ctx.save();
            ctx.translate(0,40);
            textSize(20);
            ctx.font="20px sans-serif";
            fill(0,0,0);
            text("BrowserOS Allium",((own.properties.width*4/3)-ctx.measureText("BrowserOS Allium").width)/2,20);

            textSize(15);
            ctx.font="15px sans-serif";
            text("Memory: "+(navigator.deviceMemory || 4)+"GB",((own.properties.width*4/3)-ctx.measureText("Memory: "+(navigator.deviceMemory || 4)+"GB").width)/2,40)
            text("Language: "+navigator.language,((own.properties.width*4/3)-ctx.measureText("Language: "+navigator.language).width)/2,60)
            text("External System: "+navigator.platform,((own.properties.width*4/3)-ctx.measureText("External System: "+navigator.platform).width)/2,80)
            text("Refresh Rate: "+own.properties.hertz,((own.properties.width*4/3)-ctx.measureText("Refresh Rate: "+own.properties.hertz).width)/2,100)
          ctx.restore();
        },
        init:()=>{
          load_image("./src/logo.jpg")
          own.properties.preferred={noResize:true};
          function calcFPS(a){function b(){if(f--)c(b);else{var e=3*Math.round(1E3*d/3/(performance.now()-g));"function"===typeof a.callback&&a.callback(e);console.log("Calculated: "+e+" frames per second")}}var c=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame;if(!c)return!0;a||(a={});var d=a.count||60,f=d,g=performance.now();b()}
          if(own.properties.hertz===undefined){
            own.properties.hertz = "detecting";
            calcFPS({callback:(fps)=>{
              own.properties.hertz=fps+"Hz";
            }});
          }
        },
        id:"info"
      }
    },
    store:{
      type:"app",
      data:{
        app:()=>{
          ctx.save();
          let reset = true;
          let anim = 0;
          for(let i = 0;i<own.properties.items.length;i++){
            if(i===Math.floor((cursorY-own.properties.y-20)/20) && cursorX>own.properties.x && cursorX<own.properties.x+own.properties.width){
              fill(0,0,0,100)
              rect(0,i*20,own.properties.width,20)
              fill(0);
              textSize(15);
              text(own.properties.items[i].name+" | "+own.properties.items[i].developer,5,i*20+10);
              translate(0,own.properties.animationCounter);
              if(own.properties.items[i].hasOwnProperty("description")){
                anim=i;
                if(own.properties.animationCounter<20){
                  own.properties.animationCounter+=2;
                }else{
                  fill(0);
                  textSize(15);
                  text(own.properties.items[i].description,5,i*20+10);
                }
                reset=false;
              }
            }else{
              fill(0);
              textSize(15)
              text(own.properties.items[i].name+" | "+own.properties.items[i].developer,5,i*20+10);
            }
          }
          ctx.restore();
          if(reset){
            own.properties.lastAnimation=anim;
            if(own.properties.animationCounter-2>=0){
              own.properties.animationCounter-=2;
            }
          }
        },
        init:()=>{
          own.properties.items=[
            {
              name:"preview.app",
              developer:"Lino",
              description:"A file viewer, essential for BrowserOS"
            },
            {
              name:"terminal.app",
              developer:"Lino",
              description:"A WIP of a terminal application"
            },
            {
              name:"boids.app",
              developer:"Lino",
              description:"A test of runtime and advanced logic in BrowserOS"
            },
            {
              name:"files.app",
              developer:"Lino",
              description:"A file browser"
            },
            {
              name:"youtube.app",
              developer:"Lino",
              description:"A small tech demo for youtube"
            },
          ];
          own.properties.width=500;
          own.properties.animationCounter=0;
          own.properties.lastAnimation=0;
          own.properties.height=own.properties.items.length*20+30;
          own.properties.preferred={width:500,height:own.properties.items.length*20+30};
        },
        onPressed:()=>{
          let i = Math.floor((cursorY-own.properties.y-20)/20);
          let f = own.properties.items[i];
          let reader = new FileReader();
          let url = window.location.href+"apps/"+f.name;

          fetch(url)
            .then(res => res.blob())
            .then(blob => {
              let fileType=f.name.split(".")[1];
              let file = blob;

              if(fileType==="txt" || fileType==="app"){
                reader.readAsText(file);
              }else if(fileType==="png" || fileType==="jpg" || fileType==="jpeg" || fileType==="gif" || fileType==="mp3" || fileType==="wav" || fileType==="svg" || fileType==="pdf"){
                reader.readAsDataURL(file);
              }else{
                reader.readAsText(file);
              }
              reader.onload =  function(event){
                let contents = event.target.result;
                if(fileType==="app"){
                  contents='('+contents.toString()+')'.replace(/(\r\n|\n|\r)/gm, "").replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g, '');
                  let app = eval(contents);
                  storage.desktop[f.name.split(".")[0]] = {type:fileType,data:app};
                }else{
                  storage.desktop[f.name.split(".")[0]] = {type:fileType,data:{code:contents}};
                }
              };
          });
        },
        id:"store"
      }
    }
  },
  os:{
    settings:{
      type:"setting",
      data:{
        app:(data)=>{
          addApplication(data)
        },
        png:(data)=>{
          addApplication(storage.desktop.preview.data);
          sendRequest("preview","load",data);
        },
        jpg:(data)=>{
          addApplication(storage.desktop.preview.data);
          sendRequest("preview","load",data);
        },
        jpeg:(data)=>{
          addApplication(storage.desktop.preview.data);
          sendRequest("preview","load",data);
        },
        svg:(data)=>{
          addApplication(storage.desktop.preview.data);
          sendRequest("preview","load",data);
        },
        gif:(data)=>{
          addApplication(storage.desktop.preview.data);
          sendRequest("preview","load",data);
        },
        mp3:(data)=>{
          addApplication(storage.desktop.preview.data);
          sendRequest("preview","load",data);
        },
        wav:(data)=>{
          addApplication(storage.desktop.preview.data);
          sendRequest("preview","load",data);
        },
        ogg:(data)=>{
          addApplication(storage.desktop.preview.data);
          sendRequest("preview","load",data);
        },
        txt:(data)=>{
          addApplication(storage.desktop.preview.data);
          sendRequest("preview","load",data);
        },
        folder:(data)=>{
          addApplication(storage.desktop.files.data);
          sendRequest("files","load",data);
        }
      }
    },
    logos:{
      type:"setting",
      data:{
        app:"data:image/png;base64,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",
        png:"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmVyc2lvbj0iMSI+CiA8cGF0aCBzdHlsZT0ib3BhY2l0eTowLjIiIGQ9Im0gNTgsNTQuMzMyNiB2IC00Mi42NjYgYyAwLC0xLjQ3NzcgLTEuMTYsLTIuNjY3IC0yLjYsLTIuNjY3IEggOC42IGMgLTEuNDQwNCwwIC0yLjYsMS4xODkzIC0yLjYsMi42NjY3IHYgNDIuNjY3IEMgNiw1NS44MTA2IDcuMTU5Niw1NyA4LjYsNTcgaCA0Ni44IGMgMS40NDA0LDAgMi42LC0xLjE4OTMgMi42LC0yLjY2NjcgeiIvPgogPHBhdGggZmlsbD0iIzM2YWNhMyIgZD0ibTU4IDUzLjMzM3YtNDIuNjY2YzAtMS40Nzc3LTEuMTYtMi42NjctMi42LTIuNjY3aC00Ni44Yy0xLjQ0MDQgMC0yLjYgMS4xODkzLTIuNiAyLjY2Njd2NDIuNjY3YzAgMS40NzczIDEuMTU5NiAyLjY2NjcgMi42IDIuNjY2N2g0Ni44YzEuNDQwNCAwIDIuNi0xLjE4OTMgMi42LTIuNjY2N3oiLz4KIDxwYXRoIHN0eWxlPSJvcGFjaXR5OjAuMiIgZD0ibSAyMiwyNi45OTk2IDEyLDE1IDksLTggOCw4IHYgNyBIIDEyIHYgLTEwIHoiLz4KIDxwYXRoIGZpbGw9IiNmZmYiIGQ9Im0yMiAyNiAxMiAxNSA5LTggOCA4djdoLTM5di0xMHoiLz4KIDxwYXRoIHN0eWxlPSJmaWxsOiNmZmZmZmY7b3BhY2l0eTowLjIiIGQ9Ik0gOC41OTk2MDk0IDggQyA3LjE1OTIwOTQgOCA2IDkuMTg4NjE1NiA2IDEwLjY2NjAxNiBMIDYgMTEuNjY2MDE2IEMgNiAxMC4xODg2MTYgNy4xNTkyMDk0IDkgOC41OTk2MDk0IDkgTCA1NS40MDAzOTEgOSBDIDU2Ljg0MDM5MSA5IDU4IDEwLjE4ODMxNiA1OCAxMS42NjYwMTYgTCA1OCAxMC42Njc5NjkgQyA1OCA5LjE5MDI2ODcgNTYuODQwMzkxIDggNTUuNDAwMzkxIDggTCA4LjU5OTYwOTQgOCB6Ii8+Cjwvc3ZnPgo=",
        jpg:"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmVyc2lvbj0iMSI+CiA8cGF0aCBzdHlsZT0ib3BhY2l0eTowLjIiIGQ9Im0gNTgsNTQuMzMyNiB2IC00Mi42NjYgYyAwLC0xLjQ3NzcgLTEuMTYsLTIuNjY3IC0yLjYsLTIuNjY3IEggOC42IGMgLTEuNDQwNCwwIC0yLjYsMS4xODkzIC0yLjYsMi42NjY3IHYgNDIuNjY3IEMgNiw1NS44MTA2IDcuMTU5Niw1NyA4LjYsNTcgaCA0Ni44IGMgMS40NDA0LDAgMi42LC0xLjE4OTMgMi42LC0yLjY2NjcgeiIvPgogPHBhdGggZmlsbD0iIzM2YWNhMyIgZD0ibTU4IDUzLjMzM3YtNDIuNjY2YzAtMS40Nzc3LTEuMTYtMi42NjctMi42LTIuNjY3aC00Ni44Yy0xLjQ0MDQgMC0yLjYgMS4xODkzLTIuNiAyLjY2Njd2NDIuNjY3YzAgMS40NzczIDEuMTU5NiAyLjY2NjcgMi42IDIuNjY2N2g0Ni44YzEuNDQwNCAwIDIuNi0xLjE4OTMgMi42LTIuNjY2N3oiLz4KIDxwYXRoIHN0eWxlPSJvcGFjaXR5OjAuMiIgZD0ibSAyMiwyNi45OTk2IDEyLDE1IDksLTggOCw4IHYgNyBIIDEyIHYgLTEwIHoiLz4KIDxwYXRoIGZpbGw9IiNmZmYiIGQ9Im0yMiAyNiAxMiAxNSA5LTggOCA4djdoLTM5di0xMHoiLz4KIDxwYXRoIHN0eWxlPSJmaWxsOiNmZmZmZmY7b3BhY2l0eTowLjIiIGQ9Ik0gOC41OTk2MDk0IDggQyA3LjE1OTIwOTQgOCA2IDkuMTg4NjE1NiA2IDEwLjY2NjAxNiBMIDYgMTEuNjY2MDE2IEMgNiAxMC4xODg2MTYgNy4xNTkyMDk0IDkgOC41OTk2MDk0IDkgTCA1NS40MDAzOTEgOSBDIDU2Ljg0MDM5MSA5IDU4IDEwLjE4ODMxNiA1OCAxMS42NjYwMTYgTCA1OCAxMC42Njc5NjkgQyA1OCA5LjE5MDI2ODcgNTYuODQwMzkxIDggNTUuNDAwMzkxIDggTCA4LjU5OTYwOTQgOCB6Ii8+Cjwvc3ZnPgo=",
        jpeg:"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmVyc2lvbj0iMSI+CiA8cGF0aCBzdHlsZT0ib3BhY2l0eTowLjIiIGQ9Im0gNTgsNTQuMzMyNiB2IC00Mi42NjYgYyAwLC0xLjQ3NzcgLTEuMTYsLTIuNjY3IC0yLjYsLTIuNjY3IEggOC42IGMgLTEuNDQwNCwwIC0yLjYsMS4xODkzIC0yLjYsMi42NjY3IHYgNDIuNjY3IEMgNiw1NS44MTA2IDcuMTU5Niw1NyA4LjYsNTcgaCA0Ni44IGMgMS40NDA0LDAgMi42LC0xLjE4OTMgMi42LC0yLjY2NjcgeiIvPgogPHBhdGggZmlsbD0iIzM2YWNhMyIgZD0ibTU4IDUzLjMzM3YtNDIuNjY2YzAtMS40Nzc3LTEuMTYtMi42NjctMi42LTIuNjY3aC00Ni44Yy0xLjQ0MDQgMC0yLjYgMS4xODkzLTIuNiAyLjY2Njd2NDIuNjY3YzAgMS40NzczIDEuMTU5NiAyLjY2NjcgMi42IDIuNjY2N2g0Ni44YzEuNDQwNCAwIDIuNi0xLjE4OTMgMi42LTIuNjY2N3oiLz4KIDxwYXRoIHN0eWxlPSJvcGFjaXR5OjAuMiIgZD0ibSAyMiwyNi45OTk2IDEyLDE1IDksLTggOCw4IHYgNyBIIDEyIHYgLTEwIHoiLz4KIDxwYXRoIGZpbGw9IiNmZmYiIGQ9Im0yMiAyNiAxMiAxNSA5LTggOCA4djdoLTM5di0xMHoiLz4KIDxwYXRoIHN0eWxlPSJmaWxsOiNmZmZmZmY7b3BhY2l0eTowLjIiIGQ9Ik0gOC41OTk2MDk0IDggQyA3LjE1OTIwOTQgOCA2IDkuMTg4NjE1NiA2IDEwLjY2NjAxNiBMIDYgMTEuNjY2MDE2IEMgNiAxMC4xODg2MTYgNy4xNTkyMDk0IDkgOC41OTk2MDk0IDkgTCA1NS40MDAzOTEgOSBDIDU2Ljg0MDM5MSA5IDU4IDEwLjE4ODMxNiA1OCAxMS42NjYwMTYgTCA1OCAxMC42Njc5NjkgQyA1OCA5LjE5MDI2ODcgNTYuODQwMzkxIDggNTUuNDAwMzkxIDggTCA4LjU5OTYwOTQgOCB6Ii8+Cjwvc3ZnPgo=",
        gif:"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmVyc2lvbj0iMSI+CiA8cGF0aCBzdHlsZT0ib3BhY2l0eTowLjIiIGQ9Im0gNTgsNTQuMzMyNiB2IC00Mi42NjYgYyAwLC0xLjQ3NzcgLTEuMTYsLTIuNjY3IC0yLjYsLTIuNjY3IEggOC42IGMgLTEuNDQwNCwwIC0yLjYsMS4xODkzIC0yLjYsMi42NjY3IHYgNDIuNjY3IEMgNiw1NS44MTA2IDcuMTU5Niw1NyA4LjYsNTcgaCA0Ni44IGMgMS40NDA0LDAgMi42LC0xLjE4OTMgMi42LC0yLjY2NjcgeiIvPgogPHBhdGggZmlsbD0iIzM2YWNhMyIgZD0ibTU4IDUzLjMzM3YtNDIuNjY2YzAtMS40Nzc3LTEuMTYtMi42NjctMi42LTIuNjY3aC00Ni44Yy0xLjQ0MDQgMC0yLjYgMS4xODkzLTIuNiAyLjY2Njd2NDIuNjY3YzAgMS40NzczIDEuMTU5NiAyLjY2NjcgMi42IDIuNjY2N2g0Ni44YzEuNDQwNCAwIDIuNi0xLjE4OTMgMi42LTIuNjY2N3oiLz4KIDxwYXRoIHN0eWxlPSJvcGFjaXR5OjAuMiIgZD0ibSAyMiwyNi45OTk2IDEyLDE1IDksLTggOCw4IHYgNyBIIDEyIHYgLTEwIHoiLz4KIDxwYXRoIGZpbGw9IiNmZmYiIGQ9Im0yMiAyNiAxMiAxNSA5LTggOCA4djdoLTM5di0xMHoiLz4KIDxwYXRoIHN0eWxlPSJmaWxsOiNmZmZmZmY7b3BhY2l0eTowLjIiIGQ9Ik0gOC41OTk2MDk0IDggQyA3LjE1OTIwOTQgOCA2IDkuMTg4NjE1NiA2IDEwLjY2NjAxNiBMIDYgMTEuNjY2MDE2IEMgNiAxMC4xODg2MTYgNy4xNTkyMDk0IDkgOC41OTk2MDk0IDkgTCA1NS40MDAzOTEgOSBDIDU2Ljg0MDM5MSA5IDU4IDEwLjE4ODMxNiA1OCAxMS42NjYwMTYgTCA1OCAxMC42Njc5NjkgQyA1OCA5LjE5MDI2ODcgNTYuODQwMzkxIDggNTUuNDAwMzkxIDggTCA4LjU5OTYwOTQgOCB6Ii8+Cjwvc3ZnPgo=",
        svg:"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmVyc2lvbj0iMSI+CiA8cGF0aCBzdHlsZT0ib3BhY2l0eTowLjIiIGQ9Im0gNTgsNTQuMzMyNiB2IC00Mi42NjYgYyAwLC0xLjQ3NzcgLTEuMTYsLTIuNjY3IC0yLjYsLTIuNjY3IEggOC42IGMgLTEuNDQwNCwwIC0yLjYsMS4xODkzIC0yLjYsMi42NjY3IHYgNDIuNjY3IEMgNiw1NS44MTA2IDcuMTU5Niw1NyA4LjYsNTcgaCA0Ni44IGMgMS40NDA0LDAgMi42LC0xLjE4OTMgMi42LC0yLjY2NjcgeiIvPgogPHBhdGggZmlsbD0iIzM2YWNhMyIgZD0ibTU4IDUzLjMzM3YtNDIuNjY2YzAtMS40Nzc3LTEuMTYtMi42NjctMi42LTIuNjY3aC00Ni44Yy0xLjQ0MDQgMC0yLjYgMS4xODkzLTIuNiAyLjY2Njd2NDIuNjY3YzAgMS40NzczIDEuMTU5NiAyLjY2NjcgMi42IDIuNjY2N2g0Ni44YzEuNDQwNCAwIDIuNi0xLjE4OTMgMi42LTIuNjY2N3oiLz4KIDxwYXRoIHN0eWxlPSJvcGFjaXR5OjAuMiIgZD0ibSAyMiwyNi45OTk2IDEyLDE1IDksLTggOCw4IHYgNyBIIDEyIHYgLTEwIHoiLz4KIDxwYXRoIGZpbGw9IiNmZmYiIGQ9Im0yMiAyNiAxMiAxNSA5LTggOCA4djdoLTM5di0xMHoiLz4KIDxwYXRoIHN0eWxlPSJmaWxsOiNmZmZmZmY7b3BhY2l0eTowLjIiIGQ9Ik0gOC41OTk2MDk0IDggQyA3LjE1OTIwOTQgOCA2IDkuMTg4NjE1NiA2IDEwLjY2NjAxNiBMIDYgMTEuNjY2MDE2IEMgNiAxMC4xODg2MTYgNy4xNTkyMDk0IDkgOC41OTk2MDk0IDkgTCA1NS40MDAzOTEgOSBDIDU2Ljg0MDM5MSA5IDU4IDEwLjE4ODMxNiA1OCAxMS42NjYwMTYgTCA1OCAxMC42Njc5NjkgQyA1OCA5LjE5MDI2ODcgNTYuODQwMzkxIDggNTUuNDAwMzkxIDggTCA4LjU5OTYwOTQgOCB6Ii8+Cjwvc3ZnPgo=",
        txt:"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmVyc2lvbj0iMSI+CiA8cGF0aCBzdHlsZT0ib3BhY2l0eTowLjIiIGQ9Im0gMTQuNSw3Ljk5OTk5OTkgYyAtMS4zODUsMCAtMi41LDEuMTE1IC0yLjUsMi41MDAwMDAxIHYgNDUgYyAwLDEuMzg1IDEuMTE1LDIuNSAyLjUsMi41IGggMzUgQyA1MC44ODUsNTggNTIsNTYuODg1IDUyLDU1LjUgViAyMyBMIDM4LjI1LDIxLjc1IDM3LDcuOTk5OTk5OSBaIi8+CiA8cGF0aCBmaWxsPSIjZTRlNGU0IiBkPSJtMTQuNSA3Yy0xLjM4NSAwLTIuNSAxLjExNS0yLjUgMi41djQ1YzAgMS4zODUgMS4xMTUgMi41IDIuNSAyLjVoMzVjMS4zODUgMCAyLjUtMS4xMTUgMi41LTIuNXYtMzIuNWwtMTMuNzUtMS4yNS0xLjI1LTEzLjc1eiIvPgogPHBhdGggc3R5bGU9Im9wYWNpdHk6MC4yIiBkPSJNIDM3LDcuOTk5OTk5OSBWIDIwLjUgYyAwLDEuMzgwOCAxLjExOTMsMi41IDIuNSwyLjUgSCA1MiBaIi8+CiA8cGF0aCBmaWxsPSIjZmFmYWZhIiBkPSJtMzcgN3YxMi41YzAgMS4zODA4IDEuMTE5MyAyLjUgMi41IDIuNWgxMi41bC0xNS0xNXoiLz4KIDxwYXRoIHN0eWxlPSJvcGFjaXR5OjAuNSIgZD0ibSAyMCwyOSB2IDMgaCAyNCB2IC0zIHogbSAwLDYgdiAzIGggMjQgdiAtMyB6IG0gMCw2IHYgMyBoIDI0IHYgLTMgeiBtIDAsNiB2IDMgaCAxNyB2IC0zIHoiLz4KIDxwYXRoIHN0eWxlPSJvcGFjaXR5OjAuMjtmaWxsOiNmZmZmZmYiIGQ9Im0gMTQuNSw2Ljk5OTk5OTkgYyAtMS4zODUsMCAtMi41LDEuMTE1IC0yLjUsMi41IFYgMTAuNSBDIDEyLDkuMTE0OTk5OSAxMy4xMTUsNy45OTk5OTk5IDE0LjUsNy45OTk5OTk5IEggMzcgYyAwLC0xIDAsMCAwLC0xIHoiLz4KPC9zdmc+Cg==",
        mp3:"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmVyc2lvbj0iMS4xIj4KIDxwYXRoIHN0eWxlPSJvcGFjaXR5OjAuMiIgZD0ibSAxNC41LDguMDAwMDAwMyBjIC0xLjM4NSwwIC0yLjUsMS4xMTUgLTIuNSwyLjQ5OTk5OTcgdiA0NSBjIDAsMS4zODUgMS4xMTUsMi41IDIuNSwyLjUgaCAzNSBDIDUwLjg4NSw1OCA1Miw1Ni44ODUgNTIsNTUuNSBWIDIzIEwgMzguMjUsMjEuNzUgMzcsOC4wMDAwMDAzIFoiLz4KIDxwYXRoIGZpbGw9IiNmZTk3MDAiIGQ9Im0xNC41IDdjLTEuMzg1IDAtMi41IDEuMTE1LTIuNSAyLjV2NDVjMCAxLjM4NSAxLjExNSAyLjUgMi41IDIuNWgzNWMxLjM4NSAwIDIuNS0xLjExNSAyLjUtMi41di0zMi41bC0xMy43NS0xLjI1LTEuMjUtMTMuNzV6Ii8+CiA8cGF0aCBzdHlsZT0ib3BhY2l0eTowLjIiIGQ9Ik0gMzcsOC4wMDAwMDAzIFYgMjAuNSBjIDAsMS4zODA4IDEuMTE5MywyLjUgMi41LDIuNSBIIDUyIFoiLz4KIDxwYXRoIGZpbGw9IiNmZmJkNjMiIGQ9Im0zNyA3djEyLjVjMCAxLjM4MDggMS4xMTkzIDIuNSAyLjUgMi41aDEyLjVsLTE1LTE1eiIvPgogPHBhdGggc3R5bGU9Im9wYWNpdHk6MC4yIiBkPSJNIDI2LDI3IFYgNDEuNDIgQSA1LDUgMCAwIDAgMjQsNDEgYSA1LDUgMCAwIDAgLTUsNSA1LDUgMCAwIDAgNSw1IDUsNSAwIDAgMCA0Ljk5NjEsLTQuOTA4MiBsIDAuMDA0LC0wLjAwOCB2IC0xMy4wODQgaCAxMSB2IDguNDE5OSBhIDUsNSAwIDAgMCAtMiwtMC40MiA1LDUgMCAwIDAgLTUsNSA1LDUgMCAwIDAgNSw1IDUsNSAwIDAgMCA0Ljk4ODMsLTQuNzUgbCAwLjAxMiwtMC4wMjMgdiAtMTkuMjI3IGggLTE3IHoiLz4KIDxwYXRoIGZpbGw9IiNmZmYiIGQ9Im0yNiAyNnYxNC40MmE1IDUgMCAwIDAgLTIgLTAuNDIgNSA1IDAgMCAwIC01IDUgNSA1IDAgMCAwIDUgNSA1IDUgMCAwIDAgNC45OTYxIC00LjkwODJsMC4wMDQtMC4wMDh2LTEzLjA4NGgxMXY4LjQxOTlhNSA1IDAgMCAwIC0yIC0wLjQyIDUgNSAwIDAgMCAtNSA1IDUgNSAwIDAgMCA1IDUgNSA1IDAgMCAwIDQuOTg4MyAtNC43NWwwLjAxMi0wLjAyM3YtMTkuMjI3aC0xN3oiLz4KIDxwYXRoIHN0eWxlPSJvcGFjaXR5OjAuMjtmaWxsOiNmZmZmZmYiIGQ9Im0gMTQuNSw3LjAwMDAwMDMgYyAtMS4zODUsMCAtMi41LDEuMTE1IC0yLjUsMi41IFYgMTAuNSBDIDEyLDkuMTE1MDAwMyAxMy4xMTUsOC4wMDAwMDAzIDE0LjUsOC4wMDAwMDAzIEggMzcgYyAwLC0xIDAsMCAwLC0xIHoiLz4KPC9zdmc+Cg==",
        wav:"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmVyc2lvbj0iMS4xIj4KIDxwYXRoIHN0eWxlPSJvcGFjaXR5OjAuMiIgZD0ibSAxNC41LDguMDAwMDAwMyBjIC0xLjM4NSwwIC0yLjUsMS4xMTUgLTIuNSwyLjQ5OTk5OTcgdiA0NSBjIDAsMS4zODUgMS4xMTUsMi41IDIuNSwyLjUgaCAzNSBDIDUwLjg4NSw1OCA1Miw1Ni44ODUgNTIsNTUuNSBWIDIzIEwgMzguMjUsMjEuNzUgMzcsOC4wMDAwMDAzIFoiLz4KIDxwYXRoIGZpbGw9IiNmZTk3MDAiIGQ9Im0xNC41IDdjLTEuMzg1IDAtMi41IDEuMTE1LTIuNSAyLjV2NDVjMCAxLjM4NSAxLjExNSAyLjUgMi41IDIuNWgzNWMxLjM4NSAwIDIuNS0xLjExNSAyLjUtMi41di0zMi41bC0xMy43NS0xLjI1LTEuMjUtMTMuNzV6Ii8+CiA8cGF0aCBzdHlsZT0ib3BhY2l0eTowLjIiIGQ9Ik0gMzcsOC4wMDAwMDAzIFYgMjAuNSBjIDAsMS4zODA4IDEuMTE5MywyLjUgMi41LDIuNSBIIDUyIFoiLz4KIDxwYXRoIGZpbGw9IiNmZmJkNjMiIGQ9Im0zNyA3djEyLjVjMCAxLjM4MDggMS4xMTkzIDIuNSAyLjUgMi41aDEyLjVsLTE1LTE1eiIvPgogPHBhdGggc3R5bGU9Im9wYWNpdHk6MC4yIiBkPSJNIDI2LDI3IFYgNDEuNDIgQSA1LDUgMCAwIDAgMjQsNDEgYSA1LDUgMCAwIDAgLTUsNSA1LDUgMCAwIDAgNSw1IDUsNSAwIDAgMCA0Ljk5NjEsLTQuOTA4MiBsIDAuMDA0LC0wLjAwOCB2IC0xMy4wODQgaCAxMSB2IDguNDE5OSBhIDUsNSAwIDAgMCAtMiwtMC40MiA1LDUgMCAwIDAgLTUsNSA1LDUgMCAwIDAgNSw1IDUsNSAwIDAgMCA0Ljk4ODMsLTQuNzUgbCAwLjAxMiwtMC4wMjMgdiAtMTkuMjI3IGggLTE3IHoiLz4KIDxwYXRoIGZpbGw9IiNmZmYiIGQ9Im0yNiAyNnYxNC40MmE1IDUgMCAwIDAgLTIgLTAuNDIgNSA1IDAgMCAwIC01IDUgNSA1IDAgMCAwIDUgNSA1IDUgMCAwIDAgNC45OTYxIC00LjkwODJsMC4wMDQtMC4wMDh2LTEzLjA4NGgxMXY4LjQxOTlhNSA1IDAgMCAwIC0yIC0wLjQyIDUgNSAwIDAgMCAtNSA1IDUgNSAwIDAgMCA1IDUgNSA1IDAgMCAwIDQuOTg4MyAtNC43NWwwLjAxMi0wLjAyM3YtMTkuMjI3aC0xN3oiLz4KIDxwYXRoIHN0eWxlPSJvcGFjaXR5OjAuMjtmaWxsOiNmZmZmZmYiIGQ9Im0gMTQuNSw3LjAwMDAwMDMgYyAtMS4zODUsMCAtMi41LDEuMTE1IC0yLjUsMi41IFYgMTAuNSBDIDEyLDkuMTE1MDAwMyAxMy4xMTUsOC4wMDAwMDAzIDE0LjUsOC4wMDAwMDAzIEggMzcgYyAwLC0xIDAsMCAwLC0xIHoiLz4KPC9zdmc+Cg==",
        ogg:"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmVyc2lvbj0iMS4xIj4KIDxwYXRoIHN0eWxlPSJvcGFjaXR5OjAuMiIgZD0ibSAxNC41LDguMDAwMDAwMyBjIC0xLjM4NSwwIC0yLjUsMS4xMTUgLTIuNSwyLjQ5OTk5OTcgdiA0NSBjIDAsMS4zODUgMS4xMTUsMi41IDIuNSwyLjUgaCAzNSBDIDUwLjg4NSw1OCA1Miw1Ni44ODUgNTIsNTUuNSBWIDIzIEwgMzguMjUsMjEuNzUgMzcsOC4wMDAwMDAzIFoiLz4KIDxwYXRoIGZpbGw9IiNmZTk3MDAiIGQ9Im0xNC41IDdjLTEuMzg1IDAtMi41IDEuMTE1LTIuNSAyLjV2NDVjMCAxLjM4NSAxLjExNSAyLjUgMi41IDIuNWgzNWMxLjM4NSAwIDIuNS0xLjExNSAyLjUtMi41di0zMi41bC0xMy43NS0xLjI1LTEuMjUtMTMuNzV6Ii8+CiA8cGF0aCBzdHlsZT0ib3BhY2l0eTowLjIiIGQ9Ik0gMzcsOC4wMDAwMDAzIFYgMjAuNSBjIDAsMS4zODA4IDEuMTE5MywyLjUgMi41LDIuNSBIIDUyIFoiLz4KIDxwYXRoIGZpbGw9IiNmZmJkNjMiIGQ9Im0zNyA3djEyLjVjMCAxLjM4MDggMS4xMTkzIDIuNSAyLjUgMi41aDEyLjVsLTE1LTE1eiIvPgogPHBhdGggc3R5bGU9Im9wYWNpdHk6MC4yIiBkPSJNIDI2LDI3IFYgNDEuNDIgQSA1LDUgMCAwIDAgMjQsNDEgYSA1LDUgMCAwIDAgLTUsNSA1LDUgMCAwIDAgNSw1IDUsNSAwIDAgMCA0Ljk5NjEsLTQuOTA4MiBsIDAuMDA0LC0wLjAwOCB2IC0xMy4wODQgaCAxMSB2IDguNDE5OSBhIDUsNSAwIDAgMCAtMiwtMC40MiA1LDUgMCAwIDAgLTUsNSA1LDUgMCAwIDAgNSw1IDUsNSAwIDAgMCA0Ljk4ODMsLTQuNzUgbCAwLjAxMiwtMC4wMjMgdiAtMTkuMjI3IGggLTE3IHoiLz4KIDxwYXRoIGZpbGw9IiNmZmYiIGQ9Im0yNiAyNnYxNC40MmE1IDUgMCAwIDAgLTIgLTAuNDIgNSA1IDAgMCAwIC01IDUgNSA1IDAgMCAwIDUgNSA1IDUgMCAwIDAgNC45OTYxIC00LjkwODJsMC4wMDQtMC4wMDh2LTEzLjA4NGgxMXY4LjQxOTlhNSA1IDAgMCAwIC0yIC0wLjQyIDUgNSAwIDAgMCAtNSA1IDUgNSAwIDAgMCA1IDUgNSA1IDAgMCAwIDQuOTg4MyAtNC43NWwwLjAxMi0wLjAyM3YtMTkuMjI3aC0xN3oiLz4KIDxwYXRoIHN0eWxlPSJvcGFjaXR5OjAuMjtmaWxsOiNmZmZmZmYiIGQ9Im0gMTQuNSw3LjAwMDAwMDMgYyAtMS4zODUsMCAtMi41LDEuMTE1IC0yLjUsMi41IFYgMTAuNSBDIDEyLDkuMTE1MDAwMyAxMy4xMTUsOC4wMDAwMDAzIDE0LjUsOC4wMDAwMDAzIEggMzcgYyAwLC0xIDAsMCAwLC0xIHoiLz4KPC9zdmc+Cg==",
        pdf:"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmVyc2lvbj0iMSI+CiA8cGF0aCBzdHlsZT0ib3BhY2l0eTowLjIiIGQ9Ik0gMTQuNSw4IEMgMTMuMTE1LDggMTIsOS4xMTUgMTIsMTAuNSB2IDQ1IGMgMCwxLjM4NSAxLjExNSwyLjUgMi41LDIuNSBoIDM1IEMgNTAuODg1LDU4IDUyLDU2Ljg4NSA1Miw1NS41IFYgMjMgTCAzOC4yNSwyMS43NSAzNyw4IFoiLz4KIDxwYXRoIGZpbGw9IiNjMDM2MzAiIGQ9Im0xNC41IDdjLTEuMzg1IDAtMi41IDEuMTE1LTIuNSAyLjV2NDVjMCAxLjM4NSAxLjExNSAyLjUgMi41IDIuNWgzNWMxLjM4NSAwIDIuNS0xLjExNSAyLjUtMi41di0zMi41bC0xMy43NS0xLjI1LTEuMjUtMTMuNzV6Ii8+CiA8cGF0aCBzdHlsZT0ib3BhY2l0eTowLjIiIGQ9Im0gMzcsOCB2IDEyLjUgYyAwLDEuMzgwOCAxLjExOTMsMi41IDIuNSwyLjUgSCA1MiBaIi8+CiA8cGF0aCBmaWxsPSIjZjM2OTYxIiBkPSJtMzcgN3YxMi41YzAgMS4zODA4IDEuMTE5MyAyLjUgMi41IDIuNWgxMi41bC0xNS0xNXoiLz4KIDxwYXRoIHN0eWxlPSJvcGFjaXR5OjAuMiIgZD0ibSAyOS45NzYsMjUuNTYyIGMgLTAuNTc2NTgsMCAtMS4xMTU4LDAuMjgyMjEgLTEuMjQ2MiwwLjc0ODAxIC0wLjQ4NDQsMS43ODU4IDAuMDU3NzUsNC41NDc0IDAuOTYxOTUsNy45ODgzIGwgLTAuMjcyNzYsMC42NjYxOCBjIC0wLjY5MjM0LDEuNjg3NiAtMS41NTc4LDMuMzY4NCAtMi4zMTg4LDQuODU5OSAtMy4xNDE5LDYuMTQ3NSAtNS41ODYxLDkuNDY0NCAtNy4yMTU5LDkuNjk2OCBsIC0wLjAwNjMsLTAuMDY3NSBjIC0wLjAzNTM3LC0wLjc2NjgyIDEuMzc5OCwtMi43NDM5IDMuMjk3OCwtNC4zMTU4IDAuMjAwMDYsLTAuMTYxOCAxLjA1MzgsLTAuOTg3NzYgMS4wNTM4LC0wLjk4Nzc2IDAsMCAtMS4xNTI0LDAuNjA4MzQgLTEuNDExMiwwLjc2NTIyIC0yLjQwMzUsMS40MzQ2IC0zLjU5OTUsMi44NzIgLTMuNzk0NSwzLjgyNjEgLTAuMDU3ODgsMC4yODM0IC0wLjAyMDc1LDAuNjMyMTIgMC4yMjk2OSwwLjc3NTMgbCAwLjYxNDUsMC4zMDg2OCBjIDEuNjczLDAuODM3NDQgMy43MzAxLC0xLjM2NDUgNi40NjUsLTYuMTU3OCAyLjc4MywtMC45MTI5NSA2LjI1NTQsLTEuNzcyNSA5LjQxNjksLTIuMjM4MiAyLjgzLDEuNjE3IDYuMDc2MiwyLjM4NjkgNy4zMjM1LDIuMDU0NSAwLjIzNzM0LC0wLjA2Mjc1IDAuNDg3LC0wLjI0OTA1IDAuNjE0NSwtMC40MjA2NSAwLjEsLTAuMTU3ODkgMC4yMzk3OSwtMC43ODk2NSAwLjIzOTc5LC0wLjc4OTY1IDAsMCAtMC4yMzQ2NiwwLjMxOTM0IC0wLjQyNzg4LDAuNDEzNDggLTAuNzg5NCwwLjM3MjY0IC0zLjI4MTYsLTAuMjQ5MDUgLTUuODM5LC0xLjUwMDIgMi4yMTEyLC0wLjIzNTM1IDQuMDUzNCwtMC4yNDQ0MiA1LjAzNzksMC4wNzAyNSAxLjI1MDQsMC4zOTkxMiAxLjI1MTQsMC44MDgyNCAxLjIzNDcsMC44OTE1OCAwLjAxNjg3LC0wLjA2ODYyIDAuMDcyODcsLTAuMzQyNzIgMC4wNjYsLTAuNDU5NDEgLTAuMDI4MzcsLTAuMzAwMDggLTAuMTIwODgsLTAuNTY4MDQgLTAuMzQ3NDQsLTAuNzg5NjUgLTAuNDYyODQsLTAuNDU1OTkgLTEuNjA1NiwtMC42ODU3OCAtMy4xNjI5LC0wLjcwNjM2IC0xLjE3MzgsLTAuMDEyNzUgLTIuNTgxMiwwLjA5IC00LjEwOSwwLjMwODY4IC0wLjcwMDE1LC0wLjQwMjA1IC0xLjQzOSwtMC44NDQwMiAtMi4wMjQ0LC0xLjM5MTIgLTEuNDg0NiwtMS4zODY2IC0yLjcyOSwtMy4zMTE4IC0zLjUwMTgsLTUuNDcgMC4wNTI3NSwtMC4yMDY5MSAwLjEwMzI1LC0wLjQwOTA5IDAuMTQ5MywtMC42MTMwNiAwLjIxNDc5LC0wLjk2NTg5IDAuMzY4OTYsLTQuMTU5MiAwLjM2ODk2LC00LjE1OTIgMCwwIC0wLjYxMTY4LDIuMzk5IC0wLjcwNzc4LDIuNzYwOSAtMC4wNjE3NSwwLjIyOTQ2IC0wLjEzODU4LDAuNDc0MzggLTAuMjI2ODQsMC43MjkzNCAtMC40Njg3NSwtMS42NDc0IC0wLjcwNjM2LC0zLjI0NCAtMC43MDYzNiwtNC40NTUgMCwtMC4zNDIyNCAwLjAyOTM4LC0xLjAwODIgMC4xMjYzMSwtMS41MzQ4IDAuMDQ3MjUsLTAuMzc1NTYgMC4xODMyNSwtMC41NzA1OSAwLjMyNDUsLTAuNjY0NzQgMC4yNzk0NiwwLjA2Nzc1IDAuNTkyMjksMC40OTYzNSAwLjkxODg2LDEuMjEzMiAwLjI4MDQ0LDAuNjE5NzUgMC4yNjI3MSwxLjMzNzUgMC4yNjI3MSwxLjc4MTggMCwwIDAuMzAwNzYsLTEuMSAwLjIzMTE1LC0xLjc1MDEgLTAuMDQyMzcsLTAuMzkwMjkgLTAuNDEzNywtMS4zOTQ0IC0xLjIwMzEsLTEuMzgyNiBoIC0wLjA2NDYzIGwgLTAuMzUxNzQsLTAuMDAzOCB6IG0gMC4yNjg0OCw5Ljk3MzkgYyAwLjgxNjg5LDEuNjQyNSAxLjk0MzUsMy4yMDI0IDMuNDIxNCw0LjQ1MzYgMC4zMjk0NiwwLjI3ODQ5IDAuNjgsMC41NDM0NCAxLjA0MDksMC43OTI1IC0yLjY4MzksMC40OTkxNCAtNS41MDI2LDEuMjAxMyAtOC4xMjE5LDIuMjk4NiAwLjQ3MzY0LC0wLjg0MTM2IDAuOTg1NzYsLTEuNzU4IDEuNTEwNCwtMi43NDY1IDEuMDE1OSwtMS45MjEgMS42MzE1LC0zLjQwMjggMi4xNDkyLC00Ljc5ODEgeiIvPgogPHBhdGggZmlsbD0iI2ZmZiIgZD0ibTI5Ljk3NiAyNC41NjJjLTAuNTc2NTggMC0xLjExNTggMC4yODIyMS0xLjI0NjIgMC43NDgwMS0wLjQ4NDQgMS43ODU4IDAuMDU3NzUgNC41NDc0IDAuOTYxOTUgNy45ODgzbC0wLjI3Mjc2IDAuNjY2MThjLTAuNjkyMzQgMS42ODc2LTEuNTU3OCAzLjM2ODQtMi4zMTg4IDQuODU5OS0zLjE0MTkgNi4xNDc1LTUuNTg2MSA5LjQ2NDQtNy4yMTU5IDkuNjk2OGwtMC4wMDYzLTAuMDY3NWMtMC4wMzUzNy0wLjc2NjgyIDEuMzc5OC0yLjc0MzkgMy4yOTc4LTQuMzE1OCAwLjIwMDA2LTAuMTYxOCAxLjA1MzgtMC45ODc3NiAxLjA1MzgtMC45ODc3NnMtMS4xNTI0IDAuNjA4MzQtMS40MTEyIDAuNzY1MjJjLTIuNDAzNSAxLjQzNDYtMy41OTk1IDIuODcyLTMuNzk0NSAzLjgyNjEtMC4wNTc4OCAwLjI4MzQtMC4wMjA3NSAwLjYzMjEyIDAuMjI5NjkgMC43NzUzbDAuNjE0NSAwLjMwODY4YzEuNjczIDAuODM3NDQgMy43MzAxLTEuMzY0NSA2LjQ2NS02LjE1NzggMi43ODMtMC45MTI5NSA2LjI1NTQtMS43NzI1IDkuNDE2OS0yLjIzODIgMi44MyAxLjYxNyA2LjA3NjIgMi4zODY5IDcuMzIzNSAyLjA1NDUgMC4yMzczNC0wLjA2Mjc1IDAuNDg3LTAuMjQ5MDUgMC42MTQ1LTAuNDIwNjUgMC4xLTAuMTU3ODkgMC4yMzk3OS0wLjc4OTY1IDAuMjM5NzktMC43ODk2NXMtMC4yMzQ2NiAwLjMxOTM0LTAuNDI3ODggMC40MTM0OGMtMC43ODk0IDAuMzcyNjQtMy4yODE2LTAuMjQ5MDUtNS44MzktMS41MDAyIDIuMjExMi0wLjIzNTM1IDQuMDUzNC0wLjI0NDQyIDUuMDM3OSAwLjA3MDI1IDEuMjUwNCAwLjM5OTEyIDEuMjUxNCAwLjgwODI0IDEuMjM0NyAwLjg5MTU4IDAuMDE2ODctMC4wNjg2MiAwLjA3Mjg3LTAuMzQyNzIgMC4wNjYtMC40NTk0MS0wLjAyODM3LTAuMzAwMDgtMC4xMjA4OC0wLjU2ODA0LTAuMzQ3NDQtMC43ODk2NS0wLjQ2Mjg0LTAuNDU1OTktMS42MDU2LTAuNjg1NzgtMy4xNjI5LTAuNzA2MzYtMS4xNzM4LTAuMDEyNzUtMi41ODEyIDAuMDktNC4xMDkgMC4zMDg2OC0wLjcwMDE1LTAuNDAyMDUtMS40MzktMC44NDQwMi0yLjAyNDQtMS4zOTEyLTEuNDg0Ni0xLjM4NjYtMi43MjktMy4zMTE4LTMuNTAxOC01LjQ3IDAuMDUyNzUtMC4yMDY5MSAwLjEwMzI1LTAuNDA5MDkgMC4xNDkzLTAuNjEzMDYgMC4yMTQ3OS0wLjk2NTg5IDAuMzY4OTYtNC4xNTkyIDAuMzY4OTYtNC4xNTkycy0wLjYxMTY4IDIuMzk5LTAuNzA3NzggMi43NjA5Yy0wLjA2MTc1IDAuMjI5NDYtMC4xMzg1OCAwLjQ3NDM4LTAuMjI2ODQgMC43MjkzNC0wLjQ2ODc1LTEuNjQ3NC0wLjcwNjM2LTMuMjQ0LTAuNzA2MzYtNC40NTUgMC0wLjM0MjI0IDAuMDI5MzgtMS4wMDgyIDAuMTI2MzEtMS41MzQ4IDAuMDQ3MjUtMC4zNzU1NiAwLjE4MzI1LTAuNTcwNTkgMC4zMjQ1LTAuNjY0NzQgMC4yNzk0NiAwLjA2Nzc1IDAuNTkyMjkgMC40OTYzNSAwLjkxODg2IDEuMjEzMiAwLjI4MDQ0IDAuNjE5NzUgMC4yNjI3MSAxLjMzNzUgMC4yNjI3MSAxLjc4MTggMCAwIDAuMzAwNzYtMS4xIDAuMjMxMTUtMS43NTAxLTAuMDQyMzctMC4zOTAyOS0wLjQxMzctMS4zOTQ0LTEuMjAzMS0xLjM4MjZoLTAuMDY0NjNsLTAuMzUxNzQtMC4wMDM4em0wLjI2ODQ4IDkuOTczOWMwLjgxNjg5IDEuNjQyNSAxLjk0MzUgMy4yMDI0IDMuNDIxNCA0LjQ1MzYgMC4zMjk0NiAwLjI3ODQ5IDAuNjggMC41NDM0NCAxLjA0MDkgMC43OTI1LTIuNjgzOSAwLjQ5OTE0LTUuNTAyNiAxLjIwMTMtOC4xMjE5IDIuMjk4NiAwLjQ3MzY0LTAuODQxMzYgMC45ODU3Ni0xLjc1OCAxLjUxMDQtMi43NDY1IDEuMDE1OS0xLjkyMSAxLjYzMTUtMy40MDI4IDIuMTQ5Mi00Ljc5ODF6Ii8+CiA8cGF0aCBzdHlsZT0ib3BhY2l0eTowLjI7ZmlsbDojZmZmZmZmIiBkPSJNIDE0LjUsNyBDIDEzLjExNSw3IDEyLDguMTE1IDEyLDkuNSB2IDEgQyAxMiw5LjExNSAxMy4xMTUsOCAxNC41LDggSCAzNyBjIDAsLTEgMCwwIDAsLTEgeiIvPgo8L3N2Zz4K",
        folder:"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmVyc2lvbj0iMS4xIj4KIDxyZWN0IHN0eWxlPSJvcGFjaXR5OjAuMiIgd2lkdGg9IjUwIiBoZWlnaHQ9IjMyIiB4PSI3IiB5PSIyNCIgcng9IjIuNSIgcnk9IjIuNSIvPgogPHBhdGggc3R5bGU9ImZpbGw6I2MxODYwMCIgZD0iTSA3LDQ0LjUgQyA3LDQ1Ljg4NSA4LjExNSw0NyA5LjUsNDcgSCA1NC41IEMgNTUuODg1LDQ3IDU3LDQ1Ljg4NSA1Nyw0NC41IFYgMTcuNSBDIDU3LDE2LjExNSA1NS44ODUsMTUgNTQuNSwxNSBIIDI5IFYgMTIuNSBDIDI5LDExLjExNSAyNy44ODUsMTAgMjYuNSwxMCBIIDkuNSBDIDguMTE1LDEwIDcsMTEuMTE1IDcsMTIuNSIvPgogPHJlY3Qgc3R5bGU9Im9wYWNpdHk6MC4yIiB3aWR0aD0iNTAiIGhlaWdodD0iMzIiIHg9IjciIHk9IjIyIiByeD0iMi41IiByeT0iMi41Ii8+CiA8cmVjdCBzdHlsZT0iZmlsbDojZTRlNGU0IiB3aWR0aD0iNDQiIGhlaWdodD0iMjAiIHg9IjEwIiB5PSIxOCIgcng9IjIuNSIgcnk9IjIuNSIvPgogPHJlY3Qgc3R5bGU9ImZpbGw6I2U4YTgwZSIgd2lkdGg9IjUwIiBoZWlnaHQ9IjMyIiB4PSI3IiB5PSIyMyIgcng9IjIuNSIgcnk9IjIuNSIvPgogPHBhdGggc3R5bGU9Im9wYWNpdHk6MC4xO2ZpbGw6I2ZmZmZmZiIgZD0iTSA5LjUsMTAgQyA4LjExNSwxMCA3LDExLjExNSA3LDEyLjUgViAxMy41IEMgNywxMi4xMTUgOC4xMTUsMTEgOS41LDExIEggMjYuNSBDIDI3Ljg4NSwxMSAyOSwxMi4xMTUgMjksMTMuNSBWIDEyLjUgQyAyOSwxMS4xMTUgMjcuODg1LDEwIDI2LjUsMTAgWiBNIDI5LDE1IFYgMTYgSCA1NC41IEMgNTUuODksMTYgNTcsMTcuMTE1IDU3LDE4LjUgViAxNy41IEMgNTcsMTYuMTE1IDU1Ljg5LDE1IDU0LjUsMTUgWiIvPgogPGcgc3R5bGU9ImZpbGw6IzUxM2IwNSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCwxKSI+CiAgPGNpcmNsZSBjeD0iMjQiIGN5PSIzMyIgcj0iMiIvPgogIDxjaXJjbGUgY3g9IjI5IiBjeT0iMzMiIHI9IjIiLz4KICA8Y2lyY2xlIGN4PSIzNCIgY3k9IjMzIiByPSIyIi8+CiAgPGNpcmNsZSBjeD0iMzkiIGN5PSIzMyIgcj0iMiIvPgogIDxjaXJjbGUgY3g9IjI0IiBjeT0iMzgiIHI9IjIiLz4KICA8Y2lyY2xlIGN4PSIyOSIgY3k9IjM4IiByPSIyIi8+CiAgPGNpcmNsZSBjeD0iMzQiIGN5PSIzOCIgcj0iMiIvPgogIDxjaXJjbGUgY3g9IjM5IiBjeT0iMzgiIHI9IjIiLz4KICA8Y2lyY2xlIGN4PSI0NCIgY3k9IjM4IiByPSIyIi8+CiAgPGNpcmNsZSBjeD0iMTkiIGN5PSIzOCIgcj0iMiIvPgogIDxjaXJjbGUgY3g9IjE5IiBjeT0iNDMiIHI9IjIiLz4KICA8Y2lyY2xlIGN4PSIyNCIgY3k9IjQzIiByPSIyIi8+CiAgPGNpcmNsZSBjeD0iNDQiIGN5PSI0MyIgcj0iMiIvPgogIDxjaXJjbGUgY3g9IjM5IiBjeT0iNDMiIHI9IjIiLz4KIDwvZz4KPC9zdmc+Cg=="
      }
    }
  }
};

//Initiate Rendering
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");


//deepclone
const deepCopyFunction = inObject => {
  let outObject, value, key

  if(typeof inObject !== "object" || inObject === null) {
    return inObject // Return the value if inObject is not an object
  }

  // Create an array or object to hold the values
  outObject = Array.isArray(inObject) ? [] : {}

  for (key in inObject) {
    value = inObject[key]

    // Recursively (deep) copy for nested objects, including arrays
    outObject[key] = (typeof value === "object" && value !== null) ? deepCopyFunction(value) : value
  }

  return outObject
}

//Initiate Processes
var processes = [];

var devMode = true;
