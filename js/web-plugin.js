// Web version only: implements the phone features in the browser so js/ios-bridge.js can provide
// window.CFRNative exactly as on Android and iPhone.
//  - Your own content (My images, illustration pack, backups) is stored in the browser's Cache Storage and
//    served by the service worker at files/... Patient details are never stored (memory only, as in the apps).
//  - Voice uses the browser's speech recognition; the label scanner uses Tesseract (offline after first use).
(function(){
if(window.Capacitor&&window.Capacitor.getPlatform&&window.Capacitor.getPlatform()!=='web')return;
const FILES='cfr-files';
const VERSION='50.0';
const fileURL=p=>new URL('files/'+p,document.baseURI).href;
const listeners={};
const emit=(ev,d)=>(listeners[ev]||[]).forEach(cb=>{try{cb(d);}catch(e){}});
const b64ToBlob=(b64,type)=>{const s=atob(b64);const u=new Uint8Array(s.length);for(let i=0;i<s.length;i++)u[i]=s.charCodeAt(i);return new Blob([u],{type});};
const blobToB64=blob=>new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(String(r.result).split(',')[1]||'');r.onerror=rej;r.readAsDataURL(blob);});
const mimeOf=p=>/\.png$/i.test(p)?'image/png':/\.jpe?g$/i.test(p)?'image/jpeg':/\.zip$/i.test(p)?'application/zip':'application/octet-stream';
const files=()=>caches.open(FILES);
try{if(navigator.storage&&navigator.storage.persist)navigator.storage.persist();}catch(e){}

// ---- voice (browser speech recognition) ----
let rec=null,listening=false;
function startRec(){const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SR){emit('voice',{status:'error',message:'Voice isn’t supported in this browser. Type the obs in the box instead.'});return;}
  rec=new SR();rec.lang='en-GB';rec.continuous=true;rec.interimResults=true;
  rec.onstart=()=>emit('voice',{status:'listening',offline:false});
  rec.onresult=e=>{for(let i=e.resultIndex;i<e.results.length;i++){const r=e.results[i];emit('voice',{status:r.isFinal?'final':'partial',text:r[0].transcript});}};
  rec.onerror=e=>{if(e.error==='no-speech'||e.error==='aborted')return;listening=false;
    emit('voice',{status:'error',message:e.error==='not-allowed'?'Microphone or speech permission was refused. Allow it in Settings > Safari (or your browser), then try again.':'Voice stopped ('+e.error+'). Type the obs in the box, or try again.'});};
  rec.onend=()=>{if(listening)setTimeout(()=>{if(listening)try{rec.start();}catch(e){}},250);};
  try{rec.start();}catch(e){}}

// ---- label scanner (Tesseract, loaded on first use, then cached offline) ----
let ocr=null;
const loadScript=src=>new Promise((res,rej)=>{const s=document.createElement('script');s.src=src;s.onload=res;s.onerror=()=>rej(new Error('Couldn’t load the text reader. Connect to the internet for the first scan.'));document.head.appendChild(s);});
async function getOcr(){if(ocr)return ocr;const base=new URL('vendor/tesseract/',document.baseURI).href;
  if(!window.Tesseract)await loadScript(base+'tesseract.min.js');
  ocr=await Tesseract.createWorker('eng',1,{workerPath:base+'worker.min.js',corePath:base,langPath:base+'lang',gzip:true});
  return ocr;}

let wake=null;
window.CFRWebPlugin={
  fileUrl:fileURL,
  getInfo:async()=>({dataDir:'',version:VERSION}),
  startVoice:async()=>{listening=true;startRec();},
  stopVoice:async()=>{listening=false;try{rec&&rec.stop();}catch(e){}emit('voice',{status:'stopped'});},
  recognizeText:async({data})=>{const w=await getOcr();const r=await w.recognize('data:image/jpeg;base64,'+data);return {text:(r.data&&r.data.text)||''};},
  writeFile:async({path,data})=>{const blob=b64ToBlob(data,mimeOf(path));await (await files()).put(fileURL(path),new Response(blob,{headers:{'Content-Type':mimeOf(path)}}));return {size:blob.size};},
  readFile:async({path})=>{const r=await (await files()).match(fileURL(path));if(!r)throw new Error('File not found');return {data:await blobToB64(await r.blob())};},
  deleteFile:async({path})=>{await (await files()).delete(fileURL(path));},
  deleteDir:async({path})=>{const c=await files();const pre=fileURL(path+'/');for(const k of await c.keys())if(k.url.startsWith(pre))await c.delete(k);},
  httpGet:async({url})=>{if(/commons\.wikimedia\.org\/w\/api\.php/.test(url)&&!/[?&]origin=/.test(url))url+='&origin=*';
    const r=await fetch(url,{headers:{'Api-User-Agent':'CFRReference/'+VERSION+' (web; offline educational reference app for community first responders)'}});return {status:r.status,text:await r.text()};},
  download:async({url,path})=>{const r=await fetch(url,{mode:'cors'});if(!r.ok)throw new Error('HTTP '+r.status);const blob=await r.blob();if(blob.size<1000)throw new Error('Empty image');
    await (await files()).put(fileURL(path),new Response(blob,{headers:{'Content-Type':blob.type||mimeOf(path)}}));return {size:blob.size};},
  shareText:async({title,text})=>{if(navigator.share){try{await navigator.share({title,text});return;}catch(e){if(e&&e.name==='AbortError')return;}}if(window.App&&App.copy)App.copy(text);},
  shareFile:async({path})=>{const r=await (await files()).match(fileURL(path));if(!r)throw new Error('File not found');const blob=await r.blob();const name=path.split('/').pop();
    const file=new File([blob],name,{type:mimeOf(name)});
    if(navigator.canShare&&navigator.canShare({files:[file]})){try{await navigator.share({files:[file],title:name});return;}catch(e){if(e&&e.name==='AbortError')return;}}
    const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},4000);},
  openUrl:async({url})=>{window.open(url,'_blank','noopener');},
  setSecure:async()=>{},
  keepAwake:async({on})=>{try{if(on&&navigator.wakeLock)wake=await navigator.wakeLock.request('screen');else if(wake){await wake.release();wake=null;}}catch(e){}},
  haptic:async()=>{try{navigator.vibrate&&navigator.vibrate(12);}catch(e){}},
  addListener:(ev,cb)=>{(listeners[ev]=listeners[ev]||[]).push(cb);return Promise.resolve({remove:async()=>{listeners[ev]=(listeners[ev]||[]).filter(x=>x!==cb);}});}
};
document.addEventListener('visibilitychange',()=>emit('lifecycle',{state:document.hidden?'background':'foreground'}));

// ---- install on the home screen ----
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
const standalone=()=>navigator.standalone===true||(window.matchMedia&&matchMedia('(display-mode: standalone)').matches);
window.addEventListener('load',()=>{let seen=false;try{seen=localStorage.getItem('cfr.web.installtip')==='1';}catch(e){}
  if(standalone()||seen)return;const ios=/iPhone|iPad|iPod/.test(navigator.userAgent);
  const d=document.createElement('div');d.className='installtip';d.setAttribute('role','note');
  d.innerHTML=`<b>Install CFR Reference</b><span>${ios?'Tap the Share button (square with an arrow) in Safari, then <b>Add to Home Screen</b>. It then opens full screen and works offline.':'Use your browser menu: <b>Install app</b> or <b>Add to Home screen</b>.'}</span><button type="button" aria-label="Dismiss">×</button>`;
  d.querySelector('button').onclick=()=>{d.remove();try{localStorage.setItem('cfr.web.installtip','1');}catch(e){}};
  document.body.appendChild(d);});
})();
