// "My images": user-added pictures for body system sections, plus a pinch-zoom viewer.
(function(){
const {esc}=App, K='cfr.images';
App.imgs=App.LS.get(K,[]);
App.saveImgs=()=>{App.LS.set(K,App.imgs);if(App.resetIndex)App.resetIndex();};
App.imgSrc=m=>m.data||((window.CFRNative&&window.CFRNative.fileUrl)?window.CFRNative.fileUrl('userimages/'+m.file):'/userimages/'+m.file);
App.sysSections=sys=>{if(String(sys).startsWith('cond:'))return [['main','This condition']];if(String(sys).startsWith('visual:'))return [['main','This type']];const s=SYSTEMS.find(x=>x.id===sys);return s?App.tabsFor(s).filter(t=>t[0]!=='myimg'):[];};
App.secName=(sys,sec)=>(App.sysSections(sys).find(t=>t[0]===sec)||[sec,sec])[1];
App.imgsFor=(sys,sec)=>App.imgs.filter(m=>m.sys===sys&&(!sec||m.sec===sec)).sort((a,b)=>(a.ord??a.t)-(b.ord??b.t));

/* ---------- sheet helper ---------- */
App.sheet=(html,onMount)=>{const d=document.createElement('div');d.className='modal';d.setAttribute('role','dialog');d.setAttribute('aria-modal','true');
  d.innerHTML=`<div class="sheet">${html}</div>`;d.addEventListener('click',e=>{if(e.target===d)d.remove();});document.body.appendChild(d);if(onMount)onMount(d,()=>d.remove());return d;};

/* ---------- gallery blocks ---------- */
App.imgGrid=(list,sys)=>`<div class="igrid">${list.map(m=>`<button class="icell" data-img="${m.id}"><img src="${esc(App.imgSrc(m))}" alt="${esc(m.cap||'My image')}" loading="lazy"><span>${esc(m.cap||'No caption')}</span></button>`).join('')}</div>`;
App.imgSection=(sys,sec)=>{const list=App.imgsFor(sys,sec);
  return `<div class="myimgs"><h3 class="sh">My images <small>${list.length||''}</small></h3>${list.length?App.imgGrid(list,sys):''}<button class="btn ghost block" data-addimg="${sys}|${sec}">${I('plus')}Add image here</button></div>`;};
App.imgTab=sys=>{const secs=App.sysSections(sys);const all=App.imgsFor(sys);
  const groups=secs.map(([k,l])=>{const list=all.filter(m=>m.sec===k);return list.length?`<h3 class="sh">${esc(l)} <small>${list.length}</small></h3>${App.imgGrid(list,sys)}`:'';}).join('');
  return `<p class="lede">Add your own pictures, charts and notes to this system. They stay on this phone and appear in the section you choose.</p>
  <button class="btn pri block" data-addimg="${sys}|${secs[0]?secs[0][0]:'overview'}">${I('plus')}Add images</button>
  ${groups||`<p class="empty">No images yet.</p>`}
  <p class="small muted mt">Back up your images from Settings so they survive reinstalling the app.</p>`;};

/* ---------- adding ---------- */
let pending=null;
function chooseSource(sys,sec){
  App.sheet(`<p class="mmsg">Add an image</p><div class="stack">
    ${App.native.has?`<button class="btn pri block" data-src="cam">${I('camera')}Take a photo</button>`:''}
    <button class="btn block" data-src="gal">${I('image')}Choose from gallery</button>
    <button class="btn ghost block" data-src="x">Cancel</button></div>`,(d,close)=>{
    d.addEventListener('click',e=>{const b=e.target.closest('[data-src]');if(!b)return;close();if(b.dataset.src==='x')return;
      pending={sys,sec};
      if(App.native.has)window.CFRNative.pickImage(b.dataset.src==='cam');else browserPick();});});
}
function browserPick(){const inp=document.createElement('input');inp.type='file';inp.accept='image/*';inp.multiple=true;
  inp.onchange=async()=>{const files=[...inp.files].slice(0,20);const out=[];
    for(const f of files){out.push(await shrink(f));}
    App.onNative.image({status:'ok',files:out,failed:0});};inp.click();}
function shrink(file){return new Promise(res=>{const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const k=Math.min(1,1200/Math.max(im.width,im.height));const c=document.createElement('canvas');c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);c.getContext('2d').drawImage(im,0,0,c.width,c.height);res({data:c.toDataURL('image/jpeg',.82),w:c.width,h:c.height});};im.src=r.result;};r.readAsDataURL(file);});}
App.onNative.image=d=>{
  if(d.status==='processing'){App.toast(`Adding ${d.count} image${d.count>1?'s':''}…`,1500);return;}
  if(d.status==='cancelled'){pending=null;return;}
  if(d.status==='error'){App.toast(d.message||'Couldn\u2019t add the image',3500);pending=null;return;}
  if(d.status==='ok'&&pending){
    const now=Date.now();const added=(d.files||[]).map((f,i)=>({id:'u'+now+'_'+i,file:f.file,data:f.data,w:f.w,h:f.h,sys:pending.sys,sec:pending.sec,cap:'',t:now+i}));
    App.imgs.push(...added);App.saveImgs();pending=null;
    if(d.failed)App.toast(`${d.failed} image${d.failed>1?'s':''} couldn\u2019t be read`,3000);
    App.render();
    if(added.length===1)App.editImage(added[0].id,true);else if(added.length)App.toast(`${added.length} images added. Tap one to add a caption.`,3000);
  }
};

/* ---------- editing ---------- */
App.editImage=(id,isNew)=>{const m=App.imgs.find(x=>x.id===id);if(!m)return;const secs=App.sysSections(m.sys);
  App.sheet(`<p class="mmsg">${isNew?'Image added':'Edit image'}</p>
    <img class="iprev" src="${esc(App.imgSrc(m))}" alt="">
    <label class="fld mt"><span>Caption (searchable)</span><input id="icap" value="${esc(m.cap)}" placeholder="e.g. Cranial nerves chart"></label>
    <label class="fld mt"><span>Show in section</span><select id="isec">${secs.map(([k,l])=>`<option value="${k}"${k===m.sec?' selected':''}>${esc(l)}</option>`).join('')}</select></label>
    <div class="btnrow mt"><button class="btn" data-a="up" aria-label="Move earlier">↑</button><button class="btn" data-a="down" aria-label="Move later">↓</button><button class="btn" data-a="del">${I('trash')}Delete</button></div>
    <button class="btn pri block mt" data-a="save">${I('check')}Save</button>`,(d,close)=>{
    d.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(!b)return;const a=b.dataset.a;
      if(a==='save'){m.cap=d.querySelector('#icap').value.trim();m.sec=d.querySelector('#isec').value;App.saveImgs();close();App.render();}
      else if(a==='up'||a==='down'){const list=App.imgsFor(m.sys,m.sec);list.forEach((x,i)=>x.ord=i);const i=list.indexOf(m),j=a==='up'?i-1:i+1;if(j<0||j>=list.length)return;list[i].ord=j;list[j].ord=i;App.saveImgs();App.toast(a==='up'?'Moved earlier':'Moved later',1000);}
      else if(a==='del'){close();App.confirm('Delete this image from the phone?','Delete',()=>{App.imgs=App.imgs.filter(x=>x!==m);App.saveImgs();if(m.file&&window.CFRNative)window.CFRNative.deleteImage(m.file);App.render();});}
    });});};

/* ---------- pinch-zoom viewer (images and diagrams) ---------- */
App.viewer=(inner,cap,onEdit)=>{
  const v=document.createElement('div');v.className='viewer';v.setAttribute('role','dialog');v.setAttribute('aria-label',cap||'Image');
  v.innerHTML=`<div class="vbar"><span class="vcap">${esc(cap||'')}</span>${onEdit?`<button class="iconbtn" data-v="edit" aria-label="Edit">${I('edit')}</button>`:''}<button class="iconbtn" data-v="x" aria-label="Close">${I('x')}</button></div><div class="vstage"><div class="vcontent">${inner}</div></div><p class="vhint">Pinch or double-tap to zoom</p>`;
  document.body.appendChild(v);
  const stage=v.querySelector('.vstage'),c=v.querySelector('.vcontent');
  let s=1,x=0,y=0,pts=new Map(),start=null,lastTap=0;
  const apply=()=>{c.style.transform=`translate(${x}px,${y}px) scale(${s})`;};
  const clamp=()=>{s=Math.min(6,Math.max(1,s));if(s===1){x=0;y=0;}};
  stage.addEventListener('pointerdown',e=>{stage.setPointerCapture(e.pointerId);pts.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(pts.size===2){const [a,b]=[...pts.values()];start={d:Math.hypot(a.x-b.x,a.y-b.y),s,x,y,cx:(a.x+b.x)/2,cy:(a.y+b.y)/2};}
    else{start={px:e.clientX,py:e.clientY,x,y};const now=Date.now();if(now-lastTap<300){s=s>1?1:2.5;if(s>1){const r=stage.getBoundingClientRect();x=(r.width/2-(e.clientX-r.left))*(s-1);y=(r.height/2-(e.clientY-r.top))*(s-1);}clamp();apply();}lastTap=now;}});
  stage.addEventListener('pointermove',e=>{if(!pts.has(e.pointerId))return;pts.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(pts.size===2&&start&&start.d){const [a,b]=[...pts.values()];const k=Math.hypot(a.x-b.x,a.y-b.y)/start.d;s=start.s*k;x=start.x+((a.x+b.x)/2-start.cx);y=start.y+((a.y+b.y)/2-start.cy);clamp();apply();}
    else if(pts.size===1&&start&&start.px!=null&&s>1){x=start.x+e.clientX-start.px;y=start.y+e.clientY-start.py;apply();}});
  const up=e=>{pts.delete(e.pointerId);if(pts.size===1){const p=[...pts.values()][0];start={px:p.x,py:p.y,x,y};}};
  stage.addEventListener('pointerup',up);stage.addEventListener('pointercancel',up);
  v.addEventListener('click',e=>{const b=e.target.closest('[data-v]');if(!b)return;v.remove();if(b.dataset.v==='edit'&&onEdit)onEdit();});
  App.viewerOpen=v;
};

/* ---------- global click handlers ---------- */
document.addEventListener('click',e=>{
  const add=e.target.closest('[data-addimg]');if(add){const [sys,sec]=add.dataset.addimg.split('|');chooseSource(sys,sec);return;}
  const cell=e.target.closest('[data-img]');if(cell){const m=App.imgs.find(x=>x.id===cell.dataset.img);if(m)App.viewer(`<img src="${esc(App.imgSrc(m))}" alt="">`,m.cap,()=>App.editImage(m.id));return;}
});

/* ---------- backup / restore ---------- */
App.backupImages=()=>{const my=App.myConds||[],notes=App.condNotes||{},wish=App.wish||[];if(!App.imgs.length&&!my.length&&!Object.keys(notes).length&&!wish.length)return App.toast('Nothing to back up yet');
  if(!window.CFRNative)return App.toast('Backup works in the phone app');
  window.CFRNative.backupImages(JSON.stringify({images:App.imgs.filter(m=>m.file),myconds:my,condnotes:notes,wishlist:wish}));};
App.restoreImages=()=>{if(!window.CFRNative)return App.toast('Restore works in the phone app');window.CFRNative.restoreImages();};
App.onNative.backup=d=>{if(d.status==='ok')App.toast(`Backed up ${d.count} image${d.count===1?'':'s'}`,2500);else if(d.status==='error')App.toast(d.message,3500);};
App.onNative.restore=d=>{if(d.status!=='ok'){if(d.status==='error')App.toast(d.message,3500);return;}
  let root=[];try{root=JSON.parse(d.meta);}catch(e){}
  const meta=Array.isArray(root)?root:(root.images||[]);
  const have=new Set(App.imgs.map(m=>m.file));let n=0,k=0;
  meta.forEach(m=>{if(m&&m.file&&!have.has(m.file)){App.imgs.push(m);n++;}});App.saveImgs();
  if(!Array.isArray(root)){const ids=new Set((App.myConds||[]).map(c=>c.id));(root.myconds||[]).forEach(c=>{if(c&&c.id&&!ids.has(c.id)){App.myConds.push(c);k++;}});
    Object.entries(root.condnotes||{}).forEach(([id,t])=>{if(!App.condNotes[id])App.condNotes[id]=t;});App.saveMyConds();App.saveCondNotes();
    (root.wishlist||[]).forEach(w=>{if(w&&w.n&&!App.wish.some(x=>x.n.toLowerCase()===w.n.toLowerCase()))App.wish.push(w);});App.saveWish();}
  App.toast(`Restored ${n} image${n===1?'':'s'}${k?` and ${k} condition${k===1?'':'s'}`:''}`,3000);App.render();};
})();
