// Labelled anatomy diagrams, drawn as SVG so they stay sharp and follow light/dark mode.
// Front views: the patient's right is on the viewer's LEFT.
(function(){
const T=(x,y,s,a,c)=>`<text x="${x}" y="${y}"${a?` text-anchor="${a}"`:''}${c?` class="${c}"`:''}>${s}</text>`;
// label with leader line: from point (x1,y1) to text anchor (x2,y2)
const L=(x1,y1,x2,y2,s,a)=>{let lx=x2;if((a||'start')==='start'&&x2<x1){lx=Math.min(x1-6,x2+String(s).replace(/&[a-z]+;/g,'x').length*5.6+10);}return `<path class="ld" d="M${x1},${y1}L${lx},${y2}"/><circle class="dot" cx="${x1}" cy="${y1}" r="2.2"/>`+T(a==='end'?x2-4:a==='middle'?x2:x2+4,a==='middle'?y2+12:y2+4,s,a||'start');};
const svg=(w,h,body,label)=>`<svg class="dg" viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}"><defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="5" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="11" orient="auto-start-reverse"><path d="M0,0L10,5L0,10z" class="arh"/></marker><marker id="arw" viewBox="0 0 10 10" refX="8" refY="5" markerUnits="userSpaceOnUse" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0,0L10,5L0,10z" fill="#fff"/></marker></defs>${body}</svg>`;
const RL=(y,w)=>T(12,y,'R','start','side')+T(w-12,y,'L','end','side');

// Generic front body outline (centred on x=180, 0..420)
const BODY=`<ellipse class="ol" cx="180" cy="38" rx="21" ry="25"/><path class="ol" d="M170,60L170,72L142,79Q127,84 125,99L113,172L105,232Q103,243 111,245L117,245L123,237L135,178L141,142L143,202L141,238L147,332L151,394Q151,404 161,404L172,404L175,394L177,302L180,252L183,302L185,394L188,404L199,404Q209,404 209,394L213,332L219,238L217,202L219,142L225,178L237,237L243,245L249,245Q257,243 255,232L247,172L235,99Q233,84 218,79L190,72L190,60Z"/>`;

const D={};

D.heart={cap:"Heart: chambers, valves and blood flow",svg:svg(400,320,`
<path class="f-ven" d="M118,10h22v60h-22z"/>
<path class="f-ven" d="M92,120h18v178h-18z"/>
<path d="M166,150V52Q166,36 150,36H60" style="fill:none;stroke:var(--ven)" stroke-width="18"/>
<path d="M166,52Q166,36 182,36H292" style="fill:none;stroke:var(--ven)" stroke-width="18"/>
<path d="M206,150V46Q206,18 234,18Q262,18 262,46V70" style="fill:none;stroke:var(--art)" stroke-width="22"/>
<path class="f-art" d="M262,84h60v14h-60zM262,112h60v14h-60z"/>
<clipPath id="hc"><path d="M108,96Q98,58 140,58L226,58Q268,58 268,108Q268,190 186,276Q104,194 104,132Z"/></clipPath>
<g clip-path="url(#hc)"><rect class="f-ven2" x="96" y="50" width="88" height="92"/><rect class="f-ven" x="96" y="142" width="88" height="140"/><rect class="f-art2" x="184" y="50" width="90" height="92"/><rect class="f-art" x="184" y="142" width="90" height="140"/></g>
<path class="ol2" style="fill:none" d="M108,96Q98,58 140,58L226,58Q268,58 268,108Q268,190 186,276Q104,194 104,132Z"/>
<path d="M184,70V262" class="sep"/>
<path d="M112,142H150M166,142H176M192,142H206M222,142H262" class="sep"/>
<path d="M150,142H166M206,142H222" class="valve"/>
<path class="flow" d="M132,92V132" marker-end="url(#arw)"/><path class="flow" d="M150,170Q162,230 170,170V150" marker-end="url(#arw)"/>
<path class="flow" d="M236,92V132" marker-end="url(#arw)"/><path class="flow" d="M232,176Q214,236 200,176V156" marker-end="url(#arw)"/>
${L(128,100,84,96,'Right atrium','end')}${L(158,142,84,150,'Tricuspid valve','end')}${L(140,216,84,222,'Right ventricle','end')}
${L(244,100,272,150,'Left atrium','start')}${L(214,142,272,180,'Mitral valve','start')}${L(238,214,272,214,'Left ventricle','start')}
${T(112,20,'Superior vena cava','end','sm')}${T(101,314,'Inferior vena cava','middle','sm')}${T(62,60,'To lungs','start','sm')}${T(296,40,'To lungs','start','sm')}${T(276,12,'Aorta: to body','start','sm')}${T(322,78,'From lungs','end','sm')}
${L(184,200,186,300,'Septum','middle')}
`,'Diagram of the heart showing four chambers, valves and the direction of blood flow')};
D.heart.note="Blue carries deoxygenated blood, red oxygenated. The left ventricle wall is the thickest because it pumps to the whole body.";

D.circulation={cap:"Double circulation: lungs and body",svg:svg(400,300,`
<rect class="f-lung" x="110" y="14" width="140" height="54" rx="14"/>${T(180,38,'Lungs','middle','b')}${T(180,56,'Pick up O₂, drop CO₂','middle','sm')}
<rect class="f-ven2" x="118" y="118" width="62" height="66" rx="10"/><rect class="f-art2" x="180" y="118" width="62" height="66" rx="10"/>
${T(149,146,'Right','middle','b')}${T(149,162,'heart','middle','sm')}${T(211,146,'Left','middle','b')}${T(211,162,'heart','middle','sm')}
<rect class="f-organ" x="110" y="232" width="140" height="54" rx="14"/>${T(180,256,'Body tissues','middle','b')}${T(180,274,'Drop O₂, pick up CO₂','middle','sm')}
<path d="M140,118V74" class="vein" marker-end="url(#ar)"/><path d="M220,74V114" class="art" marker-end="url(#ar)"/>
<path d="M226,184V228" class="art" marker-end="url(#ar)"/><path d="M134,228V190" class="vein" marker-end="url(#ar)"/>
${T(98,98,'Pulmonary artery','end','sm')}${T(262,98,'Pulmonary veins','start','sm')}${T(262,210,'Aorta','start','sm')}${T(98,210,'Vena cavae','end','sm')}
`,'Diagram of the pulmonary and systemic circulations')};
D.circulation.note="The right heart pumps to the lungs (low pressure); the left heart pumps to the body (high pressure). The pulmonary artery is the only artery carrying deoxygenated blood.";

D.airway={cap:"Airway and lungs (front view)",svg:svg(400,340,`${RL(330,400)}
<path class="f-lung" d="M168,96Q122,92 98,150Q78,214 84,284Q126,300 170,286Q176,190 168,96Z"/>
<path class="f-lung" d="M192,96Q238,92 262,150Q282,214 276,284Q244,298 212,290Q200,262 222,242Q194,236 194,190Q196,140 192,96Z"/>
<path class="lobe" d="M96,190Q130,196 168,176M90,236Q124,226 168,238"/><path class="lobe" d="M268,176Q228,196 200,214"/>
<path class="f-tube" d="M173,40h14v70h-14z"/><path class="rings" d="M173,48h14M173,56h14M173,64h14M173,72h14M173,80h14M173,88h14M173,96h14"/>
<path class="bron" d="M180,108L150,140L130,170M150,140L142,190M130,170L112,200M130,170L128,220M142,190L134,250M142,190L156,244"/>
<path class="bron" d="M180,108L212,136L230,168M212,136L214,188M230,168L248,196M230,168L236,222M214,188L222,250"/>
<path class="f-muscle" d="M70,300Q128,262 180,292Q232,262 290,300L290,310Q232,274 180,302Q128,274 70,310Z"/>
<path class="ol2" d="M152,14Q180,2 208,14L208,30L152,30Z" style="fill:var(--organ)"/>
${L(180,20,248,16,'Pharynx (throat)','start')}${L(180,36,248,40,'Larynx','start')}${L(187,70,248,66,'Trachea','start')}${L(180,110,40,104,'Carina','start')}
${L(150,140,40,132,'R main bronchus','start')}${L(214,188,290,130,'Bronchioles','start')}${L(120,256,30,270,'Right lung','start')}${L(254,256,290,258,'Left lung','start')}${L(250,292,310,330,'Diaphragm','end')}
`,'Diagram of the airway from pharynx to lungs and diaphragm')};
D.airway.note="The right main bronchus is wider and steeper, so inhaled objects usually lodge on the right. The left lung has a notch for the heart.";

D.alveolus={cap:"Alveoli: where gas exchange happens",svg:svg(400,230,`
<path class="bron" d="M20,110H80"/>
<g class="f-lung"><circle cx="96" cy="92" r="18"/><circle cx="96" cy="128" r="18"/><circle cx="122" cy="110" r="18"/><circle cx="118" cy="76" r="14"/><circle cx="118" cy="144" r="14"/></g>
<circle class="f-lung ol2" cx="250" cy="112" r="62"/>
<path d="M188,112Q200,40 250,48Q306,52 312,112Q306,176 250,178Q196,176 188,112" class="cap"/>
<path class="zoom" d="M122,94L204,62M122,128L204,160"/>
<path d="M232,94L266,70" class="o2" marker-end="url(#ar)"/><path d="M268,152L234,128" class="co2" marker-end="url(#ar)"/>
${T(250,110,'Air in alveolus','middle','sm')}${T(300,40,'O₂ into blood','middle','sm b')}${T(232,160,'CO₂ out','end','sm b')}
${T(20,100,'Bronchiole','start','sm')}${T(250,204,'Capillary wraps the alveolus','middle','sm')}${T(108,180,'Alveolar sacs','middle','sm')}
`,'Diagram of alveoli and gas exchange with a capillary')};
D.alveolus.note="Around 300 million alveoli give a surface area about the size of a tennis court. Fluid (pulmonary oedema) or infection (pneumonia) in the alveoli stops oxygen crossing, so SpO₂ falls.";

D.brain={cap:"Brain lobes and what they do (left side view)",svg:svg(400,250,`<g transform="translate(60,26) scale(.72)"><path class="lb-f" d="M40,150Q30,70 110,40Q150,28 170,34L150,150Z"/>
<path class="lb-p" d="M170,34Q240,28 280,70L220,140L150,150Z"/>
<path class="lb-o" d="M280,70Q322,110 300,160L240,168L220,140Z"/>
<path class="lb-t" d="M40,150L150,150L220,140L240,168Q200,196 140,196Q70,196 40,150Z"/>
<path class="lb-c" d="M240,168L300,160Q312,200 270,214Q232,218 214,196Z"/>
<path class="lb-s" d="M196,190L218,196Q222,226 214,254L196,254Q198,226 190,196Z"/>
<path class="gyri" d="M70,90Q90,110 80,140M110,60Q130,90 118,130M200,60Q210,90 196,120M246,80Q246,110 230,130M90,172Q130,166 170,176"/>
</g>
${L(125,98,10,14,'Frontal: personality, movement, speech','start')}${L(214,76,250,40,'Parietal: sensation','start')}${L(269,112,290,112,'Occipital: vision','start')}${L(246,167,274,166,'Cerebellum: balance','start')}${L(208,196,274,206,'Brainstem: breathing','start')}${L(146,153,10,236,'Temporal: hearing, memory, language','start')}${T(60,196,'Front','start','sm b')}
`,'Side view of the brain showing frontal, parietal, occipital and temporal lobes, cerebellum and brainstem')};
D.brain.note="Each side of the brain controls the opposite side of the body. Speech is usually on the left, so a left-sided stroke often causes right-sided weakness with speech problems.";

D.cns={cap:"Central and peripheral nervous system",svg:svg(400,440,`${BODY}${RL(24,400)}
<ellipse class="f-nerve" cx="180" cy="34" rx="15" ry="14"/><path class="cord" d="M180,48V236"/>
<path class="nerve" d="M180,86L150,96L132,130L122,172L116,230M180,86L210,96L228,130L238,172L244,230M180,150L150,180M180,150L210,180M180,236L164,300L158,392M180,236L196,300L202,392M180,110L160,120M180,110L200,120M180,200L156,214M180,200L204,214"/>
${L(194,30,270,22,'Brain','start')}${L(180,150,270,150,'Spinal cord (CNS)','start')}${L(238,172,270,190,'Nerves (PNS)','start')}${L(162,300,60,300,'Sciatic nerve','start')}
${T(200,422,'The cord ends around L1–L2; below this','middle','sm')}${T(200,436,'are nerve roots (the cauda equina)','middle','sm')}
`,'Body outline showing brain, spinal cord and peripheral nerves')};

D.gi={cap:"Digestive organs (front view)",svg:svg(400,340,`${RL(330,400)}
<path class="ol" d="M70,20Q180,0 290,20L300,300Q180,330 60,300Z"/>
<path class="f-tube2" d="M186,6V70"/>
<path class="f-liver" d="M74,74Q120,56 196,70Q200,96 170,104Q120,120 82,126Q66,100 74,74Z"/>
<path class="f-gb" d="M142,106Q150,124 138,132Q128,126 132,110Z"/>
<path class="f-stomach" d="M186,70Q232,56 256,82Q268,120 238,142Q210,156 190,140Q210,124 204,104Q196,88 186,90Z"/>
<path class="f-panc" d="M150,146Q200,136 250,150Q236,160 200,156Q170,160 150,156Z"/>
<path class="f-colon" d="M96,290V196Q96,168 120,168H250Q276,168 276,196V270Q276,292 240,296H200"/>
<path class="f-si" d="M130,196Q160,180 180,196T230,196Q250,214 226,226T180,232T136,238Q118,254 142,264T188,268T232,262"/>
<path class="f-colon2" d="M200,296Q186,300 180,312"/><path class="f-app" d="M96,284Q90,300 100,306"/>
${L(186,40,258,30,'Oesophagus','start')}${L(100,90,20,60,'Liver','start')}${L(136,120,20,112,'Gallbladder','start')}${L(238,100,310,70,'Stomach','start')}
${L(232,152,310,140,'Pancreas','start')}${L(186,220,310,236,'Small intestine','start')}${L(276,210,310,196,'Large intestine','start')}${L(98,300,20,318,'Appendix','start')}${L(182,310,258,326,'Rectum','start')}
`,'Diagram of oesophagus, liver, gallbladder, stomach, pancreas, small and large intestine')};

D.quadrants={cap:"Abdominal quadrants: what lies where",svg:svg(400,300,`${RL(14,400)}
<rect class="ol" x="40" y="20" width="280" height="250" rx="30"/>
<path class="grid" d="M180,20V270M40,145H320"/><circle class="f-art" cx="180" cy="145" r="6"/>
${T(110,50,'RUQ','middle','b')}${T(110,70,'Liver, gallbladder','middle','sm')}${T(110,86,'Right kidney','middle','sm')}${T(110,102,'Duodenum','middle','sm')}
${T(250,50,'LUQ','middle','b')}${T(250,70,'Stomach, spleen','middle','sm')}${T(250,86,'Pancreas tail','middle','sm')}${T(250,102,'Left kidney','middle','sm')}
${T(110,176,'RLQ','middle','b')}${T(110,196,'Appendix','middle','sm')}${T(110,212,'Right ovary / tube','middle','sm')}${T(110,228,'Right ureter','middle','sm')}
${T(250,176,'LLQ','middle','b')}${T(250,196,'Sigmoid colon','middle','sm')}${T(250,212,'Left ovary / tube','middle','sm')}${T(250,228,'Left ureter','middle','sm')}
${T(180,290,'Midline: bladder, uterus, aorta. Epigastric pain can be cardiac.','middle','sm')}${T(194,140,'Umbilicus','start','sm')}
`,'Four abdominal quadrants with the main organs in each')};

D.urinary={cap:"Urinary tract (front view)",svg:svg(400,340,`${RL(330,400)}
<path class="f-art" d="M188,20h10v200h-10z"/><path class="f-ven" d="M170,20h12v200h-12z"/>
<path class="f-kidney" d="M88,90Q70,120 86,160Q106,190 128,170Q140,150 130,124Q138,100 118,84Q100,76 88,90Z"/>
<path class="f-kidney" d="M272,82Q290,112 276,152Q258,182 236,164Q224,146 232,120Q224,96 244,80Q260,72 272,82Z"/>
<path class="f-gland" d="M92,86Q104,64 124,80Q108,88 92,86Z"/><path class="f-gland" d="M240,76Q258,58 270,80Q256,84 240,76Z"/>
<path class="rv" d="M130,128H170M232,122H198" style="stroke:var(--art)" /><path class="rv" d="M130,138H170M232,132H198" style="stroke:var(--ven);stroke-width:4"/>
<path class="ureter" d="M124,150Q150,210 160,262M236,148Q210,210 200,262"/>
<path class="f-bladder" d="M140,262Q180,244 220,262Q230,296 196,306H164Q130,296 140,262Z"/><path class="ureter" d="M180,306V332"/>
${L(94,120,20,120,'Right kidney','start')}${L(106,80,20,60,'Adrenal gland','start')}${L(152,200,20,210,'Ureter','start')}${L(210,270,300,262,'Bladder','start')}${L(180,324,260,326,'Urethra','start')}
${L(193,40,300,36,'Aorta','start')}${L(176,60,300,60,'Vena cava','start')}${L(214,122,300,112,'Renal vessels','start')}
`,'Diagram of the kidneys, ureters, bladder and urethra')};

D.skeleton={cap:"Main bones of the skeleton",svg:svg(400,430,`${RL(24,400)}
<g class="bone">
<ellipse cx="180" cy="36" rx="20" ry="24"/><path d="M168,54Q180,66 192,54L190,64H170Z"/>
<path d="M180,66V240" class="spine"/>
<path d="M140,82Q180,74 220,82" class="clav"/>
<path d="M150,96Q140,130 152,176M210,96Q220,130 208,176M154,104Q180,112 206,104M152,120Q180,130 208,120M152,136Q180,146 208,136M154,152Q180,162 206,152M156,166Q180,174 204,166" class="rib"/>
<path d="M176,86h8v40h-8z"/>
<path d="M146,226Q180,210 214,226Q222,252 204,262Q180,250 156,262Q138,252 146,226Z"/>
<path d="M140,84L126,168" class="long"/><path d="M126,172L116,238M128,172L122,238" class="long2"/>
<path d="M220,84L234,168" class="long"/><path d="M234,172L244,238M232,172L238,238" class="long2"/>
<path d="M160,262L154,344" class="long"/><path d="M200,262L206,344" class="long"/>
<path d="M153,350L151,410M158,350L158,408" class="long2"/><path d="M207,350L209,410M202,350L202,408" class="long2"/>
<circle cx="154" cy="347" r="5"/><circle cx="206" cy="347" r="5"/>
</g>
${L(196,30,280,24,'Skull','start')}${L(210,80,280,62,'Clavicle','start')}${L(180,100,280,90,'Sternum','start')}${L(206,140,280,120,'Ribs (12 pairs)','start')}${L(229,130,300,150,'Humerus','start')}${L(242,210,300,196,'Radius and ulna','start')}
${L(180,200,280,226,'Spine (vertebrae)','start')}${L(206,240,300,254,'Pelvis','start')}${L(154,300,60,300,'Femur','start')}${L(154,347,60,340,'Knee (patella)','start')}${L(152,386,60,384,'Tibia and fibula','start')}
`,'Simplified skeleton showing the main bones')};

D.endocrine={cap:"Endocrine glands",svg:svg(400,420,`${BODY}
<g class="f-gland ol2"><circle cx="180" cy="36" r="5"/><path d="M168,66Q180,76 192,66Q192,74 180,78Q168,74 168,66Z"/><circle cx="180" cy="100" r="7"/><path d="M152,168q8,-10 16,0z"/><path d="M192,168q8,-10 16,0z"/><path d="M164,184Q190,176 210,186Q190,192 164,188Z"/><circle cx="160" cy="228" r="6"/><circle cx="200" cy="228" r="6"/></g>
${L(180,36,280,24,'Pituitary','start')}${L(190,70,280,60,'Thyroid','start')}${L(186,100,280,96,'Thymus','start')}
${L(206,166,280,150,'Adrenal glands','start')}${L(200,186,280,184,'Pancreas (islets)','start')}${L(160,228,40,230,'Ovaries (female)','start')}${T(262,300,'Testes (male)','start','sm')}${T(262,314,'in the scrotum','start','sm')}
`,'Body outline showing pituitary, thyroid, thymus, adrenal glands, pancreas and ovaries')};

D.glucose={cap:"How glucose is kept in range",svg:svg(400,250,`
<rect class="band" x="150" y="101" width="100" height="48" rx="12"/>${T(200,121,'Blood glucose','middle','b')}${T(200,137,'about 4–7 mmol/L','middle','sm')}
<rect class="f-art2" x="140" y="10" width="120" height="44" rx="10"/>${T(200,30,'After a meal','middle','b')}${T(200,46,'glucose rises','middle','sm')}
<rect class="f-ven2" x="140" y="196" width="120" height="44" rx="10"/>${T(200,216,'Fasting, exercise','middle','b')}${T(200,232,'glucose falls','middle','sm')}
<path d="M260,32Q304,40 300,95Q296,125 254,125" class="art" marker-end="url(#ar)"/>
<path d="M140,218Q96,210 100,155Q104,125 146,125" class="vein" marker-end="url(#ar)"/>
${T(310,81,'Pancreas','start','sm b')}${T(310,97,'releases insulin:','start','sm')}${T(310,113,'cells take','start','sm')}${T(310,129,'up glucose','start','sm')}
${T(90,139,'Pancreas','end','sm b')}${T(90,155,'glucagon:','end','sm')}${T(90,171,'liver releases','end','sm')}${T(90,187,'glucose','end','sm')}
`,'Feedback loop of insulin and glucagon controlling blood glucose')};
D.glucose.note="Type 1 diabetes: no insulin is made. Type 2: insulin doesn't work well. Too much insulin or too little food causes hypoglycaemia.";

D.lymph={cap:"Lymphatic system and immune organs",svg:svg(400,420,`${BODY}
<path class="lymv" d="M180,70V230M180,90L140,90L126,160M180,90L220,90L234,160M180,230L162,320M180,230L198,320"/>
<g class="f-lymph ol2"><circle cx="166" cy="64" r="4"/><circle cx="194" cy="64" r="4"/><circle cx="162" cy="72" r="3"/><circle cx="198" cy="72" r="3"/><circle cx="142" cy="96" r="4"/><circle cx="218" cy="96" r="4"/><circle cx="146" cy="104" r="3"/><circle cx="214" cy="104" r="3"/><circle cx="160" cy="232" r="4"/><circle cx="200" cy="232" r="4"/><circle cx="164" cy="240" r="3"/><circle cx="196" cy="240" r="3"/><path d="M172,96q8,-8 16,0v14q-8,6 -16,0z"/></g>
<path class="f-spleen" d="M204,150Q222,142 220,164Q210,176 200,164Z"/><path class="f-lymph" d="M172,46q8,6 16,0" />
${L(194,64,280,40,'Cervical nodes','start')}${L(180,102,280,94,'Thymus','start')}${L(218,98,280,122,'Axillary nodes','start')}${L(212,160,280,168,'Spleen','start')}${L(200,232,280,226,'Inguinal nodes','start')}${L(180,48,40,40,'Tonsils','start')}${L(180,180,40,180,'Lymphatic vessels','start')}
`,'Body outline showing lymph node groups, thymus, spleen and lymphatic vessels')};

D.skin={cap:"Skin layers and burn depth",svg:svg(400,270,`
<rect class="sk1" x="20" y="40" width="250" height="26"/><rect class="sk2" x="20" y="66" width="250" height="100"/><rect class="sk3" x="20" y="166" width="250" height="80"/>
<path class="hair" d="M80,10Q84,40 90,120"/><path class="fol" d="M84,90Q76,120 90,128Q104,120 96,90Z"/>
<path class="sweat" d="M160,40V120Q150,134 164,138Q178,134 168,122"/>
<path class="cap2" d="M30,150Q70,130 110,150T190,150T270,150" style="stroke:var(--art)"/><path class="cap2" d="M30,158Q70,138 110,158T190,158T270,158" style="stroke:var(--ven)"/>
<g class="fatc"><circle cx="50" cy="200" r="12"/><circle cx="80" cy="214" r="12"/><circle cx="116" cy="198" r="12"/><circle cx="150" cy="216" r="12"/><circle cx="190" cy="200" r="12"/><circle cx="226" cy="216" r="12"/><circle cx="250" cy="192" r="10"/></g>
<path class="nerve" d="M230,240Q220,180 236,110"/>
${T(24,58,'Epidermis','start','sm b')}${T(24,84,'Dermis','start','sm b')}${T(24,184,'Subcutaneous fat','start','sm b')}
${L(90,110,120,96,'Hair follicle','start')}${L(166,134,190,126,'Sweat gland','start')}${L(234,120,200,110,'Nerve','end')}
<path class="brk b1" d="M284,40V66"/>${T(292,54,'Superficial','start','sm b')}${T(292,66,'red, painful','start','sm')}
<path class="brk b2" d="M284,72V160"/>${T(292,110,'Partial','start','sm b')}${T(292,122,'thickness','start','sm b')}${T(292,136,'blisters, very','start','sm')}${T(292,148,'painful','start','sm')}
<path class="brk b3" d="M284,40V246"/>${T(292,200,'Full','start','sm b')}${T(292,212,'thickness','start','sm b')}${T(292,226,'white/charred,','start','sm')}${T(292,238,'may be painless','start','sm')}
`,'Cross-section of skin showing epidermis, dermis and subcutaneous fat with burn depth')};

D.nines={cap:"Rule of nines (adult burns area)",svg:svg(400,420,`${BODY}
<g class="zone"><ellipse class="z1" cx="180" cy="38" rx="21" ry="25"/><path class="z2" d="M142,79Q127,84 125,99L113,172L105,232Q103,243 111,245L117,245L123,237L135,178L141,142Z"/><path class="z2" d="M218,79Q233,84 235,99L247,172L255,232Q257,243 249,245L243,245L237,237L225,178L219,142Z"/><path class="z3" d="M170,72L142,79L141,142L143,202L141,238L219,238L217,202L219,142L218,79L190,72Z"/><path class="z4" d="M141,238L147,332L151,394Q151,404 161,404L172,404L175,394L177,302L180,252Z"/><path class="z4" d="M219,238L213,332L209,394Q209,404 199,404L188,404L185,394L183,302L180,252Z"/></g>
${T(180,42,'9%','middle','b')}${T(122,150,'9%','middle','b')}${T(238,150,'9%','middle','b')}${T(180,150,'18%','middle','b')}${T(180,166,'front','middle','sm')}${T(160,330,'18%','middle','b')}${T(200,330,'18%','middle','b')}
${T(300,120,'Back of trunk','middle','sm')}${T(300,136,'18%','middle','b')}${T(300,190,'Perineum','middle','sm')}${T(300,206,'1%','middle','b')}
${T(56,120,'Patient\u2019s palm','middle','sm')}${T(56,136,'with fingers','middle','sm')}${T(56,152,'≈ 1%','middle','b')}
`,'Adult rule of nines showing body surface area percentages')};
D.nines.note="Don't count simple redness (superficial burns). Children have proportionally larger heads and smaller legs, so the adult rule of nines overestimates leg burns and underestimates head burns.";

D.repro={cap:"Female reproductive organs (front view)",svg:svg(400,260,`
<path class="f-uterus" d="M140,60Q180,40 220,60Q224,130 196,168H164Q136,130 140,60Z"/>
<path class="f-uterus2" d="M164,168h32v26h-32z"/><path class="f-uterus3" d="M168,194h24v50h-24z"/>
<path class="tube" d="M142,70Q110,50 80,70Q64,86 76,100M218,70Q250,50 280,70Q296,86 284,100"/>
<ellipse class="f-ovary" cx="96" cy="104" rx="18" ry="11"/><ellipse class="f-ovary" cx="264" cy="104" rx="18" ry="11"/>
<path class="endo" d="M154,70Q180,60 206,70Q204,120 186,150H174Q156,120 154,70Z"/>
${L(180,100,300,160,'Uterus (womb)','start')}${L(110,56,20,30,'Fallopian tube','start')}${L(96,104,20,140,'Ovary','start')}${L(180,182,300,190,'Cervix','start')}${L(180,226,300,230,'Vagina','start')}
`,'Front view of uterus, fallopian tubes, ovaries, cervix and vagina')};
D.repro.note="An ectopic pregnancy most often implants in a fallopian tube and can rupture at around 4–10 weeks, causing internal bleeding.";

D.fundus={cap:"Fundal height: estimating weeks of pregnancy",svg:svg(400,320,`
<path class="ol" d="M110,20Q180,6 250,20Q284,160 262,290Q180,310 98,290Q76,160 110,20Z"/>
<path class="lvl" d="M130,250Q180,232 230,250"/><path class="lvl" d="M118,196Q180,168 242,196"/><path class="lvl" d="M112,146Q180,112 248,146"/><path class="lvl" d="M112,96Q180,60 248,96"/><path class="lvl" d="M118,56Q180,26 242,56"/>
<circle class="f-art" cx="180" cy="160" r="5"/><path class="pubis" d="M140,284Q180,270 220,284"/>
${T(250,258,'12 weeks: just above pubic bone','start','sm')}${T(250,200,'16 weeks','start','sm')}${T(252,150,'20 weeks: umbilicus','start','sm b')}${T(252,100,'28 weeks','start','sm')}${T(248,60,'36 weeks: below ribs','start','sm')}
${T(110,290,'Pubic bone','end','sm')}${T(174,176,'Umbilicus','end','sm')}
`,'Fundal height levels at 12, 16, 20, 28 and 36 weeks of pregnancy')};
D.fundus.note="From about 20 weeks, a pregnant patient lying flat can compress the vena cava and drop their BP: tilt them to the left or displace the bump manually.";

D.eye={cap:"The eye (cross-section)",svg:svg(400,240,`
<circle class="f-eye ol2" cx="200" cy="120" r="90"/>
<path class="f-retina" d="M200,30A90,90 0 0 1 200,210A90,90 0 0 1 200,30" style="fill:none"/>
<path class="retina" d="M150,46A90,90 0 1 1 150,194"/>
<path class="cornea" d="M118,78Q86,120 118,162"/>
<path class="iris" d="M122,78V104M122,136V162"/><ellipse class="lens" cx="136" cy="120" rx="10" ry="26"/>
<path class="optic" d="M288,106L340,98M288,134L340,142"/><path class="optic2" d="M288,106L340,98L340,142L288,134Z"/>
<path class="light" d="M20,100L118,104M20,140L118,136" marker-end="url(#ar)"/>
${L(104,120,40,40,'Cornea','start')}${L(122,92,60,20,'Iris','start')}${T(80,122,'Pupil','end','sm')}${L(136,140,110,210,'Lens','start')}${L(270,70,310,40,'Retina','start')}${L(210,120,250,120,'Vitreous humour','start')}${L(318,120,330,190,'Optic nerve','end')}
`,'Cross-section of the eye showing cornea, iris, pupil, lens, retina and optic nerve')};

D.pupils={cap:"Pupil size gauge (mm)",svg:svg(400,190,`
${[2,3,4,5,6,7,8].map((mm,i)=>{const x=30+i*50;return `<circle class="irisg" cx="${x}" cy="60" r="21"/><circle class="pupil" cx="${x}" cy="60" r="${mm*2.4}"/>${T(x,100,mm+' mm','middle','sm b')}`}).join('')}
${T(55,120,'Pinpoint','middle','sm')}${T(55,134,'opioids','middle','sm')}${T(155,120,'Normal range','middle','sm')}${T(155,134,'in room light','middle','sm')}${T(305,120,'Dilated','middle','sm')}${T(305,134,'stimulants, hypoxia','middle','sm')}
<circle class="irisg" cx="140" cy="164" r="17"/><circle class="pupil" cx="140" cy="164" r="4"/><circle class="irisg" cx="190" cy="164" r="17"/><circle class="pupil" cx="190" cy="164" r="12"/>
${T(220,160,'Unequal with falling GCS:','start','sm b')}${T(220,174,'time-critical','start','sm')}
`,'Pupil size gauge from 2 to 8 millimetres')};
D.pupils.note="Hold your phone next to the patient's eye to compare. Screen size affects scale, so use it as a guide, not a measurement.";

D.blood={cap:"What blood is made of",svg:svg(400,260,`
<path class="tube" d="M60,20h60v200q0,30 -30,30q-30,0 -30,-30z" style="fill:none"/>
<clipPath id="tb"><path d="M60,20h60v200q0,30 -30,30q-30,0 -30,-30z"/></clipPath>
<g clip-path="url(#tb)"><rect class="plasma" x="60" y="30" width="60" height="110"/><rect class="buffy" x="60" y="140" width="60" height="6"/><rect class="f-art" x="60" y="146" width="60" height="110"/></g>
${L(120,84,150,84,'Plasma about 55%','start')}${L(120,143,150,143,'White cells and platelets (<1%)','start')}${L(120,200,150,200,'Red cells about 45%','start')}
<ellipse class="f-art" cx="170" cy="30" rx="14" ry="14"/><ellipse class="rbcc" cx="170" cy="30" rx="6" ry="6"/>${T(190,34,'Red cell: carries O₂','start','sm')}
<circle class="wbc" cx="170" cy="240" r="12"/><path class="wbcn" d="M164,236q6,-8 10,2q-4,8 -10,4z"/>${T(190,244,'White cell: fights infection','start','sm')}
<g class="plt"><circle cx="270" cy="56" r="4"/><circle cx="281" cy="61" r="3"/><circle cx="276" cy="50" r="3"/></g>${T(290,60,'Platelets: clotting','start','sm')}
`,'Test tube showing plasma, white cells and platelets, and red cells')};

D.feedback={cap:"Negative feedback: body temperature",svg:svg(400,300,`
<rect class="band" x="150" y="126" width="100" height="48" rx="12"/>${T(200,146,'Hypothalamus','middle','b')}${T(200,162,'set point ~37°C','middle','sm')}
<rect class="f-art2" x="140" y="10" width="120" height="44" rx="10"/>${T(200,30,'Too hot','middle','b')}${T(200,46,'fever, exertion, heat','middle','sm')}
<rect class="f-ven2" x="140" y="246" width="120" height="44" rx="10"/>${T(200,266,'Too cold','middle','b')}${T(200,282,'exposure, long lie','middle','sm')}
<path d="M260,32Q304,40 300,120Q296,150 254,150" class="art" marker-end="url(#ar)"/>
<path d="M140,268Q96,260 100,180Q104,150 146,150" class="vein" marker-end="url(#ar)"/>
${T(310,106,'Sweating','start','sm b')}${T(310,122,'skin vessels','start','sm')}${T(310,138,'widen (flushed,','start','sm')}${T(310,154,'warm)','start','sm')}
${T(90,164,'Shivering','end','sm b')}${T(90,180,'vessels narrow','end','sm')}${T(90,196,'(pale, cool)','end','sm')}
`,'Negative feedback loop controlling body temperature')};
D.feedback.note="The same pale, cool skin you see in the cold is also the body protecting BP in shock. Always read skin signs alongside the obs.";

window.DIAGRAMS=D;
window.DG={T,L,svg,RL,BODY};
})();
