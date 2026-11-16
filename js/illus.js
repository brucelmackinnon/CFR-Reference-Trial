// Illustration pack: real medical illustrations downloaded once (Settings) and shown in body system sections.
(function(){
const {esc}=App, N=()=>window.CFRNative;
App.illus={have:{},running:false,prog:null,last:null};
App.illusAvailable=()=>!!(N()&&App.native.caps.illus);
App.illusLoad=()=>{try{if(App.illusAvailable())App.illus.have=JSON.parse(N().illusStatus()||'{}');}catch(e){App.illus.have={};}};
App.illusSrc=h=>(window.CFRNative&&window.CFRNative.fileUrl)?window.CFRNative.fileUrl('illustrations/'+h.file):(location.protocol==='file:'?'illus_test/':'/illustrations/')+h.file;
App.illusCount=()=>Object.keys(App.illus.have).length;
App.illusFor=(sys,sec)=>(window.ILLUS||[]).filter(m=>m.sys===sys&&(!sec||m.sec===sec)&&App.illus.have[m.id]);

const credit=h=>[h.credit?`Illustration: ${esc(h.credit)}`:'Illustration',h.license?esc(h.license):''].filter(Boolean).join(' · ');
App.illusBlock=(sys,sec)=>App.illusFor(sys,sec).map(m=>{const h=App.illus.have[m.id];
  return `<figure class="fig ill"><button class="illbtn" data-ill="${m.id}" aria-label="Enlarge: ${esc(m.cap)}"><img src="${esc(App.illusSrc(h))}" alt="${esc(m.cap)}" loading="lazy"${h.w&&h.h?` width="${h.w}" height="${h.h}"`:''}></button>
  <figcaption>${esc(m.cap)}</figcaption><p class="credit">${credit(h)}</p></figure>`;}).join('');
App.illusFig=id=>{const m=(window.ILLUS||[]).find(x=>x.id===id),h=App.illus.have[id];if(!m||!h)return '';
  return `<figure class="fig ill"><button class="illbtn" data-ill="${m.id}" aria-label="Enlarge: ${esc(m.cap)}"><img src="${esc(App.illusSrc(h))}" alt="${esc(m.cap)}" loading="lazy"></button><figcaption>${esc(m.cap)}</figcaption><p class="credit">${credit(h)}</p></figure>`;};
App.illusBanner=()=>App.illusAvailable()&&!App.illusCount()&&!App.illus.running?
  `<a class="callout info illban" href="#/settings?focus=illus" style="text-decoration:none;color:inherit;margin-bottom:12px">${I('image')}<div><b>Get the illustration pack</b><br><span class="small">Real medical illustrations for every body system. One tap in Settings, about 15 MB, then works offline.</span></div></a>`:'';

document.addEventListener('click',e=>{const b=e.target.closest('[data-ill]');if(!b)return;const m=(window.ILLUS||[]).find(x=>x.id===b.dataset.ill),h=App.illus.have[b.dataset.ill];if(!m||!h)return;
  App.viewer(`<img src="${esc(App.illusSrc(h))}" alt="">`,m.cap);});

/* ---------- Settings card ---------- */
App.illusCard=()=>{
  if(!App.illusAvailable())return `<div class="card"><p class="small muted">The illustration pack downloads in the phone app.</p></div>`;
  const tot=(window.ILLUS||[]).length,have=App.illusCount(),s=App.illus;
  const prog=s.running&&s.prog?`<div class="cyclebar mt"><i style="width:${Math.round(100*s.prog.done/Math.max(1,s.prog.total))}%;background:var(--primary)"></i></div><p class="small muted">Downloading ${s.prog.done+1} of ${s.prog.total}: ${esc(s.prog.current||'')}</p>`:'';
  const res=s.last&&!s.running?`<p class="small">${s.last.ok} of ${s.last.total} illustrations ready.${s.last.failed&&s.last.failed.length?` ${s.last.failed.length} couldn\u2019t be found this time; tap Update later to retry.`:''}</p>`:'';
  return `<div class="card" id="illcard"><p class="small">Real anatomy illustrations from <b>Blausen Medical</b> and <b>Servier Medical Art</b> (free to use with credit), shown in each body system. Downloaded once from Wikimedia Commons over Wi-Fi (about 15 MB), then they work offline.</p>
  <p class="small"><b>${have} of ${tot}</b> downloaded.</p>${prog}${res}
  <div class="btnrow">${s.running?`<button class="btn" id="illcancel">${I('x')}Cancel</button>`:`<button class="btn pri" id="illdl">${I('image')}${have?'Update':'Download illustrations'}</button>`}${have&&!s.running?`<button class="btn" id="illdel">${I('trash')}Remove</button>`:''}</div>
  ${have?`<a class="btn ghost block mt" href="#/credits">${I('info')}Image credits</a>`:''}</div>`;};
App.illusBind=()=>{const d=App.$('#illdl'),c=App.$('#illcancel'),r=App.$('#illdel');
  if(d)d.onclick=()=>{App.illus.running=true;App.illus.prog={done:0,total:(window.ILLUS||[]).length,current:'Connecting…'};App.illus.last=null;N().illusDownload(JSON.stringify(window.ILLUS));App.illusRefresh();};
  if(c)c.onclick=()=>{N().illusCancel();};
  if(r)r.onclick=()=>App.confirm('Remove all downloaded illustrations from the phone?','Remove',()=>{N().illusDelete();App.illus.have={};App.illus.last=null;App.illusRefresh();});};
App.illusRefresh=()=>{const c=App.$('#illcard');if(c){c.outerHTML=App.illusCard();App.illusBind();}};
App.onNative.illus=d=>{const s=App.illus;
  if(d.status==='progress'){s.running=true;s.prog=d;}
  else if(d.status==='done'||d.status==='cancelled'){s.running=false;s.last=d;try{s.have=JSON.parse(d.index||'{}');}catch(e){App.illusLoad();}App.toast(d.status==='done'?`${d.ok} illustrations ready`:'Download cancelled',2500);}
  else if(d.status==='error'){s.running=false;App.toast(d.message||'Download failed',4000);App.illusLoad();}
  App.illusRefresh();};

/* ---------- Credits page ---------- */
App.route('/credits',{title:'Image credits',tab:'#/',render(){
  const list=(window.ILLUS||[]).filter(m=>App.illus.have[m.id]);
  return `<p class="lede">These illustrations are used under their open licences. Thank you to the creators.</p>
  <div class="list">${list.map(m=>{const h=App.illus.have[m.id];return `<div class="row" style="align-items:flex-start"><img src="${esc(App.illusSrc(h))}" alt="" style="width:64px;height:64px;object-fit:cover;border-radius:10px;flex:none;background:var(--surface2)"><span class="tx"><b>${esc(m.cap)}</b><span class="wrapt">${esc(h.title||'')}</span><span class="wrapt">${esc(h.credit||'Unknown author')}${h.license?' · '+esc(h.license):''}</span><span class="wrapt small muted">${esc(h.page||'')}</span></span></div>`;}).join('')||'<p class="empty">No illustrations downloaded.</p>'}</div>
  <p class="small muted mt">Blausen illustrations: Blausen.com staff (2014). \u201cMedical gallery of Blausen Medical 2014\u201d. WikiJournal of Medicine 1 (2). doi:10.15347/wjm/2014.010. Servier Medical Art by Servier, licensed under CC BY 4.0.</p>`;}});

App.illusLoad();
})();
