// CAS130 Responder Skills / Equipment Record: the paper form as a screen, filled in from the patient record.
// Everything lives in App.patient.cas (memory only, cleared with the patient). Only the responder's own
// call sign and PIN can be remembered on the phone, and only if they choose to.
(function(){
const {esc,callout,route}=App;
const RESP='cfr.responder';
const responder=()=>App.LS.get(RESP,{});
const hhmm=t=>t?App.time(t):'';
const YN=[['Yes','Yes'],['No','No']];

/* --- helpers reading the record --- */
const obs=p=>p.obs||[];
const last=p=>{const o=obs(p);return o[o.length-1];};
const lastWith=(p,f)=>{const o=obs(p);for(let i=o.length-1;i>=0;i--)if(f(o[i]))return o[i];return null;};
const latestVal=(p,k)=>{const o=lastWith(p,x=>x[k]!=null&&x[k]!=='');return o?o[k]:undefined;};
const arrest=()=>(App.arrestState?App.arrestState():null)||{log:[]};
const evt=re=>{const a=arrest();return (a.log||[]).filter(l=>re.test(l.e));};
const allergyAuto=p=>{const v=latestVal(p,'allergy');if(v)return v;const t=(p.sample.allergies||'').trim();if(!t)return undefined;return /^(none|nil|no|nka|nkda|no known.*)$/i.test(t)?'No':'Yes';};
const ageNum=p=>{const m=String(p.info.age||'').match(/\d+/);return m?+m[0]:null;};

/* --- the form. [key,label,type,options|null,auto(p)] --- */
const F=[
 ['Incident',[
  ['incDate','Incident date','text',null,()=>new Date().toLocaleDateString('en-GB')],
  ['incNo','Incident number','text'],
  ['callsign','Responder call sign','text',null,()=>responder().callsign],
  ['pin1','Responder PIN (1)','text',null,()=>responder().pin],
  ['pin2','Responder PIN (2)','text'],
  ['callTime','Call time','time'],
  ['mobileTime','Mobile time','time'],
  ['atScene','At scene','time',null,p=>hhmm(p.started)]]],
 ['Basic observations',[
  ['response','Response (AVPU)','pick',[['A','A: Alert'],['C','C: New confusion'],['V','V: Voice'],['P','P: Pain'],['U','U: Unresponsive']],p=>latestVal(p,'acvpu')],
  ['airway','Airway','pick',[['1','1: Clear'],['2','2: Partly obstructed'],['3','3: Obstructed'],['4','4: Vomited']]],
  ['breathing','Breathing','pick',[['Normal','Normal'],['SOB','SOB / unable to speak full sentences'],['Abnormal','Abnormal / absent (CPR)']]],
  ['bloodLoss','External blood loss','yn',YN],
  ['bpSys','BP systolic','num',null,p=>latestVal(p,'sbp')],
  ['bpDia','BP diastolic','num',null,p=>latestVal(p,'dbp')],
  ['hr','Heart rate','num',null,p=>latestVal(p,'hr')],
  ['pulseRhythm','Pulse rhythm','pick',[['Regular','Regular'],['Irregular','Irregular']],p=>{const v=latestVal(p,'rhythm');return v?(/irreg/.test(v)?'Irregular':'Regular'):undefined;}],
  ['pulseVol','Pulse strength','pick',[['Strong','Strong'],['Weak','Weak']],p=>{const v=latestVal(p,'vol');return v?(v==='strong'?'Strong':'Weak'):undefined;}],
  ['rr','Breathing rate','num',null,p=>latestVal(p,'rr')],
  ['temp','Temperature °C','num',null,p=>latestVal(p,'temp')],
  ['pain','Pain score /10','num',null,p=>latestVal(p,'pain')],
  ['entonox','Entonox administered','yn',YN],
  ['obsTime','Time of observations','time',null,p=>last(p)?hhmm(last(p).t):''],
  ['duration','Duration of symptoms','text',null,p=>p.info.duration],
  ['durUnit','Hours or days','pick',[['Hours','Hours'],['Days','Days']]]]],
 ['Resuscitation',[
  ['bls','BLS given','yn',YN,()=>arrest().start?'Yes':undefined],
  ['aed','AED used','yn',YN,()=>evt(/AED attached|Shock/).length?'Yes':undefined],
  ['pads','AED pads','pick',[['Adult','Adult pads'],['Paed','Paed pads (under 8)']]],
  ['padsTime','Time AED pads applied','time',null,()=>{const e=evt(/AED attached/)[0];return e?hhmm(e.t):'';}],
  ['shocks','Shocks given','num',null,()=>{const a=arrest();return a.start?evt(/Shock delivered/).length:undefined;}],
  ['breathReturn','Did breathing return','yn',YN,()=>evt(/ROSC/).length?'Yes':undefined],
  ['breathTime','Time breathing returned','time',null,()=>{const e=evt(/ROSC/)[0];return e?hhmm(e.t):'';}]]],
 ['Aspirin (cardiac-sounding chest pain)',[
  ['aAllergy','Known allergy or hypersensitivity','yn',YN,allergyAuto],
  ['aUnder16','Under 16 years of age','yn',YN,p=>{const a=ageNum(p);return a==null?undefined:a<16?'Yes':'No';}],
  ['aGI','Current active GI bleeding','yn',YN],
  ['aHaem','Haemophilia or other clotting disorder','yn',YN],
  ['aLiver','Severe liver disease','yn',YN],
  ['aTaken','300 mg already taken since the 999 call','yn',YN],
  ['aspirin','300 mg aspirin given','yn',YN],
  ['aspirinTime','Time aspirin given','time']]],
 ['Oxygen',[
  ['spo2Air','SpO₂ without O₂ %','num',null,p=>{const o=lastWith(p,x=>x.spo2!=null&&x.o2!==true);return o?o.spo2:undefined;}],
  ['spo2O2','SpO₂ with O₂ %','num',null,p=>{const o=lastWith(p,x=>x.spo2!=null&&x.o2===true);return o?o.spo2:undefined;}],
  ['o2Given','Oxygen administered','yn',YN,p=>obs(p).some(x=>x.o2===true)?'Yes':obs(p).some(x=>x.o2===false)?'No':undefined]]],
 ['Stroke',[
  ['fast','FAST performed','yn',YN,p=>latestVal(p,'fast')],
  ['face','Face: paralysis','yn',YN],
  ['armR','Arm: right weakness','yn',YN],
  ['armL','Arm: left weakness','yn',YN],
  ['speech','Speech: slurred','yn',YN],
  ['strokeOnset','Time onset of symptoms','time',null,p=>/^\d{1,2}:\d{2}$/.test(p.info.onset||'')?p.info.onset:'']]],
 ['Diabetic',[
  ['bm','BM/CBG mmol/L','num',null,p=>latestVal(p,'bm')],
  ['sugarGiven','High sugar food / drink given','yn',YN],
  ['glucogel','Glucogel administered','yn',YN],
  ['glucoDose','Estimated dose (grams)','num']]],
 ['Responder actions',[
  ['pocketMask','Pocket mask used','yn',YN],
  ['bvm','Bag valve mask used','yn',YN],
  ['suction','Suction used','yn',YN],
  ['opa','OP airway used','yn',YN],
  ['opaSize','OP airway size','text'],
  ['recovery','Recovery position','yn',YN],
  ['wound','Wound dressed and elevated for serious blood loss','yn',YN]]],
 ['History',[
  ['allergies','Allergies','yn',YN,allergyAuto],
  ['allergyDetail','Allergic to','text',null,p=>{const t=(p.sample.allergies||'').trim();if(t&&allergyAuto(p)==='Yes')return t;return latestVal(p,'allergyTo');}],
  ['meds','Currently takes medication','yn',YN,p=>p.meds.length?'Yes':undefined],
  ['medList','Medicines','text',null,p=>p.meds.join(', ')],
  ['complaint','Presenting complaint / previous medical history','area',null,p=>[p.info.complaint,p.sample.signs&&('Signs: '+p.sample.signs),p.sample.past&&('PMH: '+p.sample.past),p.sample.events&&('Events: '+p.sample.events)].filter(Boolean).join('\n')]]],
 ['Safeguarding',[
  ['safeguard','Safeguarding child / adult issue','yn',YN],
  ['informed','If yes, informed attending clinician','yn',YN]]]
];
const FLAT={};F.forEach(([,fs])=>fs.forEach(f=>FLAT[f[0]]=f));

function val(p,k){const c=p.cas||{};if(k in c)return {v:c[k],auto:false};const f=FLAT[k];const a=f[4]?f[4](p):undefined;return {v:a==null||a===''?'':a,auto:a!=null&&a!==''};}
const show=(k,v)=>{const f=FLAT[k];if(f[3]&&v!==''){const o=f[3].find(x=>String(x[0])===String(v));if(o)return o[1];}return String(v);};

function fieldHTML(p,f){const [k,l,type,opts]=f;const {v,auto}=val(p,k);
  const tag=auto?'<em class="autotag">auto</em>':'';
  if(type==='yn'||type==='pick')return `<div class="casf" data-cf="${k}"><p class="small muted casl">${esc(l)} ${tag}</p><div class="picker${type==='pick'&&opts.length>3?' wrap':''}">${opts.map(([ov,ol])=>`<button type="button" data-cv="${esc(ov)}" aria-pressed="${String(v)===String(ov)}">${esc(ol)}</button>`).join('')}</div></div>`;
  if(type==='area')return `<label class="fld casf" data-cf="${k}"><span>${esc(l)} ${tag}</span><textarea data-ci="${k}" rows="4">${esc(v)}</textarea></label>`;
  return `<label class="fld casf" data-cf="${k}"><span>${esc(l)} ${tag}</span><input data-ci="${k}" ${type==='num'?'inputmode="decimal"':''} type="${type==='time'?'time':'text'}" value="${esc(v)}"></label>`;}

App.casText=(withBlanks)=>{const p=App.patient;if(!p)return '';const L=['CAS130 RESPONDER SKILLS / EQUIPMENT RECORD',App.dateTime()];
  const n=last(p)?Tools.news2(last(p)):null;
  F.forEach(([sec,fs])=>{const rows=[];fs.forEach(f=>{const {v}=val(p,f[0]);if(v===''&&!withBlanks)return;rows.push(`${f[1]}: ${v===''?'—':show(f[0],v)}`);});
    if(sec==='Basic observations'&&n&&n.missing.length<7)rows.push(`NEWS2: ${n.total} (${App.newsRisk(last(p))})${n.complete?'':' incomplete'}`);
    if(rows.length){L.push('');L.push(sec.toUpperCase());rows.forEach(r=>L.push(r));}});
  if(obs(p).length>1){L.push('');L.push('OBS SETS');obs(p).forEach(o=>L.push(`${App.time(o.t)} ${App.obsSummary(o)} · NEWS2 ${Tools.news2(o).total}`));}
  return L.join('\n');};

route('/cas130',{title:'CAS130 record',tab:'#/patient',render(){
  if(!App.patient)return `<div class="empty">${I('user')}<h2 class="pt">No patient in progress</h2><p>The CAS130 record fills in from the patient record: obs, SAMPLE, medicines, BE-FAST and the arrest log.</p></div><button class="btn pri block" id="casstart">${I('plus')}Start a new patient</button>`;
  const p=App.patient;p.cas=p.cas||{};const r=responder();
  return `<div id="casform"><h2 class="pt">CAS130 Responder Skills / Equipment Record</h2>
  <p class="lede">Filled in from your patient record. Values marked <em class="autotag">auto</em> come from your obs and notes; tap or type to change any of them.</p>
  ${callout('amber','alert','Patient initials and date of birth go on the paper form only: they aren’t kept in the app.')}
  ${F.map(([sec,fs])=>`<h3 class="sh">${esc(sec)}</h3><div class="card stack">${fs.map(f=>fieldHTML(p,f)).join('')}${sec==='Incident'?`<label class="check"><input type="checkbox" id="casremember" ${r.callsign||r.pin?'checked':''}><span class="small">Remember my call sign and PIN (1) on this phone</span></label>`:''}${sec==='Basic observations'&&last(p)?`<div>${App.scoreBox(last(p))}</div>`:''}</div>`).join('')}
  <h3 class="sh">Send as a message</h3><div class="card"><label class="check"><input type="checkbox" id="casblank"><span class="small">Include blank fields</span></label><pre class="ocr" id="castext" style="max-height:340px;margin:8px 0 0;font-family:inherit;font-size:.86rem"></pre></div>
  <div class="btnrow mt"><button class="btn pri" id="casshare">${I('share')}Send as text</button><button class="btn" id="cascopy">${I('copy')}Copy</button></div>
  ${callout('amber','alert','This contains patient information. Send it only through channels SCAS approves for patient data, then end the job.')}
  <div class="btnrow mt"><button class="btn" id="casreset">${I('trash')}Clear my changes</button><a class="btn" href="#/patient">${I('user')}Patient record</a></div></div>`;},
  after(){
    const st=App.$('#casstart');if(st){st.onclick=()=>{App.pt();App.savePatient();App.render();};return;}
    const p=App.patient,view=App.$('#casform');
    const preview=()=>{App.$('#castext').textContent=App.casText(App.$('#casblank').checked);};
    const redraw=k=>{const el=App.$(`[data-cf="${k}"]`);if(el){el.outerHTML=fieldHTML(p,FLAT[k]);}preview();};
    const saveResp=()=>{if(!App.$('#casremember').checked){App.LS.del(RESP);return;}App.LS.set(RESP,{callsign:val(p,'callsign').v||'',pin:val(p,'pin1').v||''});};
    view.addEventListener('click',e=>{const b=e.target.closest('[data-cv]');if(!b)return;const k=b.closest('[data-cf]').dataset.cf;const cur=val(p,k).v;
      p.cas[k]=String(cur)===b.dataset.cv?'':b.dataset.cv;App.savePatient();App.native.haptic();redraw(k);});
    view.addEventListener('input',e=>{const i=e.target.closest('[data-ci]');if(!i)return;const k=i.dataset.ci;p.cas[k]=i.value;App.savePatient();
      const tag=i.closest('[data-cf]').querySelector('.autotag');if(tag)tag.remove();if(k==='callsign'||k==='pin1')saveResp();preview();});
    App.$('#casremember').onchange=saveResp;
    App.$('#casblank').onchange=preview;
    App.$('#casshare').onclick=()=>App.native.share('CAS130 record',App.casText(App.$('#casblank').checked));
    App.$('#cascopy').onclick=()=>App.copy(App.casText(App.$('#casblank').checked));
    App.$('#casreset').onclick=()=>App.confirm('Clear the changes you made on this form? Values from your obs and notes stay.','Clear',()=>{p.cas={};App.render();});
    preview();
  }});
})();
