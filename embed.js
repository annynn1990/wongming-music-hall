(function(){
  'use strict';
  var script=document.currentScript;
  var base=(script&&script.src?script.src.replace(/[^/]*$/,''):'https://annynn1990.github.io/wongming-music-hall/');
  var selector=(script&&script.getAttribute('data-target'))||'.wongming-royal-music-hall';
  var hosts=[];
  try{hosts=Array.prototype.slice.call(document.querySelectorAll(selector));}catch(e){}
  if(!hosts.length&&script&&script.nextElementSibling&&script.nextElementSibling.hasAttribute('data-wongming-music-hall'))hosts=[script.nextElementSibling];
  hosts.forEach(function(host){
    if(host.__wmrh)return;
    host.__wmrh=true;
    var root=document.createElement('div');
    root.style.cssText='position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.5);backdrop-filter:blur(3px);';
    var frame=document.createElement('div');
    frame.style.cssText='position:relative;width:82vw;height:84vh;max-width:1600px;max-height:1100px;min-width:320px;min-height:300px;overflow:hidden;background:#080403;border:1px solid rgba(226,193,123,.55);box-shadow:0 20px 90px rgba(0,0,0,.7),0 0 35px rgba(226,193,123,.14);';
    var iframe=document.createElement('iframe');
    iframe.src=base+'index.html?embedded=1';
    iframe.title='皇家音樂廳';
    iframe.setAttribute('allow','autoplay; encrypted-media');
    iframe.style.cssText='display:block;width:100%;height:100%;border:0;background:#080403;';
    var min=document.createElement('button');
    min.type='button'; min.title='縮小皇家音樂廳'; min.textContent='−';
    min.style.cssText='position:absolute;top:10px;right:10px;z-index:5;width:36px;height:36px;border:1px solid rgba(226,193,123,.5);border-radius:50%;background:rgba(12,5,2,.78);color:#f2d796;font:24px/32px Georgia,serif;cursor:pointer;box-shadow:0 0 16px rgba(226,193,123,.18);';
    var mini=document.createElement('button');
    mini.type='button'; mini.title='開啟皇家音樂廳'; mini.textContent='♫';
    mini.style.cssText='position:fixed;right:24px;bottom:24px;z-index:2147483001;width:62px;height:62px;border:0;border-radius:50%;background:rgba(12,5,2,.9);color:#e8c978;font:34px/1 Georgia,serif;cursor:pointer;display:none;align-items:center;justify-content:center;text-shadow:0 0 8px rgba(232,201,120,.65),0 0 24px rgba(226,193,123,.28);box-shadow:0 8px 25px rgba(0,0,0,.45),0 0 24px rgba(226,193,123,.2);';
    min.onclick=function(){root.style.display='none';mini.style.display='flex';};
    mini.onclick=function(){root.style.display='flex';mini.style.display='none';};
    frame.appendChild(iframe);frame.appendChild(min);root.appendChild(frame);
    document.body.appendChild(root);document.body.appendChild(mini);
  });
})();