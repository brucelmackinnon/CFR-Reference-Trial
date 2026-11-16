// Links from causes to pages, quick reference cards and side-by-side Compare pages.
(function(){
const {esc,ticks,callout,scope}=App;
// Where a cause should open: its condition page, a quick card, or null
App.causeHref=(name,cond)=>{if(cond&&CONDITIONS.some(c=>c.id===cond))return '#/condition/'+cond;
  const l=(window.CAUSELINK||{})[name];if(!l)return null;return l[0]==='c'?'#/condition/'+l.slice(2):'#/card/'+l.slice(2);};
App.causeCond=(name,cond)=>{if(cond)return cond;const l=(window.CAUSELINK||{})[name];return l&&l[0]==='c'?l.slice(2):null;};
// "Tell them apart" links for a set of condition ids
App.compareLinks=(ids,all)=>{const set=new Set(ids.filter(Boolean));const hits=COMPARE.filter(x=>all?(set.has(x.a.c)||set.has(x.b.c)):(x.a.c&&x.b.c&&x.a.c!==x.b.c?set.has(x.a.c)&&set.has(x.b.c):set.has(x.b.c||x.a.c)));
  return hits.length?`<h3 class="sh">Tell them apart</h3><div class="list">${hits.map(x=>`<a class="row" href="#/compare/${x.id}"><span class="chip-ic">${I('list')}</span><span class="tx"><b>${esc(x.t)}</b><span>Side-by-side comparison</span></span><span class="chev">${I('chev')}</span></a>`).join('')}</div>`:'';};

App.route('/card/:id',{title:a=>{const q=QUICK.find(x=>x[0]===a.id);return q?q[1]:'Quick card';},tab:'#/lookup',render(a){
  const q=QUICK.find(x=>x[0]===a.id);if(!q)return '<p class="empty">Not found.</p>';const [id,n,what,signs,red,dos]=q;
  return `<div class="monohead"><p class="kicker">Quick reference card</p><h2 class="pt">${esc(n)}</h2></div>
  <section class="mono def"><h3>${I('book')}What it is</h3><div class="mb-body"><p>${esc(what)}</p></div></section>
  <section class="mono"><h3>${I('stetho')}Key signs</h3><div class="mb-body">${ticks(signs)}</div></section>
  <section class="mono red"><h3>${I('alert')}Red flags: escalate</h3><div class="mb-body">${ticks(red,true)}</div></section>
  <section class="mono do"><h3>${I('check')}What you can do</h3><div class="mb-body">${ticks(dos)}</div></section>
  ${App.webCard?App.webCard(n.split(/,| and | or /)[0].replace(/\(.*?\)/g,'').trim(),['nhs','cks']):''}${scope()}`;}});

App.route('/compare',{title:'Tell them apart',tab:'#/lookup',render(){return `<h2 class="pt">Tell them apart</h2>
  <p class="lede">Side-by-side comparisons of conditions that look alike, one less urgent and one more urgent.</p>
  <div class="list">${COMPARE.map(x=>`<a class="row" href="#/compare/${x.id}"><span class="chip-ic">${I('list')}</span><span class="tx"><b>${esc(x.t)}</b><span>${esc(x.a.n)} vs ${esc(x.b.n)}</span></span><span class="chev">${I('chev')}</span></a>`).join('')}</div>${scope()}`;}});

App.route('/compare/:id',{title:a=>{const x=COMPARE.find(y=>y.id===a.id);return x?x.t:'Compare';},parent:'#/compare',tab:'#/lookup',render(a){
  const x=COMPARE.find(y=>y.id===a.id);if(!x)return '<p class="empty">Not found.</p>';
  const lk=s=>s.c?`<a href="#/condition/${s.c}">${esc(s.n)}</a>`:esc(s.n);
  return `<h2 class="pt">${esc(x.t)}</h2>
  <div class="cmp"><div class="cmph a">${lk(x.a)}</div><div class="cmph b">${lk(x.b)}</div>
  ${x.rows.map(([f,ta,tb])=>`<div class="cmpf">${esc(f)}</div><div class="cmpc a">${esc(ta)}</div><div class="cmpc b">${esc(tb)}</div>`).join('')}
  <div class="cmpd a"><b>What to do</b>${ticks(x.doA)}</div><div class="cmpd b"><b>What to do</b>${ticks(x.doB)}</div></div>
  <div class="mt">${callout('red','alert',`<b>Key point.</b> ${esc(x.key)}`)}</div>${scope()}`;}});
})();
