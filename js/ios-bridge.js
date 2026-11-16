// Phone bridge: provides window.CFRNative with the same methods and events as the Android app.
// iPhone app: uses the app's own native plugin (CFRNativePlugin.swift).
// Web version: uses window.CFRWebPlugin (js/web-plugin.js, only included in the web build).
// Does nothing in the Android app or a plain browser.
(function(){
const C=window.Capacitor;let P=null,PLATFORM='';
if(C&&C.getPlatform&&C.getPlatform()==='ios'){P=C.registerPlugin('CFRNative');PLATFORM='ios';}
else if(window.CFRWebPlugin){P=window.CFRWebPlugin;PLATFORM='webapp';}
if(!P)return;
const emit=(type,data)=>{if(window.__native)window.__native(type,data||{});};
const LS={get:(k,d)=>{try{const v=localStorage.getItem(k);return v==null?d:v;}catch(e){return d;}},set:(k,v)=>{try{localStorage.setItem(k,v);}catch(e){}}};
let DATA=LS.get('cfr.ios.data','');
let VERSION='';

// ---------- helpers ----------
const b64FromBytes=u8=>{let s='';const CH=0x8000;for(let i=0;i<u8.length;i+=CH)s+=String.fromCharCode.apply(null,u8.subarray(i,i+CH));return btoa(s);};
const bytesFromB64=b=>{const s=atob(b);const u=new Uint8Array(s.length);for(let i=0;i<s.length;i++)u[i]=s.charCodeAt(i);return u;};
const pickFiles=(accept,{capture=false,multiple=false}={})=>new Promise(res=>{const inp=document.createElement('input');inp.type='file';inp.accept=accept;if(capture)inp.setAttribute('capture','environment');inp.multiple=multiple;
  inp.style.display='none';document.body.appendChild(inp);let done=false;const fin=f=>{if(done)return;done=true;inp.remove();res(f);};
  inp.addEventListener('change',()=>fin([...inp.files]));inp.addEventListener('cancel',()=>fin([]));inp.click();});
const fileToB64=f=>new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(String(r.result).split(',')[1]||'');r.onerror=rej;r.readAsDataURL(f);});
// Resize to a maximum side, re-encode as JPEG (WebKit applies the photo's orientation when drawing)
const shrinkToJpeg=(file,maxSide,q)=>new Promise((res,rej)=>{const url=URL.createObjectURL(file);const im=new Image();
  im.onload=()=>{const k=Math.min(1,maxSide/Math.max(im.naturalWidth,im.naturalHeight));const c=document.createElement('canvas');c.width=Math.round(im.naturalWidth*k);c.height=Math.round(im.naturalHeight*k);
    c.getContext('2d').drawImage(im,0,0,c.width,c.height);URL.revokeObjectURL(url);res({b64:c.toDataURL('image/jpeg',q).split(',')[1],w:c.width,h:c.height});};
  im.onerror=()=>{URL.revokeObjectURL(url);rej(new Error('unreadable'));};im.src=url;});
const rid=()=>{const a=new Uint8Array(8);crypto.getRandomValues(a);return [...a].map(x=>x.toString(16).padStart(2,'0')).join('');};

// ---------- minimal ZIP (store on write; store or deflate on read) ----------
const CRC=(()=>{const t=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0;}return t;})();
const crc32=u8=>{let c=0xFFFFFFFF;for(let i=0;i<u8.length;i++)c=CRC[(c^u8[i])&255]^(c>>>8);return (c^0xFFFFFFFF)>>>0;};
function zipStore(entries){const enc=new TextEncoder();const parts=[],cd=[];let off=0;
  entries.forEach(({name,data})=>{const nm=enc.encode(name),crc=crc32(data);
    const lh=new DataView(new ArrayBuffer(30));lh.setUint32(0,0x04034b50,true);lh.setUint16(4,20,true);lh.setUint32(14,crc,true);lh.setUint32(18,data.length,true);lh.setUint32(22,data.length,true);lh.setUint16(26,nm.length,true);
    parts.push(new Uint8Array(lh.buffer),nm,data);
    const ch=new DataView(new ArrayBuffer(46));ch.setUint32(0,0x02014b50,true);ch.setUint16(4,20,true);ch.setUint16(6,20,true);ch.setUint32(16,crc,true);ch.setUint32(20,data.length,true);ch.setUint32(24,data.length,true);ch.setUint16(28,nm.length,true);ch.setUint32(42,off,true);
    cd.push(new Uint8Array(ch.buffer),nm);off+=30+nm.length+data.length;});
  const cdSize=cd.reduce((a,p)=>a+p.length,0);const end=new DataView(new ArrayBuffer(22));end.setUint32(0,0x06054b50,true);end.setUint16(8,entries.length,true);end.setUint16(10,entries.length,true);end.setUint32(12,cdSize,true);end.setUint32(16,off,true);
  const all=[...parts,...cd,new Uint8Array(end.buffer)];const out=new Uint8Array(all.reduce((a,p)=>a+p.length,0));let o=0;all.forEach(p=>{out.set(p,o);o+=p.length;});return out;}
async function zipRead(u8){const dv=new DataView(u8.buffer,u8.byteOffset,u8.byteLength);let e=-1;
  for(let i=u8.length-22;i>=Math.max(0,u8.length-65558);i--){if(dv.getUint32(i,true)===0x06054b50){e=i;break;}}
  if(e<0)throw new Error('not a zip');const n=dv.getUint16(e+10,true);let p=dv.getUint32(e+16,true);const dec=new TextDecoder();const out=[];
  for(let k=0;k<n;k++){if(dv.getUint32(p,true)!==0x02014b50)throw new Error('bad zip');
    const method=dv.getUint16(p+10,true),csize=dv.getUint32(p+20,true),nl=dv.getUint16(p+28,true),xl=dv.getUint16(p+30,true),cl=dv.getUint16(p+32,true),lo=dv.getUint32(p+42,true);
    const name=dec.decode(u8.subarray(p+46,p+46+nl));p+=46+nl+xl+cl;
    const start=lo+30+dv.getUint16(lo+26,true)+dv.getUint16(lo+28,true);const raw=u8.subarray(start,start+csize);
    out.push({name,method,raw});}
  for(const f of out){if(f.method===0)f.data=f.raw;else if(f.method===8){
      if(typeof DecompressionStream==='undefined')throw new Error('This backup needs iOS 16.4 or later to restore.');
      const ds=new Blob([f.raw]).stream().pipeThrough(new DecompressionStream('deflate-raw'));f.data=new Uint8Array(await new Response(ds).arrayBuffer());}
    else throw new Error('unsupported zip');}
  return out;}

// ---------- illustration pack (port of Illustrations.kt) ----------
const API='https://commons.wikimedia.org/w/api.php';
const TRANSLATED=/[ _-](ar|zh|zh-hans|zh-hant|es|fr|de|pt|ru|uk|ukr|sv|it|nl|pl|eu|hy|ca|gl|ka|hr|et|fa|vi|bn|tr|el|he|ja|ko|id|ms|th|ta|hi|ro|cs|sk|hu|fi|no|nb|da|bs|sr|sl|lt|lv|mk|bg|az|sq|ur|ml|mr|te|kn)\.(png|jpe?g|svg)$/i;
let illusCancelled=false,illusRunning=false;
const getJSON=async url=>{const r=await P.httpGet({url});if(r.status!==200)throw new Error('HTTP '+r.status);return JSON.parse(r.text);};
async function resolveTitle(q,must){const j=await getJSON(API+'?action=query&list=search&srnamespace=6&srlimit=15&format=json&srsearch='+encodeURIComponent(q));
  const words=String(must||'').toLowerCase().split(' ').filter(Boolean);
  for(const r of (j.query&&j.query.search)||[]){const t=r.title,l=t.toLowerCase();if(!l.startsWith('file:'))continue;if(!/\.(png|jpe?g|svg)$/.test(l))continue;if(TRANSLATED.test(t))continue;if(words.every(w=>l.includes(w)))return t;}
  throw new Error('No match for '+q);}
async function imageInfo(title){const j=await getJSON(API+'?action=query&prop=imageinfo&iiprop=url%7Cextmetadata%7Csize&iiurlwidth=1400&format=json&titles='+encodeURIComponent(title));
  const pages=j.query.pages;const page=pages[Object.keys(pages)[0]];const info=page.imageinfo[0];const meta=info.extmetadata||{};
  const m=k=>String((meta[k]&&meta[k].value)||'').replace(/<[^>]*>/g,'').trim();
  return {url:info.thumburl||info.url,page:info.descriptionurl||'',w:info.thumbwidth||info.width,h:info.thumbheight||info.height,credit:(m('Artist')||m('Credit')).slice(0,160),license:m('LicenseShortName')};}
async function illusRun(items){const index=JSON.parse(LS.get('cfr.ios.illus','{}')||'{}');const total=items.length;let ok=0;const failed=[];
  try{await getJSON(API+'?action=query&meta=siteinfo&format=json');}catch(e){emit('illus',{status:'error',message:'No internet connection. Connect to Wi-Fi and try again.'});return;}
  for(let i=0;i<total;i++){if(illusCancelled)break;const it=items[i];emit('illus',{status:'progress',done:i,total,current:it.cap});
    if(index[it.id]){ok++;continue;}
    try{let title='',info=null;
      if(it.title){title='File:'+String(it.title).replace(/^File:/,'');try{info=await imageInfo(title);}catch(e){info=null;}}
      if(!info){title=await resolveTitle(it.q,it.must);info=await imageInfo(title);}
      const ext=/\.jpe?g/i.test(info.url)?'.jpg':'.png';const name=String(it.id).replace(/[^a-z0-9_]/g,'')+ext;
      await P.download({url:info.url,path:'illustrations/'+name});
      index[it.id]={file:name,title:title.replace(/^File:/,''),credit:info.credit,license:info.license,page:info.page,w:info.w,h:info.h};
      LS.set('cfr.ios.illus',JSON.stringify(index));ok++;
    }catch(e){failed.push({id:it.id,reason:String(e&&e.message||e)});}}
  emit('illus',{status:illusCancelled?'cancelled':'done',ok,total,failed,index:JSON.stringify(index)});}

// ---------- the bridge ----------
window.CFRNative={
  capabilities:()=>JSON.stringify({native:true,platform:PLATFORM,voice:PLATFORM==='ios'||!!(window.SpeechRecognition||window.webkitSpeechRecognition),scan:true,images:true,illus:true,web:true,version:(VERSION||'')+(PLATFORM==='ios'?' (iPhone)':' (web)')}),
  fileUrl:path=>PLATFORM==='webapp'?P.fileUrl(path):(DATA?C.convertFileSrc(DATA+'/'+path):''),
  // voice obs
  startVoice:()=>{P.startVoice().catch(()=>emit('voice',{status:'error',message:'Voice capture couldn’t start.'}));},
  stopVoice:()=>{P.stopVoice().catch(()=>emit('voice',{status:'stopped'}));},
  // prescription scanner: photo stays in memory only and is never saved
  scanPrescription:async fromGallery=>{const files=await pickFiles('image/*',{capture:!fromGallery});
    if(!files.length){emit('scan',{status:'cancelled'});return;}
    emit('scan',{status:'processing'});
    try{const img=await shrinkToJpeg(files[0],2400,.9);const r=await P.recognizeText({data:img.b64});emit('scan',{status:'ok',text:r.text||''});}
    catch(e){emit('scan',{status:'error',message:'Couldn’t read the label. Try again with more light, closer and flat.'});}},
  // phone features
  keepAwake:on=>{P.keepAwake({on:!!on});},
  setSecure:on=>{P.setSecure({on:!!on});},
  haptic:()=>{P.haptic();},
  setChrome:()=>{},
  share:(title,text)=>{P.shareText({title,text});},
  openUrl:url=>{P.openUrl({url}).catch(()=>{});},
  // illustration pack
  illusStatus:()=>LS.get('cfr.ios.illus','{}')||'{}',
  illusDownload:json=>{if(illusRunning)return;illusRunning=true;illusCancelled=false;
    illusRun(JSON.parse(json)).catch(e=>emit('illus',{status:'error',message:'Download failed: '+(e&&e.message||e)})).finally(()=>{illusRunning=false;});},
  illusCancel:()=>{illusCancelled=true;},
  illusDelete:()=>{illusCancelled=true;LS.set('cfr.ios.illus','{}');P.deleteDir({path:'illustrations'});},
  // my images
  pickImage:async fromCamera=>{const files=(await pickFiles('image/*',{capture:!!fromCamera,multiple:!fromCamera})).slice(0,20);
    if(!files.length){emit('image',{status:'cancelled'});return;}
    emit('image',{status:'processing',count:files.length});const out=[];let failed=0;
    for(const f of files){try{const img=await shrinkToJpeg(f,2400,.88);const name='img_'+rid()+'.jpg';await P.writeFile({path:'userimages/'+name,data:img.b64});out.push({file:name,w:img.w,h:img.h});}catch(e){failed++;}}
    emit('image',{status:'ok',files:out,failed});},
  deleteImage:name=>{if(/^[A-Za-z0-9_.-]+$/.test(name))P.deleteFile({path:'userimages/'+name});},
  // backup: one .zip (same layout as the Android backup), offered through the share sheet ("Save to Files")
  backupImages:async metaJson=>{try{const raw=String(metaJson||'').trim();const root=JSON.parse(raw);const meta=Array.isArray(root)?root:(root.images||[]);
      const enc=new TextEncoder();const entries=[{name:'meta.json',data:enc.encode(raw)}];let n=0;
      for(const m of meta){const f=m&&m.file;if(!f||!/^[A-Za-z0-9_.-]+$/.test(f))continue;try{const r=await P.readFile({path:'userimages/'+f});entries.push({name:'images/'+f,data:bytesFromB64(r.data)});n++;}catch(e){}}
      const d=new Date(),stamp=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
      const path='backups/CFR-backup-'+stamp+'.zip';await P.writeFile({path,data:b64FromBytes(zipStore(entries))});
      await P.shareFile({path});emit('backup',{status:'ok',count:n});
    }catch(e){emit('backup',{status:'error',message:'Backup failed: '+(e&&e.message||e)});}},
  // restore: pick a backup .zip from Files (iPhone or Android backups both work)
  restoreImages:async()=>{const files=await pickFiles('.zip,application/zip');if(!files.length){emit('restore',{status:'cancelled'});return;}
    try{const u8=new Uint8Array(await files[0].arrayBuffer());const entries=await zipRead(u8);let meta=null,n=0;
      for(const e of entries){const base=e.name.split('/').pop();
        if(e.name==='meta.json')meta=new TextDecoder().decode(e.data);
        else if(base&&/^[A-Za-z0-9_.-]+$/.test(base)&&/\.(jpe?g|png|webp)$/i.test(base)){await P.writeFile({path:'userimages/'+base,data:b64FromBytes(e.data)});n++;}}
      if(meta==null)throw new Error('no meta');JSON.parse(meta);emit('restore',{status:'ok',meta,count:n});
    }catch(e){emit('restore',{status:'error',message:/iOS 16\.4/.test(String(e&&e.message))?e.message:'That file isn’t a CFR image backup.'});}}
};

// Native events
P.addListener('voice',d=>emit('voice',d));
P.addListener('lifecycle',d=>emit('lifecycle',d));
// Storage location can change when the app is updated: refresh it and redraw pictures if needed
P.getInfo().then(info=>{VERSION=info.version||'';const changed=info.dataDir!==DATA;DATA=info.dataDir;LS.set('cfr.ios.data',DATA);
  if(window.App&&App.native&&App.native.caps)App.native.caps.version=VERSION+(PLATFORM==='ios'?' (iPhone)':' (web)');
  if(changed&&window.App&&App.render)App.render();}).catch(()=>{});
})();
