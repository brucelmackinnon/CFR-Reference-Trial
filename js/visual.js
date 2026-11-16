// Visual lookup screen: pick the type, tick what you can see, get ranked possible causes.
(function(){
const {esc,callout,ticks,scope}=App;
const st={type:'',feats:[]};
const featLabel=id=>{for(const [,items] of VISUAL.FEATS)for(const [k,l] of items)if(k===id)return l;return id;};
const typeLabel=id=>(VISUAL.TYPES.find(t=>t[0]===id)||['','Any'])[1];
const visible=(types)=>types==='*'||!st.type||types.includes(st.type);

const photos=()=>(window.ILLUS||[]).filter(m=>m.sys==='visual'&&App.illus&&App.illus.have[m.id]);
const photoCard=m=>{const h=App.illus.have[m.id];return `<button class="vphoto${m.graphic?' graphic':''}" data-ill="${m.id}" aria-label="View photo: ${esc(m.cap)}"><img src="${esc(App.illusSrc(h))}" alt="" loading="lazy">${m.graphic?`<span class="gwarn">${I('alert')}Graphic: tap to view</span>`:''}<span class="vcap">${esc(m.cap)}</span></button>`;};
function results(){
  if(!st.type&&!st.feats.length)return `<p class="empty">Choose what you\u2019re looking at, then tick everything you can see.</p>`;
  const ranked=[];
  VISUAL.K.forEach(([t,cond,ser,types,feats,note])=>{
    if(st.type&&!types.includes(st.type))return;
    let score=0;const why=[];
    feats.forEach(f=>{const key=f[0]==='!',id=key?f.slice(1):f;if(st.feats.includes(id)){score+=key?3:1;why.push(featLabel(id));}});
    if(!score)return;ranked.push({t,cond,ser,note,why,score});});
  ranked.sort((a,b)=>b.score-a.score||b.ser-a.ser);
  const top=ranked.length?ranked[0].score:1;
  const pats=VISUAL.PAT.filter(p=>p.when(st.type,st.feats));
  const row=c=>{const href=App.causeHref(c.t,c.cond);const pct=Math.max(18,Math.round(100*c.score/top));
    const inner=`<span class="chip-ic${c.ser?' red':''}">${I(c.ser?'alert':'stetho')}</span><span class="tx"><b>${esc(c.t)}</b><span class="wrapt">${esc(c.note||'')}</span><span class="why">${c.why.map(w=>`<i>${esc(w)}</i>`).join('')}</span><span class="mbar"><i style="width:${pct}%"></i></span></span>`;
    return href?`<a class="row" href="${href}">${inner}<span class="chev">${I('chev')}</span></a>`:`<div class="row" style="align-items:flex-start">${inner}</div>`;};
  const figs=st.type?VISUAL.FIGS[st.type]:null;
  const figHTML=figs?[...(figs.ill||[]).map(id=>App.illusFig?App.illusFig(id):''),...(figs.dg||[]).map(k=>App.fig(k))].filter(Boolean).slice(0,2).join(''):'';
  const photoTerms=[...new Set(ranked.slice(0,4).map(r=>r.t.replace(/\(.*?\)/g,'').trim()))];
  const all=photos();const used=new Set();const matched=[];
  ranked.forEach(r=>all.forEach(m=>{if(!used.has(m.id)&&(m.causes||[]).includes(r.t)){used.add(m.id);matched.push(m);}}));
  const typeGallery=st.type?all.filter(m=>(m.vt||[]).includes(st.type)&&!used.has(m.id)):[];
  const noPack=App.illusAvailable&&App.illusAvailable()&&!all.length;
  return `${pats.map(p=>`<div class="mb">${callout('red','alert',`<b>${esc(p.t)}.</b> ${esc(p.p)}${p.cond?` <a href="#/condition/${p.cond}">Open condition</a>`:''}`)}</div>`).join('')}
  ${ranked.length?`<h3 class="sh">Possible causes <small>best match first</small></h3><div class="list">${ranked.slice(0,10).map(row).join('')}</div>`:(st.feats.length?`<p class="empty">No strong match. Add more of what you can see, or look it up online.</p>`:'')}
  ${matched.length?`<h3 class="sh">Compare with photos <small>for these causes</small></h3><div class="vstrip">${matched.slice(0,8).map(photoCard).join('')}</div>`:''}
  ${noPack&&(st.type||ranked.length)?`<a class="callout info illban" href="#/settings?focus=illus" style="text-decoration:none;color:inherit;margin-top:12px">${I('image')}<div><b>Example photos available</b><br><span class="small">Download the free illustration and photo pack in Settings to compare with real clinical photos here, offline.</span></div></a>`:''}
  ${App.compareLinks(ranked.slice(0,6).map(c=>App.causeCond(c.t,c.cond)))}
  ${st.type?`<h3 class="sh">What you can do</h3><div class="card">${ticks(VISUAL.DO[st.type])}</div>`:''}
  ${typeGallery.length?`<h3 class="sh">More ${esc(typeLabel(st.type).toLowerCase())} photos</h3><div class="vstrip">${typeGallery.map(photoCard).join('')}</div>`:''}
  ${figHTML?`<h3 class="sh">Reference</h3>${figHTML}`:''}
  ${st.type&&App.imgSection?App.imgSection('visual:'+st.type,'main').replace('My images','My reference pictures'):''}
  ${photoTerms.length?`<section class="mono web mt2"><h3>${I('image')}See real photo examples</h3><div class="mb-body"><p class="small muted" style="margin-top:0">Compare with clinical photos online. Images may be graphic. Needs internet.</p>
    <div class="list flat">${photoTerms.map(t=>`<button class="row" data-web="dermnet" data-q="${esc(t)}"><span class="chip-ic">${I('image')}</span><span class="tx"><b>${esc(t)}</b><span>DermNet clinical photo library</span></span><span class="chev">${I('external')}</span></button>`).join('')}
    <button class="row" data-web="images" data-q="${esc(photoTerms[0])}"><span class="chip-ic">${I('search')}</span><span class="tx"><b>Image search: ${esc(photoTerms[0])}</b><span>Google Images</span></span><span class="chev">${I('external')}</span></button></div></div></section>`:''}
  <div class="btnrow mt2"><button class="btn pri" id="vlsave">${I('plus')}Add to patient notes</button><button class="btn" id="vlclear">${I('x')}Clear</button></div>
  ${callout('amber','alert','Don\u2019t photograph patients on your personal phone unless SCAS policy allows it. Describe what you see in your notes and handover instead.')}
  <p class="small muted mt">Possible causes to consider, not a diagnosis. Always assess the whole patient and escalate red flags.</p>`;}

function draw(){
  App.$$('[data-vt]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.vt===st.type));
  App.$('#vlfeats').innerHTML=VISUAL.FEATS.map(([g,items])=>{const vis=items.filter(([,,types])=>visible(types));
    return vis.length?`<p class="small muted ftg">${esc(g)}</p><div class="chips">${vis.map(([k,l])=>`<button class="chip" data-vf="${k}" aria-pressed="${st.feats.includes(k)}">${esc(l)}</button>`).join('')}</div>`:'';}).join('');
  App.$('#vlres').innerHTML=results();
  const s=App.$('#vlsave');if(s)s.onclick=()=>{const p=App.pt();p.notes.push({t:Date.now(),text:`${typeLabel(st.type)}: ${st.feats.map(featLabel).join(', ')||'no features recorded'}`});App.savePatient();App.toast('Added to patient notes');};
  const c=App.$('#vlclear');if(c)c.onclick=()=>{st.type='';st.feats=[];draw();};}

App.onClear(()=>{st.type='';st.feats=[];});
App.route('/visual',{title:'Visual lookup',tab:'#/assess',render(){return `<div id="vlwrap">
  <p class="lede" style="margin-bottom:10px">What does it look like? Pick the type, then tick everything you can see.</p>
  <div class="vtypes">${VISUAL.TYPES.map(([id,l,ic])=>`<button class="vtype" data-vt="${id}" aria-pressed="false">${I(ic)}<span>${esc(l)}</span></button>`).join('')}</div>
  <div class="card mt ftcard" id="vlfeats"></div>
  <div id="vlres" class="mt"></div>${scope()}</div>`;},
  after(){App.$('#vlwrap').addEventListener('click',e=>{
    const t=e.target.closest('[data-vt]');if(t){st.type=st.type===t.dataset.vt?'':t.dataset.vt;st.feats=st.feats.filter(f=>{for(const [,items] of VISUAL.FEATS)for(const [k,,types] of items)if(k===f)return visible(types);return false;});App.native.haptic();draw();return;}
    const f=e.target.closest('[data-vf]');if(f){const i=st.feats.indexOf(f.dataset.vf);if(i>-1)st.feats.splice(i,1);else st.feats.push(f.dataset.vf);App.native.haptic();draw();}});draw();}});
})();
