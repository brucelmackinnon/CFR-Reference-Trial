// "Read more online": trusted UK sources, opened in a browser tab (needs internet).
(function(){
const {esc}=App, enc=encodeURIComponent;
const G=(site,q)=>'https://www.google.com/search?q='+enc('site:'+site+' '+q);
App.webSources={
  nhs:{t:'NHS website',sub:'Plain-English health information',icon:'book',url:q=>'https://www.nhs.uk/search/?q='+enc(q)},
  cks:{t:'NICE CKS',sub:'Clinical summaries used by GPs and clinicians',icon:'stetho',url:q=>G('cks.nice.org.uk',q)},
  patient:{t:'Patient.info',sub:'Professional reference articles',icon:'list',url:q=>G('patient.info/doctor',q)},
  bnf:{t:'BNF (NICE)',sub:'British National Formulary: uses, cautions, side effects',icon:'pill',url:q=>G('bnf.nice.org.uk/drugs',q)},
  nhsmed:{t:'NHS medicines A\u2013Z',sub:'What it\u2019s for, side effects, patient advice',icon:'pill',url:q=>'https://www.nhs.uk/search/?q='+enc(q+' medicine')},
  dermnet:{t:'DermNet',sub:'Clinical photo library of skin conditions',icon:'image',url:q=>G('dermnetnz.org',q)},
  images:{t:'Image search',sub:'Google Images',icon:'image',url:q=>'https://www.google.com/search?tbm=isch&q='+enc(q+' clinical photo')},
  google:{t:'Search the web',sub:'Google search with UK health results',icon:'search',url:q=>'https://www.google.com/search?q='+enc(q+' NHS')}
};
App.openWeb=url=>{if(window.CFRNative&&App.native.caps.web)window.CFRNative.openUrl(url);else window.open(url,'_blank','noopener');};
App.webTerm=s=>String(s).replace(/\(.*?\)/g,'').split(' / ')[0].replace(/\s+/g,' ').trim();
const COND_TERMS={angina:'angina',acs:'heart attack',pneumonia:'pneumonia',stroke:'stroke',meningitis:'meningitis',overdose:'poisoning',syncope:'fainting',panic:'panic attack',alcohol:'alcohol poisoning',cauda:'cauda equina syndrome',hip:'hip fracture',aph:'bleeding in pregnancy',heat:'heatstroke',gibleed:'gastrointestinal bleeding',gastro:'diarrhoea and vomiting',headinj:'head injury',ckd:'chronic kidney disease',bronchiolitis:'bronchiolitis',adrenal:'adrenal crisis',preeclampsia:'pre-eclampsia',diabetes:'diabetes',hypo:'hypoglycaemia',cirrhosis:'cirrhosis'};
App.condTerm=c=>COND_TERMS[c.id]||App.webTerm(c.n);
App.webCard=(term,keys,title)=>`<section class="mono web"><h3>${I('external')}${esc(title||'Read more online')}</h3><div class="mb-body">
  <div class="list flat">${keys.map(k=>{const s=App.webSources[k];return `<button class="row" data-web="${k}" data-q="${esc(term)}"><span class="chip-ic">${I(s.icon)}</span><span class="tx"><b>${esc(s.t)}</b><span class="wrapt">${esc(s.sub)}</span></span><span class="chev">${I('external')}</span></button>`;}).join('')}</div>
  <p class="small muted" style="margin-top:8px">Opens in a browser tab and needs internet. Don\u2019t type patient details into online searches.</p></div></section>`;
document.addEventListener('click',e=>{const b=e.target.closest('[data-web]');if(!b)return;const s=App.webSources[b.dataset.web];if(s)App.openWeb(s.url(b.dataset.q));});

App.route('/online',{title:'Look it up online',tab:'#/lookup',render(a){return `<h2 class="pt">Look it up online</h2>
  <p class="lede">Search trusted UK sources for any condition, symptom or medicine not covered in the app.</p>
  <div class="search">${I('search')}<input id="wq" value="${esc(a.q||'')}" placeholder="e.g. Addison\u2019s disease, rivaroxaban" aria-label="What to look up" autocomplete="off"></div>
  <div class="list mt" id="wsrc">${Object.entries(App.webSources).map(([k,s])=>`<button class="row" data-src="${k}"><span class="chip-ic">${I(s.icon)}</span><span class="tx"><b>${esc(s.t)}</b><span class="wrapt">${esc(s.sub)}</span></span><span class="chev">${I('external')}</span></button>`).join('')}</div>
  <button class="btn block mt" id="wadd">${I('plus')}Request a full page for it</button>
  ${App.callout('info','info','Needs internet. Pages open in a browser tab; press back to return to the app. Never type a patient\u2019s name or details into a search.')}${App.scope()}`;},
  after(){const q=App.$('#wq');App.$('#wadd').onclick=()=>{const t=q.value.trim();if(!t){App.toast('Type the condition first');q.focus();return;}App.addRequest(t);};App.$('#wsrc').addEventListener('click',e=>{const b=e.target.closest('[data-src]');if(!b)return;const t=q.value.trim();if(!t){App.toast('Type what you want to look up');q.focus();return;}App.openWeb(App.webSources[b.dataset.src].url(t));});}});
})();
