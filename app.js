const DEFAULT=[
  {title:"天命所歸典禮曲",englishTitle:"",intro:"",youtube:"https://www.youtube.com/watch?v=nJFxOGmXo3k"},
  {title:"統治吧！帝國",englishTitle:"大樂集團",intro:"",youtube:"https://youtu.be/0FjsDF4D_qw?si=hZVBVGG2JZ127DmN"},
  {title:"宮廷的遐想",englishTitle:"Reverie of the Court",intro:"",youtube:"https://www.youtube.com/watch?v=-XttfvXYPLc"},
  {title:"昭武破陣樂",englishTitle:"Zhaowu’s Breaking Through the Enemy Array",intro:"",youtube:"https://www.youtube.com/watch?v=wv6zMrVgZLg"}
];

const CLOUD_WRITE="https://wongming-ai.vercel.app/api/locale?shrine=2";
const CLOUD_READ="https://api.github.com/repos/annynn1990/WONGMING-AI/contents/data/music-hall.json?ref=main";

async function readCloud(){
  const r=await fetch(CLOUD_READ+"&v="+Date.now(),{
    cache:"no-store",
    headers:{Accept:"application/vnd.github+json"}
  });
  if(!r.ok) throw new Error("CLOUD_READ_"+r.status);
  const x=await r.json();
  const binary=atob(String(x.content||"").replace(/\s/g,""));
  const bytes=Uint8Array.from(binary,c=>c.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}

let songs=[],player=null,ready=false,current=-1,playing=false,pendingControl=null,dragIndex=-1,editingIndex=-1;

const $=id=>document.getElementById(id);

const englishOf=s=>String(s?.englishTitle??s?.artist??"").trim();
const introOf=s=>String(s?.intro??"").trim();

function vid(u){
  try{
    const x=new URL(u);
    return x.hostname.includes("youtu.be")
      ?x.pathname.slice(1).split("/")[0]
      :x.searchParams.get("v")||((x.pathname.match(/\/embed\/([^/]+)/)||[])[1]||"");
  }catch{return""}
}

async function load(){
  const x=await readCloud();
  if(!Array.isArray(x)) throw new Error("CLOUD_DATA_INVALID");
  songs=x.map(s=>({
    title:String(s?.title||"").trim(),
    englishTitle:englishOf(s),
    intro:introOf(s),
    youtube:String(s?.youtube||"").trim()
  }));
}

function render(){
  $("count").textContent=songs.length+" 首";
  $("playlist").innerHTML="";
  songs.forEach((s,i)=>{
    const b=document.createElement("button");
    b.className="track "+(i===current?"active":"");
    b.innerHTML='<img src="https://i.ytimg.com/vi/'+encodeURIComponent(vid(s.youtube))+'/hqdefault.jpg"><span><div class="track-title"></div><div class="track-meta"></div></span>';
    b.querySelector(".track-title").textContent=s.title;
    b.querySelector(".track-meta").textContent=englishOf(s);
    b.onclick=()=>play(i);
    $("playlist").appendChild(b);
  });
}

function updatePerformanceText(s){
  $("title").textContent=s?.title||"";
  $("englishTitle").textContent=englishOf(s);
}

function prepareSongCrawl(){
  const box=$("songCrawl");
  const inner=box.querySelector(".song-crawl-inner");
  if(!box.classList.contains("playing")||!inner)return;

  requestAnimationFrame(()=>{
    const boxHeight=Math.max(box.clientHeight,1);
    const contentHeight=Math.max(inner.scrollHeight,1);
    const start=boxHeight;
    const end=-(contentHeight+boxHeight*1.05);
    const distance=Math.abs(end-start);
    const seconds=Math.max(60,Math.min(300,distance/32));

    box.style.setProperty("--crawl-start",start+"px");
    box.style.setProperty("--crawl-end",end+"px");
    box.style.setProperty("--crawl-duration",seconds+"s");

    inner.style.animation="none";
    void inner.offsetWidth;
    inner.style.animation="";
  });
}

function updateSongCrawl(s){
  const box=$("songCrawl");
  $("songCrawlTitle").textContent=s?.title||"";
  $("songCrawlEnglish").textContent=englishOf(s);
  $("songCrawlText").textContent=introOf(s);
  box.classList.remove("playing","is-paused");
  void box.offsetWidth;
  if(playing&&introOf(s)){
    box.classList.add("playing");
    prepareSongCrawl();
  }
}

function stopSongCrawl(){
  $("songCrawl").classList.remove("playing");
  $("songCrawl").classList.remove("is-paused");
}

function setSongCrawlPaused(paused){
  const box=$("songCrawl");
  if(!box.classList.contains("playing")) return;
  box.classList.toggle("is-paused",!!paused);
}

$("songCrawl").addEventListener("pointerdown",()=>{
  setSongCrawlPaused(true);
});

window.addEventListener("pointerup",()=>{
  setSongCrawlPaused(false);
});

window.addEventListener("pointercancel",()=>{
  setSongCrawlPaused(false);
});

function notifyEmbed(state){
  try{
    if(window.parent&&window.parent!==window){
      window.parent.postMessage(
        {type:"wongming-royal-music-hall",state:state},
        "*"
      );
    }
  }catch{}
}

function setPlaying(v){
  playing=v;
  document.body.classList.toggle("playing",v);
  $("playButton").classList.toggle("playing",v);
  $("soundNote").textContent=v?"♪ 正在演奏":"按中央播放鍵開始演奏";
  if(v) updateSongCrawl(songs[current]);
  else stopSongCrawl();
  notifyEmbed(v?"playing":"paused");
}

function play(i){
  const s=songs[i],id=vid(s?.youtube);
  if(!s||!id) return;

  current=i;
  updatePerformanceText(s);
  render();
  updateSongCrawl(s);
  window.pending=id;

  if(ready){
    player.loadVideoById(id);
    player.playVideo();
    setPlaying(true);
  }
}

$("playButton").onclick=()=>{
  if(!songs.length) return;

  if(!ready){
    pendingControl="play";
    window.pending=vid(songs[current>=0?current:0]?.youtube||"");
    if(window.YT&&YT.Player) make();
    return;
  }

  if(playing) player.pauseVideo();
  else player.playVideo();
};

function handleControl(action){
  if(!songs.length)return;

  if(!ready){
    pendingControl=action||"toggle";
    window.pending=vid(songs[current>=0?current:0]?.youtube||"");
    if(window.YT&&YT.Player) make();
    return;
  }

  if(action==="play") player.playVideo();
  else if(action==="pause") player.pauseVideo();
  else if(action==="toggle"){
    if(playing) player.pauseVideo();
    else player.playVideo();
  }
}

window.addEventListener("message",event=>{
  if(event.source!==window.parent)return;
  if(!event.data||event.data.type!=="wongming-royal-music-hall-control")return;
  handleControl(event.data.action||"toggle");
});

function make(){
  if(player)return;

  const id=window.pending||vid(songs[0]?.youtube||"");
  if(!id)return;

  player=new YT.Player("player",{
    videoId:id,
    playerVars:{playsinline:1,controls:0,rel:0,modestbranding:1},
    events:{
      onReady:e=>{
        ready=true;
        const action=pendingControl;
        pendingControl=null;

        if(action==="pause"){
          e.target.cueVideoById(id);
          setPlaying(false);
        }else if(action==="play"||action==="toggle"){
          e.target.loadVideoById(id);
          e.target.playVideo();
          setPlaying(true);
        }else{
          e.target.cueVideoById(id);
          setPlaying(false);
        }
        notifyEmbed("ready");
      },
      onStateChange:e=>{
        if(e.data===YT.PlayerState.PLAYING) setPlaying(true);
        if(e.data===YT.PlayerState.PAUSED) setPlaying(false);
        if(e.data===YT.PlayerState.ENDED){
          playing=false;
          document.body.classList.remove("playing");
          $("playButton").classList.remove("playing");
          $("soundNote").textContent="按中央播放鍵開始演奏";
          stopSongCrawl();
          notifyEmbed("stopped");
        }
      }
    }
  });
}

window.onYouTubeIframeAPIReady=()=>{
  if(pendingControl) make();
};

const eq=document.querySelector(".equalizer");
for(let i=0;i<52;i++){
  const e=document.createElement("span");
  e.style.setProperty("--h",(20+Math.random()*115)+"px");
  e.style.setProperty("--speed",(0.28+Math.random()*.58)+"s");
  e.style.setProperty("--delay",(-Math.random()*1.2)+"s");
  eq.appendChild(e);
}

const pf=document.querySelector("#particleField");
for(let i=0;i<30;i++){
  const e=document.createElement("i");
  e.className="particle";
  e.style.left=(8+Math.random()*84)+"%";
  e.style.top=(45+Math.random()*45)+"%";
  e.style.setProperty("--speed",(1.4+Math.random()*2)+"s");
  e.style.setProperty("--delay",(-Math.random()*3)+"s");
  pf.appendChild(e);
}

const modal=$("manageModal");

$("manageOpen").onclick=()=>{
  modal.hidden=false;
  $("manageLock").hidden=false;
  $("manageEditor").hidden=true;
  $("managePw").value="";
  $("manageErr").textContent="";
  setTimeout(()=>$("managePw").focus(),50);
};

$("manageClose").onclick=()=>{
  modal.hidden=true;
};

$("managePw").onkeydown=e=>{
  if(e.key==="Enter") $("manageUnlock").click();
};

$("manageUnlock").onclick=()=>{
  if($("managePw").value==="1111"){
    $("manageLock").hidden=true;
    $("manageEditor").hidden=false;
    loadManage();
  }else{
    $("manageErr").textContent="管理密碼錯誤";
  }
};

async function loadManage(){
  try{
    const x=await readCloud();
    if(Array.isArray(x)){
      songs=x.map(s=>({
        title:String(s?.title||"").trim(),
        englishTitle:englishOf(s),
        intro:introOf(s),
        youtube:String(s?.youtube||"").trim()
      }));
    }
    render();
    renderManage();
    $("manageStatus").textContent="已連線至雲端曲目資料";
  }catch{
    $("manageStatus").textContent="雲端讀取失敗";
  }
}

function normalizeSong(s){
  return {
    title:String(s?.title||"").trim(),
    englishTitle:englishOf(s),
    intro:introOf(s),
    youtube:String(s?.youtube||"").trim()
  };
}

function renderManage(){
  const list=$("manageList");
  list.innerHTML="";

  if(!songs.length){
    list.innerHTML='<div class="manage-empty">目前沒有曲目。</div>';
    return;
  }

  songs.forEach((s,i)=>{
    const d=document.createElement("div");
    d.className="manage-song";
    d.draggable=true;
    d.dataset.index=String(i);

    const drag=document.createElement("div");
    drag.className="manage-drag";
    drag.textContent="☷";
    drag.title="拖曳調整順序";

    const info=document.createElement("div");
    info.className="manage-song-info";

    const b=document.createElement("b");
    b.textContent=(i+1)+". "+s.title;

    const en=document.createElement("small");
    en.textContent=englishOf(s)||"未設定英文曲名";

    const url=document.createElement("small");
    url.textContent=s.youtube||"未設定 YouTube";

    info.appendChild(b);
    info.appendChild(en);
    info.appendChild(url);

      const actions=document.createElement("div");
    actions.className="manage-song-actions";

    const edit=document.createElement("button");
    edit.type="button";
    edit.textContent="編輯";
    edit.title="編輯這首歌曲";
    edit.onclick=()=>{
      startEditSong(i);
    };

    const up=document.createElement("button");
    up.type="button";
    up.textContent="↑";
    up.title="往上移";
    up.disabled=i===0;
    up.onclick=async()=>{
      if(i<=0)return;
      [songs[i-1],songs[i]]=[songs[i],songs[i-1]];
      render();
      renderManage();
      await saveManage();
    };

    const down=document.createElement("button");
    down.type="button";
    down.textContent="↓";
    down.title="往下移";
    down.disabled=i===songs.length-1;
    down.onclick=async()=>{
      if(i>=songs.length-1)return;
      [songs[i+1],songs[i]]=[songs[i],songs[i+1]];
      render();
      renderManage();
      await saveManage();
    };

    const del=document.createElement("button");
    del.type="button";
    del.textContent="刪除";
    del.onclick=async()=>{
      songs.splice(i,1);
      render();
      renderManage();
      await saveManage();
    };

    actions.append(edit,up,down,del);
    d.append(drag,info,actions);

    d.addEventListener("dragstart",()=>{
      dragIndex=i;
      d.classList.add("dragging");
    });

    d.addEventListener("dragend",()=>{
      dragIndex=-1;
      d.classList.remove("dragging");
      list.querySelectorAll(".manage-song").forEach(x=>x.classList.remove("drag-over"));
    });

    d.addEventListener("dragover",e=>{
      e.preventDefault();
      if(dragIndex!==i)d.classList.add("drag-over");
    });

    d.addEventListener("dragleave",()=>{
      d.classList.remove("drag-over");
    });

    d.addEventListener("drop",async e=>{
      e.preventDefault();
      d.classList.remove("drag-over");

      const from=dragIndex;
      const to=i;
      if(from<0||from===to)return;

      const [moved]=songs.splice(from,1);
      songs.splice(to,0,moved);

      dragIndex=-1;
      render();
      renderManage();
      await saveManage();
    });

    list.appendChild(d);
  });
}

function clearEditForm(){
  editingIndex=-1;
  $("manageTitleInput").value="";
  $("manageEnglishInput").value="";
  $("manageIntroInput").value="";
  $("manageUrlInput").value="";
  $("manageAdd").hidden=false;
  $("manageSaveEdit").hidden=true;
  $("manageCancelEdit").hidden=true;
}

function startEditSong(i){
  const s=songs[i];
  if(!s)return;
  editingIndex=i;
  $("manageTitleInput").value=s.title||"";
  $("manageEnglishInput").value=englishOf(s);
  $("manageIntroInput").value=introOf(s);
  $("manageUrlInput").value=s.youtube||"";
  $("manageAdd").hidden=true;
  $("manageSaveEdit").hidden=false;
  $("manageCancelEdit").hidden=false;
  $("manageTitleInput").focus();
  $("manageStatus").textContent="正在編輯第 "+(i+1)+" 首曲目";
}

async function saveEditedSong(){
  if(editingIndex<0||!songs[editingIndex])return;

  const title=$("manageTitleInput").value.trim();
  const englishTitle=$("manageEnglishInput").value.trim();
  const intro=$("manageIntroInput").value.trim();
  const youtube=$("manageUrlInput").value.trim();

  if(!title||!youtube){
    return alert("請填寫曲名與 YouTube 網址");
  }

  songs[editingIndex]={
    title,
    englishTitle,
    intro,
    youtube
  };

  await saveManage();
  clearEditForm();
}

async function saveManage(){
  $("manageStatus").textContent="正在同步雲端……";

  try{
    const payload=songs.map(normalizeSong);

    const r=await fetch(CLOUD_WRITE,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(payload)
    });

    const x=await r.json();

    if(!r.ok||!x.ok)throw new Error(x?.message||"SAVE_FAILED");

    const saved=await readCloud();

    if(!Array.isArray(saved))throw new Error("VERIFY_FAILED");

    songs=saved.map(normalizeSong);

    render();
    renderManage();

    $("manageStatus").textContent="已儲存並從雲端驗證成功";
  }catch(error){
    $("manageStatus").textContent="儲存失敗，請檢查雲端 API";
    console.error(error);
  }
}

$("manageAdd").onclick=async()=>{
  const title=$("manageTitleInput").value.trim();
  const englishTitle=$("manageEnglishInput").value.trim();
  const intro=$("manageIntroInput").value.trim();
  const youtube=$("manageUrlInput").value.trim();

  if(!title||!youtube){
    return alert("請填寫曲名與 YouTube 網址");
  }

  songs.push({
    title,
    englishTitle,
    intro,
    youtube
  });

  await saveManage();
  clearEditForm();
};

$("manageSaveEdit").onclick=saveEditedSong;
$("manageCancelEdit").onclick=()=>{
  clearEditForm();
  $("manageStatus").textContent="已取消修改";
};

$("manageReset").onclick=async()=>{
  songs=DEFAULT.map(s=>({...s}));
  await saveManage();
};

(async()=>{
  try{
    await load();

    current=songs.length?0:-1;

    render();

    if(current>=0){
      updatePerformanceText(songs[0]);
      updateSongCrawl(songs[0]);
    }
  }catch(error){
    songs=[];
    current=-1;
    render();
    $("title").textContent="雲端曲目資料讀取失敗";
    $("englishTitle").textContent="請稍後重新整理";
    $("soundNote").textContent="目前未使用預設資料，以免覆蓋雲端記憶";
    notifyEmbed("paused");
    console.error("Royal Music Hall cloud load failed:",error);
  }

  const x=document.createElement("script");
  x.src="https://www.youtube.com/iframe_api";
  document.head.appendChild(x);
})();