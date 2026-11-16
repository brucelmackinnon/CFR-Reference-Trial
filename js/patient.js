// Patient record, voice obs, scoring tools, cardiac arrest, scanner, handover, settings.
(function(){
const {esc,row,callout,scope,ticks,acc,route}=App;

/* ---------- Obs display helpers ---------- */
const FIELDS=[['rr','RR','/min'],['spo2','SpO₂','%'],['o2','O₂',''],['bp','BP','mmHg'],['hr','Pulse','/min'],['acvpu','ACVPU',''],['temp','Temp','°C'],['bm','BM/CBG','mmol/L'],['pq','Pulse feel',''],['crt','Cap refill',''],['pain','Pain','/10'],['fast','FAST done',''],['allergy','Allergies','']];
function fmt(o,k){
  if(k==='bp') return o.sbp!=null?o.sbp+(o.dbp!=null?'/'+o.dbp:''):null;
  if(k==='o2') return o.o2==null?null:(o.o2?(o.o2flow||'O₂'):'Air');
  if(k==='pq') return [o.rhythm,o.vol].filter(Boolean).map(x=>x[0].toUpperCase()+x.slice(1)).join(', ')||null;
  if(k==='spo2') return o.spo2!=null?o.spo2+(o.scale===2?' (S2)':''):null;
  return o[k]!=null&&o[k]!==''?o[k]:null;
}
function ptsFor(parts,k){return k==='bp'?parts.sbp:parts[k];}
App.obsGrid=(o,compact)=>{const parts=Tools.news2Parts(o);
  return `<div class="obs-grid">${FIELDS.filter(f=>!compact||['rr','spo2','o2','bp','hr','pq','acvpu','temp','bm'].includes(f[0])).map(([k,l,u])=>{const v=fmt(o,k);const p=ptsFor(parts,k);
    return `<div class="ob ${v==null?'empty':p?'s'+Math.min(p,3):''}" data-ob="${k}"><span class="k">${l}</span><span class="v${v!=null&&String(v).length>5?' long':''}">${v==null?'–':esc(v)}</span><span class="u">${u}</span>${p?`<span class="pts">+${p}</span>`:''}</div>`;}).join('')}</div>`;};
App.scoreBox=o=>{const n=Tools.news2(o);if(n.missing.length===7)return `<div class="scorebox" role="status"><span class="num" style="color:var(--muted)">–</span><span><b>NEWS2</b><span>Enter or speak obs to calculate the score.</span></span></div>`;return `<div class="scorebox b${n.band}" role="status"><span class="num">${n.total}</span><span><b>NEWS2 ${esc(n.label)}</b><span>${esc(n.advice)}${n.complete?'':` <br><i>Incomplete: ${n.missing.length} of 7 parameters missing.</i>`}</span></span></div>`;};
/* ---------- NEWS2 impact: what the score means and what to do ---------- */
const NEWS_NAME={rr:'Resp rate',spo2:'SpO\u2082',o2:'On oxygen',sbp:'Systolic BP',hr:'Pulse',acvpu:'Consciousness',temp:'Temperature'};
App.newsImpact=(o,prev)=>{const n=Tools.news2(o);if(n.missing.length===7)return '';
  const tier=n.total>=7?'high':n.total>=5?'med':n.single3?'red':n.total>=1?'low':'zero';
  const T={
    zero:{risk:'Low risk',means:'All recorded obs are in the normal range. This doesn\u2019t rule out illness: a normal score can hide early sepsis, a stroke, a head injury on blood thinners, or a patient on beta-blockers whose pulse can\u2019t rise.',hosp:'Routine obs at least every 12 hours.',
      do:['Carry on with your assessment and care','Repeat the obs while you\u2019re with them, and straight away if anything changes','Still escalate if you\u2019re worried: your concern counts even with a score of 0']},
    low:{risk:'Low risk',means:'Some obs are outside the normal range. On its own a low score is reassuring, but a rising score is an early warning that they\u2019re getting worse.',hosp:'Obs every 4\u20136 hours and assessment by a registered nurse.',
      do:['Include the score and the abnormal obs in your update to EOC','Repeat the obs regularly and compare: a rising score matters more than one number','Think about why: pain, anxiety, infection, blood loss, low sugar']},
    red:{risk:'Low\u2013medium risk (one red score)',means:'One observation is at an extreme (scores 3). Even with a low total, that one value can mean a serious problem.',hosp:'Urgent review by a doctor or clinician, at least hourly obs.',
      do:['Update EOC now and name the parameter that scored 3','Recheck that reading (probe position, cuff size, cold fingers)','Treat what you can within your scope (position, oxygen if trained and indicated) and reassess']},
    med:{risk:'Medium risk: urgent response threshold',means:'A key threshold. Patients scoring 5 or more have a much higher risk of getting worse quickly, and it is a strong signal of possible sepsis.',hosp:'Urgent review by a clinician skilled in acute illness, obs at least hourly.',
      do:['Update EOC straight away with the score and the obs; ask for clinical advice','Consider sepsis if there could be an infection (use the sepsis screen)','Repeat the obs frequently, keep them under constant observation, prepare to hand over']},
    high:{risk:'High risk: emergency response threshold',means:'Emergency. A score of 7 or more is strongly linked to critical illness, cardiac arrest and death if not treated quickly.',hosp:'Emergency assessment by a critical care team, continuous monitoring.',
      do:['Tell EOC immediately: \u201cNEWS2 of '+n.total+'\u201d and the worst obs; the response may need upgrading','Stay with them and watch airway and breathing; position for comfort or recovery position','Have the AED nearby; prepare for deterioration and repeat obs every few minutes']}}[tier];
  const drivers=Tools.NEWS_KEYS.filter(k=>n.parts[k]>=2).map(k=>NEWS_NAME[k]+' +'+n.parts[k]);
  let trend='';if(prev){const pn=Tools.news2(prev);if(pn.missing.length<7){const d=n.total-pn.total;trend=d>0?`<p class="small"><b>Trend:</b> up ${d} from ${pn.total} at ${App.time(prev.t)}. A rising score means they\u2019re getting worse: tell EOC.</p>`:d<0?`<p class="small"><b>Trend:</b> down ${-d} from ${pn.total} at ${App.time(prev.t)}. Improving, keep monitoring.</p>`:`<p class="small"><b>Trend:</b> no change from ${App.time(prev.t)}.</p>`;}}
  return `<div class="card nimpact b${n.band}"><p style="margin:0 0 4px"><b>What NEWS2 ${n.total} means: ${T.risk}</b></p><p class="small" style="margin:0 0 6px">${T.means}</p>
  ${drivers.length?`<p class="small" style="margin:0 0 6px"><b>Driving the score:</b> ${drivers.join(', ')}</p>`:''}${trend}
  <p class="small" style="margin:0 0 2px"><b>What to do</b></p>${ticks(T.do)}
  <p class="small muted" style="margin:6px 0 0">In hospital this score would mean: ${T.hosp} ${n.complete?'':'<br><i>Incomplete set: the real score may be higher.</i>'}</p></div>`;};
App.newsRisk=o=>{const n=Tools.news2(o);return n.total>=7?'high risk':n.total>=5?'medium risk':n.single3?'low\u2013medium risk (single red score)':'low risk';};
function obsSummary(o){const a=[];
  if(o.rr!=null)a.push(`RR ${o.rr}`);
  if(o.spo2!=null)a.push(`SpO₂ ${o.spo2}%${o.o2===true?' on O₂'+(o.o2flow?' '+o.o2flow:''):o.o2===false?' on air':''}${o.scale===2?' (scale 2)':''}`);
  else if(o.o2!=null)a.push(o.o2?'on O₂':'on air');
  if(o.sbp!=null)a.push(`BP ${o.sbp}${o.dbp!=null?'/'+o.dbp:''}`);
  if(o.hr!=null||o.rhythm||o.vol)a.push(`HR ${o.hr??''}${o.rhythm?' '+o.rhythm:''}${o.vol?' '+o.vol:''}`.replace('HR  ','Pulse '));
  if(o.acvpu)a.push(`ACVPU ${o.acvpu}`);
  if(o.temp!=null)a.push(`Temp ${o.temp}°C`);
  if(o.bm!=null)a.push(`BM/CBG ${o.bm}`);
  if(o.crt)a.push(`CRT ${o.crt}`);
  if(o.pain!=null)a.push(`Pain ${o.pain}/10`);
  if(o.pupils)a.push(`Pupils ${o.pupils}`);
  if(o.fast)a.push(`FAST performed: ${o.fast}`);
  if(o.allergy)a.push(`Allergies: ${o.allergy}`);
  return a.join(', ');}
App.obsSummary=obsSummary;

/* ---------- Patient ---------- */
route('/patient',{root:true,title:'Patient',tab:'#/patient',render(){
  const p=App.patient;
  if(!p) return `<div class="empty">${I('user')}<h2 class="pt">No patient in progress</h2><p>Start a record to log obs sets with times, track NEWS2 and build your handover.</p><p class="small">Held only while the app is open, never saved to the phone. Cleared when you end the job, close the app, or after 30 minutes in the background.</p></div>
  <div class="stack"><a class="btn pri block" href="#/voice">${I('mic')}Start with voice obs</a><button class="btn block" id="startp">${I('plus')}Start a new patient</button></div>`;
  const last=p.obs[p.obs.length-1];
  const trend=p.obs.length?`<div class="tablewrap"><table class="t"><thead><tr><th>Time</th><th>RR</th><th>SpO₂</th><th>O₂</th><th>BP</th><th>HR</th><th>ACVPU</th><th>Temp</th><th>BM/CBG</th><th>NEWS2</th></tr></thead><tbody>${p.obs.map((o,i)=>{const pp=Tools.news2Parts(o),n=Tools.news2(o);const td=(k,pk)=>{const v=fmt(o,k);const s=pp[pk||k];return `<td class="${s?'s'+s:''}">${v==null?'–':esc(v)}</td>`;};
    return `<tr><th scope="row">${App.time(o.t)}</th>${td('rr')}${td('spo2')}${td('o2')}${td('bp','sbp')}${td('hr')}${td('acvpu')}${td('temp')}<td>${o.bm??'–'}</td><td><span class="badge b${n.band}">${n.total}${n.complete?'':'*'}</span></td></tr>`;}).join('')}</tbody></table></div><p class="small muted">* incomplete set. Swipe the table sideways on small screens.</p>`:`<p class="empty">No obs recorded yet.</p>`;
  const f=(k,l,ph,type='text')=>`<label class="fld"><span>${l}</span><input data-k="${k}" type="${type}" value="${esc(p.info[k]||'')}" placeholder="${ph}"></label>`;
  const s=(k,l)=>`<label class="fld"><span>${l}</span><textarea data-s="${k}">${esc(p.sample[k]||'')}</textarea></label>`;
  return `<div class="card pcard" style="display:flex"><span style="flex:1"><b>Patient started ${App.time(p.started)}</b><br><span class="small muted">Not saved to the phone · cleared when you end the job or close the app</span></span><button class="btn red" id="clearp">${I('check')}End job</button></div>
  ${last?`<h3 class="sh">Latest obs <small>${App.time(last.t)}</small></h3>${App.scoreBox(last)}<div class="mt">${App.newsImpact(last,p.obs[p.obs.length-2])}</div><div class="mt">${App.obsGrid(last)}</div>`:''}
  <div class="btnrow mt"><a class="btn pri" href="#/voice">${I('mic')}Voice obs</a><a class="btn" href="#/obs/new">${I('edit')}Manual obs</a></div>
  <h3 class="sh">Obs trend <small>${p.obs.length} set${p.obs.length===1?'':'s'}</small></h3>${trend}
  <h3 class="sh">Patient details</h3>${callout('amber','alert','Don\u2019t enter names, addresses, dates of birth or NHS numbers.')}<div class="card stack"><div class="grid2">${f('age','Age','e.g. 72','text')}${f('sex','Sex','')}</div>${f('complaint','Presenting complaint','e.g. chest pain')}${f('onset','Time of onset','e.g. 14:10')}</div>
  <h3 class="sh">SAMPLE</h3><div class="card stack">${s('signs','Signs and symptoms')}${s('allergies','Allergies')}${s('past','Past medical history')}${s('last','Last oral intake')}${s('events','Events leading up')}</div>
  <h3 class="sh">Medicines <small>${p.meds.length}</small></h3><div class="card"><div class="chips">${p.meds.map((m,i)=>`<button class="chip" data-delmed="${i}" aria-label="Remove ${esc(m)}">${esc(m)} ×</button>`).join('')||'<span class="muted small">None added</span>'}</div><div class="btnrow mt"><a class="btn" href="#/scan">${I('camera')}Scan</a><a class="btn" href="#/meds">${I('search')}Find</a></div></div>
  <h3 class="sh">Treatment and notes</h3><div class="card stack"><label class="fld"><span>Treatment given</span><textarea data-k="treatment">${esc(p.info.treatment||'')}</textarea></label>
  ${p.notes.length?`<div class="log">${p.notes.map(n=>`<div><b>${App.time(n.t)}</b> ${esc(n.text)}</div>`).join('')}</div>`:''}
  <div style="display:flex;gap:8px"><input id="notein" class="fld" style="flex:1;border:1px solid var(--line);border-radius:8px;padding:10px;min-height:48px;background:var(--surface)" placeholder="Add a timed note"><button class="btn" id="noteadd">Add</button></div></div>
  <div class="btnrow mt2"><a class="btn pri" href="#/handover">${I('share')}Build handover</a><a class="btn pri" href="#/cas130">${I('list')}CAS130 form</a></div>`;},
  after(){
    const sp=App.$('#startp'); if(sp){sp.onclick=()=>{App.pt();App.savePatient();App.render();};return;}
    const p=App.patient;
    App.$('#clearp').onclick=()=>App.endJob();
    App.$$('[data-k]').forEach(el=>el.addEventListener('input',()=>{p.info[el.dataset.k]=el.value;App.savePatient();}));
    App.$$('[data-s]').forEach(el=>el.addEventListener('input',()=>{p.sample[el.dataset.s]=el.value;App.savePatient();}));
    App.$$('[data-delmed]').forEach(b=>b.onclick=()=>{p.meds.splice(+b.dataset.delmed,1);App.savePatient();App.render();});
    App.$('#noteadd').onclick=()=>{const v=App.$('#notein').value.trim();if(!v)return;p.notes.push({t:Date.now(),text:v});App.savePatient();App.render();};
  }});

/* ---------- Voice obs ---------- */
let voiceState={status:'idle',partial:'',lines:[],offline:false,level:0};
App.voiceLive=false;
App.onClear(()=>{voiceState={status:'idle',partial:'',lines:[],offline:false,level:0};if(App.voiceLive){App.native.voiceStop();App.voiceLive=false;}});
function commitDraft(){
  const p=App.pt(); const d=p.draft;
  voiceState.lines=[];voiceState.partial='';
  if(!Object.keys(d).length){App.toast('Nothing captured yet');return false;}
  p.obs.push(Object.assign({t:Date.now(),src:'voice'},d)); p.draft={}; App.savePatient();
  App.native.haptic(); const n=Tools.news2(p.obs[p.obs.length-1]);
  App.toast(`Obs set saved · NEWS2 ${n.total}`); return true;
}
function applyText(text,isFinal){
  const res=Tools.parseObs(text);
  if(!isFinal) return res;
  const p=App.pt();
  if(res.command==='undo'){p.draft={};App.toast('Draft cleared');}
  Object.assign(p.draft,res.values);
  App.savePatient();
  if(res.command==='save') commitDraft();
  return res;
}
function markHits(text,hits){let h=esc(text);const norm=Tools.normalise(text).trim();if(hits.length)h=`${esc(text)}<br><span class="hint">Heard as: ${App.hl(norm,'')}</span>`;return h;}
function drawVoice(){
  const v=App.$('#view'); if(!App.$('#vp',v)) return;
  const st=voiceState, p=App.pt();
  const lab={idle:'Ready',listening:st.offline?'Listening (on-device)':'Listening',stopped:'Paused',error:'Stopped'}[st.status]||'Listening';
  App.$('#vstate').innerHTML=`${st.status==='listening'?`<span style="width:10px;height:10px;border-radius:50%;background:#F0485E;display:inline-block"></span>`:I('mic')}<span>${lab}</span><span class="lvl"><i style="width:${Math.min(100,Math.max(0,(st.level+2)*9))}%"></i></span>`;
  App.$('#vtx').innerHTML=st.lines.slice(-3).map(l=>`<div>${l}</div>`).join('')+(st.partial?`<div class="partial">${esc(st.partial)}</div>`:'')||`<div class="hint">Try: “resp rate 22, sats 94 on air, pulse 110 irregular, BP 128 over 76, temp 37.9, alert, BM 6.4, FAST negative, no known allergies”. Say “save obs” to store the set.</div>`;
  App.$('#vtoggle').innerHTML=App.voiceLive?`${I('stop')}Pause`:`${I('mic')}${st.status==='idle'?'Start':'Resume'}`;
  App.$('#vtoggle').className='btn '+(App.voiceLive?'red':'pri');
  App.$('#vdraft').innerHTML=App.obsGrid(p.draft)+`<div class="mt">${App.scoreBox(p.draft)}</div>`;
  App.$('#vcount').textContent=p.obs.length?`${p.obs.length} set${p.obs.length>1?'s':''} saved · last ${App.time(p.obs[p.obs.length-1].t)}`:'No sets saved yet';
  App.$('.tab.mic').classList.toggle('live',App.voiceLive);
}
App.onNative.voice=d=>{
  const st=voiceState;
  if(d.status==='listening'){st.status='listening';st.offline=!!d.offline;App.voiceLive=true;}
  else if(d.status==='level'){st.level=d.level;}
  else if(d.status==='partial'){st.partial=d.text;}
  else if(d.status==='final'){st.partial='';const r=applyText(d.text,true);if(st.lines.length>=3)st.lines.shift();st.lines.push(esc(d.text)+(Object.keys(r.values).length?` <span class="got">\u2713 ${esc(App.obsSummary(r.values))}</span>`:` <span class="hint">(nothing recognised)</span>`));}
  else if(d.status==='stopped'){st.status='stopped';App.voiceLive=false;st.partial='';}
  else if(d.status==='error'){st.status='error';App.voiceLive=false;App.toast(d.message||'Voice stopped',4000);}
  drawVoice();
};
App.editObs=(o,k,done)=>{
  const L={rr:['Resp rate','/min'],spo2:['SpO\u2082','%'],hr:['Pulse','/min'],temp:['Temperature','\u00b0C'],bm:['BM/CBG','mmol/L'],pain:['Pain','0\u201310']};
  let body='';
  if(k==='bp')body=`<div class="grid2"><label class="fld"><span>Systolic</span><input id="e1" type="number" inputmode="numeric" value="${o.sbp??''}"></label><label class="fld"><span>Diastolic</span><input id="e2" type="number" inputmode="numeric" value="${o.dbp??''}"></label></div>`;
  else if(k==='o2')body=`<div class="picker"><button data-v="air" aria-pressed="${o.o2===false}">On air</button><button data-v="o2" aria-pressed="${o.o2===true}">On oxygen</button></div><label class="fld mt"><span>Flow (optional)</span><input id="e1" value="${esc(o.o2flow||'')}" placeholder="e.g. 2 L/min"></label>`;
  else if(k==='acvpu')body=`<div class="picker">${[['A','Alert'],['C','New confusion'],['V','Voice'],['P','Pain'],['U','Unresp.']].map(([v,l])=>`<button data-v="${v}" aria-pressed="${o.acvpu===v}">${l}</button>`).join('')}</div>`;
  else if(k==='pq')body=`<p class="small muted" style="margin:0 0 4px">Rhythm</p><div class="picker" data-g="rhythm">${['regular','irregular'].map(v=>`<button data-v="${v}" aria-pressed="${o.rhythm===v}">${v[0].toUpperCase()+v.slice(1)}</button>`).join('')}</div><p class="small muted mt" style="margin-bottom:4px">Strength</p><div class="picker" data-g="vol">${['strong','weak'].map(v=>`<button data-v="${v}" aria-pressed="${o.vol===v}">${v[0].toUpperCase()+v.slice(1)}</button>`).join('')}</div>`;
  else if(k==='fast'||k==='allergy')body=`<div class="picker" data-g="${k}">${['Yes','No'].map(v=>`<button data-v="${v}" aria-pressed="${o[k]===v}">${v}</button>`).join('')}</div>`;
  else if(k==='crt')body=`<label class="fld"><span>Capillary refill (seconds)</span><input id="e1" value="${esc(o.crt||'')}" placeholder="e.g. 2 s or <2 s"></label>`;
  else body=`<label class="fld"><span>${L[k][0]} (${L[k][1]})</span><input id="e1" type="number" inputmode="decimal" step="${k==='temp'||k==='bm'?'0.1':'1'}" value="${o[k]??''}"></label>`;
  App.sheet(`<p class="mmsg">Correct ${k==='bp'?'BP':k==='o2'?'oxygen':k==='acvpu'?'consciousness':k==='crt'?'cap refill':k==='pq'?'pulse rhythm and strength':k==='fast'?'FAST performed':k==='allergy'?'allergies':L[k][0]}</p>${body}<div class="btnrow mt"><button class="btn" data-a="clr">${I('trash')}Clear</button><button class="btn pri" data-a="ok">${I('check')}Save</button></div>`,(d,close)=>{
    let pick=k==='o2'?(o.o2===true?'o2':o.o2===false?'air':null):k==='acvpu'?o.acvpu:null;
    const multi={};
    d.addEventListener('click',e=>{const b=e.target.closest('[data-v]');const grp=b&&b.closest('[data-g]');if(grp){const g=grp.dataset.g;multi[g]=multi[g]===b.dataset.v?null:b.dataset.v;grp.querySelectorAll('[data-v]').forEach(x=>x.setAttribute('aria-pressed',x===b&&multi[g]!=null));return;}if(b){pick=b.dataset.v;d.querySelectorAll('[data-v]').forEach(x=>x.setAttribute('aria-pressed',x===b));return;}
      const a=e.target.closest('[data-a]');if(!a)return;const v1=(d.querySelector('#e1')||{}).value,v2=(d.querySelector('#e2')||{}).value;
      const num=x=>x===''||x==null?undefined:+x;
      if(k==='pq'||k==='fast'||k==='allergy'){const keys=k==='pq'?['rhythm','vol']:[k];keys.forEach(g=>{if(a.dataset.a==='clr')delete o[g];else if(g in multi)o[g]=multi[g]||undefined;});}
      else if(a.dataset.a==='clr'){if(k==='bp'){delete o.sbp;delete o.dbp;}else if(k==='o2'){delete o.o2;delete o.o2flow;}else delete o[k];}
      else if(k==='bp'){o.sbp=num(v1);o.dbp=num(v2);}
      else if(k==='o2'){if(pick)o.o2=pick==='o2';o.o2flow=v1?v1:undefined;}
      else if(k==='acvpu'){if(pick)o.acvpu=pick;}
      else if(k==='crt'){o.crt=v1||undefined;}
      else o[k]=num(v1);
      Object.keys(o).forEach(x=>o[x]===undefined&&delete o[x]);close();done();});
    const f=d.querySelector('input');if(f)setTimeout(()=>f.focus(),50);});};

route('/voice',{title:'Record obs',tab:'#/voice',render(){
  const avail=App.voiceAvailable();
  return `<div class="voicepanel" id="vp"><div class="state" id="vstate"></div><div class="transcript" id="vtx" aria-live="polite"></div>
    <div class="btnrow"><button class="btn pri" id="vtoggle"></button><button class="btn" id="vsave">${I('check')}Save set</button></div>
    ${avail?'':`<p class="hint mt">Speech recognition isn't available here. Type what you'd say below instead.</p>`}</div>
  <div class="search mt"><input id="vtype" placeholder="Or type: rr 22 sats 94 pulse 110…" aria-label="Type observations"><button class="iconbtn" id="vgo" aria-label="Add typed obs">${I('check')}</button></div>
  <h3 class="sh">Current set <small id="vcount"></small></h3><p class="small muted" style="margin:-4px 2px 8px">Tap any value to correct it or add it by hand.</p><div id="vdraft"></div>
  <div class="btnrow mt"><button class="btn" id="vclear">${I('trash')}Clear set</button><a class="btn" href="#/patient">${I('user')}Patient record</a></div>
  ${acc('What can I say?',ticks(['“Resp rate 22” / “breathing 22” / “RR 22”','“Sats 94 on air” / “sats 96 on 2 litres” / “scale 2”','“Pulse 110 irregular” / “heart rate 110”','“BP 128 over 76” / “blood pressure 90 systolic”','“Temp 37.9” / “temperature 38 point 4”','“Alert” / “new confusion” / “responds to voice” / “responds to pain” / “unresponsive”','“BM 6.4” / “CBG 6.4” / “blood sugar 3 point 2”','“Pulse strong and regular” / “weak irregular pulse”','“FAST done” / “FAST negative” · “no known allergies” / “allergic to penicillin”','“Cap refill 3 seconds”, “pain score 7”, “pupils equal and reactive”','“Save obs” to store the set · “scratch that” to clear it']),{icon:'info'})}
  ${App.native.caps.platform==='webapp'?callout('info','info','Speech is recognised by your browser\u2019s speech service (Apple\u2019s on an iPhone), which may need internet. No audio or transcript is kept: only the obs values are recorded. If voice doesn\u2019t work, type the obs in the box.'):App.native.caps.platform==='ios'?callout('info','info','Speech is recognised by Apple\u2019s speech service, on the phone where your iPhone supports it. No audio or transcript is kept: only the obs values are recorded, and the words on screen are cleared when you save the set or leave.'):callout('info','info','On Android 13+ speech is processed on the phone; older phones may use Google\u2019s speech service. No audio or transcript is kept: only the obs values are recorded, and the words on screen are cleared when you save the set or leave.')}`;},
  after(){
    App.pt();
    App.$('#vtoggle').onclick=()=>{if(App.voiceLive){App.native.voiceStop();App.voiceLive=false;voiceState.status='stopped';}else{voiceState.status='listening';App.native.voiceStart();App.voiceLive=true;}drawVoice();};
    App.$('#vsave').onclick=()=>{commitDraft();drawVoice();};
    App.$('#vclear').onclick=()=>{App.pt().draft={};App.savePatient();drawVoice();};
    App.$('#vdraft').addEventListener('click',e=>{const t=e.target.closest('[data-ob]');if(!t)return;const p=App.pt();App.editObs(p.draft,t.dataset.ob,()=>{App.savePatient();drawVoice();});});
    const go=()=>{const i=App.$('#vtype');if(!i.value.trim())return;window.__native('voice',{status:'final',text:i.value});i.value='';};
    App.$('#vgo').onclick=go;App.$('#vtype').addEventListener('keydown',e=>{if(e.key==='Enter')go();});
    // auto-start when arriving from the mic button
    if(!App.voiceLive&&App.voiceAvailable()&&voiceState.status!=='stopped'){voiceState.status='listening';App.native.voiceStart();App.voiceLive=true;}
    App.leave=()=>{voiceState.lines=[];voiceState.partial='';};
    drawVoice();
  }});

/* ---------- Manual obs / NEWS2 ---------- */
function obsEditor(o){
  const n=(k,l,step='1',ph='')=>`<label class="fld"><span>${l}</span><input inputmode="decimal" type="number" step="${step}" data-o="${k}" value="${o[k]??''}" placeholder="${ph}"></label>`;
  const pick=(k,opts)=>`<div class="picker" data-p="${k}">${opts.map(([v,l])=>`<button type="button" data-v="${v}" aria-pressed="${String(o[k])===String(v)}">${l}</button>`).join('')}</div>`;
  return `<div class="grid3">${n('rr','Resp rate')}${n('spo2','SpO₂ %')}${n('hr','Pulse')}${n('sbp','Systolic BP')}${n('dbp','Diastolic BP')}${n('temp','Temp °C','0.1')}</div>
  <p class="small muted mt" style="margin-bottom:4px">Oxygen</p>${pick('o2',[['false','On air'],['true','On oxygen']])}
  <p class="small muted mt" style="margin-bottom:4px">SpO₂ scale</p>${pick('scale',[['1','Scale 1'],['2','Scale 2 (88–92% target)']])}
  <p class="small muted mt" style="margin-bottom:4px">Consciousness (ACVPU)</p>${pick('acvpu',[['A','Alert'],['C','New confusion'],['V','Voice'],['P','Pain'],['U','Unresp.']])}
  <p class="small muted mt" style="margin-bottom:4px">Pulse rhythm</p>${pick('rhythm',[['regular','Regular'],['irregular','Irregular']])}
  <p class="small muted mt" style="margin-bottom:4px">Pulse strength</p>${pick('vol',[['strong','Strong'],['weak','Weak']])}
  <div class="grid2 mt">${n('bm','BM/CBG mmol/L','0.1')}${n('pain','Pain /10')}</div>
  <div class="grid2 mt"><div><p class="small muted" style="margin:0 0 4px">FAST performed</p>${pick('fast',[['Yes','Yes'],['No','No']])}</div><div><p class="small muted" style="margin:0 0 4px">Allergies</p>${pick('allergy',[['Yes','Yes'],['No','No']])}</div></div>`;
}
function bindEditor(o,onChange){
  App.$$('[data-o]').forEach(el=>el.addEventListener('input',()=>{const v=el.value;o[el.dataset.o]=v===''?undefined:+v;onChange();}));
  App.$$('[data-p]').forEach(g=>g.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const k=g.dataset.p;let v=b.dataset.v;v=v==='true'?true:v==='false'?false:/^\d$/.test(v)?+v:v;
    if(o[k]===v){delete o[k];b.setAttribute('aria-pressed','false');}else{o[k]=v;App.$$('button',g).forEach(x=>x.setAttribute('aria-pressed',x===b));}onChange();}));
}
let calc={};
route('/news2',{title:'NEWS2',tab:'#/assess',render(){return `<div id="nsb"></div><div id="nimp" class="mt"></div><div class="card mt">${obsEditor(calc)}</div>
  <div class="btnrow mt"><button class="btn pri" id="nsave">${I('plus')}Save to patient record</button><button class="btn" id="nreset">Reset</button></div>
  ${callout('info','info','Use scale 2 only for patients with a prescribed target of 88–92% (for example COPD with hypercapnic respiratory failure).')}
  <h3 class="sh">Scoring chart</h3>${App.newsChart()}${scope()}`;},
  after(){const up=()=>{App.$('#nsb').innerHTML=App.scoreBox(calc);App.$('#nimp').innerHTML=App.newsImpact(calc);};bindEditor(calc,up);up();
    App.$('#nreset').onclick=()=>{calc={};App.render();};
    App.$('#nsave').onclick=()=>{const p=App.pt();p.obs.push(Object.assign({t:Date.now(),src:'manual'},calc));App.savePatient();calc={};App.toast('Saved to patient record');App.go('#/patient');};}});
route('/obs/new',{title:'Enter obs',tab:'#/patient',render(){calc={};return `<p class="lede">Timed at ${App.time()} when saved.</p><div id="nsb"></div><div id="nimp" class="mt"></div><div class="card mt">${obsEditor(calc)}</div><button class="btn pri block mt" id="nsave">${I('check')}Save obs set</button>`;},
  after(){const up=()=>{App.$('#nsb').innerHTML=App.scoreBox(calc);App.$('#nimp').innerHTML=App.newsImpact(calc);};bindEditor(calc,up);up();App.$('#nsave').onclick=()=>{const p=App.pt();p.obs.push(Object.assign({t:Date.now(),src:'manual'},calc));App.savePatient();calc={};App.toast('Obs set saved');App.go('#/patient');};}});

/* ---------- GCS ---------- */
const GCS={E:[[4,'Opens spontaneously'],[3,'Opens to voice'],[2,'Opens to pressure'],[1,'None']],V:[[5,'Orientated'],[4,'Confused'],[3,'Words'],[2,'Sounds'],[1,'None']],M:[[6,'Obeys commands'],[5,'Localises to pressure'],[4,'Normal flexion'],[3,'Abnormal flexion'],[2,'Extension'],[1,'None']]};
let gcs={};
route('/gcs',{title:'Glasgow Coma Scale',tab:'#/assess',render(){return `<div id="gsum"></div>${[['E','Eyes'],['V','Verbal'],['M','Motor']].map(([k,l])=>`<h3 class="sh">${l}</h3><div class="list" data-g="${k}">${GCS[k].map(([v,t])=>`<button class="row" data-v="${v}" aria-pressed="${gcs[k]===v}"><span class="badge">${v}</span><span class="tx"><b>${t}</b></span></button>`).join('')}</div>`).join('')}
${callout('info','info','Record the best response. If a component can\u2019t be tested (e.g. eyes swollen shut, intubated), record NT and describe it.')}${scope()}`;},
  after(){const up=()=>{const t=(gcs.E||0)+(gcs.V||0)+(gcs.M||0);const done=gcs.E&&gcs.V&&gcs.M;App.$('#gsum').innerHTML=`<div class="scorebox ${done&&t<=8?'b3':done&&t<15?'b2':''}"><span class="num">${done?t:'–'}</span><span><b>GCS ${done?`E${gcs.E} V${gcs.V} M${gcs.M}`:'select all three'}</b><span>${done&&t<=8?'8 or less: airway at risk.':done&&t<15?'Reduced consciousness: find the cause, check glucose.':''}</span></span></div>`;
      App.$$('[data-g]').forEach(g=>App.$$('.row',g).forEach(r=>{const on=gcs[g.dataset.g]===+r.dataset.v;r.style.background=on?'var(--primary-soft)':'';r.setAttribute('aria-pressed',on);}));};
    App.$$('[data-g]').forEach(g=>g.addEventListener('click',e=>{const r=e.target.closest('[data-v]');if(!r)return;gcs[g.dataset.g]=+r.dataset.v;up();}));up();
}});

/* ---------- BE-FAST ---------- */
const BF=[['B','Balance','Sudden loss of balance or coordination, unsteady'],['E','Eyes','Sudden loss of vision in one or both eyes, double vision'],['F','Face','Face drooping on one side: ask them to smile'],['A','Arms','Weakness or drift: raise both arms, eyes closed, 10 seconds'],['S','Speech','Slurred, muddled, or unable to find or understand words'],['T','Time','Time last known well: note it exactly']];
route('/befast',{title:'BE-FAST',tab:'#/assess',render(){return `<h2 class="pt">BE-FAST stroke check</h2>
  <div class="list">${BF.slice(0,5).map(([k,t,d])=>`<label class="check"><input type="checkbox" data-bf="${t}"><span><b>${k}: ${t}</b><br><span class="small muted">${d}</span></span></label>`).join('')}</div>
  <label class="fld mt"><span>T: Time last known well</span><input type="time" id="bft"></label>
  <div id="bfout" class="mt"></div>
  <div class="btnrow mt"><button class="btn pri" id="bfsave">${I('plus')}Add to patient notes</button><a class="btn" href="#/symptom/stroke">${I('symptom')}Stroke guidance</a></div>
  ${callout('amber','alert','Always check blood glucose if trained: hypoglycaemia can look exactly like a stroke.')}${scope()}`;},
  after(){const up=()=>{const pos=App.$$('[data-bf]:checked').map(x=>x.dataset.bf);App.$('#bfout').innerHTML=pos.length?callout('red','alert',`<b>BE-FAST positive:</b> ${pos.join(', ')}. Treat as a time-critical stroke: escalate and record time last known well.`):callout('info','info','No positive findings ticked. A negative BE-FAST does not rule out stroke (especially posterior circulation strokes).');};
    App.$$('[data-bf]').forEach(x=>x.onchange=up);up();
    App.$('#bfsave').onclick=()=>{const pos=App.$$('[data-bf]:checked').map(x=>x.dataset.bf);const t=App.$('#bft').value;const p=App.pt();p.notes.push({t:Date.now(),text:`BE-FAST: ${pos.length?'positive ('+pos.join(', ')+')':'negative'}${t?'; last known well '+t:''}`});
      p.cas=p.cas||{};p.cas.fast='Yes';p.cas.face=pos.includes('Face')?'Yes':'No';p.cas.speech=pos.includes('Speech')?'Yes':'No';if(!pos.includes('Arms')){p.cas.armL='No';p.cas.armR='No';}if(t)p.cas.strokeOnset=t;
      App.savePatient();App.toast(pos.includes('Arms')?'Added to notes and CAS130: mark which arm on the form':'Added to notes and CAS130');};}});

/* ---------- Sepsis ---------- */
const SRF=['New or altered mental state / new confusion','Respiratory rate 25 or more','Needs oxygen to keep SpO₂ 92% or more (88% in COPD)','Systolic BP 90 or less','Heart rate 131 or more','Not passed urine in 18 hours','Non-blanching rash, mottled, ashen or cyanosed skin','Recent chemotherapy (within 6 weeks)'];
route('/sepsis',{title:'Sepsis screen',tab:'#/assess',render(){
  const last=App.patient&&App.patient.obs[App.patient.obs.length-1];
  return `<h2 class="pt">Sepsis screen</h2><p class="lede">Could this be an infection? If yes, look for red flags.</p>
  ${last?`<div class="card"><b>Latest NEWS2: </b><span class="badge b${Tools.news2(last).band}">${Tools.news2(last).total}</span> <span class="small muted">at ${App.time(last.t)}</span></div>`:''}
  <h3 class="sh">Red flags</h3><div class="list">${SRF.map(t=>`<label class="check"><input type="checkbox" data-sf><span>${t}</span></label>`).join('')}</div>
  <div id="sfout" class="mt"></div>
  <h3 class="sh">Possible sources</h3><div class="card">${ticks(['Chest: cough, breathlessness','Urine: burning, confusion, catheter','Abdomen: pain, vomiting, jaundice','Skin: cellulitis, wounds, ulcers, lines','Brain: headache, neck stiffness, rash','Recent surgery or procedure'])}</div>${scope()}`;},
  after(){const last=App.patient&&App.patient.obs[App.patient.obs.length-1];const n=last?Tools.news2(last):null;
    const up=()=>{const c=App.$$('[data-sf]:checked').length;App.$('#sfout').innerHTML=c?callout('red','alert',`<b>${c} red flag${c>1?'s':''}: possible sepsis.</b> This is time-critical. Escalate to EOC / clinical support now and state “suspected sepsis”.`):n&&(n.total>=5||n.single3)?callout('amber','alert','No red flags ticked, but NEWS2 is 5 or more (or a single 3). With suspected infection, escalate for clinical advice.'):callout('info','info','No red flags ticked. Keep reassessing: sepsis can develop quickly.');};
    App.$$('[data-sf]').forEach(x=>x.onchange=up);up();}});

/* ---------- Cardiac arrest ---------- */
let arrest={running:false,start:0,cycleStart:0,log:[],beat:false};
let audio=null,metro=null,tick=null;
function click(){try{if(!audio)audio=new (window.AudioContext||window.webkitAudioContext)();const o=audio.createOscillator(),g=audio.createGain();o.frequency.value=1000;g.gain.setValueAtTime(.35,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.05);o.connect(g).connect(audio.destination);o.start();o.stop(audio.currentTime+.06);}catch(e){}}
const mmss=ms=>{const s=Math.floor(ms/1000);return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');};
function drawArrest(){const c=App.$('#aclock');if(!c)return;const now=Date.now();
  c.textContent=arrest.start?mmss(now-arrest.start):'00:00';
  const cyc=arrest.running?(now-arrest.cycleStart)%120000:0;App.$('#acyc i').style.width=(cyc/1200)+'%';
  App.$('#acyct').textContent=arrest.running?`Next rhythm check / swap in ${mmss(120000-cyc)}`:'2-minute cycle';
  App.$('#alog').innerHTML=arrest.log.map(l=>`<div><b>${mmss(l.t-arrest.start)}</b> · ${App.time(l.t)} · ${esc(l.e)}</div>`).reverse().join('');
  App.$('#atoggle').innerHTML=arrest.running?`${I('stop')}Stop metronome`:`${I('play')}${arrest.start?'Resume':'Start CPR'}`;}
App.arrestState=()=>arrest;
function logA(e){arrest.log.push({t:Date.now(),e});drawArrest();}
route('/arrest',{title:'Cardiac arrest',tab:'#/assess',render(){return `
  <div class="card center"><div class="cprclock" id="aclock">00:00</div><div class="beat" id="abeat">110</div>
  <div class="cyclebar" id="acyc"><i></i></div><p class="small muted mt" id="acyct"></p>
  <button class="btn red block" id="atoggle"></button></div>
  <h3 class="sh">Log an event</h3><div class="chips">${['AED attached','Shock delivered','No shock advised','Rhythm check','Compressor swap','Airway adjunct','Oxygen','Crew arrived','ROSC','Rearrest'].map(e=>`<button class="chip" data-ev="${e}">${e}</button>`).join('')}</div>
  <h3 class="sh">Event log</h3><div class="card log" id="alog"></div>
  <div class="btnrow mt"><button class="btn" id="ashare">${I('share')}Share log</button><button class="btn" id="areset">${I('trash')}Reset</button></div>
  ${acc('Reminders',ticks(['Rate 100–120 /min, depth 5–6 cm, full recoil','30:2 with barrier device, or continuous compressions','Swap compressors every 2 minutes','Minimise pauses; resume immediately after a shock','Consider DNACPR / ReSPECT documentation']),{icon:'info'})}${scope()}`;},
  after(){
    App.$('#atoggle').onclick=()=>{if(arrest.running){arrest.running=false;clearInterval(metro);App.native.keepAwake(false);logA('Metronome stopped');}
      else{if(!arrest.start){arrest.start=Date.now();arrest.log=[];}arrest.cycleStart=Date.now();arrest.running=true;App.native.keepAwake(true);logA('CPR started');
        clearInterval(metro);metro=setInterval(()=>{click();const b=App.$('#abeat');if(b){b.classList.add('on');setTimeout(()=>b.classList.remove('on'),90);}},60000/110);}
      drawArrest();};
    App.$$('[data-ev]').forEach(b=>b.onclick=()=>{if(!arrest.start)arrest.start=Date.now();if(/Rhythm check|swap/i.test(b.dataset.ev))arrest.cycleStart=Date.now();logA(b.dataset.ev);App.native.haptic();});
    App.$('#ashare').onclick=()=>App.native.share('Arrest log',`Cardiac arrest log (started ${App.dateTime(arrest.start)})\n`+arrest.log.map(l=>`${mmss(l.t-arrest.start)} (${App.time(l.t)}) ${l.e}`).join('\n'));
    App.$('#areset').onclick=()=>{App.confirm('Reset the arrest timer and log?','Reset',()=>{arrest={running:false,start:0,cycleStart:0,log:[]};clearInterval(metro);App.native.keepAwake(false);drawArrest();});};
    clearInterval(tick);tick=setInterval(drawArrest,250);drawArrest();
    App.leave=()=>clearInterval(tick); // metronome keeps running if you navigate away
  }});

/* ---------- Prescription scanner ---------- */
let scan={status:'idle',text:'',matches:[],lines:[]};
App.onNative.scan=d=>{
  if(d.status==='processing')scan.status='processing';
  else if(d.status==='ok'){scan.status='done';scan.text=d.text||'';scan.matches=Tools.matchMeds(scan.text);scan.lines=Tools.labelLines(scan.text);}
  else if(d.status==='cancelled'){scan.status='idle';}
  else if(d.status==='error'){scan.status='idle';App.toast(d.message||'Scan failed',3500);}
  const o=App.$('#scanout');if(o)o.innerHTML=scanResult();
};
function scanResult(){
  if(scan.status==='processing')return `<div class="card center"><p><b>Reading the label…</b></p><p class="small muted">Text recognition runs on the phone.</p></div>`;
  if(scan.status!=='done')return '';
  const m=scan.matches;
  return `${m.length?`<h3 class="sh">Found ${m.length} medicine${m.length>1?'s':''}</h3>${m.map(i=>App.medCard(i)).join('')}<button class="btn block mt" id="scanadd">${I('plus')}Add ${m.length>1?'all':'it'} to patient record</button>`:
    callout('amber','alert','<b>No medicine recognised.</b> Try again closer, flatter and in better light, or type the name. Handwriting reads poorly.')}
  ${scan.lines.length?`<h3 class="sh">Label directions</h3><div class="card">${ticks(scan.lines)}</div>`:''}
  ${acc('All text read from the photo',`<div class="ocr">${esc(scan.text)||'(no text found)'}</div><p class="small muted">The photo has already been deleted. This text is discarded when you leave this screen.</p>`,{icon:'list'})}`;
}
route('/scan',{title:'Scan a medicine',tab:'#/lookup',render(){scan={status:'idle',text:'',matches:[],lines:[]};return `
  <h2 class="pt">Scan a medicine</h2><p class="lede">Photograph a dispensing label, box or repeat slip. The app reads the text on the phone and tells you what the medicine is commonly prescribed for.</p>
  ${App.native.has?`<div class="btnrow"><button class="btn pri" id="scam">${I('camera')}Take photo</button><button class="btn" id="sgal">${I('image')}Choose photo</button></div>`:callout('info','info','Camera scanning works in the Android app. You can paste label text below to test matching.')}
  <div class="search mt"><input id="stype" placeholder="Or type / paste a name or label text" aria-label="Medicine name or label text"><button class="iconbtn" id="sgo" aria-label="Look up">${I('search')}</button></div>
  <div id="scanout"></div>
  ${callout('info','info','<b>Privacy:</b> the photo is processed on this phone, deleted straight away, and never uploaded. Only the medicine names you choose to add are kept in the patient record.')}
  ${callout('amber','alert','A medicine can have several uses. This shows the <b>common</b> reasons; ask the patient or check their records for theirs.')}${scope()}`;},
  after(){
    const c=App.$('#scam');if(c){c.onclick=()=>App.native.scan(false);App.$('#sgal').onclick=()=>App.native.scan(true);}
    const go=()=>{const v=App.$('#stype').value;if(!v.trim())return;App.onNative.scan({status:'ok',text:v});};
    App.$('#sgo').onclick=go;App.$('#stype').addEventListener('keydown',e=>{if(e.key==='Enter')go();});
    App.$('#scanout').addEventListener('click',e=>{if(e.target.closest('#scanadd')){const p=App.pt();scan.matches.forEach(i=>{if(!p.meds.includes(MEDS[i][0]))p.meds.push(MEDS[i][0]);});App.savePatient();App.toast('Added to patient record');}});
    App.leave=()=>{scan={status:'idle',text:'',matches:[],lines:[]};};
  }});

/* ---------- Handover ---------- */
App.handoverText=()=>{
  const p=App.patient; if(!p) return '';
  const last=p.obs[p.obs.length-1], first=p.obs[0], i=p.info, s=p.sample;
  const L=[];
  L.push(`CFR HANDOVER (ATMIST) · ${App.dateTime()}`);
  L.push(`A: ${[i.age&&('Age '+i.age),i.sex].filter(Boolean).join(', ')||'Not recorded'}`);
  L.push(`T: Onset ${i.onset||'not recorded'}; CFR on scene record started ${App.time(p.started)}`);
  L.push(`M: ${i.complaint||'Not recorded'}`);
  L.push(`I: ${s.signs||'See obs'}`);
  if(last){const n=Tools.news2(last);L.push(`S: Latest obs ${App.time(last.t)}: ${obsSummary(last)}. NEWS2 ${n.total}, ${App.newsRisk(last)}${n.complete?'':' (incomplete)'}.`);
    if(first&&first!==last){const n1=Tools.news2(first);L.push(`   Trend: NEWS2 ${n1.total} at ${App.time(first.t)} → ${n.total} at ${App.time(last.t)} (${p.obs.length} sets)`);}}
  else L.push('S: No obs recorded');
  L.push(`T: ${i.treatment||'None recorded'}`);
  L.push('');
  if(s.allergies)L.push(`Allergies: ${s.allergies}`);
  if(p.meds.length)L.push(`Medicines: ${p.meds.join(', ')}`);
  if(s.past)L.push(`History: ${s.past}`);
  if(s.last)L.push(`Last oral intake: ${s.last}`);
  if(s.events)L.push(`Events: ${s.events}`);
  if(p.obs.length>1){L.push('');L.push('Obs sets:');p.obs.forEach(o=>L.push(`${App.time(o.t)}  ${obsSummary(o)}  NEWS2 ${Tools.news2(o).total}`));}
  if(p.notes.length){L.push('');L.push('Notes:');p.notes.forEach(n=>L.push(`${App.time(n.t)}  ${n.text}`));}
  return L.join('\n');
};
route('/handover',{title:'Handover',tab:'#/patient',render(){
  if(!App.patient)return `<p class="empty">Start a patient record first.</p><a class="btn pri block" href="#/patient">${I('user')}Patient</a>`;
  return `<h2 class="pt">Handover (ATMIST)</h2><p class="lede">Built from your patient record. Check it, then share or read it out.</p>
  <div class="card"><pre class="ocr" style="max-height:none;margin:0;font-family:inherit;font-size:.92rem" id="hotext">${esc(App.handoverText())}</pre></div>
  <div class="btnrow mt"><button class="btn pri" id="hshare">${I('share')}Share</button><button class="btn" id="hcopy">${I('copy')}Copy</button></div>
  ${callout('amber','alert','This contains patient information. Share only through channels approved by SCAS for patient data, then end the job.')}<button class="btn red block mt" id="hend">${I('check')}End job and clear details</button><a class="btn block mt" href="#/patient">${I('edit')}Edit record</a>`;},
  after(){if(!App.patient)return;App.$('#hshare').onclick=()=>{App.native.share('CFR handover',App.handoverText());setTimeout(()=>App.confirm('Handover shared. End the job and clear the patient details now?','End job',()=>{App.clearPatient();App.toast('Patient details cleared',2500);App.go('#/');}),1200);};App.$('#hcopy').onclick=()=>App.copy(App.handoverText());App.$('#hend').onclick=()=>App.endJob(()=>App.go('#/'));}});

/* ---------- Settings ---------- */
route('/settings',{title:'Settings',tab:'#/',render(){const s=App.settings;
  const seg=(k,opts)=>`<div class="seg" data-set="${k}">${opts.map(([v,l])=>`<button aria-pressed="${String(s[k])===String(v)}" data-v="${v}">${l}</button>`).join('')}</div>`;
  return `<h3 class="sh">Appearance</h3><div class="card stack"><div><p class="small muted" style="margin:0 0 6px">Theme</p>${seg('theme',[['system','Match phone'],['light','Light'],['dark','Dark']])}</div>
  <div><p class="small muted" style="margin:0 0 6px">Text size</p>${seg('fs',[['90','Small'],['100','Normal'],['115','Large'],['130','Largest']])}</div>
  <div><p class="small muted" style="margin:0 0 6px">Contrast</p>${seg('contrast',[['normal','Standard'],['high','High']])}</div>
  <div><p class="small muted" style="margin:0 0 6px">Vibration feedback</p>${seg('haptics',[['true','On'],['false','Off']])}</div></div>
  <h3 class="sh">Patient data</h3><div class="card"><p class="small"><b>Patient details are never saved to this phone.</b> Obs, notes, SAMPLE and handovers are held only while the app is open and are cleared when you end the job, close the app, or after 30 minutes in the background. Scanner photos are deleted immediately. Voice obs keep no audio and no transcript: only the obs values. Nothing leaves the phone unless you tap Share.</p>
  <div><p class="small muted" style="margin:6px 0">Hide the screen in recent apps and block screenshots while a patient is in progress</p>${seg('secure',[['true','On'],['false','Off']])}</div>
  ${App.patient?'<button class="btn red block mt" id="wipe">'+I('check')+'End current job now</button>':''}</div>
  <h3 class="sh">Illustrations</h3>${App.illusCard?App.illusCard():''}
  <h3 class="sh">Backup</h3><div class="card"><p class="small">You have ${App.imgs.length} image${App.imgs.length===1?'':'s'}, ${(App.myConds||[]).length} condition${(App.myConds||[]).length===1?'':'s'} and ${Object.keys(App.condNotes||{}).length} note${Object.keys(App.condNotes||{}).length===1?'':'s'} of your own. Uninstalling the app deletes them, so keep a backup file somewhere safe (Drive or Downloads).</p><div class="btnrow"><button class="btn" id="ibak">${I('share')}Back up</button><button class="btn" id="ires">${I('plus')}Restore</button></div></div>
  <h3 class="sh">About</h3><div class="card small"><p><b>CFR Reference</b> v50${App.native.caps.version?' ('+esc(App.native.caps.version)+')':''}. Content reviewed September 2026.</p>
  <p>An unofficial study and reference aid for Community First Responders. Not an official SCAS or NHS product. It does not replace your training, SCAS clinical guidance, JRCALC or advice from EOC and clinicians.</p>
  <p>NEWS2 © Royal College of Physicians 2017. Children's ranges based on APLS. Diagrams are simplified for teaching.</p></div>`;},
  after(a){App.$$('[data-set]').forEach(g=>g.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;let v=b.dataset.v;const k=g.dataset.set;App.settings[k]=k==='fs'?+v:(k==='haptics'||k==='secure')?v==='true':v;if(k==='secure'){App._secure=null;App.updateSecure();}App.saveSettings();App.$$('button',g).forEach(x=>x.setAttribute('aria-pressed',x===b));}));
    if(App.illusBind)App.illusBind();
    if(a&&a.focus==='illus'){const el=App.$('#illcard');if(el)setTimeout(()=>el.scrollIntoView({block:'center'}),50);}
    App.$('#ibak').onclick=App.backupImages;App.$('#ires').onclick=App.restoreImages;
    const wp=App.$('#wipe');if(wp)wp.onclick=()=>App.endJob();}});
})();
