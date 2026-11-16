// Core: state, native bridge, router, shell and shared UI helpers.
(function(){
const App=window.App={routes:[],onNative:{}};

/* ---------- helpers ---------- */
App.esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const esc=App.esc;
App.$=(s,r=document)=>r.querySelector(s);
App.$$=(s,r=document)=>[...r.querySelectorAll(s)];
App.slug=s=>String(s).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
App.time=(t=Date.now())=>new Date(t).toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'});
App.dateTime=(t=Date.now())=>new Date(t).toLocaleString('en-GB',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'});
App.toast=(msg,ms=2200)=>{App.$$('.toast').forEach(x=>x.remove());const t=document.createElement('div');t.className='toast';t.setAttribute('role','status');t.textContent=msg;document.body.appendChild(t);setTimeout(()=>t.remove(),ms);};
App.go=h=>{location.hash=h;};
// In-app confirm dialog (Android WebView blocks the browser's confirm()).
App.confirm=(msg,okLabel,onOk)=>{
  const d=document.createElement('div');d.className='modal';d.setAttribute('role','alertdialog');d.setAttribute('aria-modal','true');
  d.innerHTML=`<div class="sheet"><p class="mmsg"></p><div class="btnrow"><button class="btn" data-a="no">Cancel</button><button class="btn red" data-a="ok"></button></div></div>`;
  d.querySelector('.mmsg').textContent=msg;d.querySelector('[data-a=ok]').textContent=okLabel||'OK';
  const close=()=>d.remove();
  d.addEventListener('click',e=>{const a=e.target.closest('[data-a]');if(a){close();if(a.dataset.a==='ok')onOk();}else if(e.target===d)close();});
  document.body.appendChild(d);d.querySelector('[data-a=no]').focus();
};

/* ---------- storage ---------- */
const LS={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d;}catch(e){return d;}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}},del(k){try{localStorage.removeItem(k);}catch(e){}}};
App.LS=LS;
App.settings=Object.assign({theme:'system',fs:100,contrast:'normal',haptics:true,secure:true},LS.get('cfr.settings',{}));
App.saveSettings=()=>{LS.set('cfr.settings',App.settings);App.applySettings();};
App.applySettings=()=>{
  const s=App.settings, root=document.documentElement;
  const dark=s.theme==='dark'||(s.theme==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);
  root.dataset.theme=dark?'dark':'light';
  root.dataset.contrast=s.contrast;
  root.style.setProperty('--fs',(16*s.fs/100)+'px');
  const surf=getComputedStyle(root).getPropertyValue('--surface').trim()||'#ffffff';
  App.native.setChrome('#0E1A24',surf,!dark);
};

// Patient session: held in memory ONLY. Never written to the phone's storage.
// Cleared by End job, by closing the app, or after 30 minutes in the background.
LS.del('cfr.patient');            // remove anything saved by older versions
const BG_LIMIT=30*60e3;
App.patient=null;
App.newPatient=()=>({id:Date.now(),started:Date.now(),obs:[],draft:{},info:{},sample:{},atmist:{},meds:[],notes:[]});
App.clearHooks=[];
App.onClear=fn=>App.clearHooks.push(fn);
App.updateSecure=()=>{const on=App.settings.secure!==false&&!!App.patient;if(App._secure!==on){App._secure=on;if(window.CFRNative&&window.CFRNative.setSecure)window.CFRNative.setSecure(on);}};
App.pt=()=>{if(!App.patient){App.patient=App.newPatient();App.updateSecure();}return App.patient;};
App.savePatient=()=>{if(App.patient)App.patient.touched=Date.now();App.updateSecure();};
App.clearPatient=()=>{App.patient=null;App.clearHooks.forEach(fn=>{try{fn();}catch(e){}});App.updateSecure();};
App.endJob=after=>App.confirm('End this job and clear all patient details from the app?','End job',()=>{App.clearPatient();App.toast('Patient details cleared',2500);if(after)after();else App.render();});
// Background timer: clear after 30 minutes away
const goneAway=()=>{App.bgAt=Date.now();};
const cameBack=()=>{if(App.patient&&App.bgAt&&Date.now()-App.bgAt>BG_LIMIT){App.clearPatient();if(location.hash&&location.hash!=='#/')location.hash='#/';else App.render();App.toast('Patient details cleared after 30 minutes away',3500);}App.bgAt=0;};
App.onNative.lifecycle=d=>{if(d.state==='background')goneAway();else if(d.state==='foreground')cameBack();};
document.addEventListener('visibilitychange',()=>{if(window.CFRNative)return;if(document.hidden)goneAway();else cameBack();});

/* ---------- native bridge ---------- */
const N=window.CFRNative;
let caps={native:false,voice:false,scan:false};
try{if(N)caps=JSON.parse(N.capabilities());}catch(e){}
App.native={
  caps,
  has:!!N,
  scan:g=>N&&N.scanPrescription(!!g),
  voiceStart:()=>N?N.startVoice():App.webSpeech.start(),
  voiceStop:()=>N?N.stopVoice():App.webSpeech.stop(),
  share:(title,text)=>{if(N)N.share(title,text);else if(navigator.share)navigator.share({title,text}).catch(()=>{});else App.copy(text);},
  keepAwake:on=>N&&N.keepAwake(!!on),
  haptic:()=>{if(App.settings.haptics){if(N)N.haptic();else if(navigator.vibrate)navigator.vibrate(12);}},
  setChrome:(a,b,l)=>N&&N.setChrome(a,b,!!l)
};
App.voiceAvailable=()=>N?caps.voice:!!(window.SpeechRecognition||window.webkitSpeechRecognition);
App.copy=text=>{(navigator.clipboard?navigator.clipboard.writeText(text):Promise.reject()).then(()=>App.toast('Copied'),()=>{const ta=document.createElement('textarea');ta.value=text;document.body.appendChild(ta);ta.select();try{document.execCommand('copy');App.toast('Copied');}catch(e){}ta.remove();});};
window.__native=(type,data)=>{const h=App.onNative[type];if(h)h(data||{});};

// Browser fallback for testing voice capture outside the app
App.webSpeech={rec:null,active:false,
  start(){const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){window.__native('voice',{status:'error',message:'Voice capture needs the phone app (or Chrome for testing).'});return;}
    const r=this.rec=new SR();r.lang='en-GB';r.continuous=true;r.interimResults=true;this.active=true;
    r.onstart=()=>window.__native('voice',{status:'listening',offline:false});
    r.onresult=e=>{for(let i=e.resultIndex;i<e.results.length;i++){const res=e.results[i];window.__native('voice',{status:res.isFinal?'final':'partial',text:res[0].transcript});}};
    r.onerror=e=>{if(e.error==='no-speech')return;this.active=false;window.__native('voice',{status:'error',message:'Voice error: '+e.error});};
    r.onend=()=>{if(this.active)try{r.start();}catch(e){}};
    r.start();},
  stop(){this.active=false;if(this.rec)this.rec.stop();window.__native('voice',{status:'stopped'});}
};

/* ---------- UI building blocks ---------- */
App.row=(href,icon,title,sub,opt={})=>`<a class="row" href="${href}">${icon?`<span class="chip-ic${opt.tone?' '+opt.tone:''}">${I(icon)}</span>`:''}<span class="tx"><b>${esc(title)}</b>${sub?`<span${opt.wrap?' class="wrapt"':''}>${esc(sub)}</span>`:''}</span>${opt.right||`<span class="chev">${I('chev')}</span>`}</a>`;
App.callout=(tone,icon,html)=>`<div class="callout ${tone}">${I(icon)}<div>${html}</div></div>`;
App.scope=()=>`<p class="scope">${I('info')}<span>Reference aid for trained Community First Responders. Always work within your SCAS training, scope of practice and current guidance, and escalate through EOC.</span></p>`;
App.ticks=(arr,flags)=>`<ul class="ticks${flags?' flags':''}">${arr.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`;
App.acc=(title,body,opt={})=>`<details class="acc${opt.red?' red':''}"${opt.open?' open':''}><summary>${opt.icon?I(opt.icon):''}${esc(title)}</summary><div class="body">${body}</div></details>`;
App.kv=pairs=>`<dl class="kv">${pairs.map(([k,v])=>`<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl>`;

/* ---------- router & shell ---------- */
App.route=(pattern,def)=>{App.routes.push(Object.assign({re:new RegExp('^'+pattern.replace(/:(\w+)/g,'([^/]+)')+'$'),keys:(pattern.match(/:(\w+)/g)||[]).map(k=>k.slice(1))},def));};
const TABS=[['#/','home','Home'],['#/assess','assess','Assess'],['#/voice','mic','Record'],['#/lookup','book','Lookup'],['#/patient','user','Patient']];
App.shell=()=>{
  document.getElementById('app').innerHTML=`
  <header class="appbar" id="bar"></header>
  <main id="view" tabindex="-1"></main>
  <nav class="tabbar" aria-label="Main">${TABS.map(([h,ic,l])=>h==='#/voice'?`<a class="tab mic" href="${h}" data-tab="${h}" aria-label="Record obs by voice"><span class="micdisc">${I('mic')}</span></a>`:`<a class="tab" href="${h}" data-tab="${h}">${I(ic)}<span>${l}</span></a>`).join('')}</nav>`;
};
App.render=()=>{
  const hash=location.hash||'#/';
  const [path,qs]=hash.slice(1).split('?');
  const params=Object.fromEntries(new URLSearchParams(qs||''));
  let r=null,args={};
  for(const rt of App.routes){const m=path.match(rt.re);if(m){r=rt;rt.keys.forEach((k,i)=>args[k]=decodeURIComponent(m[i+1]));break;}}
  if(!r){r=App.routes[0];}
  Object.assign(args,params);
  if(App.leave){try{App.leave();}catch(e){} App.leave=null;}
  const view=App.$('#view');
  const title=typeof r.title==='function'?r.title(args):r.title;
  const isRoot=!!r.root;
  App.$('#bar').innerHTML=isRoot&&path==='/'?
    `<div class="brand"><span class="brandmark">${I('plus')}</span><h1>CFR Reference<span class="sub">Community First Responder guide</span></h1></div><a class="iconbtn" href="#/search" aria-label="Search">${I('search')}</a><a class="iconbtn" href="#/settings" aria-label="Settings">${I('settings')}</a>`:
    `${isRoot?'':`<button class="iconbtn" id="backbtn" aria-label="Back">${I('back')}</button>`}<h1 style="${isRoot?'padding-left:4px':''}">${esc(title)}</h1><a class="iconbtn" href="#/search" aria-label="Search">${I('search')}</a>${isRoot?`<a class="iconbtn" href="#/settings" aria-label="Settings">${I('settings')}</a>`:''}`;
  const bb=App.$('#backbtn'); if(bb) bb.onclick=()=>{if(history.length>1)history.back();else App.go(r.parent||'#/');};
  const tab=r.tab||'#/';
  App.$$('.tab').forEach(t=>{if(t.dataset.tab===tab)t.setAttribute('aria-current','page');else t.removeAttribute('aria-current');});
  view.innerHTML=`<div class="wrap">${r.render(args)}</div>`;
  view.scrollTop=0;
  document.title=title+' · CFR Reference';
  if(r.after) r.after(args,view);
  App.$('.tab.mic').classList.toggle('live',!!App.voiceLive);
};
App.start=()=>{
  App.shell(); App.applySettings();
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change',()=>App.settings.theme==='system'&&App.applySettings());
  window.addEventListener('hashchange',App.render);
  App.render();
};

/* ---------- search ---------- */
let IDX=null;
App.resetIndex=()=>{IDX=null;};
App.buildIndex=()=>{
  const X=[];
  const add=(t,sub,href,icon,body)=>X.push({t,sub,href,icon,s:(t+' '+(sub||'')+' '+(body||'')).toLowerCase()});
  [['Cardiac arrest / CPR','CPR metronome, timer and log','#/arrest','cpr'],['NEWS2 calculator','Score a set of obs','#/news2','pulse'],['Record obs by voice','Speak obs as you take them','#/voice','mic'],['Scan a medicine','Photo of a label or box','#/scan','camera'],['Primary survey (DRSABCD / ABCDE)','Structured assessment','#/abcde','abc'],['Secondary survey','SAMPLE, OPQRST, head to toe','#/secondary','stetho'],['GCS calculator','Glasgow Coma Scale','#/gcs','brain'],['BE-FAST stroke check','Balance, Eyes, Face, Arms, Speech, Time','#/befast','brain'],['Sepsis screen','Red flags and NEWS2','#/sepsis','sepsis'],['Children: normal values','Age-based ranges and weight','#/paeds','baby'],['Normal values (adult)','Obs reference ranges','#/values','list'],['ECG rhythms','Illustrative strips','#/ecg','ecg'],['Handover (ATMIST)','Build and share handover','#/handover','share'],['CAS130 record','Responder skills / equipment form','#/cas130','list'],['Pain & symptom checker','Body map plus symptoms: possible causes','#/bodymap','user'],['Requested conditions','Conditions to have written up','#/requests','plus'],['Visual lookup','Bites, stings, rashes, wounds, burns, infected skin','#/visual','image'],['Medical terms','Glossary','#/terms','book'],['Latin & abbreviations','Prefixes, suffixes, prescription terms','#/latin','book']].forEach(a=>add(...a));
  (window.SYSTEMS||[]).forEach(s=>add(s.n+' system',s.tag,'#/system/'+s.id,s.icon,s.overview+' '+s.parts.map(p=>p.join(' ')).join(' ')));
  (window.SYMPTOMS||[]).forEach(s=>add(s.n,'Symptom lookup','#/symptom/'+s.id,'symptom',s.aka+' '+s.serious.join(' ')+' '+s.common.join(' ')));
  (window.QUICK||[]).forEach(q=>add(q[1],'Quick card','#/card/'+q[0],'info',q[2]+' '+q[3].join(' ')+' '+q[4].join(' ')));
  (window.COMPARE||[]).forEach(x=>add(x.t,'Tell them apart','#/compare/'+x.id,'list',x.a.n+' '+x.b.n+' '+x.rows.flat().join(' ')));
  (window.CONDITIONS||[]).forEach(c=>add(c.n,'Condition','#/condition/'+c.id,'stetho',c.def+' '+(c.types||[]).map(t=>t.join(' ')).join(' ')+' '+c.pres.join(' ')+' '+c.meds.map(m=>m.join(' ')).join(' ')));
  (window.MEDS||[]).forEach((m,i)=>add(m[0],(m[1]?m[1]+' · ':'')+m[2],'#/med/'+i,'pill',m[3]));
  (window.REF_ECG||[]).forEach(e=>add(e.n,'ECG rhythm','#/ecg?id='+e.id,'ecg',e.p));
  (window.REF_TERMS||[]).forEach(t=>add(t.t,'Medical term','#/terms?q='+encodeURIComponent(t.t),'book',t.d));
  (App.imgs||[]).forEach(m=>{const s=(window.SYSTEMS||[]).find(x=>x.id===m.sys);add(m.cap||'Untitled image','My image · '+(s?s.n:''),'#/system/'+m.sys+'?tab='+m.sec,'image','');});
  (window.SCENARIOS||[]).forEach(x=>add(x.t,'Follow the patient: '+x.sub,'#/scenario/'+x.id,x.icon,x.intro+' '+x.stages.map(s=>s.title+' '+s.body).join(' ')));
  Object.entries(window.CONNECT||{}).forEach(([id,C])=>{const s=(window.SYSTEMS||[]).find(x=>x.id===id);if(!s)return;
    add(s.n+': connections',"How it links to other systems",'#/system/'+id+'?tab=connect',s.icon,C.intro+' '+C.links.map(l=>l[1]).join(' '));
    C.chains.forEach(ch=>add(ch.q,'Why does this happen? · '+s.n,'#/system/'+id+'?tab=connect',s.icon,ch.steps.join(' ')+' '+ch.so));});
  (window.SYSTEMS||[]).forEach(s=>(s.topics||[]).forEach(t=>add(t.t,s.n+' system','#/system/'+s.id+'?tab='+t.id,s.icon,JSON.stringify(t.blocks).replace(/[{}\[\]"]/g,' '))));
  (window.REF_LATIN||[]).forEach(t=>add(t.t,'Latin / abbreviation','#/latin?q='+encodeURIComponent(t.t),'book',t.d));
  IDX=X;
};
App.search=q=>{
  if(!IDX)App.buildIndex();
  const terms=q.toLowerCase().split(/\s+/).filter(Boolean); if(!terms.length) return [];
  const res=[];
  for(const it of IDX){
    let sc=0; const tl=it.t.toLowerCase();
    for(const w of terms){ if(!it.s.includes(w)){sc=-1;break;} sc+= tl.startsWith(w)?6: tl.includes(w)?4:1; }
    if(sc>0) res.push([sc,it]);
  }
  return res.sort((a,b)=>b[0]-a[0]).slice(0,60).map(x=>x[1]);
};
App.hl=(text,q)=>{let h=esc(text);q.split(/\s+/).filter(w=>w.length>1).forEach(w=>{h=h.replace(new RegExp('('+w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','ig'),'<mark class="hl">$1</mark>');});return h;};
})();
