// My conditions: add your own condition pages as you go, plus personal notes on any condition.
(function(){
const {esc,callout,scope}=App, LSK='cfr.myconds', NK='cfr.condnotes';
App.baseConds=window.CONDITIONS.slice();
App.myConds=App.LS.get(LSK,[]);
App.condNotes=App.LS.get(NK,{});
const norm=c=>Object.assign({pres:[],find:[],red:[],do:[],next:[],meds:[],comp:[],key:[],types:[],sym:[]},c,{mine:true,sid:(c.sid&&c.sid.length)?c.sid:['other']});
App.syncConds=()=>{CONDITIONS.length=0;CONDITIONS.push(...App.baseConds,...App.myConds.map(norm));if(App.resetIndex)App.resetIndex();};
App.saveMyConds=()=>{App.LS.set(LSK,App.myConds);App.syncConds();};
App.saveCondNotes=()=>App.LS.set(NK,App.condNotes);
App.syncConds();

/* ---------- extra blocks on every condition page ---------- */
App.condExtras=c=>{const note=App.condNotes[c.id]||'';
  return `<section class="mono mine"><h3>${I('edit')}My notes</h3><div class="mb-body"><textarea id="cnote" class="cnote" data-cid="${esc(c.id)}" placeholder="Add your own notes, local guidance or learning points. Saved on this phone.">${esc(note)}</textarea></div></section>
  ${App.imgSection?App.imgSection('cond:'+c.id,'main'):''}`;};
App.condHeadExtras=c=>c.mine?`<div class="btnrow mb"><a class="btn" href="#/mycond/edit/${esc(c.id)}">${I('edit')}Edit</a><button class="btn" id="cdel">${I('trash')}Delete</button></div>`:'';
document.addEventListener('input',e=>{const t=e.target.closest('#cnote');if(!t)return;const id=t.dataset.cid;if(t.value.trim())App.condNotes[id]=t.value;else delete App.condNotes[id];App.saveCondNotes();});
document.addEventListener('click',e=>{if(!e.target.closest('#cdel'))return;const id=decodeURIComponent((location.hash.split('/condition/')[1]||'').split('?')[0]);
  App.confirm('Delete this condition from your library?','Delete',()=>{App.myConds=App.myConds.filter(c=>c.id!==id);delete App.condNotes[id];App.saveCondNotes();
    App.imgs.filter(m=>m.sys==='cond:'+id).forEach(m=>{if(m.file&&window.CFRNative)window.CFRNative.deleteImage(m.file);});App.imgs=App.imgs.filter(m=>m.sys!=='cond:'+id);App.saveImgs();
    App.saveMyConds();App.toast('Condition deleted');App.go('#/conditions');});});

/* ---------- form ---------- */
const lines=v=>String(v||'').split('\n').map(s=>s.replace(/^[\u2022\-*]\s*/,'').trim()).filter(Boolean);
const toText=a=>(a||[]).join('\n');
const FIELDS=[['def','Definition','What is it, in a sentence or two',3,'p'],['types','Types','One per line, e.g. \u201cStable: settles with rest\u201d',3,'types'],['what','What\u2019s happening','What\u2019s going on in the body',3,'p'],
 ['pres','Presentation','One per line',4,'l'],['find','What you\u2019ll find','Obs and assessment findings, one per line',3,'l'],['red','Red flags','One per line',3,'l'],
 ['do','What you can do','Actions within your scope, one per line',3,'l'],['next','What happens next','Crew or hospital care, one per line',2,'l'],
 ['meds','Medicines you\u2019ll find at home','One per line: Class | examples | what it tells you',3,'meds'],['comp','Complications','One per line',2,'l'],['key','Key points','One per line',2,'l'],['src','Source','Where this came from, e.g. NHS website, NICE CKS, training notes',1,'p']];
function formHTML(c,isNew){const sysOpts=[['other','Other / not sure'],...SYSTEMS.map(s=>[s.id,s.n])];
  const val=(k,type)=>type==='types'?(c.types||[]).map(t=>t[0]+(t[1]?': '+t[1]:'')).join('\n'):type==='meds'?(c.meds||[]).map(m=>m.join(' | ')).join('\n'):type==='l'?toText(c[k]):(c[k]||'');
  return `<h2 class="pt">${isNew?'Add a condition':'Edit condition'}</h2><p class="lede">Only the name is needed; empty sections are hidden. You can add pictures after saving.</p>
  <div class="card stack">
  <label class="fld"><span>Name *</span><input id="f_n" value="${esc(c.n||'')}" placeholder="e.g. Addison\u2019s disease"></label>
  <label class="fld"><span>Body system</span><select id="f_sys">${sysOpts.map(([v,l])=>`<option value="${v}"${(c.sid||[])[0]===v?' selected':''}>${esc(l)}</option>`).join('')}</select></label>
  ${FIELDS.map(([k,l,ph,rows,type])=>`<label class="fld"><span>${l}</span>${rows===1?`<input id="f_${k}" value="${esc(val(k,type))}" placeholder="${esc(ph)}">`:`<textarea id="f_${k}" rows="${rows}" placeholder="${esc(ph)}">${esc(val(k,type))}</textarea>`}</label>`).join('')}
  </div><div class="btnrow mt"><button class="btn pri" id="fsave">${I('check')}Save</button><button class="btn" id="fcancel">Cancel</button></div>
  ${callout('info','info','Saved on this phone and included in your backup file (Settings \u203a My images \u203a Back up).')}`;}
function readForm(base){const g=id=>(App.$('#f_'+id)||{}).value||'';const c=Object.assign({},base);
  c.n=g('n').trim();const s=g('sys');c.sid=[s];c.def=g('def').trim();c.what=g('what').trim();c.src=g('src').trim();
  c.types=lines(g('types')).map(x=>{const i=x.indexOf(':');return i>0?[x.slice(0,i).trim(),x.slice(i+1).trim()]:[x,''];});
  c.meds=lines(g('meds')).map(x=>{const p=x.split('|').map(s=>s.trim());return [p[0]||'',p[1]||'',p[2]||''];});
  ['pres','find','red','do','next','comp','key'].forEach(k=>c[k]=lines(g(k)));c.updated=Date.now();return c;}
function bindForm(base,isNew){App.$('#fcancel').onclick=()=>history.back();
  App.$('#fsave').onclick=()=>{const c=readForm(base);if(!c.n){App.toast('Add a name first');App.$('#f_n').focus();return;}
    if(isNew){c.id='my_'+Date.now().toString(36);c.created=Date.now();App.myConds.push(c);}else{const i=App.myConds.findIndex(x=>x.id===base.id);if(i>-1)App.myConds[i]=c;}
    App.saveMyConds();App.toast('Saved to your conditions');location.replace('#/condition/'+c.id);};}
App.route('/mycond/new',{title:'Add a condition',tab:'#/lookup',render(a){return formHTML({n:a.n||''},true);},after(){bindForm({},true);}});
App.route('/mycond/edit/:id',{title:'Edit condition',tab:'#/lookup',render(a){const c=App.myConds.find(x=>x.id===a.id);return c?formHTML(c,false):'<p class="empty">Not found.</p>';},
  after(a){const c=App.myConds.find(x=>x.id===a.id);if(c)bindForm(c,false);}});
})();

/* ---------- Requested conditions: a list to send for writing up ---------- */
(function(){
const {esc}=App, WK='cfr.wishlist';
App.wish=App.LS.get(WK,[]);
App.saveWish=()=>App.LS.set(WK,App.wish);
App.addRequest=(name,note)=>{name=String(name||'').trim();if(!name)return false;
  if(App.wish.some(w=>w.n.toLowerCase()===name.toLowerCase())){App.toast('Already on your list');return false;}
  App.wish.push({n:name,note:note||'',t:Date.now()});App.saveWish();App.toast(`\u201c${name}\u201d added to requested conditions`,2500);return true;};
App.wishText=()=>'CFR Reference: conditions I\u2019d like added\n\n'+App.wish.map((w,i)=>`${i+1}. ${w.n}${w.note?' ('+w.note+')':''}`).join('\n');
App.route('/requests',{title:'Requested conditions',tab:'#/lookup',render(){return `<h2 class="pt">Requested conditions</h2>
  <p class="lede">Save conditions you\u2019d like full pages for. When you\u2019re ready, share the list and they\u2019ll be written up in the same format for the next update.</p>
  <div class="search"><input id="rq" placeholder="Condition name" aria-label="Condition name"><button class="iconbtn" id="radd" aria-label="Add">${I('plus')}</button></div>
  <div class="list mt" id="rlist">${App.wish.length?App.wish.map((w,i)=>`<div class="row"><span class="chip-ic">${I('stetho')}</span><span class="tx"><b>${esc(w.n)}</b><span>Added ${new Date(w.t).toLocaleDateString('en-GB')}${w.note?' \u00b7 '+esc(w.note):''}</span></span><button class="iconbtn" data-rdel="${i}" aria-label="Remove ${esc(w.n)}">${I('trash')}</button></div>`).join(''):'<p class="empty">No requests yet. Add them here, or from a search that finds nothing.</p>'}</div>
  ${App.wish.length?`<div class="btnrow mt"><button class="btn pri" id="rshare">${I('share')}Share list</button><button class="btn" id="rcopy">${I('copy')}Copy</button></div><button class="btn ghost block mt" id="rclear">${I('trash')}Clear list (after they\u2019ve been added)</button>`:''}
  ${App.callout('info','info','Share the list into your Claude chat (or email it to yourself). It\u2019s also saved in your backup file.')}`;},
  after(){const q=App.$('#rq'),add=()=>{if(App.addRequest(q.value))App.render();};
    App.$('#radd').onclick=add;q.addEventListener('keydown',e=>{if(e.key==='Enter')add();});
    App.$$('[data-rdel]').forEach(b=>b.onclick=()=>{App.wish.splice(+b.dataset.rdel,1);App.saveWish();App.render();});
    const s=App.$('#rshare');if(s)s.onclick=()=>App.native.share('Conditions to add',App.wishText());
    const c=App.$('#rcopy');if(c)c.onclick=()=>App.copy(App.wishText());
    const x=App.$('#rclear');if(x)x.onclick=()=>App.confirm('Clear the whole requested list?','Clear',()=>{App.wish=[];App.saveWish();App.render();});}});
})();
