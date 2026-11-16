// Clinical tools: NEWS2 scoring, spoken-obs parser, ECG strip generator, medicine text matcher.
(function(){
const Tools={};

/* ---------------- NEWS2 (RCP 2017) ---------------- */
const band=(v,rules)=>{for(const [test,pts] of rules) if(test(v)) return pts; return 0;};
Tools.news2Parts=function(o){
  const p={};
  if(o.rr!=null) p.rr=band(o.rr,[[v=>v<=8,3],[v=>v<=11,1],[v=>v<=20,0],[v=>v<=24,2],[()=>true,3]]);
  if(o.spo2!=null){
    if(o.scale===2){
      const onO2=!!o.o2;
      p.spo2=band(o.spo2,[[v=>v<=83,3],[v=>v<=85,2],[v=>v<=87,1],[v=>v<=92,0],[v=>!onO2,0],[v=>v<=94,1],[v=>v<=96,2],[()=>true,3]]);
    } else p.spo2=band(o.spo2,[[v=>v<=91,3],[v=>v<=93,2],[v=>v<=95,1],[()=>true,0]]);
  }
  if(o.o2!=null) p.o2=o.o2?2:0;
  if(o.sbp!=null) p.sbp=band(o.sbp,[[v=>v<=90,3],[v=>v<=100,2],[v=>v<=110,1],[v=>v<=219,0],[()=>true,3]]);
  if(o.hr!=null) p.hr=band(o.hr,[[v=>v<=40,3],[v=>v<=50,1],[v=>v<=90,0],[v=>v<=110,1],[v=>v<=130,2],[()=>true,3]]);
  if(o.acvpu) p.acvpu=o.acvpu==='A'?0:3;
  if(o.temp!=null) p.temp=band(Math.round(o.temp*10)/10,[[v=>v<=35.0,3],[v=>v<=36.0,1],[v=>v<=38.0,0],[v=>v<=39.0,1],[()=>true,2]]);
  return p;
};
Tools.NEWS_KEYS=['rr','spo2','o2','sbp','hr','acvpu','temp'];
Tools.news2=function(o){
  const parts=Tools.news2Parts(o);
  const have=Tools.NEWS_KEYS.filter(k=>parts[k]!=null);
  const total=have.reduce((a,k)=>a+parts[k],0);
  const single3=have.some(k=>parts[k]===3);
  const complete=have.length===7;
  let b=0,label='Low',advice='Continue to monitor and reassess.';
  if(total>=7){b=3;label='High';advice='Emergency response threshold. Escalate immediately to EOC / clinical support.';}
  else if(total>=5){b=2;label='Medium';advice='Urgent response threshold. Escalate to EOC / clinical support; consider sepsis if infection is possible.';}
  else if(single3){b=2;label='Low–medium (single red score)';advice='A single parameter scores 3. Seek clinical advice and reassess frequently.';}
  else if(total>=1){b=1;label='Low';advice='Reassess regularly and watch the trend.';}
  return {parts,total,single3,complete,missing:Tools.NEWS_KEYS.filter(k=>parts[k]==null),band:b,label,advice};
};

/* ---------------- Spoken observation parser ---------------- */
const SMALL={zero:0,one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10,eleven:11,twelve:12,thirteen:13,fourteen:14,fifteen:15,sixteen:16,seventeen:17,eighteen:18,nineteen:19};
const TENS={twenty:20,thirty:30,forty:40,fifty:50,sixty:60,seventy:70,eighty:80,ninety:90};
const isNumWord=w=>w in SMALL||w in TENS||w==='hundred'||/^\d+(\.\d+)?$/.test(w);
function wordsToNumbers(text){
  const w=text.split(/\s+/).filter(Boolean), out=[];
  for(let i=0;i<w.length;){
    if(!isNumWord(w[i])){out.push(w[i]);i++;continue;}
    if(/^\d/.test(w[i])){ // digit token: allow "37 point 2"
      let v=w[i]; i++;
      if(w[i]==='point'&&w[i+1]&&(w[i+1] in SMALL&&SMALL[w[i+1]]<10||/^\d$/.test(w[i+1]))){v+='.'+(w[i+1] in SMALL?SMALL[w[i+1]]:w[i+1]);i+=2;}
      out.push(v);continue;
    }
    let cur=0, unitOnly=false;
    while(i<w.length){
      const t=w[i];
      if(t in SMALL){
        const n=SMALL[t];
        if(unitOnly&&cur>=1&&cur<=2&&n>=10){cur=cur*100+n;unitOnly=false;i++;continue;} // "one twelve"
        if(cur%10!==0&&cur>0&&!unitOnly) break; // "twenty two three" -> stop
        cur+=n; unitOnly=cur<10; i++;
      } else if(t in TENS){
        if(unitOnly&&cur>=1&&cur<=2){cur=cur*100+TENS[t];unitOnly=false;i++;continue;} // "one twenty"
        if(cur%100!==0&&cur>=10) break;
        cur+=TENS[t]; unitOnly=false; i++;
      } else if(t==='hundred'){cur=(cur||1)*100;unitOnly=false;i++;if(w[i]==='and')i++;}
      else if(t==='oh'&&unitOnly&&w[i+1]&&w[i+1] in SMALL){cur=cur*100+SMALL[w[i+1]];unitOnly=false;i+=2;}
      else break;
    }
    let v=String(cur);
    if(w[i]==='point'&&w[i+1]&&(w[i+1] in SMALL&&SMALL[w[i+1]]<10||/^\d$/.test(w[i+1]))){v+='.'+(w[i+1] in SMALL?SMALL[w[i+1]]:w[i+1]);i+=2;}
    out.push(v);
  }
  return out.join(' ');
}
// Speech engines often write numbers as sound-alike words ("free" for three, "to" for two, "for" for four).
// Swap them back when they sit next to a number or straight after an obs keyword.
const SOUNDALIKE={to:'two',too:'two',tu:'two',for:'four',fore:'four',fall:'four',free:'three',tree:'three',thee:'three',won:'one',ate:'eight',tin:'ten',sex:'six',sick:'six',nein:'nine',fife:'five',fourty:'forty',ninty:'ninety',fiveteen:'fifteen'};
const OBSKEY=new Set(['rr','resps','resp','respirations','rate','breathing','sats','sat','saturation','saturations','saturating','spo2','pulse','hr','bp','pressure','systolic','temp','temperature','tympanic','gcs','glasgow','bm','sugar','glucose','cbg','refill','crt','pain','score','e','v','m','point','over','of','is','at','on']);
// Obs WORDS the speech engine commonly mishears. Single words are only swapped when a number follows,
// so everyday speech (e.g. "save set") is left alone.
const KEYFIX={sets:'sats',set:'sats',sacks:'sats',sax:'sats',stats:'sats',stat:'sats',sads:'sats',sass:'sats',sits:'sats',sat:'sats',
  tent:'temp',tempt:'temp',gcse:'gcs',gcses:'gcs',gsc:'gcs',bmi:'bm',bpm:'pulse',bbc:'bp',beeper:'bp'};
const PHRASEFIX=[[/\b(?:rest|wrest|rests|reps|red|rust)\s+rate\b/g,'resp rate'],[/\b(?:cat|cap|capillary)\s+(?:refilled|refills|re fill|refil|feel|refeel)\b/g,'cap refill'],[/\bcat refill\b/g,'cap refill'],
  [/\bheart\s+(?:right|write|wait)\b/g,'heart rate'],[/\b(?:bee|be|b)\s+(?:pee|p)\b/g,'bp'],[/\b(?:bee|be|b)\s+(?:em|m)\b/g,'bm'],[/\bg\s+c\s+s\b/g,'gcs'],[/\bo\s*2\s+(?:sets|stats|sacks)\b/g,'sats'],[/\bpulse ox\b/g,'sats']];
function fixKeywords(s){PHRASEFIX.forEach(([re,to])=>{s=s.replace(re,to);});
  const w=s.split(' ');const numLike=t=>!!t&&(/^\d/.test(t)||t in SMALL||t in TENS||t in SOUNDALIKE||t==='hundred');
  for(let i=0;i<w.length;i++){if(!(w[i] in KEYFIX))continue;let j=i+1;while(['of','is','are','at','was','were'].includes(w[j]))j++;
    if(numLike(w[j]))w[i]=KEYFIX[w[i]];}
  return w.join(' ');}
function fixSoundalikes(s){
  const w=s.split(' ');const isNum=t=>!!t&&(/^\d/.test(t)||t in SMALL||t in TENS||t==='hundred');
  for(let i=0;i<w.length;i++){const t=w[i];if(!(t in SOUNDALIKE))continue;
    const prev=w[i-1],next=w[i+1];
    const afterNumber=isNum(prev)||prev==='point'||prev==='over';
    const afterKey=OBSKEY.has(prev)&&!isNum(next);
    const beforeNumber=isNum(next)&&(isNum(prev)||prev==='point');
    // don't touch everyday phrases like "responds to voice", "on for", "pain for 3 days"
    if(afterNumber||beforeNumber||(afterKey&&!['on','of','is','at'].includes(prev)))w[i]=SOUNDALIKE[t];}
  return w.join(' ');}
Tools.normalise=function(raw){
  let s=' '+String(raw||'').toLowerCase()+' ';
  s=s.replace(/([a-z])-(?=[a-z])/g,'$1 ')       // "ninety-four" -> "ninety four"
     .replace(/\ba hundred\b/g,'one hundred')
     .replace(/(\d)([a-z])/g,(m,d,l)=>/[evm]/.test(l)?m:d+' '+l); // "94percent" -> "94 percent"
  s=' '+fixSoundalikes(fixKeywords(s.replace(/[.,;!?]+(?=\s|$)/g,' ').replace(/\s+/g,' ').trim()))+' ';
  s=s.replace(/[°%]/g,' ').replace(/per ?cent/g,' ').replace(/degrees?( c(elsius)?)?/g,' ')
     .replace(/\bsp\s*o\s*(2|two)\b/g,'spo2').replace(/\b(?:o|oh)\s*(?:2|two)\b/g,'o2')
     .replace(/(\d)\s*\/\s*(\d)/g,'$1 over $2').replace(/[,;!?]/g,' ').replace(/(\D)\.(\D|$)/g,'$1 $2')
     .replace(/\s+/g,' ');
  return ' '+wordsToNumbers(s.trim())+' ';
};
const NUM='(\\d{1,3}(?:\\.\\d{1,2})?)';
const CON='\\s*(?:is|are|was|of|at|about|around|reading|:|=)?\\s*';
const RULES=[
  ['bp',new RegExp('\\b(?:bp|b p|blood pressure|pressure)'+CON+'(\\d{2,3})\\s*(?:over|on|by)\\s*(\\d{2,3})\\b'),m=>({sbp:+m[1],dbp:+m[2]})],
  ['sbp',new RegExp('\\b(?:bp|blood pressure|systolic)'+CON+'(\\d{2,3})\\b(?!\\s*(?:over|on|by))'),m=>({sbp:+m[1]})],
  ['rr',new RegExp('\\b(?:resp(?:iratory|irations|s)?(?: rate)?|breathing(?: rate)?|rr|breaths?|respiration(?: rate)?)'+CON+'(\\d{1,2})\\b'),m=>({rr:+m[1]})],
  ['spo2',new RegExp('\\b(?:sats?|saturations?|saturating|spo2|oxygen sat\\w*|o2 sats?|pulse ox\\w*|oxygen levels?)'+CON+'(\\d{2,3})\\b'),m=>+m[1]<=100?{spo2:+m[1]}:null],
  ['hr',new RegExp('\\b(?:pulse(?: rate)?|heart ?rate|hr|heart)'+CON+'(\\d{2,3})\\b'),m=>({hr:+m[1]})],
  ['temp',new RegExp('\\b(?:temp(?:erature)?|tympanic)'+CON+NUM+'\\b'),m=>{const v=+m[1];return v>=25&&v<=44?{temp:v}:null;}],
  ['bm',new RegExp('\\b(?:bm|b m|blood sugar|blood glucose|glucose|sugar|cbg|bgl)'+CON+NUM+'\\b'),m=>({bm:+m[1]})],
  ['crt',/\b(?:cap(?:illary)? refill(?: time)?|crt)\s*(?:is|of|was|:)?\s*(less than |under |below |more than |over )?(\d)\b/,m=>({crt:(m[1]&&/less|under|below/.test(m[1])?'<':m[1]?'>':'')+m[2]+' s'})],
  ['pain',/\bpain(?: score)?\s*(?:is|of|was|:)?\s*(\d{1,2})\s*(?:out of (?:10|ten)|over (?:10|ten))?\b/,m=>+m[1]<=10?{pain:+m[1]}:null],
  ['o2off',/\b(?:on |room )air\b/,()=>({o2:false})],
  ['o2on',/\bon (?:(\d{1,2}(?:\.\d)?) ?(?:litres?|liters?|l|lpm)(?: of oxygen| o2)?|oxygen|o2|high flow|(?:a )?non ?rebreather|nasal cannulae?|(?:a )?venturi)\b/,m=>({o2:true,o2flow:m[1]?m[1]+' L/min':undefined})],
  ['scale2',/\b(?:scale 2|scale two|target (?:of )?88|copd target|88 to 92)\b/,()=>({scale:2})],
  ['rhythm',/\b(?:pulse|heart|rhythm)[a-z0-9 ]{0,24}?\b(irregular(?:ly irregular)?|regular)\b/,m=>({rhythm:m[1]})],
  ['vol',/\b(?:pulse|radial|heart|it s|its)[a-z0-9 ]{0,24}?\b(strong|weak|thready|bounding|faint)\b|\b(strong|weak|thready|bounding|faint)(?: (?:and )?(?:regular|irregular))? (?:radial )?pulse\b/,m=>{const w=m[1]||m[2];return {vol:/strong|bounding/.test(w)?'strong':'weak'};}],
  ['rhythm2',/\b(irregular|regular)(?: (?:and )?(?:strong|weak|thready|bounding))? (?:radial )?pulse\b/,m=>({rhythm:m[1]})],
  ['fast',/\b(?:be ?fast|fast)(?: test| check)?(?: (?:is|was))? (done|performed|negative|positive|clear|normal|not done)\b/,m=>({fast:m[1]==='not done'?'No':'Yes',fastResult:/negative|clear|normal/.test(m[1])?'negative':m[1]==='positive'?'positive':undefined})],
  ['allergyNo',/\b(?:no (?:known )?(?:drug )?allergies|nkda|nka|not allergic to anything|allergies none|no allergies)\b/,()=>({allergy:'No'})],
  ['allergyYes',/\b(?:allergic to ([a-z ]{3,30}?)|allerg(?:y|ies) (?:to )?([a-z]{4,20}))(?= (?:resp|sats|pulse|bp|temp|bm|pain|fast|and then)|\s*$)/,m=>{const x=(m[1]||m[2]||'').trim();return /^(none|nothing|no)$/.test(x)?{allergy:'No'}:{allergy:'Yes',allergyTo:x};}],
  ['pupils',/\bpupils? ([a-z0-9 ]{3,40}?)(?= (?:resp|sats|pulse|bp|temp|bm|pain|fast|allerg\w*|no known|and then)|\s*$)/,m=>({pupils:m[1].trim()})]
];
const AVPU=[['U',/\b(unresponsive|unconscious|no response|u on avpu)\b/],['P',/\b(respond(?:s|ing)? to pain|pain responsive|p on avpu)\b/],['V',/\b(respond(?:s|ing)? to voice|voice responsive|v on avpu)\b/],['C',/\b(new(?:ly)? confus\w*|acutely confused|c on acvpu)\b/],['A',/\b(alert|a on avpu|fully alert)\b/]];
Tools.parseObs=function(raw){
  const s=Tools.normalise(raw); const values={}; const hits=[];
  let work=s;
  for(const [key,re,fn] of RULES){
    const m=work.match(re); if(!m) continue;
    const v=fn(m); if(!v) continue;
    if(key==='sbp'&&values.sbp) continue;
    Object.assign(values,v); hits.push(m[0].trim());
    if(key==='bp') work=work.replace(m[0],' '); // stop "bp 120" re-matching
  }
  for(const [code,re] of AVPU){const m=s.match(re); if(m){values.acvpu=code;hits.push(m[0]);break;}}
  let command=null;
  if(/\b(save (?:obs|set|observations|the set)|new set|next set|obs complete)\b/.test(s)) command='save';
  else if(/\b(undo|scratch that|delete last)\b/.test(s)) command='undo';
  return {values,hits,command,normalised:s.trim()};
};

/* ---------------- ECG strip generator ---------------- */
function rng(seed){let x=seed;return()=>{x=(x*1103515245+12345)&0x7fffffff;return x/0x7fffffff;};}
const G=(t,c,w,a)=>a*Math.exp(-((t-c)*(t-c))/(2*w*w));
// Beat shapes in seconds relative to QRS centre
function narrow(t,o={}){return G(t,-(o.pr||.16),.022,o.p===0?0:(o.p||.12))+G(t,-.03,.009,-.08)+G(t,0,.012,1)+G(t,.03,.012,-.22)+G(t,.28,.055,o.tAmp||.28);}
function broad(t,o={}){return G(t,-.02,.035,o.q||.2)+G(t,.05,.04,o.r||1)+G(t,.14,.05,o.s||-.35)+G(t,.36,.07,o.tAmp||-.4);}
function pwave(t,c){return G(t,c,.022,.12);}
Tools.ecg=function(id,W=600,H=110){
  const secs=6, pxs=W/secs, base=H*.62, amp=H*.42, R=rng(id.length*97+13);
  let beats=[],fn=null,extraP=[];
  const regular=(rate,shape,o)=>{for(let t=.35;t<secs;t+=60/rate)beats.push({t,shape,o});};
  switch(id){
    case 'nsr':case 'pea':regular(id==='pea'?66:75,narrow,{});break;
    case 'brady':regular(44,narrow,{});break;
    case 'tachy':regular(122,narrow,{tAmp:.22});break;
    case 'af':{let t=.3;while(t<secs){beats.push({t,shape:narrow,o:{p:0}});t+=.42+R()*.55;}
      fn=t=>.035*Math.sin(t*2*Math.PI*6.3)+.03*Math.sin(t*2*Math.PI*8.9+1)+.02*Math.sin(t*2*Math.PI*11.7);break;}
    case 'flutter':{fn=t=>{const ph=(t*5)%1;return .12*(ph<.8?(ph/.8)-.5:(1-(ph-.8)/.2)-.5)*-1;};for(let t=.2+.8;t<secs;t+=.8)beats.push({t,shape:narrow,o:{p:0,tAmp:.1}});break;}
    case 'svt':regular(180,narrow,{p:0,tAmp:.2});break;
    case 'pvc':{let t=.35;let k=0;while(t<secs){if(k===2){beats.push({t:t-.28,shape:broad,o:{r:1.1}});t+=.8*1.35;}else{beats.push({t,shape:narrow,o:{}});t+=.8;}k++;}break;}
    case 'vt':regular(170,broad,{r:1.05,tAmp:-.5,q:0});break;
    case 'vf':fn=t=>{const env=.45+.35*Math.sin(t*1.3);return env*(.55*Math.sin(t*2*Math.PI*4.6+Math.sin(t*3))+.35*Math.sin(t*2*Math.PI*7.3+1.7)+.2*Math.sin(t*2*Math.PI*2.1));};break;
    case 'asystole':fn=t=>.02*Math.sin(t*1.7)+.012*Math.sin(t*9.1);break;
    case 'avb1':regular(70,narrow,{pr:.32});break;
    case 'mobitz1':{let t=.45,pr=.16,k=0;while(t<secs){if(k%4===3){extraP.push(t-.16);pr=.16;}else{beats.push({t:t+(pr-.16),shape:narrow,o:{pr}});pr+=.09;}t+=.8;k++;}break;}
    case 'mobitz2':{let t=.45,k=0;while(t<secs){if(k%3===2)extraP.push(t-.16);else beats.push({t,shape:narrow,o:{}});t+=.8;k++;}break;}
    case 'chb':{for(let t=.1;t<secs;t+=.72)extraP.push(t);for(let t=.9;t<secs;t+=1.7)beats.push({t,shape:broad,o:{r:.9,tAmp:-.35}});break;}
    case 'paced':{regular(70,broad,{r:.85,q:0,tAmp:-.35});break;}
  }
  const pts=[];
  for(let x=0;x<=W;x+=1.5){
    const t=x/pxs; let v=0;
    for(const b of beats){const d=t-b.t; if(d>-.45&&d<.6) v+=b.shape(d,b.o);}
    for(const p of extraP){const d=t-p; if(d>-.1&&d<.1) v+=pwave(d,0);}
    if(fn) v+=fn(t);
    pts.push(x.toFixed(1)+','+(base-v*amp).toFixed(1));
  }
  let spikes='';
  if(id==='paced') for(const b of beats){const x=(b.t-.06)*pxs; spikes+=`<path d="M${x.toFixed(1)},${base+6}V${base-amp*.95}" stroke="#7CF5C4" stroke-width="1.2"/>`;}
  const grid=`<defs><pattern id="g${id}" width="${pxs/5}" height="${pxs/5}" patternUnits="userSpaceOnUse"><path d="M${pxs/5},0V${pxs/5}H0" fill="none" stroke="#123326" stroke-width=".6"/></pattern><pattern id="G${id}" width="${pxs}" height="${pxs}" patternUnits="userSpaceOnUse"><rect width="${pxs}" height="${pxs}" fill="url(#g${id})"/><path d="M${pxs},0V${pxs}H0" fill="none" stroke="#1C4A37" stroke-width="1"/></pattern></defs><rect width="${W}" height="${H}" fill="url(#G${id})"/>`;
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Illustrative rhythm strip">${grid}${spikes}<polyline points="${pts.join(' ')}" fill="none" stroke="#39E6A0" stroke-width="1.8" stroke-linejoin="round"/></svg>`;
};

/* ---------------- Medicine text matcher (for scanned labels) ---------------- */
function lev(a,b){if(Math.abs(a.length-b.length)>2)return 9;const d=[];for(let i=0;i<=a.length;i++){d[i]=[i];}for(let j=1;j<=b.length;j++)d[0][j]=j;for(let i=1;i<=a.length;i++)for(let j=1;j<=b.length;j++)d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]===b[j-1]?0:1));return d[a.length][b.length];}
let NAMEIDX=null;
function buildIdx(){NAMEIDX=[];(window.MEDS||[]).forEach((m,i)=>{const names=[m[0]].concat((m[1]||'').split(',')).map(s=>s.trim().toLowerCase()).filter(Boolean);
  names.forEach(n=>{n.split(/[\/ ]/).forEach(part=>{if(part.length>=5&&!/^(tablets?|spray|patch|injection|insulin|combined|oral|contraceptive|pill|vitamin|acid|sodium|home|oxygen|adrenaline|glucose|fumarate|sulfate|sulphate|gluconate|hydrochloride|potassium|calcium|magnesium|maleate|succinate|tartrate|mesilate|besilate)$/.test(part))NAMEIDX.push({w:part,i});});NAMEIDX.push({w:n,i,full:true});});});}
Tools.matchMeds=function(text){
  if(!NAMEIDX)buildIdx();
  const low=' '+String(text||'').toLowerCase().replace(/[^a-z0-9\/\- \n]/g,' ')+' ';
  const words=low.split(/[\s\/\-]+/).filter(w=>w.length>=5);
  const found=new Map();
  for(const e of NAMEIDX){
    if(e.full&&e.w.length>=4&&low.includes(' '+e.w+' ')){found.set(e.i,(found.get(e.i)||0)+3);continue;}
    if(!e.full){
      if(words.includes(e.w)){found.set(e.i,(found.get(e.i)||0)+2);continue;}
      if(e.w.length>=7) for(const w of words){if(lev(w,e.w)<=1){found.set(e.i,(found.get(e.i)||0)+1);break;}}
    }
  }
  return [...found.entries()].sort((a,b)=>b[1]-a[1]).map(([i])=>i);
};
// Pull out useful label lines (strength, directions) without keeping identifiers
Tools.labelLines=function(text){
  return String(text||'').split(/\n+/).map(s=>s.trim()).filter(s=>/\b(\d+(\.\d+)?\s?(mg|mcg|micrograms?|g|ml|units?)\b|take|apply|inhale|spray|puffs?|daily|once|twice|three times|every|morning|night|when required|prn)\b/i.test(s)).slice(0,8);
};

window.Tools=Tools;
})();
