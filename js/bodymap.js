// Pain & symptom checker: detailed front, back and head views; area-specific causes ranked by symptoms.
(function(){
const {esc,callout,scope}=App;
const st={view:'front',sex:'',sel:[],feats:[],ctx:[],age:'',dur:'',ctxOff:[],allergy:[],allergyTxt:'',pmh:'',intake:'',intakeTxt:'',eventsTxt:'',find:{},fu:{},open:new Set(),zside:'r'};
const ZVIEWS=['hand','knee','foot'];
const ALLERGY=[['nkda','No known allergies'],['penicillin','Penicillin'],['nsaid','NSAIDs or aspirin'],['latex','Latex'],['nuts','Nuts'],['plasters','Plasters or adhesives'],['other','Other']];
const INTAKE=[['lt1','Under 1 hour ago'],['h1_4','1\u20134 hours ago'],['gt4','Over 4 hours ago'],['unk','Unknown']];
const ptMeds=()=>App.patient?App.patient.meds:[];
// context implied by the patient's medicines (auto-ticked unless the user unticks it)
const medCtxAll=()=>{const m=new Map();ptMeds().forEach(n=>BODYMAP.medCtx(n).forEach(id=>{if(!m.has(id))m.set(id,[]);m.get(id).push(n);}));return m;};
function syncMedCtx(){medCtxAll().forEach((meds,id)=>{if(!st.ctx.includes(id)&&!st.ctxOff.includes(id))st.ctx.push(id);});}
const ctxAll=()=>[st.age,st.dur,...st.ctx].filter(Boolean);
const INJ=['fall_stand','fall_height','rtc','assault','head_hit','sport','crush','stab','burn'];
// injury and trigger answers in Context also count as the matching symptoms
const effFeats=()=>{const f=new Set(st.feats);if(st.ctx.some(k=>INJ.includes(k)))f.add('trauma');if(st.ctx.some(k=>['newmed','allergen','bite'].includes(k)))f.add('trigger');return [...f];};
const HIDEF=new Set(['trauma','trigger']);
const ctxLabel=id=>{for(const g of BODYMAP.CTX)for(const [k,l] of g[3])if(k===id)return l;return id;};
const termMode=()=>App.settings.bmterms||'common';
const term=r=>r?BODYMAP.medTerm(r[2],r[3],termMode()):'';
function ctxBoost(c){const cx=ctxAll();let b=0;const why=[];BODYMAP.CXR.forEach(([id,re,conds,w])=>{if(!cx.includes(id))return;if(re.test(c.t)||(c.cond&&conds.includes(c.cond))){b+=w;if(w>0&&!why.includes(ctxLabel(id)))why.push(ctxLabel(id));}});return {b,why};}
const centre=s=>s.r?[s.r[0]+s.r[2]/2,s.r[1]+s.r[3]/2]:s.e?[s.e[0],s.e[1]]:(()=>{const p=s.p.split(' ').map(q=>q.split(',').map(Number));return [p.reduce((a,q)=>a+q[0],0)/p.length,p.reduce((a,q)=>a+q[1],0)/p.length];})();
const labels=(list,fs,minX,maxX)=>{const placed=[];return list.filter(r=>st.sel.includes(r[0])).map(r=>{let [x,y]=centre(r[4]);const t=term(r);if(!t)return '';const w=t.length*fs*0.52;const cx=Math.min(maxX-w/2,Math.max(minX+w/2,x));
  let guard=0;while(guard++<8&&placed.some(p=>Math.abs(p.y-y)<fs*1.25&&Math.abs(p.x-cx)<(p.w+w)/2))y+=fs*1.3;placed.push({x:cx,y,w});
  return `<text x="${cx.toFixed(1)}" y="${(y+fs*0.35).toFixed(1)}" text-anchor="middle" class="bm-term" style="font-size:${fs}px">${esc(t)}</text>`;}).join('');};
const ALL=()=>BODYMAP.FRONT.concat(BODYMAP.BACK,BODYMAP.HEAD,BODYMAP.ZREG);
const reg=id=>ALL().find(r=>r[0]===id);
const featLabel=id=>{for(const g of BODYMAP.FEATS)for(const [k,l] of g[2])if(k===id)return l;return id;};
const shape=(s,cls,attrs)=>s.r?`<rect x="${s.r[0]}" y="${s.r[1]}" width="${s.r[2]}" height="${s.r[3]}" rx="4" class="${cls}" ${attrs}/>`:s.e?`<ellipse cx="${s.e[0]}" cy="${s.e[1]}" rx="${s.e[2]}" ry="${s.e[3]}" class="${cls}" ${attrs}/>`:`<polygon points="${s.p}" class="${cls}" ${attrs}/>`;
const SYM_FOR={tophead:'headache',forehead:'headache',temple:'headache',occiput:'headache',eye:'eye',ear:'headache',cheek:'headache',jaw:'chest-pain',mouth:'allergy',throat:'sore-throat',neckside:'headache',neckback:'headache',
 chestc:'chest-pain',chestside:'chest-pain',shoulder:'chest-pain',upperback:'back-pain',scapula:'back-pain',midback:'back-pain',loin:'back-pain',lowback:'back-pain',tailbone:'back-pain',buttock:'back-pain',
 epi:'abdo-pain',ruq:'abdo-pain',luq:'abdo-pain',flank:'abdo-pain',umb:'abdo-pain',rlq:'abdo-pain',llq:'abdo-pain',supra:'urinary',groin:'abdo-pain',genitals:'urinary',hip:'fall',
 thigh:'leg-swelling',hthigh:'leg-swelling',ithigh:'leg-swelling',thumb:'fall',finger:'fall',snuffbox:'fall',palm:'fall',thumbbase:'fall',handback:'fall',knuckle:'fall',wristrad:'fall',wristuln:'fall',patella:'fall',kneemed:'fall',kneelat:'fall',kneebelow:'fall',kneeabove:'fall',latmall:'fall',medmall:'fall',mt5:'fall',navic:'fall',bigtoe:'fall',toes:'fall',footdorsum:'fall',arch:'fall',popliteal:'leg-swelling',calf:'leg-swelling',shin:'leg-swelling',knee:'fall',ankle:'fall',foot:'fall',heel:'fall',sole:'fall',upperarm:'fall',elbow:'fall',forearm:'fall',wrist:'fall',hand:'fall',nose:'bleeding'};

function headSVG(){return `<svg class="dg bm" viewBox="0 0 240 270" role="group" aria-label="Head and neck: tap areas of pain">
  <path class="ol" d="M88,196L84,268H156L152,196Z"/>
  <ellipse class="ol" cx="42" cy="118" rx="11" ry="25"/><ellipse class="ol" cx="198" cy="118" rx="11" ry="25"/>
  <ellipse class="ol" cx="120" cy="112" rx="72" ry="90"/>
  <g class="bm-face"><path d="M80,96Q95,90 110,96M130,96Q145,90 160,96"/><path d="M80,107Q95,99 110,107Q95,114 80,107ZM130,107Q145,99 160,107Q145,114 130,107Z"/>
  <path d="M120,112L114,142Q120,148 126,142"/><path d="M103,166Q120,174 137,166"/></g>
  ${BODYMAP.HEAD.map(([id,label,,,s])=>shape(s,'bm-r'+(st.sel.includes(id)?' on':''),`data-rg="${id}" role="button" tabindex="0" aria-pressed="${st.sel.includes(id)}" aria-label="${esc(label)}"`)).join('')}
  ${labels(BODYMAP.HEAD,9,6,234)}
  <text x="10" y="20" class="side">R</text><text x="230" y="20" class="side" text-anchor="end">L</text></svg>`;}
function bodySVG(){const list=st.view==='front'?BODYMAP.FRONT:BODYMAP.BACK;const [a,b]=st.view==='front'?['R','L']:['L','R'];
  return `<svg class="dg bm" viewBox="60 0 240 420" role="group" aria-label="${st.view} body: tap areas of pain">
  <g transform="translate(0,6)">${DG.BODY}
  ${st.view==='back'?'<path class="bm-spine" d="M180,70V226"/>':'<path class="bm-guide" d="M143,130H217M143,158H217M143,186H217M165,130V216M195,130V216"/>'}
  ${list.map(([id,label,type,,s])=>shape(s,'bm-r'+(type==='zoom'?' zoom':'')+(st.sel.includes(id)?' on':''),`data-rg="${id}" role="button" tabindex="0" aria-pressed="${st.sel.includes(id)}" aria-label="${esc(label)}"`)).join('')}
  ${labels(list,7.5,62,298)}
  </g>${st.view==='front'?'<text x="180" y="50" text-anchor="middle" class="bm-zoomtxt">tap</text>':''}<text x="72" y="24" class="side">${a}</text><text x="288" y="24" class="side" text-anchor="end">${b}</text></svg>`;}

function zoomSVG(view){const z=BODYMAP.ZOOM[view],side=st.zside,list=BODYMAP.ZREG.filter(r=>r[5]===view&&r[3]===side);
  const out=z.outline.map((o,i)=>{const pn=z.panels[i];return (side==='l'&&z.mirror)?`<g transform="translate(${pn[0]+pn[1]},0) scale(-1,1)">${o}</g>`:o;}).join('');
  const [,,W,H]=z.vb.split(' ').map(Number);
  return `<svg class="dg bm zoomv" viewBox="${z.vb}" role="group" aria-label="${esc(z.t)} close-up, ${side==='r'?'right':'left'}: tap areas of pain">${out}
  ${list.map(([id,label,,,s])=>shape(s,'bm-r'+(st.sel.includes(id)?' on':''),`data-rg="${id}" role="button" tabindex="0" aria-pressed="${st.sel.includes(id)}" aria-label="${esc(label)}"`)).join('')}
  ${z.panels.map(([x0,x1,l])=>`<text x="${(x0+x1)/2}" y="${H-3}" text-anchor="middle" class="zpanel">${esc(l)}</text>`).join('')}
  ${labels(list,8,4,W-4)}</svg>`;}
const grpOf=id=>{const r=reg(id);return r?BODYMAP.FUMAP[r[2]]:null;};
const qsFor=id=>BODYMAP.FU[grpOf(id)]||[];
const findLabel=f=>(BODYMAP.FIND.find(x=>x[0]===f)||[f,f])[1];
// boosts from answers and findings, applied only to causes listed for that area
function detailBoost(e){let b=0;const tags=[];const used=new Set();const hay=e.t+' '+(e.cond||'');
  e.regs.forEach(rid=>{(st.find[rid]||[]).forEach(f=>{if(used.has('f'+f))return;const fr=BODYMAP.FINDR[f];if(fr&&fr[0].test(hay)){b+=fr[1];used.add('f'+f);tags.push(findLabel(f));}});
    const ans=st.fu[rid]||{};qsFor(rid).forEach(([qid,,tag,yes,no])=>{const a=ans[qid];if(!a||used.has('q'+qid))return;
      (a==='y'?yes:no).forEach(([re,w])=>{if(re.test(hay)){b+=w;used.add('q'+qid);if(w>0)tags.push(tag+(a==='y'?'':': no'));}});});});
  return {b,tags};}
const hasDetail=()=>st.sel.some(id=>(st.find[id]||[]).length||Object.keys(st.fu[id]||{}).length);
function detailAlerts(){const out=[];st.sel.forEach(id=>{const ans=st.fu[id]||{};qsFor(id).forEach(q=>{const al=q[5];if(al&&ans[q[0]]===al.on)out.push(al);});
  (st.find[id]||[]).forEach(f=>{if(BODYMAP.FIND_ALERT[f])out.push(BODYMAP.FIND_ALERT[f]);});});return out;}
const ansText=id=>{const parts=(st.find[id]||[]).map(f=>findLabel(f).toLowerCase());const ans=st.fu[id]||{};
  qsFor(id).forEach(([qid,,tag])=>{if(ans[qid])parts.push(tag+': '+(ans[qid]==='y'?'yes':'no'));});return parts.join(', ');};
function areasHTML(){const ids=st.sel.filter(id=>{const r=reg(id);return r&&r[2]!=='zoom';});if(!ids.length)return '';
  return `<h3 class="sh" style="margin-top:14px">About each area <small>answers sharpen the causes</small></h3>`+ids.map(id=>{const r=reg(id),t=term(r),g=grpOf(id);
    const ans=st.fu[id]||{},fs=st.find[id]||[],n=Object.keys(ans).length+fs.length,zv=BODYMAP.ZOOM_FOR[r[2]];
    return `<details class="acard" data-aid="${id}"${st.open.has(id)?' open':''}><summary><span class="atitle"><b>${esc(r[1])}</b>${t?` <span class="mterm">\u00b7 ${esc(t)}</span>`:''}</span><span class="acount">${n?n+' answered':'tap to answer'}</span></summary>
    <p class="small muted ftg">What do you see?</p><div class="chips">${BODYMAP.findFor(g).map(f=>`<button class="chip" data-af="${id}|${f}" aria-pressed="${fs.includes(f)}">${esc(findLabel(f))}</button>`).join('')}</div>
    ${qsFor(id).length?`<p class="small muted ftg">Questions</p>${qsFor(id).map(([qid,q])=>`<div class="fqrow"><span>${esc(q)}</span><span class="yn"><button data-fq="${id}|${qid}|y" aria-pressed="${ans[qid]==='y'}">Yes</button><button data-fq="${id}|${qid}|n" aria-pressed="${ans[qid]==='n'}">No</button></span></div>`).join('')}`:''}
    ${zv&&!ZVIEWS.includes(r[5])?`<button class="btn block mt" data-zoomto="${zv}|${r[3]||'r'}">${I('search')}Close-up: ${esc(BODYMAP.ZOOM[zv].t.toLowerCase())}</button>`:''}</details>`;}).join('');}

function rankByArea(){
  const regs=st.sel.map(reg).filter(r=>r&&r[2]!=='zoom'), map=new Map();let order=0;
  regs.forEach(([rid,label,type,side])=>(BODYMAP.C[type]||[]).forEach(([t,cond,ser,fs,note,sex,cside])=>{
    if(cside&&side&&cside!==side)return;if(sex&&st.sex&&sex!==st.sex)return;
    const k=t.toLowerCase().replace(/\s*\(.*?\)/g,'').trim();if(!map.has(k))map.set(k,{t,cond,ser,note,sex,fs:new Set(),areas:[],regs:new Set(),ord:order++});
    const e=map.get(k);e.regs.add(rid);if(!e.areas.includes(label))e.areas.push(label);(fs||'').split(' ').filter(Boolean).forEach(f=>e.fs.add(f));if(ser)e.ser=1;if(note&&!e.note)e.note=note;}));
  const out=[...map.values()].map(e=>{let fsc=0;const fm=[];
    e.fs.forEach(f=>{const key=f[0]==='!',id=key?f.slice(1):f;if(effFeats().includes(id)){fsc+=key?3:1;fm.push(featLabel(id));}});
    const cb=ctxBoost(e),db=detailBoost(e);
    return Object.assign(e,{fm,cx:cb.why,dx:db.tags,score:e.areas.length*3+fsc+cb.b+db.b,fsc});});
  out.sort((a,b)=>b.score-a.score||b.ser-a.ser||a.ord-b.ord);return out;}
function rankByFeatures(){
  const out=[];const ef=effFeats();const need=ef.length>1?2:1;
  BODYMAP.KB.forEach(([t,cond,ser,,feats,sex,note])=>{if(sex&&st.sex&&sex!==st.sex)return;
    const fm=ef.filter(f=>feats.includes(f));if(fm.length<need)return;const e={t,cond,ser,note,sex,areas:[],fm:fm.map(featLabel)};const cb=ctxBoost(e);e.cx=cb.why;e.score=fm.length*2+cb.b;if(e.score>0)out.push(e);});
  out.sort((a,b)=>b.score-a.score||b.ser-a.ser);return out;}

function results(){
  if(!st.sel.length&&!effFeats().length&&!ctxAll().length)return `<p class="empty">Tap where it hurts (tap the head for face and neck detail) and/or pick signs, symptoms and history.</p>`;
  const byArea=st.sel.some(id=>reg(id)&&reg(id)[2]!=='zoom');
  const ranked=byArea?rankByArea():rankByFeatures();
  const top=ranked.length?ranked[0].score:1;
  let strong=ranked.filter((c,i)=>i<6&&(effFeats().length||ctxAll().length||hasDetail()?c.score>=top*0.6:true));if(!strong.length)strong=ranked.slice(0,3);
  const rest=ranked.filter(c=>!strong.includes(c)).slice(0,14);
  // systemic causes that fit the symptoms strongly, even if not tied to the area
  const shown=new Set(ranked.map(c=>c.cond).filter(Boolean));
  const systemic=byArea&&effFeats().length>=3?rankByFeatures().filter(c=>c.ser&&c.fm.length>=3&&!(c.cond&&shown.has(c.cond))).slice(0,3):[];
  const pats=BODYMAP.PATTERNS.filter(p=>p.when(st.sel)).concat(BODYMAP.PATTERNS2.filter(p=>p.when(st.sel,effFeats())),BODYMAP.CPAT.filter(p=>p.when(st.sel,effFeats(),ctxAll())),detailAlerts());
  const seen=new Set();const pu=pats.filter(p=>!seen.has(p.t)&&seen.add(p.t));
  const sexTag=c=>c.sex&&!st.sex?(c.sex==='f'?'if female':'if male'):'';
  const row=c=>{const href=App.causeHref(c.t,c.cond);const pct=Math.max(15,Math.round(100*c.score/top));
    const inner=`<span class="chip-ic${c.ser?' red':''}">${I(c.ser?'alert':'stetho')}</span><span class="tx"><b>${esc(c.t)}</b>${c.note||sexTag(c)?`<span class="wrapt">${esc([c.note,sexTag(c)].filter(Boolean).join(' \u00b7 '))}</span>`:''}<span class="why">${[...c.areas,...c.fm].map(w=>`<i>${esc(w)}</i>`).join('')}${(c.dx||[]).map(w=>`<i class="dx">${esc(w)}</i>`).join('')}${(c.cx||[]).map(w=>`<i class="cx">${esc(w)}</i>`).join('')}</span><span class="mbar"><i style="width:${pct}%"></i></span></span>`;
    return href?`<a class="row" href="${href}">${inner}<span class="chev">${I('chev')}</span></a>`:`<button class="row" data-web="nhs" data-q="${esc(c.t.replace(/\(.*?\)/g,''))}">${inner}<span class="chev" title="Look up online">${I('external')}</span></button>`;};
  const syms=[...new Set(st.sel.map(id=>reg(id)&&SYM_FOR[reg(id)[2]]).filter(Boolean))];
  return `${pu.map(p=>`<div class="mb">${callout('red','alert',`<b>${esc(p.t)}.</b> ${esc(p.p)}${p.cond?` <a href="#/condition/${p.cond}">Open condition</a>`:''}`)}</div>`).join('')}
  ${strong.length?`<h3 class="sh">Most likely to consider <small>${byArea?'for '+(st.sel.length>1?'these areas':'this area'):'from symptoms'}</small></h3><div class="list">${strong.map(row).join('')}</div>`:`<p class="empty">No clear match. Add more symptoms, or look it up online.</p>`}
  ${byArea&&!hasDetail()?`<p class="small muted" style="margin:8px 2px">Answer the questions under <b>About each area</b> to narrow these down.</p>`:(!st.feats.length&&byArea?`<p class="small muted" style="margin:8px 2px">Pick signs, symptoms and history below the map to narrow these down.</p>`:'')}
  ${systemic.length?`<h3 class="sh">Also fits the symptoms</h3><div class="list">${systemic.map(row).join('')}</div>`:''}
  ${rest.length?App.acc(`Other possibilities (${rest.length})`,`<div class="list flat">${rest.map(row).join('')}</div>`,{icon:'list'}):''}
  ${App.compareLinks([...strong,...systemic].map(c=>App.causeCond(c.t,c.cond)))}
  <h3 class="sh">Ask about the pain (OPQRST)</h3><div class="card">${App.kv([['Onset','Sudden or gradual? What were they doing?'],['Provokes / palliates','Worse with movement, breathing, eating? Better with rest?'],['Quality','Sharp, dull, crushing, tearing, colicky, burning?'],['Radiation','Where does it spread? (Tap those areas too)'],['Severity','Score 0\u201310'],['Time','How long? Constant or coming in waves?']])}</div>
  ${syms.length?`<h3 class="sh">Symptom guides</h3><div class="chips">${syms.map(id=>{const y=SYMPTOMS.find(s=>s.id===id);return y?`<a class="chip sysch" href="#/symptom/${id}">${I('symptom')}${esc(y.n)}</a>`:'';}).join('')}</div>`:''}
  <div class="btnrow mt2"><button class="btn pri" id="bmsave">${I('plus')}Add to patient notes</button><button class="btn" id="bmclear">${I('x')}Clear all</button></div>
  <p class="small muted mt">Possible causes to consider, not a diagnosis. Always assess the whole patient, take full obs and escalate red flags.</p>`;}

function sampleText(){
  const areas=st.sel.map(id=>{const r=reg(id),t=term(r),a=ansText(id);return r[1]+(t?' ('+t+')':'')+(a?' ['+a+']':'');});
  const S=[areas.length?'Pain: '+areas.join(', '):'',st.feats.length?'Symptoms: '+st.feats.map(featLabel).join(', '):'',st.dur?'Duration: '+ctxLabel(st.dur):''].filter(Boolean).join('. ');
  const A=st.allergy.includes('nkda')?'No known allergies':[...st.allergy.filter(a=>a!=='other').map(a=>ALLERGY.find(x=>x[0]===a)[1]),st.allergyTxt.trim()].filter(Boolean).join(', ');
  const M=ptMeds().join(', ');
  const hx=st.ctx.filter(k=>k.startsWith('hx_')&&!['hx_anticoag','hx_immuno'].includes(k)).map(ctxLabel);
  const P=[hx.join(', '),st.pmh.trim()].filter(Boolean).join('. ');
  const L=[st.intake?INTAKE.find(x=>x[0]===st.intake)[1]:'',st.intakeTxt.trim()].filter(Boolean).join(': ');
  const grp=g=>st.ctx.filter(k=>BODYMAP.CTX.find(x=>x[0]===g)[3].some(i=>i[0]===k)).map(ctxLabel);
  const inj=grp('injury'),trg=grp('triggers'),before=grp('before');
  const E=[inj.length?'What happened: '+inj.join(', '):'',trg.length?'Possible triggers: '+trg.join(', '):'',before.length?'When it started: '+before.join(', '):'',st.dur?({dur_min:'Started minutes ago',dur_hrs:'Started hours ago',dur_days:'Started days ago',dur_wks:'Going on for weeks or keeps coming back'})[st.dur]:'',st.age?ctxLabel(st.age):'',st.eventsTxt.trim()].filter(Boolean).join('. ');
  return {S,A,M,P,L,E};}
function drawSample(){const w=App.$('#smcard');if(!w)return;const s=sampleText();
  const set=(id,v,empty)=>{const el=App.$(id);if(el)el.innerHTML=v?esc(v):`<span class="muted">${empty}</span>`;};
  set('#smS',s.S,'Pick areas and symptoms above');set('#smPauto',st.ctx.filter(k=>k.startsWith('hx_')&&!['hx_anticoag','hx_immuno'].includes(k)).map(ctxLabel).join(', '),'Tick past medical history in History above, or type below');
  set('#smEauto',s.E.replace(st.eventsTxt.trim(),'').replace(/\.\s*$/,''),'Tick what happened and how long in History above');
  App.$$('[data-al]').forEach(b=>b.setAttribute('aria-pressed',st.allergy.includes(b.dataset.al)));
  App.$$('[data-in]').forEach(b=>b.setAttribute('aria-pressed',st.intake===b.dataset.in));
  const mc=medCtxAll();
  App.$('#smMeds').innerHTML=ptMeds().length?ptMeds().map((n,i)=>{const cx=BODYMAP.medCtx(n);return `<span class="chip on">${esc(n)}${cx.length?` <span class="mterm">\u00b7 ${esc(cx.map(ctxLabel).join(', '))}</span>`:''} <button class="chipx" data-mdel="${i}" aria-label="Remove ${esc(n)}">\u00d7</button></span>`;}).join(''):'<span class="small muted">No medicines recorded yet</span>';}
function sampleSave(){const s=sampleText();const p=App.pt();
  const merge=(k,v)=>{if(!v)return 0;const cur=(p.sample[k]||'').trim();if(cur.includes(v))return 0;p.sample[k]=cur?cur+'\n'+v:v;return 1;};
  let n=0;n+=merge('signs',s.S);n+=merge('allergies',s.A);n+=merge('past',s.P);n+=merge('last',s.L);n+=merge('events',s.E);
  if(!p.info.complaint&&st.sel.length)p.info.complaint=reg(st.sel[0])[1]+' pain';
  p.notes.push({t:Date.now(),text:'SAMPLE completed from the symptom checker'});App.savePatient();
  App.toast(n?'SAMPLE saved to the patient record':'Patient record already has this',2500);}
const sampleCard=()=>`<div class="card mt ftcard" id="smcard"><h3 class="sh" style="margin-top:0">SAMPLE <small>for your handover</small></h3>
  <div class="smrow"><b class="sml">S</b><div><p class="small muted smh">Signs and symptoms (from above)</p><p class="smv" id="smS"></p></div></div>
  <div class="smrow"><b class="sml">A</b><div><p class="small muted smh">Allergies</p><div class="chips">${ALLERGY.map(([k,l])=>`<button class="chip" data-al="${k}" aria-pressed="false">${l}</button>`).join('')}</div>
    <input class="sminput" id="smA" placeholder="Other allergies or reactions" value="${esc(st.allergyTxt)}"></div></div>
  <div class="smrow"><b class="sml">M</b><div><p class="small muted smh">Medications (patient record)</p><div class="chips" id="smMeds"></div>
    <div class="smadd"><input class="sminput" id="smMadd" placeholder="Add a medicine by name"><button class="btn" id="smMbtn">${I('plus')}Add</button></div>
    <div class="btnrow"><a class="btn" href="#/scan">${I('camera')}Scan a medicine</a><a class="btn" href="#/meds">${I('search')}Find</a></div>
    <p class="small muted" style="margin:6px 0 0">Recognised medicines tick the matching past medical history automatically.</p></div></div>
  <div class="smrow"><b class="sml">P</b><div><p class="small muted smh">Past medical history</p><p class="smv" id="smPauto"></p><textarea class="sminput" id="smP" rows="2" placeholder="Anything else: operations, other conditions">${esc(st.pmh)}</textarea></div></div>
  <div class="smrow"><b class="sml">L</b><div><p class="small muted smh">Last oral intake</p><div class="chips">${INTAKE.map(([k,l])=>`<button class="chip" data-in="${k}" aria-pressed="false">${l}</button>`).join('')}</div>
    <input class="sminput" id="smL" placeholder="What did they have? e.g. tea and toast" value="${esc(st.intakeTxt)}"></div></div>
  <div class="smrow"><b class="sml">E</b><div><p class="small muted smh">Events leading up (from History)</p><p class="smv" id="smEauto"></p><textarea class="sminput" id="smE" rows="2" placeholder="Anything else about what happened">${esc(st.eventsTxt)}</textarea></div></div>
  <button class="btn pri block mt" id="smsave">${I('check')}Save SAMPLE to patient record</button>
  <p class="small muted" style="margin:6px 0 0">Adds to the SAMPLE boxes in the Patient record without overwriting what\u2019s already there.</p></div>`;

function draw(){
  const zv=ZVIEWS.includes(st.view);
  App.$('#bmsvg').innerHTML=st.view==='head'?headSVG():zv?zoomSVG(st.view):bodySVG();
  App.$('#bmhint').textContent=st.view==='head'?'Head and neck: tap the exact area':zv?(st.zside==='r'?'Right ':'Left ')+BODYMAP.ZOOM[st.view].t.toLowerCase()+': tap the exact spot':st.view==='front'?'Front: tap the head for face and neck detail':'Back of the body';
  App.$('#bmzside').hidden=!zv;App.$$('[data-zs]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.zs===st.zside));
  App.$('#bmareas').innerHTML=areasHTML();
  App.$('#bmsel').innerHTML=st.sel.length?st.sel.map(id=>{const r=reg(id),t=term(r);return `<button class="chip on" data-unsel="${id}" aria-label="Remove ${esc(r[1])}">${esc(r[1])}${t?` <span class="mterm">\u00b7 ${esc(t)}</span>`:''} \u00d7</button>`;}).join(''):'<span class="small muted">No areas selected</span>';
  const mc=medCtxAll();App.$$('[data-cx]').forEach(b=>{const k=b.dataset.cx;b.setAttribute('aria-pressed',st.age===k||st.dur===k||st.ctx.includes(k));b.classList.toggle('frommed',mc.has(k)&&st.ctx.includes(k));b.title=mc.has(k)?'From medicines: '+mc.get(k).join(', '):'';});
  drawSample();
  const cc=App.$('#cxcount');if(cc)cc.textContent=ctxAll().length?ctxAll().length+' selected':'';
  App.$$('[data-ft]').forEach(b=>b.setAttribute('aria-pressed',st.feats.includes(b.dataset.ft)));
  const fc=App.$('#ftcount');if(fc)fc.textContent=st.feats.length?st.feats.length+' selected':'';
  App.$('#bmres').innerHTML=results();
  App.$$('[data-view]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.view===st.view));App.$$('[data-zv]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.zv===st.view));
  App.$$('[data-tm]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.tm===termMode()));
  App.$$('[data-sex]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.sex===st.sex));
  const s=App.$('#bmsave');if(s)s.onclick=()=>{const p=App.pt();p.notes.push({t:Date.now(),text:[st.sel.length?'Pain location: '+st.sel.map(id=>{const r=reg(id),t=term(r),a=ansText(id);return r[1]+(t?' ('+t+')':'')+(a?' ['+a+']':'');}).join('; '):'',st.feats.length?'Symptoms: '+st.feats.map(featLabel).join(', '):'',ctxAll().length?'Context: '+ctxAll().map(ctxLabel).join(', '):''].filter(Boolean).join('. ')});App.savePatient();App.toast('Added to patient notes');};
  const c=App.$('#bmclear');if(c)c.onclick=()=>{st.sel=[];st.feats=[];st.ctx=[];st.age='';st.dur='';st.ctxOff=[];st.find={};st.fu={};st.open=new Set();syncMedCtx();draw();};}
const toggle=id=>{const r=reg(id);if(r&&r[2]==='zoom'){st.view='head';draw();return;}const i=st.sel.indexOf(id);if(i>-1){st.sel.splice(i,1);delete st.find[id];delete st.fu[id];st.open.delete(id);}else{st.sel.push(id);st.open=new Set([id]);}App.native.haptic();draw();};

App.onClear(()=>{Object.assign(st,{sel:[],feats:[],ctx:[],age:'',dur:'',ctxOff:[],allergy:[],allergyTxt:'',pmh:'',intake:'',intakeTxt:'',eventsTxt:'',find:{},fu:{},open:new Set()});});
App.route('/bodymap',{title:'Pain & symptom checker',tab:'#/assess',render(){return `<div id="bmwrap">
  <p class="lede" style="margin-bottom:10px">Tap exactly where it hurts, then add signs, symptoms and history. Causes are ranked for those areas.</p>
  <div class="seg" role="group" aria-label="View"><button data-view="front">Front</button><button data-view="back">Back</button><button data-view="head">Head &amp; neck</button></div>
  <div class="seg zoomseg" role="group" aria-label="Close-up views"><span class="small muted">Close-up</span><button data-zv="hand">Hand &amp; wrist</button><button data-zv="knee">Knee</button><button data-zv="foot">Ankle &amp; foot</button></div>
  <div class="seg zoomseg" id="bmzside" role="group" aria-label="Which side" hidden><button data-zs="r">Right</button><button data-zs="l">Left</button></div>
  <p class="small muted center" id="bmhint" style="margin:8px 0 0"></p>
  <div class="bmfig" id="bmsvg"></div>
  <div class="seg bmterms" role="group" aria-label="Area labels"><span class="small muted">Labels</span><button data-tm="common">Common</button><button data-tm="full">Medical</button><button data-tm="off">Off</button></div>
  <div class="chips" id="bmsel" aria-live="polite"></div>
  <div id="bmareas"></div>
  <div class="card mt ftcard"><h3 class="sh" style="margin-top:0">Signs &amp; symptoms <small id="ftcount"></small></h3>${BODYMAP.FEATS.map(([gid,gl,items])=>`<p class="small muted ftg">${esc(gl)}</p><div class="chips">${items.filter(([k])=>!HIDEF.has(k)).map(([k,l])=>`<button class="chip" data-ft="${k}" aria-pressed="false">${esc(l)}</button>`).join('')}</div>`).join('')}</div>
  <div class="card mt ftcard"><h3 class="sh" style="margin-top:0">History <small id="cxcount"></small></h3><p class="small muted" style="margin:-4px 0 0">Background, what happened and past medical history. Helps narrow down the cause.</p>${BODYMAP.CTX.map(([gid,gl,mode,items])=>`<p class="small muted ftg">${esc(gl)}${mode==='one'?'':' (pick any)'}</p><div class="chips">${items.map(([k,l])=>`<button class="chip" data-cx="${k}" data-cxg="${gid}" aria-pressed="false">${esc(l)}</button>`).join('')}</div>`).join('')}</div>
  <div class="seg mt" role="group" aria-label="Sex (optional)"><button data-sex="">Sex not specified</button><button data-sex="f">Female</button><button data-sex="m">Male</button></div>
  <div id="bmres" class="mt"></div>
  ${sampleCard()}${scope()}</div>`;},
  after(){const w=App.$('#bmwrap');
    w.addEventListener('click',e=>{const r=e.target.closest('[data-rg]');if(r){toggle(r.dataset.rg);return;}
      const u=e.target.closest('[data-unsel]');if(u){toggle(u.dataset.unsel);return;}
      const v=e.target.closest('[data-view]');if(v){st.view=v.dataset.view;draw();return;}
      const zvb=e.target.closest('[data-zv]');if(zvb){st.view=zvb.dataset.zv;draw();return;}
      const zs=e.target.closest('[data-zs]');if(zs){st.zside=zs.dataset.zs;draw();return;}
      const zt=e.target.closest('[data-zoomto]');if(zt){const [v2,s2]=zt.dataset.zoomto.split('|');st.view=v2;st.zside=s2;draw();App.$('#bmsvg').scrollIntoView({behavior:'smooth',block:'center'});return;}
      const af=e.target.closest('[data-af]');if(af){const [rid,f]=af.dataset.af.split('|');const a=st.find[rid]=st.find[rid]||[];const i=a.indexOf(f);if(i>-1)a.splice(i,1);else a.push(f);st.open.add(rid);App.native.haptic();draw();return;}
      const fq=e.target.closest('[data-fq]');if(fq){const [rid,q,a]=fq.dataset.fq.split('|');const m=st.fu[rid]=st.fu[rid]||{};if(m[q]===a)delete m[q];else m[q]=a;st.open.add(rid);App.native.haptic();draw();return;}
      const tm=e.target.closest('[data-tm]');if(tm){App.settings.bmterms=tm.dataset.tm;App.saveSettings();draw();return;}
      const ft=e.target.closest('[data-ft]');if(ft){const i=st.feats.indexOf(ft.dataset.ft);if(i>-1)st.feats.splice(i,1);else st.feats.push(ft.dataset.ft);App.native.haptic();draw();return;}
      const cx=e.target.closest('[data-cx]');if(cx){const k=cx.dataset.cx,g=cx.dataset.cxg;if(g==='age')st.age=st.age===k?'':k;else if(g==='dur')st.dur=st.dur===k?'':k;else{const i=st.ctx.indexOf(k);if(i>-1){st.ctx.splice(i,1);if(!st.ctxOff.includes(k))st.ctxOff.push(k);}else{st.ctx.push(k);st.ctxOff=st.ctxOff.filter(x=>x!==k);}}
        if(k==='hx_preg'&&st.ctx.includes('hx_preg')&&!st.sex)st.sex='f';App.native.haptic();draw();return;}
      const s=e.target.closest('[data-sex]');if(s){st.sex=s.dataset.sex;draw();}});
    w.addEventListener('click',e=>{const a=e.target.closest('[data-al]');if(a){const k=a.dataset.al;if(k==='nkda')st.allergy=st.allergy.includes('nkda')?[]:['nkda'];else{st.allergy=st.allergy.filter(x=>x!=='nkda');const i=st.allergy.indexOf(k);if(i>-1)st.allergy.splice(i,1);else st.allergy.push(k);}drawSample();return;}
      const n=e.target.closest('[data-in]');if(n){st.intake=st.intake===n.dataset.in?'':n.dataset.in;drawSample();return;}
      const d=e.target.closest('[data-mdel]');if(d){const p=App.pt();const name=p.meds[+d.dataset.mdel];p.meds.splice(+d.dataset.mdel,1);App.savePatient();
        BODYMAP.medCtx(name).forEach(id=>{if(!medCtxAll().has(id))st.ctx=st.ctx.filter(x=>x!==id);});draw();return;}
      if(e.target.closest('#smMbtn')){const i=App.$('#smMadd');const v=i.value.trim();if(!v)return;const m=BODYMAP.findMed(v);const name=m?m[0]:v;const p=App.pt();if(!p.meds.includes(name))p.meds.push(name);App.savePatient();i.value='';syncMedCtx();draw();
        const cx=BODYMAP.medCtx(name);if(cx.length)App.toast(`${name}: ticked ${cx.map(ctxLabel).join(', ')}`,2500);return;}
      if(e.target.closest('#smsave'))sampleSave();});
    w.addEventListener('input',e=>{const t=e.target;if(t.id==='smA')st.allergyTxt=t.value;else if(t.id==='smP')st.pmh=t.value;else if(t.id==='smL')st.intakeTxt=t.value;else if(t.id==='smE')st.eventsTxt=t.value;});
    w.addEventListener('keydown',e=>{if(e.target.id==='smMadd'&&e.key==='Enter'){App.$('#smMbtn').click();}});
    syncMedCtx();
    w.addEventListener('toggle',e=>{const d=e.target;if(d.matches&&d.matches('details.acard')){if(d.open)st.open.add(d.dataset.aid);else st.open.delete(d.dataset.aid);}},true);
    w.addEventListener('keydown',e=>{const r=e.target.closest('[data-rg]');if(r&&(e.key==='Enter'||e.key===' ')){e.preventDefault();toggle(r.dataset.rg);}});
    draw();}});
})();
