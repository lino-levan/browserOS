{
  app:()=>{
    let iframe = own.properties.iframe;
    iframe.width=own.properties.width;
    iframe.height=own.properties.height;
    iframe.style.top=own.properties.y+20;
    iframe.style.left=own.properties.x;
    if(own.properties.tracking){
      iframe.style.pointerEvents="none";
    }else{
      iframe.style.pointerEvents="auto";
    }
    if(own.properties.y+20+own.properties.preferred.height>canvas.height){
      background(0);
      iframe.style.display="none";
    }else if(own.properties.x+own.properties.preferred.width>canvas.width){
      background(0);
      iframe.style.display="none";
    }else{
      iframe.style.display="block";
    }
  },
  init:()=>{
    own.properties.width=400;
    own.properties.height=400*9/16;
    own.properties.preferred={width:400,height:400*9/16};
    sendRequest("youtube","load","r_0JjYUe5jo")
  },
  onKilled:()=>{
    own.properties.iframe.parentNode.removeChild(own.properties.iframe);
  },
  load:(url)=>{
    let iframe = document.createElement("iframe");
    iframe.src="https://www.youtube.com/embed/"+url;
    iframe.width=own.properties.width;
    iframe.height=own.properties.height;
    iframe.style.top=own.properties.y+20;
    iframe.style.left=own.properties.x;
    iframe.frameBorder="0";
    iframe.style.position="absolute";
    iframe.sandbox="allow-scripts allow-forms allow-modals allow-orientation-lock allow-presentation allow-same-origin";
    let links;
    if (iframe.contentWindow)  {
       links = iframe.contentWindow.document.links;
       for(var i in links)
       {
          links[i].href="#";
       }
    }
    document.body.appendChild(iframe);
    own.properties.iframe=iframe;
  },
  id:"youtube"
}
