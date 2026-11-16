// Detailed nervous system and vascular diagrams (v31).
(function(){
const {T,L,svg,BODY}=window.DG, D=window.DIAGRAMS;

/* ---------- Brain: arterial territories ---------- */
const OUT="M40,150Q30,70 110,40Q150,28 170,34Q240,28 280,70Q322,110 300,160L240,168Q200,196 140,196Q70,196 40,150Z";
const B=(x,y)=>[+(40+.8*x).toFixed(1),+(20+.8*y).toFixed(1)];
D.territories={cap:"Brain blood supply: which artery feeds which area",svg:svg(420,280,`
<g transform="translate(40,20) scale(.8)">
<clipPath id="bc"><path d="${OUT}"/></clipPath>
<path d="${OUT}" class="t-mca"/>
<g clip-path="url(#bc)"><path class="t-aca" d="M20,130Q26,50 108,22Q160,8 204,16Q256,18 290,58L262,80Q236,52 196,48Q150,44 116,58Q64,82 58,130Z"/>
<path class="t-pca" d="M262,80L290,58Q330,110 306,170L240,176Q200,200 150,204L154,184Q200,182 232,154Q254,122 262,80Z"/></g>
<path class="gyri2" d="M150,150L170,34M150,150L220,140L280,70M220,140L240,168M60,150Q110,140 150,150"/>
<path d="M240,168L300,160Q312,200 270,214Q232,218 214,196Z" class="t-post"/>
<path d="M196,190L218,196Q222,226 214,254L196,254Q198,226 190,196Z" class="t-post2"/>
<path d="${OUT}" fill="none" class="ol3"/>
</g>
${L(...B(150,40),10,16,'ACA: top and inner surface (leg, behaviour)')}
${L(...B(150,120),10,262,'MCA: side of brain (face, arm, speech)')}
${L(...B(288,120),300,86,'PCA: back of brain','start')}${T(304,100,'(vision)','start','sm')}
${L(...B(262,196),300,176,'Vertebral / basilar:','start')}${T(304,190,'brainstem,','start','sm')}${T(304,202,'cerebellum','start','sm')}${T(304,214,'(balance, breathing)','start','sm')}
${T(30,190,'Front','start','sm b')}
`,'Side view of the brain coloured by arterial territory: ACA, MCA, PCA and vertebrobasilar')};
D.territories.note="MCA strokes are the most common and usually FAST-positive. ACA and posterior circulation strokes are often FAST-negative, which is why Balance and Eyes were added (BE-FAST).";

/* ---------- Cranial nerves (schematic, from below) ---------- */
const S='#4F7EC2',M='#CF4A4A',BO='#8E5BB5';
const nerve=(d,c,w=2.4)=>`<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;
const pair=(d,c,w)=>nerve(d,c,w)+`<g transform="translate(420,0) scale(-1,1)">${nerve(d,c,w)}</g>`;
const lab=(side,x,y,ly,num,name,fn,col)=>side==='l'?
  `<path class="ld" d="M${x},${y}L${150},${ly}"/><circle class="dot" cx="${x}" cy="${y}" r="2"/><text x="8" y="${ly-1}" class="cn" fill="${col}">${num} ${name}</text><text x="8" y="${ly+11}" class="sm">${fn}</text>`:
  `<path class="ld" d="M${x},${y}L${272},${ly}"/><circle class="dot" cx="${x}" cy="${y}" r="2"/><text x="276" y="${ly-1}" class="cn" fill="${col}">${num} ${name}</text><text x="276" y="${ly+11}" class="sm">${fn}</text>`;
D.cranial={cap:"The 12 cranial nerves (brain seen from below)",svg:svg(420,470,`
<path class="cn-lobe" d="M206,24Q130,10 118,80Q116,138 196,142Z"/><path class="cn-lobe" d="M214,24Q290,10 302,80Q304,138 224,142Z"/>
<ellipse cx="146" cy="214" rx="28" ry="46" class="cn-lobe"/><ellipse cx="274" cy="214" rx="28" ry="46" class="cn-lobe"/>
<ellipse cx="164" cy="312" rx="38" ry="46" class="cn-cb"/><ellipse cx="256" cy="312" rx="38" ry="46" class="cn-cb"/>
<path class="cn-bs" d="M190,150H230Q234,196 244,212Q256,244 238,272Q232,310 228,362H192Q188,310 182,272Q164,244 176,212Q186,196 190,150Z"/>
<rect x="197" y="362" width="26" height="80" rx="6" class="cn-bs"/>
<path class="cn-div" d="M178,212Q210,204 242,212M184,272Q210,266 236,272"/>
${T(210,176,'Midbrain','middle','sm')}${T(210,244,'Pons','middle','sm')}${T(210,320,'Medulla','middle','sm')}${T(210,410,'Cord','middle','sm')}
${pair('M204,112L198,48',S,3)}<ellipse cx="197" cy="42" rx="5" ry="9" fill="${S}"/><ellipse cx="223" cy="42" rx="5" ry="9" fill="${S}"/>
${pair('M210,132L182,70',S,4)}<circle cx="178" cy="64" r="9" class="cn-eye"/><circle cx="242" cy="64" r="9" class="cn-eye"/><path d="M196,132H224" stroke="${S}" stroke-width="4"/>
${pair('M202,180Q186,182 164,188',M)}${pair('M196,198Q176,200 158,204',M,1.6)}
${pair('M180,232Q160,232 134,236',BO,5)}
${pair('M204,272Q190,276 176,284',M)}${pair('M186,280Q170,284 150,290',BO)}${pair('M186,290Q166,296 146,300',S)}
${pair('M192,312Q176,316 154,322',BO)}${pair('M192,324Q174,330 152,336',BO)}${pair('M194,338Q178,346 158,354M200,372Q188,360 176,352',M)}${pair('M204,318Q196,326 186,334',M,1.8)}
${lab('l',196,40,40,'I','Olfactory','smell',S)}${lab('r',236,66,66,'II','Optic','vision',S)}
${lab('l',166,188,188,'III','Oculomotor','eye movement, pupil',M)}${lab('r',256,204,212,'IV','Trochlear','eye down and in',M)}
${lab('l',136,236,236,'V','Trigeminal','face feeling, chewing',BO)}${lab('r',236,280,252,'VI','Abducens','eye outwards',M)}
${lab('l',152,290,280,'VII','Facial','facial expression',BO)}${lab('r',274,300,288,'VIII','Vestibulocochlear','hearing, balance',S)}
${lab('l',156,322,316,'IX','Glossopharyngeal','swallow, gag',BO)}${lab('r',234,334,324,'XII','Hypoglossal','tongue',M)}
${lab('l',160,354,352,'XI','Accessory','shrug, turn head',M)}${lab('r',266,330,360,'X','Vagus','voice, heart rate, gut',BO)}
<circle cx="24" cy="456" r="5" fill="${S}"/>${T(34,460,'Sensory','start','sm')}<circle cx="104" cy="456" r="5" fill="${M}"/>${T(114,460,'Motor','start','sm')}<circle cx="170" cy="456" r="5" fill="${BO}"/>${T(180,460,'Both','start','sm')}
`,'Schematic of the brainstem from below showing the 12 cranial nerves, colour coded sensory, motor or both')};
D.cranial.note="Schematic, not to scale. Nerves are shown on both sides; each is labelled once. III is the one to know on scene: a newly dilated, sluggish pupil with falling GCS means pressure on the brain.";

/* ---------- Dermatome landmarks ---------- */
const dot=(x,y)=>`<circle cx="${x}" cy="${y}" r="4.5" class="dm-dot"/>`;
D.dermatomes={cap:"Spinal nerve levels: key skin landmarks (dermatomes)",svg:svg(400,430,`<g transform="translate(20,0)">${BODY}
<path class="dm-line" d="M143,112H217"/><path class="dm-line" d="M141,168H219"/><path class="dm-line" d="M148,232Q180,246 212,232"/>
${dot(146,80)}${dot(108,242)}${dot(114,246)}${dot(121,244)}${dot(162,322)}${dot(174,380)}${dot(165,400)}${dot(152,402)}${dot(128,150)}
</g>
${L(166,80,6,60,'C4: top of shoulder')}${L(148,150,6,130,'C5: outer upper arm')}${L(128,242,6,228,'C6: thumb')}${L(134,246,6,246,'C7: middle finger')}${L(141,244,6,264,'C8: little finger')}
${L(182,322,6,318,'L3: knee')}${L(194,380,6,370,'L4: inner shin, ankle')}${L(185,400,6,392,'L5: top of foot, big toe')}${L(172,402,6,414,'S1: outer foot, little toe')}
${L(237,112,262,100,'T4: nipple line','start')}${L(239,168,262,160,'T10: umbilicus','start')}${L(232,238,262,236,'L1: groin','start')}
${T(262,296,'C3, 4, 5:','start','sm b')}${T(262,310,'diaphragm','start','sm')}${T(262,324,'(breathing)','start','sm')}${T(262,352,'S2, 3, 4:','start','sm b')}${T(262,366,'bladder, bowel,','start','sm')}${T(262,380,'saddle area','start','sm')}
`,'Body outline marking key dermatome landmarks')};
D.dermatomes.note="After a spinal injury, the level where feeling changes tells you roughly which part of the cord is affected. Injuries at C5 or above can stop breathing (C3, 4, 5 keep the diaphragm alive).";

/* ---------- Arteries & veins maps ---------- */
const P=(x,y)=>[+(-33+1.35*x).toFixed(1),+(10+1.35*y).toFixed(1)];
const heart=`<path d="M186,104Q176,100 176,110Q176,118 188,126Q198,118 198,110Q198,100 190,104Z" class="vm-heart"/>`;
const artHalf=`<path d="M176,88Q160,84 146,86L136,104L124,176L110,236M124,176L120,238M108,240Q115,246 122,242"/>
<path d="M184,232L172,246L166,258L160,318L162,336L170,392M160,336L158,390L160,402"/>`;
const pulse=(x,y)=>`<circle cx="${x}" cy="${y}" r="3.4" class="vm-pulse"/>`;
D.arteries={cap:"Major arteries and pulse points",svg:svg(420,570,`<g transform="translate(-33,10) scale(1.35)">${BODY}
<g class="vm-art">${artHalf}<g transform="translate(360,0) scale(-1,1)">${artHalf}</g>
<path d="M186,108V92Q186,80 196,82Q202,84 200,94L192,108L184,232"/><path d="M178,86L174,58L172,44M188,84L188,58L190,44"/><path d="M186,176H170M190,178H204"/></g>
${heart}${pulse(174,64)}${pulse(126,170)}${pulse(110,232)}${pulse(166,256)}${pulse(161,330)}${pulse(170,392)}${pulse(159,398)}
</g>
${L(...P(174,64),6,70,'Carotid pulse')}${L(...P(160,85),6,98,'Subclavian')}${L(...P(141,95),6,124,'Axillary')}${L(...P(130,140),6,160,'Brachial')}${L(...P(126,170),6,186,'Brachial pulse')}
${L(...P(117,210),6,262,'Ulnar')}${L(...P(110,232),6,300,'Radial pulse')}${L(...P(115,244),6,330,'Palmar arch')}
${L(...P(166,256),6,356,'Femoral pulse')}${L(...P(162,290),6,392,'Femoral artery')}${L(...P(161,330),6,454,'Popliteal (behind knee)')}${L(...P(159,370),6,500,'Anterior tibial')}${L(...P(159,398),6,540,'Dorsalis pedis pulse')}
${L(...P(190,44),300,58,'Internal / external','start')}${T(304,72,'carotid','start','sm')}${L(...P(197,83),300,104,'Aortic arch','start')}${L(...P(190,116),300,150,'Heart (coronary','start')}${T(304,164,'arteries)','start','sm')}
${L(...P(190,160),300,196,'Descending aorta','start')}${L(...P(200,178),300,230,'Renal arteries','start')}${L(...P(192,240),300,330,'Common iliac','start')}${L(...P(200,392),300,528,'Posterior tibial','start')}${T(304,542,'pulse (inner ankle)','start','sm')}
`,'Body outline showing the main arteries and where to feel pulses')};
D.arteries.note="Front view: the patient's right is on your left. Pulse points (red rings) are where an artery runs close to the skin over bone.";

const veinHalf=`<path d="M174,88Q160,86 146,88"/><path d="M146,88L138,110L116,232"/><path d="M140,112L128,176L124,232"/><path d="M121,178L131,172"/>
<path d="M176,232L170,246L166,258L162,318"/><path d="M168,256Q176,300 176,330L178,392"/><path d="M160,336L162,392"/><path d="M160,402Q170,398 180,402"/>`;
D.veins={cap:"Major veins",svg:svg(420,570,`<g transform="translate(-33,10) scale(1.35)">${BODY}
<g class="vm-vein">${veinHalf}<g transform="translate(360,0) scale(-1,1)">${veinHalf}</g>
<path d="M178,88V106"/><path d="M178,120L176,232"/><path d="M172,88L172,50M166,86L164,56"/><path d="M178,176H166M180,176H194"/></g>
${heart}</g>
${L(...P(172,56),6,76,'Internal jugular (JVP)')}${L(...P(164,62),6,98,'External jugular')}${L(...P(156,87),6,124,'Subclavian vein')}${L(...P(126,150),6,178,'Cephalic (outer arm)')}
${L(...P(134,140),6,200,'Basilic (inner arm)')}${L(...P(126,175),6,238,'Median cubital')}${T(10,252,'(cannula site)','start','sm')}
${L(...P(163,300),6,420,'Femoral vein')}${L(...P(161,370),6,500,'Small saphenous (back of calf)')}${L(...P(170,401),6,544,'Dorsal venous arch')}
${L(...P(178,96),300,112,'Superior vena cava','start')}${L(...P(177,200),300,236,'Inferior vena cava','start')}${L(...P(186,176),300,260,'Renal veins','start')}
${L(...P(190,248),300,340,'Common iliac vein','start')}${L(...P(184,330),300,454,'Great saphenous','start')}${T(304,468,'(inner leg)','start','sm')}
`,'Body outline showing the main veins')};
D.veins.note="Veins run at low pressure and rely on valves and muscle action to return blood to the heart. That's why immobility causes DVTs, and why lying flat late in pregnancy squeezes the inferior vena cava.";
})();
