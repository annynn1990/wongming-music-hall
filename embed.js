(function(){
  'use strict';
  if(window.__WONGMING_ROYAL_MUSIC_HALL__) return;
  window.__WONGMING_ROYAL_MUSIC_HALL__=true;

  var base='https://annynn1990.github.io/wongming-music-hall/';
  var root=document.createElement('div');
  root.id='wongming-royal-music-hall-root';

  var icon=document.createElement('button');
  icon.type='button';
  icon.setAttribute('aria-label','開啟皇家音樂廳');
  icon.title='皇家音樂廳';
  icon.textContent='♫';
  icon.style.cssText=[
    'position:fixed','left:16px','top:50%','transform:translateY(-50%)',
    'z-index:2147483001','width:58px','height:74px',
    'border:1px solid rgba(226,193,123,.62)','border-radius:0 16px 16px 0',
    'background:linear-gradient(90deg,rgba(11,5,2,.96),rgba(20,9,3,.88))',
    'color:#e8c978','font:38px/1 Georgia,"Times New Roman",serif',
    'cursor:pointer','display:flex','align-items:center','justify-content:center',
    'text-shadow:0 0 8px rgba(232,201,120,.7),0 0 24px rgba(226,193,123,.32)',
    'box-shadow:6px 0 24px rgba(0,0,0,.3),0 0 24px rgba(226,193,123,.16)',
    'animation:wmMusicPulse 2.6s ease-in-out infinite'
  ].join(';');

  var veil=document.createElement('div');
  veil.style.cssText=[
    'position:fixed','inset:0','z-index:2147483000',
    'display:none','align-items:center','justify-content:center',
    'background:rgba(0,0,0,.62)','backdrop-filter:blur(4px)',
    'padding:4vh 4vw'
  ].join(';');

  var frame=document.createElement('div');
  frame.style.cssText=[
    'position:relative','width:92vw','height:92vh','max-width:1800px',
    'max-height:1200px','overflow:hidden','background:#080403',
    'border:1px solid rgba(226,193,123,.58)',
    'box-shadow:0 25px 110px rgba(0,0,0,.8),0 0 42px rgba(226,193,123,.12)'
  ].join(';');

  var iframe=document.createElement('iframe');
  iframe.src=base+'index.html?embedded=1&v=8';
  iframe.title='皇家音樂廳';
  iframe.setAttribute('allow','autoplay; encrypted-media');
  iframe.style.cssText='display:block;width:100%;height:100%;border:0;background:#080403';

  var minimize=document.createElement('button');
  minimize.type='button';
  minimize.setAttribute('aria-label','縮小皇家音樂廳');
  minimize.title='縮小';
  minimize.textContent='−';
  minimize.style.cssText=[
    'position:absolute','top:12px','right:12px','z-index:5',
    'width:40px','height:40px','border:1px solid rgba(226,193,123,.55)',
    'border-radius:50%','background:rgba(10,4,2,.8)',
    'color:#f0d792','font:28px/36px Georgia,serif',
    'cursor:pointer','box-shadow:0 0 18px rgba(226,193,123,.16)'
  ].join(';');

  var style=document.createElement('style');
  style.textContent='@keyframes wmMusicPulse{0%,100%{box-shadow:6px 0 20px rgba(0,0,0,.3),0 0 14px rgba(226,193,123,.12);text-shadow:0 0 6px rgba(232,201,120,.5),0 0 18px rgba(226,193,123,.2)}50%{box-shadow:6px 0 25px rgba(0,0,0,.35),0 0 30px rgba(226,193,123,.3);text-shadow:0 0 10px rgba(232,201,120,.85),0 0 30px rgba(226,193,123,.42)}}';

  function openHall(){
    veil.style.display='flex';
    icon.style.display='none';
  }
  function minimizeHall(){
    veil.style.display='none';
    icon.style.display='flex';
  }

  icon.onclick=openHall;
  minimize.onclick=minimizeHall;

  frame.appendChild(iframe);
  frame.appendChild(minimize);
  veil.appendChild(frame);
  root.appendChild(style);
  root.appendChild(icon);
  root.appendChild(veil);
  (document.body||document.documentElement).appendChild(root);
})();