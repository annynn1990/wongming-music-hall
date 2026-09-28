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
    'position:fixed','left:0','top:50%','transform:translateY(-50%)',
    'z-index:2147483001','width:56px','height:78px',
    'margin:0','padding:0','border:1px solid rgba(226,193,123,.64)',
    'border-left:0','border-radius:0 15px 15px 0',
    'background:linear-gradient(90deg,rgba(11,5,2,.96),rgba(20,9,3,.9))',
    'color:#e8c978','font:39px/1 Georgia,"Times New Roman",serif',
    'cursor:pointer','display:flex','align-items:center','justify-content:center',
    'text-shadow:0 0 8px rgba(232,201,120,.72),0 0 25px rgba(226,193,123,.34)',
    'box-shadow:5px 0 22px rgba(0,0,0,.34),0 0 26px rgba(226,193,123,.18)',
    'transition:opacity .22s ease,transform .35s cubic-bezier(.2,.9,.25,1),filter .22s ease',
    'animation:wmMusicPulse 2.6s ease-in-out infinite'
  ].join(';');

  var veil=document.createElement('div');
  veil.setAttribute('aria-hidden','true');
  veil.style.cssText=[
    'position:fixed','inset:0','z-index:2147483000',
    'display:none','align-items:center','justify-content:center',
    'box-sizing:border-box','width:100vw','height:100dvh',
    'padding:12px','margin:0','overflow:hidden',
    'background:rgba(0,0,0,0)','backdrop-filter:blur(0)',
    'transition:background .32s ease,backdrop-filter .32s ease'
  ].join(';');

  var frame=document.createElement('div');
  frame.style.cssText=[
    'position:relative','box-sizing:border-box',
    'width:calc(100vw - 24px)','height:calc(100dvh - 24px)',
    'min-width:0','min-height:0','max-width:1800px','max-height:1200px',
    'overflow:hidden','background:#080403',
    'border:1px solid rgba(226,193,123,.62)',
    'box-shadow:0 24px 110px rgba(0,0,0,.82),0 0 46px rgba(226,193,123,.15)',
    'opacity:0','transform:translateY(22px) scale(.88)',
    'transition:opacity .4s ease,transform .46s cubic-bezier(.18,.86,.25,1)'
  ].join(';');

  var iframe=document.createElement('iframe');
  iframe.src=base+'index.html?embedded=1&v=9';
  iframe.title='皇家音樂廳';
  iframe.setAttribute('allow','autoplay; encrypted-media');
  iframe.setAttribute('scrolling','no');
  iframe.style.cssText=[
    'display:block','width:100%','height:100%',
    'min-width:0','min-height:0','border:0','margin:0','padding:0',
    'background:#080403','overflow:hidden'
  ].join(';');

  var minimize=document.createElement('button');
  minimize.type='button';
  minimize.setAttribute('aria-label','縮小皇家音樂廳');
  minimize.title='縮小';
  minimize.textContent='−';
  minimize.style.cssText=[
    'position:absolute','top:12px','right:12px','z-index:5',
    'width:42px','height:42px','margin:0','padding:0',
    'border:1px solid rgba(226,193,123,.58)','border-radius:50%',
    'background:rgba(10,4,2,.82)','color:#f0d792',
    'font:29px/38px Georgia,serif','cursor:pointer',
    'box-shadow:0 0 20px rgba(226,193,123,.18)',
    'transition:transform .2s ease,background .2s ease,box-shadow .2s ease'
  ].join(';');

  var style=document.createElement('style');
  style.textContent=[
    '@keyframes wmMusicPulse{0%,100%{box-shadow:5px 0 20px rgba(0,0,0,.32),0 0 14px rgba(226,193,123,.12);text-shadow:0 0 6px rgba(232,201,120,.5),0 0 18px rgba(226,193,123,.2)}50%{box-shadow:5px 0 25px rgba(0,0,0,.38),0 0 30px rgba(226,193,123,.3);text-shadow:0 0 10px rgba(232,201,120,.88),0 0 30px rgba(226,193,123,.44)}}',
    '#wongming-royal-music-hall-root .wm-opened{display:flex!important;background:rgba(0,0,0,.67)!important;backdrop-filter:blur(5px)!important}',
    '#wongming-royal-music-hall-root .wm-opened .wm-frame{opacity:1!important;transform:translateY(0) scale(1)!important}',
    '#wongming-royal-music-hall-root .wm-closing{background:rgba(0,0,0,0)!important;backdrop-filter:blur(0)!important}',
    '#wongming-royal-music-hall-root .wm-closing .wm-frame{opacity:0!important;transform:translateY(18px) scale(.9)!important}',
    '#wongming-royal-music-hall-root .wm-icon-hidden{opacity:0!important;pointer-events:none!important;transform:translate(-22px,-50%)!important}',
    '#wongming-royal-music-hall-root .wm-icon-show{opacity:1!important;pointer-events:auto!important;transform:translate(0,-50%)!important}',
    '@media(max-width:760px){#wongming-royal-music-hall-root .wm-frame{width:calc(100vw - 10px)!important;height:calc(100dvh - 10px)!important}#wongming-royal-music-hall-root .wm-minimize{top:8px!important;right:8px!important;width:38px!important;height:38px!important}}'
  ].join('');

  frame.className='wm-frame';
  minimize.className='wm-minimize';

  var isOpen=false;
  var closeTimer=null;

  function openHall(){
    if(isOpen) return;
    isOpen=true;
    if(closeTimer) clearTimeout(closeTimer);
    icon.classList.remove('wm-icon-show');
    icon.classList.add('wm-icon-hidden');
    veil.classList.remove('wm-closing');
    veil.classList.add('wm-opened');
    veil.style.display='flex';
    veil.setAttribute('aria-hidden','false');
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){
        frame.style.opacity='1';
        frame.style.transform='translateY(0) scale(1)';
      });
    });
  }

  function minimizeHall(){
    if(!isOpen) return;
    isOpen=false;
    veil.classList.remove('wm-opened');
    veil.classList.add('wm-closing');
    veil.setAttribute('aria-hidden','true');
    frame.style.opacity='0';
    frame.style.transform='translateY(18px) scale(.9)';
    closeTimer=setTimeout(function(){
      veil.style.display='none';
      veil.classList.remove('wm-closing');
      icon.classList.remove('wm-icon-hidden');
      icon.classList.add('wm-icon-show');
    },460);
  }

  icon.onclick=openHall;
  minimize.onclick=minimizeHall;
  veil.addEventListener('click',function(event){
    if(event.target===veil) minimizeHall();
  });
  document.addEventListener('keydown',function(event){
    if(event.key==='Escape' && isOpen) minimizeHall();
  });

  frame.appendChild(iframe);
  frame.appendChild(minimize);
  veil.appendChild(frame);
  root.appendChild(style);
  root.appendChild(icon);
  root.appendChild(veil);
  (document.body||document.documentElement).appendChild(root);
})();