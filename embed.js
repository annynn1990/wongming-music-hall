(function(){
  'use strict';
  if(window.__WONGMING_ROYAL_MUSIC_HALL__)return;
  window.__WONGMING_ROYAL_MUSIC_HALL__=true;

  var base='https://annynn1990.github.io/wongming-music-hall/';
  var root=document.createElement('div');
  root.id='wongming-royal-music-hall-root';

  var icon=document.createElement('button');
  icon.type='button';
  icon.id='wm-royal-music-toggle';
  icon.title='皇家音樂廳';
  icon.textContent='▶';
  icon.style.cssText=[
    'position:fixed','left:0','top:50%','transform:translateY(-50%)',
    'z-index:2147483001','width:56px','height:78px','margin:0','padding:0',
    'border:1px solid rgba(226,193,123,.64)','border-left:0',
    'border-radius:0 15px 15px 0',
    'background:linear-gradient(90deg,rgba(11,5,2,.97),rgba(20,9,3,.9))',
    'color:#e8c978','font:34px/1 Georgia,"Times New Roman",serif',
    'cursor:pointer','display:flex','align-items:center','justify-content:center',
    'text-shadow:0 0 8px rgba(232,201,120,.72),0 0 25px rgba(226,193,123,.34)',
    'box-shadow:5px 0 22px rgba(0,0,0,.34),0 0 26px rgba(226,193,123,.18)',
    'animation:wmMusicPulse 2.6s ease-in-out infinite',
    'transition:opacity .22s ease,transform .35s cubic-bezier(.2,.9,.25,1),filter .22s ease'
  ].join(';');

  var veil=document.createElement('div');
  veil.style.cssText=[
    'position:fixed','inset:0','z-index:2147483000','display:none',
    'align-items:center','justify-content:center','width:100vw','height:100dvh',
    'margin:0','padding:0','overflow:hidden','background:rgba(0,0,0,.67)',
    'backdrop-filter:blur(5px)'
  ].join(';');

  var frame=document.createElement('div');
  frame.style.cssText=[
    'position:relative','width:80vw','height:80vh','min-width:0','min-height:0',
    'overflow:hidden','background:#080403','border:1px solid rgba(226,193,123,.62)',
    'box-shadow:0 24px 110px rgba(0,0,0,.82),0 0 46px rgba(226,193,123,.15)',
    'opacity:0','transform:translateY(22px) scale(.88)',
    'transition:opacity .4s ease,transform .46s cubic-bezier(.18,.86,.25,1)'
  ].join(';');

  var iframe=document.createElement('iframe');
  iframe.src=base+'index.html?embedded=1&v=10';
  iframe.title='皇家音樂廳';
  iframe.setAttribute('allow','autoplay; encrypted-media');
  iframe.setAttribute('scrolling','no');
  iframe.style.cssText='display:block;width:100%;height:100%;border:0;margin:0;padding:0;background:#080403';

  var minimize=document.createElement('button');
  minimize.type='button';
  minimize.textContent='−';
  minimize.title='縮小';
  minimize.style.cssText=[
    'position:absolute','top:12px','right:12px','z-index:5','width:42px','height:42px',
    'border:1px solid rgba(226,193,123,.58)','border-radius:50%',
    'background:rgba(10,4,2,.82)','color:#f0d792','font:29px/38px Georgia,serif',
    'cursor:pointer','box-shadow:0 0 20px rgba(226,193,123,.18)'
  ].join(';');

  var style=document.createElement('style');
  style.textContent='@keyframes wmMusicPulse{0%,100%{box-shadow:5px 0 20px rgba(0,0,0,.32),0 0 14px rgba(226,193,123,.12);text-shadow:0 0 6px rgba(232,201,120,.5),0 0 18px rgba(226,193,123,.2)}50%{box-shadow:5px 0 25px rgba(0,0,0,.38),0 0 30px rgba(226,193,123,.3);text-shadow:0 0 10px rgba(232,201,120,.88),0 0 30px rgba(226,193,123,.44)}}';

  var opened=false,closeTimer=null,musicState='paused';

  function updateMusicButton(state){
    musicState=state;
    if(state==='playing'){
      icon.textContent='Ⅱ';
      icon.style.fontSize='30px';
      icon.setAttribute('aria-label','正在播放；點擊可暫停音樂');
    }else{
      icon.textContent='▶';
      icon.style.fontSize='34px';
      icon.setAttribute('aria-label','已暫停；點擊可播放音樂');
    }
  }

  function sendControl(action){
    try{
      iframe.contentWindow.postMessage({
        type:'wongming-royal-music-hall-control',
        action:action
      },'*');
    }catch{}
  }

  function openHall(){
    opened=true;
    if(closeTimer)clearTimeout(closeTimer);
    veil.style.display='flex';
    requestAnimationFrame(function(){
      frame.style.opacity='1';
      frame.style.transform='translateY(0) scale(1)';
    });
  }

  function minimizeHall(){
    if(!opened)return;
    opened=false;
    frame.style.opacity='0';
    frame.style.transform='translateY(18px) scale(.9)';
    closeTimer=setTimeout(function(){
      veil.style.display='none';
    },460);
  }

  icon.onclick=function(){
    if(opened){
      sendControl(musicState==='playing'?'pause':'play');
    }else{
      openHall();
      if(musicState==='playing')sendControl('pause');
      else sendControl('play');
    }
  };

  minimize.onclick=minimizeHall;

  veil.onclick=function(event){
    if(event.target===veil)minimizeHall();
  };

  document.addEventListener('keydown',function(event){
    if(event.key==='Escape'&&opened)minimizeHall();
  });

  window.addEventListener('message',function(event){
    if(event.source!==iframe.contentWindow)return;
    if(!event.data||event.data.type!=='wongming-royal-music-hall')return;

    if(event.data.state==='playing')updateMusicButton('playing');
    if(event.data.state==='paused'||event.data.state==='stopped')updateMusicButton('paused');
  });

  frame.appendChild(iframe);
  frame.appendChild(minimize);
  veil.appendChild(frame);
  root.appendChild(style);
  root.appendChild(icon);
  root.appendChild(veil);
  (document.body||document.documentElement).appendChild(root);

  updateMusicButton('paused');
})();