// Pages: home, lookup library, body systems, symptoms, conditions, meds, reference.
(function(){
const {esc,row,callout,scope,ticks,acc,kv,route}=App;

/* ---------- Home ---------- */
route('/',{root:true,title:'CFR Reference',tab:'#/',render(){
  const p=App.patient, last=p&&p.obs[p.obs.length-1];
  const n=last?Tools.news2(last):null;
  const step=(h,ic,t,s,done)=>`<a class="jstep${done?' done':''}" href="${h}">${I(done?'check':ic)}<span><b>${t}</b><span>${s}</span></span></a>`;
  const job=p?`<section class="jobcard" aria-label="Current job">
      <a class="jobhead" href="#/patient"><span class="badge ${n?'b'+n.band:''}">${n?n.total:'–'}</span>
        <span style="flex:1"><b>Current job</b><span>Started ${App.time(p.started)} · ${p.obs.length} obs set${p.obs.length===1?'':'s'}${n?' · NEWS2 '+n.total+' '+App.newsRisk(last):''}</span></span>${I('chev')}</a>
      <div class="jsteps">
        ${step('#/voice','mic','1 Obs',p.obs.length?p.obs.length+' set'+(p.obs.length===1?'':'s')+' · add more':'Speak or tap in',p.obs.length>0)}
        ${step('#/bodymap','user','2 Pain & symptoms','Where it hurts, likely causes',false)}
        ${step('#/cas130','list','3 CAS130 form','Auto-filled · send as text',p.cas&&Object.keys(p.cas).length>0)}
        ${step('#/handover','share','4 Handover','ATMIST to the crew',false)}
      </div>
      <button class="btn red block" id="homeend">${I('check')}End job and clear details</button></section>`
    :`<section class="jobcard" aria-label="Start a job"><div class="jobhead"><span class="badge">${I('user')}</span><span style="flex:1"><b>No job in progress</b><span>Start one to record obs, fill in the CAS130 and build the handover. Nothing is saved to the phone.</span></span></div>
      <div class="btnrow"><button class="btn pri" id="homestart">${I('plus')}Start job</button><a class="btn" href="#/voice">${I('mic')}Voice obs</a></div></section>`;
  const tile=(h,ic,t,s,tone)=>`<a class="tile" href="${h}" style="text-decoration:none;color:inherit"><span class="chip-ic${tone?' '+tone:''}">${I(ic)}</span><span><b>${t}</b><br><span>${s}</span></span></a>`;
  return `${job}
  ${p?'':`<a class="card bigtool" href="#/bodymap"><span class="chip-ic red">${I('user')}</span><span style="flex:1"><b>Pain & symptom checker</b><span>Tap where it hurts, add symptoms and history: likely causes</span></span>${I('chev')}</a>`}
  <div class="tiles">
    ${tile('#/arrest','cpr','Cardiac arrest','CPR metronome, timer, log','red')}
    ${tile('#/voice','mic','Record obs','Speak them as you take them')}
    ${tile('#/news2','pulse','NEWS2','Score, risk and what to do','amber')}
    ${tile('#/befast','brain','Stroke check','BE-FAST and time last well','red')}
    ${tile('#/cas130','list','CAS130 form','Auto-filled, send as text')}
    ${tile('#/scan','camera','Scan a medicine','What is it usually for?')}
    ${tile('#/symptoms','symptom','Symptom lookup','Causes, questions, red flags')}
    ${tile('#/visual','image','Visual lookup','Bites, rashes, wounds, burns')}
    ${tile('#/notes','headphones','Voice notes','Listen: symptoms, what to do, sats')}
    ${tile('#/conditions','stetho','Conditions','A to Z, textbook-style pages')}
  </div>
  <h3 class="sh">Assessment</h3>
  <div class="list">
    ${row('#/abcde','abc','Primary survey','DRSABCD and ABCDE')}
    ${row('#/secondary','stetho','Secondary survey','SAMPLE, OPQRST, head to toe')}
    ${row('#/sepsis','sepsis','Sepsis screen','Red flags with NEWS2')}
    ${row('#/handover','share','Handover','ATMIST, ready to share')}
    ${row('#/systems','heart','Body systems','Anatomy, assessment, meds')}
  </div>
  ${scope()}`;},
  after(){const st=App.$('#homestart');if(st)st.onclick=()=>{App.pt();App.savePatient();App.render();};
    const en=App.$('#homeend');if(en)en.onclick=()=>App.endJob();}});

/* ---------- Assess hub ---------- */
route('/assess',{root:true,title:'Assess',tab:'#/assess',render(){return `
  <h2 class="pt">Assess</h2><p class="lede">Structured assessment and scoring tools.</p>
  <div class="list">
    ${row('#/arrest','cpr','Cardiac arrest','CPR metronome, timer and log',{tone:'red'})}
    ${row('#/abcde','abc','Primary survey','DRSABCD then ABCDE')}
    ${row('#/secondary','stetho','Secondary survey','SAMPLE, OPQRST, head to toe')}
  </div>
  <h3 class="sh">Scores and screens</h3>
  <div class="list">
    ${row('#/bodymap','user','Pain & symptom checker','Body map plus symptoms: ranked possible causes',{tone:'red'})}
    ${row('#/visual','image','Visual lookup','Bites, rashes, wounds, burns and infected skin')}
    ${row('#/news2','pulse','NEWS2 calculator','RCP NEWS2 with escalation guide',{tone:'amber'})}
    ${row('#/gcs','brain','Glasgow Coma Scale','Eyes, verbal, motor')}
    ${row('#/befast','brain','BE-FAST stroke check','With time last known well',{tone:'red'})}
    ${row('#/sepsis','sepsis','Sepsis screen','Red flags plus NEWS2')}
    ${row('#/paeds','baby','Children','Normal values by age and weight estimate')}
  </div>
  <h3 class="sh">Learn</h3>
  <div class="list">${row('#/scenarios','pulse','Follow the patient','Sepsis, bleeding, heart attack, DKA, COPD, head injury')}</div>
  <h3 class="sh">Patient record</h3>
  <div class="list">
    ${row('#/voice','mic','Record obs by voice','Speak obs as you take them')}
    ${row('#/obs/new','edit','Enter obs manually','Tap-in observations')}
    ${row('#/handover','share','Handover (ATMIST)','Generated from your record')}
    ${row('#/cas130','list','CAS130 record','Auto-filled form, send as text')}
  </div>${scope()}`;}});

/* ---------- Lookup hub ---------- */
route('/lookup',{root:true,title:'Lookup',tab:'#/lookup',render(){return `
  <form class="search" onsubmit="event.preventDefault();App.go('#/search?q='+encodeURIComponent(this.q.value))" role="search">${I('search')}<input name="q" placeholder="Search symptoms, drugs, conditions…" aria-label="Search everything"></form>
  <h3 class="sh">Clinical</h3>
  <div class="list">
    ${row('#/symptoms','symptom','Symptom lookup',`${SYMPTOMS.length} presenting complaints`)}
    ${row('#/bodymap','user','Pain & symptom checker','Body map plus symptoms')}
    ${row('#/visual','image','Visual lookup','What does it look like? Bites, rashes, wounds, burns')}
    ${row('#/systems','heart','Body systems',`${SYSTEMS.length} systems, how they link together`)}
    ${row('#/scenarios','pulse','Follow the patient',`${SCENARIOS.length} cases: watch the body compensate, then fail`)}
    ${row('#/notes','headphones','Voice notes',`${VOICENOTES.length} spoken briefings: symptoms, causes, what to do, sats`)}
    ${row('#/conditions','stetho','Conditions',`${CONDITIONS.length} conditions, textbook-style pages`)}
    ${row('#/meds','pill','Medicines',`${MEDS.length} common UK medicines`)}
    ${row('#/scan','camera','Scan a medicine','Read a label or box with the camera')}
    ${row('#/ecg','ecg','ECG rhythms',`${REF_ECG.length} illustrative strips`)}
    ${row('#/compare','list','Tell them apart',`${COMPARE.length} side-by-side comparisons`)}
    ${row('#/online','external','Look it up online','NHS, NICE CKS, BNF, Patient.info')}
  </div>
  <h3 class="sh">Reference</h3>
  <div class="list">
    ${row('#/values','list','Normal values','Adult observation ranges')}
    ${row('#/paeds','baby','Children','Normal values by age')}
    ${row('#/terms','book','Medical terms',`${REF_TERMS.length} definitions`)}
    ${row('#/latin','book','Latin and abbreviations',`${REF_LATIN.length} terms`)}
  </div>${scope()}`;}});

/* ---------- Search ---------- */
route('/search',{title:'Search',tab:'#/lookup',render(a){
  return `<div class="search">${I('search')}<input id="sq" type="search" value="${esc(a.q||'')}" placeholder="Search everything" aria-label="Search everything" autocomplete="off"></div><div id="sres" class="mt"></div>`;},
  after(a){const inp=App.$('#sq'),out=App.$('#sres');
    const run=()=>{const q=inp.value.trim();if(!q){out.innerHTML=`<p class="empty">Search symptoms, drugs (generic or brand), conditions, terms and tools.</p>`;return;}
      const r=App.search(q);const web=`<h3 class="sh">Search online for “${esc(q)}”</h3><div class="list">${['nhs','cks','bnf'].map(k=>{const s=App.webSources[k];return `<button class="row" data-web="${k}" data-q="${esc(q)}"><span class="chip-ic">${I(s.icon)}</span><span class="tx"><b>${esc(s.t)}</b><span>${esc(s.sub)}</span></span><span class="chev">${I('external')}</span></button>`;}).join('')}</div>`;out.innerHTML=(r.length?`<div class="list">${r.map(it=>`<a class="row" href="${it.href}"><span class="chip-ic">${I(it.icon)}</span><span class="tx"><b>${App.hl(it.t,q)}</b><span>${esc(it.sub||'')}</span></span></a>`).join('')}</div>`:`<p class="empty">Nothing in the app for “${esc(q)}”. Try a different spelling or a brand name, or search online below.</p><button class="btn pri block" data-req="${esc(q)}">${I('plus')}Request a page for “${esc(q)}”</button><a class="btn ghost block mt" href="#/mycond/new?n=${encodeURIComponent(q)}">${I('edit')}Or write it yourself</a>`)+web;};
    inp.addEventListener('input',run);run();setTimeout(()=>inp.focus(),50);}});

/* ---------- Body systems ---------- */
route('/systems',{title:'Body systems',tab:'#/lookup',render(){return `
  <h2 class="pt">Body systems</h2><p class="lede">Anatomy, how each system works and fails, what to assess, red flags and linked medicines.</p>
  <div class="list">${SYSTEMS.map(s=>row('#/system/'+s.id,s.icon,s.n,s.tag)).join('')}</div>`;}});

const SYS_BASE=[['diagrams','Diagrams'],['anatomy','Anatomy'],['works','How it works'],['fails','When it fails'],['assess','Assessment'],['flags','Red flags'],['meds','Medicines']];
App.tabsFor=s=>[['overview','Overview'],...(s.topics||[]).map(t=>[t.id,t.t]),...((window.CONNECT||{})[s.id]?[['connect','Connections']]:[]),...SYS_BASE,['myimg','My images']];
function renderBlocks(blocks){return blocks.map(b=>{
  if(b.fig)return fig(b.fig);
  if(b.p)return `<p>${esc(b.p)}</p>`;
  if(b.h)return `<h3 class="sh">${esc(b.h)}</h3>`;
  if(b.pearls)return `<div class="card pearls"><b class="ptitle">${I('info')}Key points</b>${ticks(b.pearls)}</div>`;
  if(b.callout)return `<div class="mt">${callout(b.callout[0],b.callout[1],b.callout[2])}</div>`;
  if(b.table&&b.table.head.length>=4){const h=b.table.head,wide=h.length>=5;const tone={Sensory:'s',Motor:'m',Both:'b'};
    return `<div class="rcards mt mb">${b.table.rows.map(r=>`<div class="rcard" id="rc-${App.slug(r[0])}"><div class="rch"><b>${esc(r[0])}${wide?' '+esc(r[1]):''}</b>${wide?`<span class="tp tp-${tone[r[2]]||'x'}">${esc(r[2])}</span>`:''}</div><dl class="kv">${r.slice(wide?3:1).map((v,i)=>`<dt>${esc(h[(wide?3:1)+i])}</dt><dd>${esc(v)}</dd>`).join('')}</dl></div>`).join('')}</div>`;}
  if(b.table)return `<div class="tablewrap mt mb"><table class="t tw"><thead><tr>${b.table.head.map(h=>`<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${b.table.rows.map(r=>`<tr>${r.map((v,i)=>i===0?`<th scope="row">${esc(v)}</th>`:`<td>${esc(v)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  return '';}).join('');}
function fig(key){const d=DIAGRAMS[key];if(!d)return '';return `<figure class="fig"><div class="figwrap"><figcaption>${esc(d.cap)}</figcaption><button class="iconbtn zoombtn" data-zoom="${key}" aria-label="Enlarge diagram">${I('zoomin')}</button></div>${d.svg}${d.note?`<p class="note">${esc(d.note)}</p>`:''}</figure>`;}
App.fig=fig;
function sysSection(s,tab){
  if(tab==='myimg')return App.imgTab(s.id);
  const topic=(s.topics||[]).find(t=>t.id===tab);
  let body=topic?renderBlocks(topic.blocks):sysCore(s,tab);
  const ill=App.illusBlock?(tab==='diagrams'?App.illusBlock(s.id):App.illusBlock(s.id,tab)):'';
  if(ill){const i=body.indexOf('</p>');body=(i>-1&&tab!=='diagrams')?body.slice(0,i+4)+ill+body.slice(i+4):ill+body;}
  if(tab==='overview'&&App.illusBanner)body=App.illusBanner()+body;
  return body+App.imgSection(s.id,tab);
}
App.chainHTML=ch=>`<div class="chain card"><h4>${esc(ch.q)}</h4><ol class="flow">${ch.steps.map(x=>`<li>${esc(x)}</li>`).join('')}</ol><div class="so">${I('check')}<span><b>So:</b> ${esc(ch.so)}</span></div></div>`;
function connectHTML(s){const C=window.CONNECT[s.id];const sc=(window.SCENARIOS||[]).filter(x=>x.systems.includes(s.id));
  return `<p>${esc(C.intro)}</p>
  <h3 class="sh">How it links to other systems</h3><div class="list">${C.links.map(([id,t])=>{const o=SYSTEMS.find(x=>x.id===id);return o?`<a class="row link2" href="#/system/${id}?tab=connect" style="align-items:flex-start"><span class="chip-ic">${I(o.icon)}</span><span class="tx"><b>${esc(s.n)} ↔ ${esc(o.n)}</b><span class="wrapt" style="color:var(--text)">${esc(t)}</span></span></a>`:''}).join('')}</div>
  <h3 class="sh">Why does this happen?</h3>${C.chains.map(App.chainHTML).join('')}
  ${sc.length?`<h3 class="sh">Follow the patient</h3><div class="list">${sc.map(x=>row('#/scenario/'+x.id,x.icon,x.t,x.sub)).join('')}</div>`:''}
  ${C.deeper&&C.deeper.length?`<h3 class="sh">Go deeper <small>optional</small></h3>${C.deeper.map(([t,p])=>acc(t,`<p>${esc(p)}</p>`,{icon:'book'})).join('')}`:''}`;}
function sysCore(s,tab){
  switch(tab){
  case 'connect':return connectHTML(s);
  case 'overview':return `<p>${esc(s.overview)}</p>${fig(s.figs[0])}${(s.topics||[]).length?`<h3 class="sh">In depth</h3><div class="list">${s.topics.map(t=>`<button class="row" data-t="${t.id}"><span class="chip-ic">${I('book')}</span><span class="tx"><b>${esc(t.t)}</b><span>${esc((t.blocks.find(b=>b.p)||{p:''}).p.slice(0,90))}…</span></span><span class="chev">${I('chev')}</span></button>`).join('')}</div>`:''}
    <h3 class="sh">Key numbers</h3><div class="card">${kv(s.nums)}</div>
    <h3 class="sh">Special groups</h3><div class="card">${kv(s.special)}</div>
    <h3 class="sh">Related symptoms</h3><div class="list">${s.sym.map(id=>{const y=SYMPTOMS.find(x=>x.id===id);return y?row('#/symptom/'+id,'symptom',y.n,y.serious.slice(0,2).join(', ')):''}).join('')}</div>`;
  case 'diagrams':return s.figs.map(fig).join('')+`<p class="muted small">Tap ${I('zoomin')} to enlarge. Front views show the patient's right on your left.</p>`;
  case 'anatomy':return `<div class="list">${s.parts.map(([n,d])=>`<div class="row" style="align-items:flex-start"><span class="tx"><b>${esc(n)}</b><span class="wrapt">${esc(d)}</span></span></div>`).join('')}</div>`;
  case 'works':return `<div class="card"><ol class="steps">${s.works.map(w=>`<li>${esc(w)}</li>`).join('')}</ol></div>${s.figs[1]?fig(s.figs[1]):''}`;
  case 'fails':return `<div class="list">${s.fails.map(([n,d])=>`<div class="row" style="align-items:flex-start"><span class="tx"><b>${esc(n)}</b><span class="wrapt">${esc(d)}</span></span></div>`).join('')}</div>
    <h3 class="sh">What your findings mean</h3><div class="card">${kv(s.findings)}</div>
    <h3 class="sh">Conditions <small>${CONDITIONS.filter(c=>c.sid.includes(s.id)).length}</small></h3><div class="list">${CONDITIONS.filter(c=>c.sid.includes(s.id)).map(c=>row('#/condition/'+c.id,'stetho',c.n,App.condGroup(c))).join('')}</div>`;
  case 'assess':{const a=s.assess;const blk=(t,ic,arr)=>arr&&arr.length?acc(t,ticks(arr),{icon:ic,open:true}):'';
    return blk('Look','eye',a.look)+blk('Listen / ask','mic',a.listen)+blk('Feel','user',a.feel)+blk('Measure','pulse',a.measure)+`<div class="btnrow mt"><a class="btn" href="#/news2">${I('pulse')}NEWS2</a><a class="btn" href="#/voice">${I('mic')}Record obs</a></div>`;}
  case 'flags':return callout('red','alert','<b>Escalate early</b> through EOC if you find any of these.')+`<div class="card mt">${ticks(s.red,true)}</div>`;
  case 'meds':return `<div class="list">${s.meds.map(([c,ex])=>`<div class="row" style="align-items:flex-start"><span class="chip-ic">${I('pill')}</span><span class="tx"><b>${esc(c)}</b><span class="wrapt">${esc(ex)}</span></span></div>`).join('')}</div>
    <h3 class="sh">All ${esc(s.n.toLowerCase())} medicines <small>${MEDS.filter(m=>m[5]===s.id).length}</small></h3>
    <div class="list">${MEDS.map((m,i)=>m[5]===s.id?row('#/med/'+i,null,m[0],m[3]):'').join('')||'<p class="empty">See the medicines list.</p>'}</div>`;
  }
}
route('/system/:id',{title:a=>(SYSTEMS.find(s=>s.id===a.id)||{n:'System'}).n,parent:'#/systems',tab:'#/lookup',render(a){
  const s=SYSTEMS.find(x=>x.id===a.id); if(!s) return '<p class="empty">Not found.</p>';
  const tab=a.tab||'overview';
  return `<div class="syshead"><span class="chip-ic">${I(s.icon)}</span><div><h2 class="pt">${esc(s.n)} system</h2><div class="muted">${esc(s.tag)}</div></div></div>
  <div class="tabs" role="tablist">${App.tabsFor(s).map(([k,l])=>`<button aria-pressed="${k===tab}" data-t="${k}">${l}</button>`).join('')}</div>
  <div id="syssec">${sysSection(s,tab)}</div>${scope()}`;},
  after(a,v){const s=SYSTEMS.find(x=>x.id===a.id); if(!s)return;
    v.addEventListener('click',e=>{const b=e.target.closest('[data-t]');if(b){const tb=App.$(`.tabs [data-t="${b.dataset.t}"]`,v);App.$$('.tabs button',v).forEach(x=>x.setAttribute('aria-pressed',x===tb));if(tb)tb.scrollIntoView({inline:'center',block:'nearest'});App.$('#view').scrollTop=0;App.$('#syssec',v).innerHTML=sysSection(s,b.dataset.t);history.replaceState(null,'','#/system/'+s.id+'?tab='+b.dataset.t);}});
  }});

// Tap a nerve picture in a hub diagram to jump to its card
document.addEventListener('click',e=>{const g=e.target.closest('[data-cn]');if(!g||e.target.closest('.viewer'))return;const card=document.getElementById('rc-'+App.slug(g.dataset.cn));if(card){card.scrollIntoView({behavior:'smooth',block:'center'});card.classList.remove('flash');void card.offsetWidth;card.classList.add('flash');}});

// Diagram viewer (pinch zoom)
document.addEventListener('click',e=>{const z=e.target.closest('[data-zoom]');if(!z)return;const d=DIAGRAMS[z.dataset.zoom];App.viewer(`<div class="vsvg">${d.svg}</div>`,d.cap);});

/* ---------- Follow the patient ---------- */
route('/scenarios',{title:'Follow the patient',tab:'#/lookup',render(){return `<h2 class="pt">Follow the patient</h2>
  <p class="lede">Watch how the body compensates and then fails, stage by stage, with the obs you’d record at each point. Illustrative teaching cases.</p>
  <div class="list">${SCENARIOS.map(x=>row('#/scenario/'+x.id,x.icon,x.t,x.sub)).join('')}</div>${scope()}`;}});
route('/scenario/:id',{title:a=>(SCENARIOS.find(x=>x.id===a.id)||{t:'Scenario'}).t,parent:'#/scenarios',tab:'#/lookup',render(a){
  const x=SCENARIOS.find(y=>y.id===a.id);if(!x)return '<p class="empty">Not found.</p>';
  const chip=id=>{const o=SYSTEMS.find(s=>s.id===id);return o?`<a class="chip sysch" href="#/system/${id}?tab=connect">${I(o.icon)}${esc(o.n)}</a>`:'';};
  const trend=x.stages.map(st=>Tools.news2(st.obs).total);
  return `<h2 class="pt">${esc(x.t)}</h2><p class="muted">${esc(x.sub)}</p><p>${esc(x.intro)}</p>
  <div class="card trendc"><b>NEWS2 through the case</b><div class="trendrow">${x.stages.map((st,i)=>{const n=Tools.news2(st.obs);return `<a href="#st${i}" class="tstep" data-jump="st${i}"><span class="badge b${n.band}">${n.total}</span><span class="small">${esc(st.time)}</span></a>`;}).join('<span class="tarrow">→</span>')}</div></div>
  <ol class="timeline">${x.stages.map((st,i)=>`<li id="st${i}"><div class="tl-time">${esc(st.time)}</div><div class="card"><h3 class="tl-h">${esc(st.title)}</h3>
    <div class="chips mb">${st.sys.map(chip).join('')}</div>
    <p><b>What’s happening inside:</b> ${esc(st.body)}</p>
    ${App.scoreBox(st.obs)}<div class="mt">${App.obsGrid(st.obs,true)}</div>
    <p class="mt" style="margin-bottom:4px"><b>What you’d see</b></p>${ticks(st.see)}
    ${st.do?`<p class="mt" style="margin-bottom:4px"><b>What to do</b></p>${ticks(st.do)}`:''}
    ${st.lesson?`<div class="mt">${callout('info','info',esc(st.lesson))}</div>`:''}</div></li>`).join('')}</ol>
  <h3 class="sh">Key lessons</h3><div class="card pearls"><b class="ptitle">${I('info')}Take-aways</b>${ticks(x.lessons)}</div>
  <h3 class="sh">Systems involved</h3><div class="chips">${x.systems.map(chip).join('')}</div>${scope()}`;},
  after(a,v){v.addEventListener('click',e=>{const j=e.target.closest('[data-jump]');if(j){e.preventDefault();const el=document.getElementById(j.dataset.jump);if(el)el.scrollIntoView({behavior:'smooth',block:'start'});}});}});

document.addEventListener('click',e=>{const b=e.target.closest('[data-req]');if(b&&App.addRequest(b.dataset.req)){b.disabled=true;b.textContent='Added to requested conditions';}});

/* ---------- Symptoms ---------- */
route('/symptoms',{title:'Symptom lookup',tab:'#/lookup',render(){return `
  <h2 class="pt">Symptom lookup</h2><p class="lede">What could it be, what to ask, what to check and when to escalate. An assessment aid, not a diagnosis.</p>
  <div class="btnrow mb"><a class="btn" href="#/bodymap">${I('user')}Pain & symptoms</a><a class="btn" href="#/visual">${I('image')}Visual lookup</a></div>
  <div class="search">${I('search')}<input id="yq" placeholder="e.g. chest pain, dizzy, swollen leg" aria-label="Filter symptoms"></div>
  <div class="list mt" id="ylist">${SYMPTOMS.map(s=>`<a class="row" href="#/symptom/${s.id}" data-s="${esc((s.n+' '+s.aka).toLowerCase())}"><span class="chip-ic">${I('symptom')}</span><span class="tx"><b>${esc(s.n)}</b><span>Don't miss: ${esc(s.serious.slice(0,2).join(', '))}</span></span><span class="chev">${I('chev')}</span></a>`).join('')}</div>`;},
  after(){const q=App.$('#yq');q.addEventListener('input',()=>{const v=q.value.toLowerCase().trim();App.$$('#ylist .row').forEach(r=>r.classList.toggle('hide',!!v&&!v.split(/\s+/).every(w=>r.dataset.s.includes(w))));});}});

route('/symptom/:id',{title:a=>(SYMPTOMS.find(s=>s.id===a.id)||{n:'Symptom'}).n,parent:'#/symptoms',tab:'#/lookup',render(a){
  const s=SYMPTOMS.find(x=>x.id===a.id); if(!s)return '<p class="empty">Not found.</p>';
  const conds=s.cond.map(n=>{const k=App.condByName(n);return k?row('#/condition/'+k.id,'stetho',k.n,App.condGroup(k)):'';}).join('');
  return `<h2 class="pt">${esc(s.n)}</h2>
  ${callout('red','alert',`<b>Red flags</b>${ticks(s.red,true)}`)}
  <h3 class="sh">Don't miss</h3><div class="card">${ticks(s.serious,true)}</div>
  <h3 class="sh">More common causes</h3><div class="card">${ticks(s.common)}</div>
  <h3 class="sh">Ask</h3><div class="card">${ticks(s.ask)}</div>
  <h3 class="sh">Check</h3><div class="card">${ticks(s.check)}</div>
  <h3 class="sh">Actions within your role</h3><div class="card">${ticks(s.act)}</div>
  ${conds?`<h3 class="sh">Related conditions</h3><div class="list">${conds}</div>`:''}
  <h3 class="sh">Body systems</h3><div class="list">${s.sys.map(id=>{const y=SYSTEMS.find(x=>x.id===id);return y?row('#/system/'+id,y.icon,y.n+' system',y.tag):''}).join('')}</div>
  ${App.webCard?`<div class="mt2">${App.webCard(s.n,['nhs','cks'])}</div>`:''}
  <div class="btnrow mt"><button class="btn" id="addc">${I('plus')}Add to patient record</button></div>${scope()}`;},
  after(a){App.$('#addc').onclick=()=>{const p=App.pt();p.info.complaint=p.info.complaint?p.info.complaint:(SYMPTOMS.find(x=>x.id===a.id).n);p.notes.push({t:Date.now(),text:'Presenting complaint: '+SYMPTOMS.find(x=>x.id===a.id).n});App.savePatient();App.toast('Added to patient record');};}});

/* ---------- Conditions (monograph format) ---------- */
const COND_GROUPS=[['cardiovascular','Heart & circulation'],['respiratory','Breathing'],['nervous','Brain & nerves'],['endocrine','Hormones & diabetes'],['lymphatic_immune','Infection & allergy'],['digestive','Gut & liver'],['urinary','Kidneys & urine'],['musculoskeletal','Bones & falls'],['reproductive','Pregnancy & reproductive'],['haematological','Blood'],['homeostasis','Heat, cold & poisons'],['integumentary','Skin']];
App.condByName=n=>CONDITIONS.find(c=>c.n===n);
App.condGroup=c=>{const g=COND_GROUPS.find(g=>g[0]===c.sid[0]);return g?g[1]:'Other';};
route('/conditions',{title:'Conditions',tab:'#/lookup',render(a){
  const f=a.g||'all';
  const used=COND_GROUPS.filter(g=>CONDITIONS.some(c=>c.sid[0]===g[0]));
  const list=CONDITIONS.filter(c=>f==='all'||(f==='mine'?c.mine:c.sid[0]===f)).sort((x,y)=>x.n.localeCompare(y.n));
  const nMine=CONDITIONS.filter(c=>c.mine).length;
  return `<h2 class="pt">Conditions</h2><p class="lede">${CONDITIONS.length} conditions: what\u2019s happening, what you\u2019ll find, red flags, what to do and the medicines you\u2019ll see.</p>
  <div class="list mb">${row('#/requests','plus','Requested conditions',`${App.wish.length} on your list: share them to have pages written`)}${row('#/mycond/new','edit','Write your own condition','Same layout, saved on this phone')}</div>
  <div class="search">${I('search')}<input id="cq" placeholder="Filter conditions" aria-label="Filter conditions"></div>
  <div class="chips mt" role="group" aria-label="Filter by system"><button class="chip" data-g="all" aria-pressed="${f==='all'}">All</button>${nMine?`<button class="chip" data-g="mine" aria-pressed="${f==='mine'}">My conditions (${nMine})</button>`:''}${used.map(([id,l])=>`<button class="chip" data-g="${id}" aria-pressed="${f===id}">${l}</button>`).join('')}</div>
  <div class="list mt" id="clist">${list.map(c=>{const s=SYSTEMS.find(x=>x.id===c.sid[0]);return `<a class="row" href="#/condition/${c.id}" data-s="${esc((c.n+' '+c.def+' '+(c.types||[]).map(t=>t[0]).join(' ')).toLowerCase())}"><span class="chip-ic">${I(s?s.icon:'stetho')}</span><span class="tx"><b>${esc(c.n)}</b><span>${c.mine?'My condition \u00b7 ':''}${esc(App.condGroup(c))}</span></span><span class="chev">${I('chev')}</span></a>`;}).join('')||'<p class="empty">None yet.</p>'}</div>`;},
  after(){const q=App.$('#cq');q.addEventListener('input',()=>{const v=q.value.toLowerCase().trim();App.$$('#clist .row').forEach(r=>r.classList.toggle('hide',!!v&&!v.split(/\s+/).every(w=>r.dataset.s.includes(w))));});
    App.$$('[data-g]').forEach(b=>b.onclick=()=>{history.replaceState(null,'','#/conditions?g='+b.dataset.g);App.render();});}});

function monoSec(title,icon,body,cls=''){return `<section class="mono ${cls}"><h3>${I(icon)}${title}</h3><div class="mb-body">${body}</div></section>`;}
route('/condition/:id',{title:a=>(CONDITIONS.find(c=>c.id===a.id)||{n:'Condition'}).n,parent:'#/conditions',tab:'#/lookup',render(a){
  const c=CONDITIONS.find(x=>x.id===a.id)||CONDITIONS[+a.id]; if(!c)return '<p class="empty">Not found.</p>';
  const ill=c.ill&&App.illusFig?App.illusFig(c.ill):'';
  const sysChips=c.sid.map(id=>{const o=SYSTEMS.find(s=>s.id===id);return o?`<a class="chip sysch" href="#/system/${id}?tab=connect">${I(o.icon)}${esc(o.n)}</a>`:'';}).join('');
  const syms=(c.sym||[]).map(id=>{const y=SYMPTOMS.find(s=>s.id===id);return y?row('#/symptom/'+id,'symptom',y.n,'Symptom lookup'):'';}).join('');
  const sc=c.scen?(SCENARIOS.find(s=>s.id===c.scen)):null;
  const L=(k)=>c[k]&&c[k].length;
  return `<div class="monohead"><p class="kicker">${esc(c.mine?'My condition · '+App.condGroup(c):App.condGroup(c))}</p><h2 class="pt">${esc(c.n)}</h2><div class="chips">${sysChips}</div></div>
  ${App.noteButton?App.noteButton(c.id):''}
  ${App.condHeadExtras?App.condHeadExtras(c):''}
  ${c.def?monoSec('Definition','book',`<p>${esc(c.def)}</p>`,'def'):''}
  ${ill}
  ${c.types&&c.types.length?monoSec('Types','list',`<dl class="kv">${c.types.map(([k,v])=>`<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl>`):''}
  ${c.what?monoSec('What\u2019s happening','pulse',`<p>${esc(c.what)}</p>`):''}
  ${L('pres')?monoSec('Presentation','user',ticks(c.pres)):''}
  ${L('find')?monoSec('What you\u2019ll find','stetho',ticks(c.find)):''}
  ${L('red')?monoSec('Red flags','alert',ticks(c.red,true),'red'):''}
  ${L('do')?monoSec('What you can do','check',ticks(c.do),'do'):''}
  ${L('next')?monoSec('What happens next','clock',ticks(c.next)):''}
  ${c.meds&&c.meds.length?monoSec('Medicines you\u2019ll find at home','pill',`<div class="tablewrap"><table class="t tw"><thead><tr><th>Class</th><th>Examples</th><th>What it tells you</th></tr></thead><tbody>${c.meds.map(m=>`<tr><th scope="row">${esc(m[0])}</th><td>${esc(m[1])}</td><td>${esc(m[2])}</td></tr>`).join('')}</tbody></table></div>`):''}
  ${c.comp&&c.comp.length?monoSec('Complications','zap',ticks(c.comp)):''}
  ${L('key')?monoSec('Key points','info',ticks(c.key),'key'):''}
  ${c.src?monoSec('Source','book',`<p>${esc(c.src)}</p>`):''}
  ${App.condExtras?App.condExtras(c):''}
  ${App.webCard?App.webCard(App.condTerm(c),['nhs','cks','patient']):''}
  ${App.compareLinks?App.compareLinks([c.id],true):''}
  ${sc?`<h3 class="sh">Follow the patient</h3><div class="list">${row('#/scenario/'+sc.id,sc.icon,sc.t,sc.sub)}</div>`:''}
  ${syms?`<h3 class="sh">Related symptoms</h3><div class="list">${syms}</div>`:''}
  ${scope()}`;}});

/* ---------- Medicines ---------- */
App.medCard=(i,full)=>{const m=MEDS[i];const sys=SYSTEMS.find(s=>s.id===m[5]);return `<div class="card medcard"><h4>${esc(m[0])}</h4>${m[1]?`<div class="brand">${esc(m[1])}</div>`:''}<span class="cls">${esc(m[2])}</span>
  <p class="for"><b>Commonly prescribed for:</b> ${esc(m[3])}</p><p class="small"><b>CFR relevance:</b> ${esc(m[4])}</p>${full&&sys?`<a class="btn ghost" href="#/system/${sys.id}?tab=meds">${I(sys.icon)}${esc(sys.n)} system</a>`:''}${!full?`<a class="small" href="#/med/${i}">Details</a>`:''}</div>`;};
route('/meds',{title:'Medicines',tab:'#/lookup',render(){return `
  <h2 class="pt">Medicines</h2><p class="lede">Recognise what a patient takes and why it matters. Search by generic or brand name.</p>
  <div class="btnrow mb"><a class="btn pri" href="#/scan">${I('camera')}Scan a label</a></div>
  <div class="search">${I('search')}<input id="mq" placeholder="e.g. Eliquis, bisoprolol, Ventolin" aria-label="Filter medicines"></div>
  <div class="list mt" id="mlist">${MEDS.map((m,i)=>i).sort((x,y)=>MEDS[x][0].localeCompare(MEDS[y][0])).map(i=>{const m=MEDS[i];return `<a class="row" href="#/med/${i}" data-s="${esc((m.join(' ')).toLowerCase())}"><span class="tx"><b>${esc(m[0])}</b><span>${esc((m[1]?m[1]+' · ':'')+m[3])}</span></span><span class="chev">${I('chev')}</span></a>`;}).join('')}</div>`;},
  after(){const q=App.$('#mq');q.addEventListener('input',()=>{const v=q.value.toLowerCase().trim();App.$$('#mlist .row').forEach(r=>r.classList.toggle('hide',!!v&&!r.dataset.s.includes(v)));});}});
route('/med/:i',{title:a=>(MEDS[a.i]||['Medicine'])[0],parent:'#/meds',tab:'#/lookup',render(a){
  if(!MEDS[a.i])return '<p class="empty">Not found.</p>';
  return App.medCard(+a.i,true)+(App.webCard?`<div class="mt">${App.webCard(MEDS[a.i][0],['bnf','nhsmed'])}</div>`:'')+`<div class="btnrow mt"><button class="btn" id="addm">${I('plus')}Add to patient's medicines</button></div>`+callout('info','info','This shows what the medicine is <b>commonly</b> prescribed for. The patient\u2019s own reason may be different: ask them or check their records.')+scope();},
  after(a){App.$('#addm').onclick=()=>{const p=App.pt();const n=MEDS[a.i][0];if(!p.meds.includes(n))p.meds.push(n);App.savePatient();App.toast(n+' added');};}});

/* ---------- ECG ---------- */
route('/ecg',{title:'ECG rhythms',tab:'#/lookup',render(){return `
  <h2 class="pt">ECG rhythms</h2><p class="lede">Illustrative 6-second strips for recognition practice. Always treat the patient, not the monitor.</p>
  ${REF_ECG.map(e=>`<div class="card" id="${e.id}"><h3 style="margin:0 0 8px;font-size:1.05rem">${esc(e.n)}</h3><div class="ecg">${Tools.ecg(e.id)}</div>
  <p class="small mt"><b>Pattern:</b> ${esc(e.p)}</p>${e.sig?`<p class="small"><b>Significance:</b> ${esc(e.sig)}</p>`:''}${e.red?`<p class="small" style="color:var(--red)"><b>Red flags:</b> ${esc(e.red)}</p>`:''}</div>`).join('')}${scope()}`;},
  after(a){if(a.id){const el=document.getElementById(a.id);if(el)el.scrollIntoView();}}});

/* ---------- Terms & Latin ---------- */
function glossary(list,withOrigin){return (a)=>`<div class="search">${I('search')}<input id="gq" value="${esc(a.q||'')}" placeholder="Filter" aria-label="Filter terms"></div>
  <div class="list mt" id="glist">${list.map(t=>`<div class="row" style="align-items:flex-start" data-s="${esc((t.t+' '+t.d+' '+(t.o||'')).toLowerCase())}"><span class="tx"><b>${esc(t.t)}</b>${withOrigin&&t.o?`<span class="wrapt muted">${esc(t.o)}</span>`:''}<span class="wrapt" style="color:var(--text)">${esc(t.d)}</span>${t.e?`<span class="wrapt"><i>${esc(t.e)}</i></span>`:''}</span></div>`).join('')}</div>`;}
const gAfter=()=>{const q=App.$('#gq');const f=()=>{const v=q.value.toLowerCase().trim();App.$$('#glist .row').forEach(r=>r.classList.toggle('hide',!!v&&!r.dataset.s.includes(v)));};q.addEventListener('input',f);f();};
route('/terms',{title:'Medical terms',tab:'#/lookup',render:a=>glossary(REF_TERMS,false)(a),after:gAfter});
route('/latin',{title:'Latin and abbreviations',tab:'#/lookup',render:a=>glossary(REF_LATIN,true)(a),after:gAfter});

/* ---------- Values ---------- */
route('/values',{title:'Normal values',tab:'#/lookup',render(){
  const rows=[['Respiratory rate','12–20 /min','NEWS2 0 band'],['SpO₂','96–100%','88–92% if prescribed scale 2 target'],['Heart rate','51–90 /min','NEWS2 0 band (60–100 typical resting)'],['Systolic BP','111–219 mmHg','Interpret against the patient\u2019s usual'],['Temperature','36.1–38.0 °C','NEWS2 0 band'],['Blood glucose','4–7 mmol/L','Below 4 = hypoglycaemia'],['Capillary refill','≤ 2 seconds','Unreliable when cold'],['GCS','15','3 is the lowest'],['Pupils','2–5 mm, equal, reactive','Up to 1 mm difference can be normal'],['Peak flow','Compare with best / predicted','Below 33% best = life-threatening asthma']];
  return `<h2 class="pt">Normal values (adult)</h2><div class="tablewrap"><table class="t"><thead><tr><th>Measure</th><th>Normal</th><th>Notes</th></tr></thead><tbody>${rows.map(r=>`<tr><th scope="row">${r[0]}</th><td>${r[1]}</td><td class="small" style="white-space:normal">${r[2]}</td></tr>`).join('')}</tbody></table></div>
  <h3 class="sh">NEWS2 scoring chart</h3>${App.newsChart()}<div class="btnrow mt"><a class="btn" href="#/paeds">${I('baby')}Children's values</a></div>${scope()}`;}});
App.newsChart=()=>{const c=(t,s)=>`<td class="s${s}">${t}</td>`;const b=(a)=>a.map(([t,s])=>s==null?`<td></td>`:c(t,s)).join('');
  return `<div class="tablewrap"><table class="t small"><thead><tr><th>Score</th><th>3</th><th>2</th><th>1</th><th>0</th><th>1</th><th>2</th><th>3</th></tr></thead><tbody>
  <tr><th scope="row">RR</th>${b([['≤8',3],['',null],['9–11',1],['12–20',0],['',null],['21–24',2],['≥25',3]])}</tr>
  <tr><th scope="row">SpO₂ scale 1</th>${b([['≤91',3],['92–93',2],['94–95',1],['≥96',0],['',null],['',null],['',null]])}</tr>
  <tr><th scope="row">SpO₂ scale 2</th>${b([['≤83',3],['84–85',2],['86–87',1],['88–92 / ≥93 air',0],['93–94 O₂',1],['95–96 O₂',2],['≥97 O₂',3]])}</tr>
  <tr><th scope="row">Air or O₂</th>${b([['',null],['O₂',2],['',null],['Air',0],['',null],['',null],['',null]])}</tr>
  <tr><th scope="row">Systolic BP</th>${b([['≤90',3],['91–100',2],['101–110',1],['111–219',0],['',null],['',null],['≥220',3]])}</tr>
  <tr><th scope="row">Pulse</th>${b([['≤40',3],['',null],['41–50',1],['51–90',0],['91–110',1],['111–130',2],['≥131',3]])}</tr>
  <tr><th scope="row">Consciousness</th>${b([['',null],['',null],['',null],['Alert',0],['',null],['',null],['CVPU',3]])}</tr>
  <tr><th scope="row">Temperature</th>${b([['≤35.0',3],['',null],['35.1–36.0',1],['36.1–38.0',0],['38.1–39.0',1],['≥39.1',2],['',null]])}</tr>
  </tbody></table></div>`;};

/* ---------- Children ---------- */
const PAEDS=[['Under 1 year','30–40','110–160','70–90',a=>'(0.5 × age in months) + 4'],['1–2 years','25–35','100–150','80–95',a=>'(2 × age) + 8'],['2–5 years','25–30','95–140','80–100',a=>'(2 × age) + 8'],['5–12 years','20–25','80–120','90–110',a=>'(3 × age) + 7'],['Over 12 years','15–20','60–100','100–120',a=>'Use adult values / actual weight']];
route('/paeds',{title:'Children',tab:'#/assess',render(){return `
  <h2 class="pt">Children</h2><p class="lede">Normal ranges (APLS) and a weight estimate. Children compensate well and then deteriorate suddenly.</p>
  <label class="fld"><span>Age</span><select id="pa">${[['0.25','3 months'],['0.5','6 months'],['0.75','9 months'],...Array.from({length:14},(_,i)=>[String(i+1),(i+1)+' year'+(i?'s':'')])].map(([v,l])=>`<option value="${v}">${l}</option>`).join('')}</select></label>
  <div id="pout" class="mt"></div>
  <h3 class="sh">All age bands</h3><div class="tablewrap"><table class="t"><thead><tr><th>Age</th><th>RR</th><th>HR</th><th>SBP</th></tr></thead><tbody>${PAEDS.map(r=>`<tr><th scope="row">${r[0]}</th><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td></tr>`).join('')}</tbody></table></div>
  ${callout('amber','alert','NEWS2 is not validated for under-16s. Look for grunting, head bobbing, recession, mottling, cold peripheries, reduced feeding, fewer wet nappies and a child who is floppy or not interacting.')}${scope()}`;},
  after(){const s=App.$('#pa'),o=App.$('#pout');const f=()=>{const age=+s.value;const idx=age<1?0:age<2?1:age<5?2:age<=12?3:4;const r=PAEDS[idx];
    let w=age<1?Math.round(age*12*0.5+4):age<=5?Math.round(2*age+8):age<=12?Math.round(3*age+7):null;
    o.innerHTML=`<div class="card">${App.kv([['Respiratory rate',r[1]+' /min'],['Heart rate',r[2]+' /min'],['Systolic BP',r[3]+' mmHg'],['Estimated weight',w?`${w} kg (${r[4]()})`:r[4]()]])}</div>`;};s.value='2';s.onchange=f;f();}});

/* ---------- Primary / secondary survey ---------- */
route('/abcde',{title:'Primary survey',tab:'#/assess',render(){
  const step=(k,t,body)=>`<details class="acc"><summary><span class="badge">${k}</span>${t}</summary><div class="body">${body}</div></details>`;
  return `<h2 class="pt">Primary survey</h2><p class="lede">Find and treat life threats in order. Reassess after every intervention.</p>
  <h3 class="sh">DRSABCD: unresponsive patient</h3>
  ${step('D','Danger',ticks(['Scene safe for you, bystanders and patient','Gloves and appropriate PPE','Hazards: traffic, electricity, gas, sharps, dogs, aggression']))}
  ${step('R','Response',ticks(['Speak loudly and gently shake shoulders','Alert, responds to voice, responds to pain, or unresponsive']))}
  ${step('S','Send for help',ticks(['Update EOC early with what you find','Ask a bystander to fetch the nearest AED']))}
  ${step('A','Airway',ticks(['Head tilt, chin lift (jaw thrust if spinal injury suspected and trained)','Look in the mouth; remove visible obstruction only']))}
  ${step('B','Breathing',ticks(['Look, listen and feel for no more than 10 seconds','Agonal gasps are NOT normal breathing: start CPR']))}
  ${step('C','CPR',ticks(['30 compressions : 2 breaths (or continuous compressions if no barrier)','Rate 100–120 /min, depth 5–6 cm, full recoil','Minimise pauses']) + `<a class="btn red block mt" href="#/arrest">${I('cpr')}Start arrest timer</a>`)}
  ${step('D','Defibrillation',ticks(['Attach the AED as soon as it arrives','Follow the voice prompts; keep clear during analysis and shock']))}
  <h3 class="sh">ABCDE: responsive patient</h3>
  ${acc('<C> Catastrophic bleeding',ticks(['Direct pressure, haemostatic dressing or tourniquet per training']),{red:true})}
  ${acc('A: Airway',ticks(['Can they speak? Noisy breathing: snoring, gurgling, stridor','Swelling of lips, tongue, throat','Position to protect the airway']))}
  ${acc('B: Breathing',ticks(['Rate, depth, effort, pattern','SpO₂ and whether on air','Chest movement equal both sides','Wheeze, cough, colour']))}
  ${acc('C: Circulation',ticks(['Pulse rate, rhythm, strength','BP, capillary refill','Skin: colour, temperature, sweating','Obvious or suspected blood loss']))}
  ${acc('D: Disability',ticks(['ACVPU and GCS','Pupils','Blood glucose if trained','BE-FAST','Pain score']))}
  ${acc('E: Exposure / everything else',ticks(['Temperature','Rashes (glass test), injuries, swelling','Medicines, alert cards, care plans','Maintain dignity and keep warm']))}
  <div class="btnrow mt"><a class="btn pri" href="#/voice">${I('mic')}Record obs</a><a class="btn" href="#/secondary">${I('stetho')}Secondary survey</a></div>${scope()}`;}});

route('/secondary',{title:'Secondary survey',tab:'#/assess',render(){return `
  <h2 class="pt">Secondary survey</h2><p class="lede">Once life threats are managed: history, a head-to-toe check and repeated obs.</p>
  ${acc('SAMPLE history',App.kv([['Signs & symptoms','What is wrong? When did it start?'],['Allergies','Medicines, foods, latex, stings'],['Medications','Prescribed, over the counter, recreational; scan the boxes'],['Past history','Conditions, operations, recent hospital stays'],['Last oral intake','Food and drink, and when'],['Events','What happened before and leading up to this?']]),{open:true,icon:'list'})}
  ${acc('OPQRST pain assessment',App.kv([['Onset','Sudden or gradual? What were you doing?'],['Provokes / palliates','What makes it better or worse?'],['Quality','Sharp, dull, crushing, burning, tearing?'],['Region / radiation','Where is it? Does it spread?'],['Severity','Score 0–10'],['Time','How long? Constant or comes and goes?']]),{icon:'symptom'})}
  ${acc('Head to toe',ticks(['Head and face: wounds, bruising behind ears or around eyes, fluid from ears or nose','Neck: tenderness, raised neck veins, medical alert jewellery','Chest: equal movement, wounds, tenderness','Abdomen: tenderness by quadrant, distension, bruising','Pelvis: do not spring; note pain','Legs and arms: deformity, swelling, pulses, movement, sensation','Back: when safe to log roll, per training','Skin: rash, pressure areas, injection sites, patches']),{icon:'user'})}
  ${acc('Social and baseline',ticks(['Who lives with them? Carers?','Normal mobility and cognition','DNACPR / ReSPECT form, care plans, key safe','Safeguarding concerns: report per SCAS procedure']),{icon:'home'})}
  ${App.fig('quadrants')}${scope()}`;}});
})();
