// Voice notes: spoken briefings for common conditions (data/voicenotes.js).
// Android reads them with the phone's own text-to-speech (CFRNative.speak, keeps going with the screen off);
// iPhone and the web version use the browser's speech synthesis. Nothing is recorded.
(function(){
const {esc,route,row,callout}=App;
const N=window.CFRNative;
const RATES=[['0.85','Slower'],['1','Normal'],['1.2','Faster']];
const rate=()=>App.LS.get('cfr.vn.rate','1');

/* ---------- speech engine ---------- */
const T=App.tts={tag:null,parts:0,cur:-1,
  native:()=>!!(N&&N.speak),
  ok:()=>T.native()||!!window.speechSynthesis,
  speak(parts,tag){T.stop(true);T.tag=tag;T.parts=parts.length;T.cur=-1;
    if(T.native()){N.speak(JSON.stringify(parts),parseFloat(rate()),tag);return;}
    const S=window.speechSynthesis;if(!S){T.event({state:'unavailable'});return;}
    const vs=S.getVoices();const v=vs.find(x=>/en-GB/i.test(x.lang))||vs.find(x=>/^en/i.test(x.lang));
    parts.forEach((txt,i)=>{const u=new SpeechSynthesisUtterance(txt);u.lang='en-GB';if(v)u.voice=v;u.rate=parseFloat(rate());
      u.onstart=()=>T.event({state:'start',id:tag+'#'+i});u.onend=()=>T.event({state:'done',id:tag+'#'+i});
      u.onerror=e=>{if(e.error!=='interrupted'&&e.error!=='canceled')T.event({state:'error',id:tag+'#'+i});};S.speak(u);});},
  stop(quiet){const was=T.tag;T.tag=null;T.cur=-1;
    if(T.native())N.stopSpeaking();else if(window.speechSynthesis)window.speechSynthesis.cancel();
    if(!quiet&&was)T.event({state:'stopped',id:''});},
  event(d){if(d.state==='unavailable'||d.state==='error'){T.tag=null;App.toast('Your phone’s speech voice isn’t available. Check that a text-to-speech voice is installed in your phone settings.');T.ui();return;}
    if(d.state==='stopped'&&d.id===''){T.ui();return;}
    const m=String(d.id||'').match(/^(.*)#(\d+)$/);if(!m||m[1]!==T.tag)return;const i=+m[2];
    if(d.state==='start'){T.cur=i;T.ui();}
    else if(d.state==='done'&&i===T.parts-1){T.tag=null;T.cur=-1;App.native.keepAwake(false);T.ui();}},
  ui(){const el=document.getElementById('vnplayer');if(el&&T.onui)T.onui();}
};
App.onNative.tts=d=>T.event(d);
// Don't talk over the microphone or carry on into another page
const vs=App.native.voiceStart;App.native.voiceStart=()=>{T.stop(true);vs();};
window.addEventListener('hashchange',()=>{if(T.tag&&!/^#\/note\//.test(location.hash))T.stop(true);});

const spoken=(n,from)=>{const S=VOICENOTE_SECTIONS;return S.slice(from).map(([k,h],j)=>(j===0&&from===0?n.n+'. ':'')+h+'. '+n.s[k]);};
App.noteFor=condId=>VOICENOTES.find(v=>v.cond===condId);
App.noteButton=condId=>{const v=App.noteFor(condId);return v?`<a class="btn block mt" href="#/note/${v.id}">${I('headphones')}Listen to the voice note</a>`:'';};

/* ---------- list ---------- */
route('/notes',{title:'Voice notes',tab:'#/lookup',render(){
  return `<p class="lede">Short spoken briefings for common conditions: symptoms, causes, what to do, sats to expect and what to watch out for. Read aloud by your phone’s voice, so they work offline.</p>
  <label class="fld"><span>Search</span><input id="vnq" type="search" placeholder="e.g. asthma, hypo, stroke"></label>
  <div class="list mt" id="vnlist">${VOICENOTES.map(v=>`<a class="row" data-vn="${esc((v.n+' '+v.id).toLowerCase())}" href="#/note/${v.id}"><span class="chip-ic">${I('headphones')}</span><span class="tx"><b>${esc(v.n)}</b><span>Sats: ${esc(v.sats)}</span></span><span class="chev">${I('chev')}</span></a>`).join('')}</div>`;},
  after(){App.$('#vnq').oninput=e=>{const q=e.target.value.trim().toLowerCase();App.$$('#vnlist [data-vn]').forEach(r=>r.style.display=!q||r.dataset.vn.includes(q)?'':'none');};}});

/* ---------- one note ---------- */
route('/note/:id',{title:a=>(VOICENOTES.find(v=>v.id===a.id)||{n:'Voice note'}).n,parent:'#/notes',tab:'#/lookup',render(a){
  const v=VOICENOTES.find(x=>x.id===a.id);if(!v)return '<p class="empty">Not found.</p>';
  const S=VOICENOTE_SECTIONS;
  return `<div class="monohead"><p class="kicker">Voice note</p><h2 class="pt">${esc(v.n)}</h2><p class="small muted" style="margin:4px 0 0">Sats: ${esc(v.sats)}</p></div>
  <div class="card vnplayer" id="vnplayer">
    <button class="btn pri block" id="vnplay"></button>
    <div class="picker mt" id="vnrate">${RATES.map(([r,l])=>`<button data-r="${r}" aria-pressed="${rate()===r}">${l}</button>`).join('')}</div>
    <p class="small muted" id="vnnow" style="margin:8px 0 0"></p>
  </div>
  ${T.ok()?'':callout('amber','alert','This browser can’t read text aloud. You can still read the note below.')}
  ${S.map(([k,h],i)=>`<section class="mono vnsec${k==='watch'?' red':k==='do'?' do':''}" data-sec="${i}"><h3><button class="vnfrom" data-from="${i}" aria-label="Play from ${esc(h)}">${I('play')}</button>${esc(h)}</h3><div class="mb-body"><p>${esc(v.s[k])}</p></div></section>`).join('')}
  <div class="btnrow mt">${v.cond?`<a class="btn" href="#/condition/${v.cond}">${I('book')}Full condition page</a>`:''}${v.link?`<a class="btn red" href="${v.link}">${I('cpr')}Open cardiac arrest tool</a>`:''}<a class="btn" href="#/notes">${I('list')}All voice notes</a></div>
  <p class="small muted mt">A study aid, not a protocol. Follow your SCAS training and scope of practice.</p>`;},
  after(a){const v=VOICENOTES.find(x=>x.id===a.id);if(!v)return;
    let from=0;const tagFor=f=>v.id+'@'+f;
    const playing=()=>T.tag&&T.tag.startsWith(v.id+'@');
    T.onui=()=>{const b=App.$('#vnplay');if(!b)return;const on=playing();
      b.innerHTML=on?`${I('stop')}Stop`:`${I('play')}Play the whole note`;
      const sec=on&&T.cur>=0?from+T.cur:-1;
      App.$$('.vnsec').forEach(s=>s.classList.toggle('speaking',+s.dataset.sec===sec));
      App.$('#vnnow').textContent=on?(sec>=0?'Reading: '+VOICENOTE_SECTIONS[sec][1]:'Starting…'):'Plays through your phone’s speaker or headphones. Tap ▶ on a section to start there.';
      const el=App.$('.vnsec.speaking');if(el&&el.getBoundingClientRect().top>innerHeight*0.6)el.scrollIntoView({behavior:'smooth',block:'center'});};
    const start=f=>{from=f;T.speak(spoken(v,f),tagFor(f));App.native.keepAwake(true);T.onui();};
    App.$('#vnplay').onclick=()=>{if(playing()){T.stop();App.native.keepAwake(false);}else start(0);};
    App.$$('.vnfrom').forEach(b=>b.onclick=()=>start(+b.dataset.from));
    App.$('#vnrate').onclick=e=>{const b=e.target.closest('[data-r]');if(!b)return;App.LS.set('cfr.vn.rate',b.dataset.r);
      App.$$('#vnrate [data-r]').forEach(x=>x.setAttribute('aria-pressed',x===b));if(playing()){const cur=from+Math.max(0,T.cur);start(cur);}};
    if(T.tag&&T.tag.startsWith(v.id+'@'))from=+T.tag.split('@')[1];
    T.onui();}});
})();
