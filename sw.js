// CFR Reference web version: offline app shell + your own saved files.
const SHELL='cfr-shell-50.0-46';
const RUNTIME='cfr-runtime-1';   // text reader files, cached on first use
const FILES='cfr-files';         // My images, illustration pack, backups (never patient data)
const ASSETS=["./", "css/app.css", "data/bodymap.js", "data/bodymap_detail.js", "data/compare.js", "data/conditions.js", "data/conditions2.js", "data/conditions3.js", "data/conditions4.js", "data/connections.js", "data/diagrams.js", "data/diagrams_msk.js", "data/diagrams_neurovasc.js", "data/illustrations.js", "data/meds.js", "data/quickcards.js", "data/reference.js", "data/scenarios.js", "data/symptoms.js", "data/systems.js", "data/systems2.js", "data/systems_topics.js", "data/visual.js", "data/voicenotes.js", "icons/icon-180.png", "icons/icon-192.png", "icons/icon-512.png", "index.html", "js/bodymap.js", "js/cas130.js", "js/core.js", "js/icons.js", "js/illus.js", "js/images.js", "js/ios-bridge.js", "js/learn.js", "js/mycond.js", "js/pages.js", "js/patient.js", "js/tools.js", "js/visual.js", "js/voicenotes.js", "js/web-plugin.js", "js/web.js", "lib/capacitor.js", "manifest.webmanifest"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(SHELL).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('cfr-shell-')&&k!==SHELL).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{const req=e.request;if(req.method!=='GET')return;const url=new URL(req.url);if(url.origin!==location.origin)return;
  const base=new URL('./',self.registration.scope).pathname;
  if(url.pathname.startsWith(base+'files/')){e.respondWith(caches.open(FILES).then(c=>c.match(url.href)).then(r=>r||new Response('',{status:404})));return;}
  e.respondWith(caches.match(req,{ignoreSearch:true}).then(hit=>{if(hit)return hit;
    return fetch(req).then(res=>{if(res.ok&&url.pathname.startsWith(base+'vendor/')){const copy=res.clone();caches.open(RUNTIME).then(c=>c.put(req,copy));}return res;})
      .catch(()=>req.mode==='navigate'?caches.match(base+'index.html'):new Response('',{status:504}));}));});
