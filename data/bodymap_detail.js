// Pain & symptom checker, detail layer (v46):
// close-up views (hand & wrist, knee, ankle & foot), inner thigh, area-specific follow-up questions
// and "what do you see?" findings. Answers and findings re-rank the causes for the area they belong to.
(function(){
const B=window.BODYMAP;
const R=(x,y,w,h)=>({r:[x,y,w,h]}), E=(x,y,rx,ry)=>({e:[x,y,rx,ry]}), P=p=>({p});
const mir=(pts,W)=>pts.split(' ').map(pt=>{const [x,y]=pt.split(',');return (W-+x)+','+y;}).join(' ');

// ---- Inner thigh: split the front thigh into front/outer and inner
const splitThigh=(id,side,pOuter,pInner)=>{const i=B.FRONT.findIndex(r=>r[0]===id);if(i<0)return;
  B.FRONT[i]=[id,(side==='r'?'Right':'Left')+' thigh (front and outer)','thigh',side,P(pOuter)];
  B.FRONT.splice(i+1,0,['ithigh_'+side,(side==='r'?'Right':'Left')+' inner thigh','ithigh',side,P(pInner)]);};
splitThigh('thigh_r','r','148,256 164,257 163,310 152,310','164,257 176,258 174,310 163,310');
splitThigh('thigh_l','l',mir('148,256 164,257 163,310 152,310',360),mir('164,257 176,258 174,310 163,310',360));

// ---- Close-up views. Shapes are drawn for the RIGHT side; mirrored panels flip for the left.
// panels: [x0,x1,label]; regions: [key,label,type,shape,panelIndex]
const handOutline=`<rect class="ol" x="40" y="108" width="80" height="94" rx="16"/><rect class="ol" x="55" y="196" width="50" height="44" rx="6"/>
 <rect class="ol" x="42" y="30" width="17" height="86" rx="8"/><rect class="ol" x="62" y="18" width="17" height="98" rx="8"/><rect class="ol" x="82" y="28" width="17" height="88" rx="8"/><rect class="ol" x="102" y="50" width="15" height="66" rx="7"/>
 <polygon class="ol" points="42,152 14,120 8,100 20,92 48,122"/>`;
const kneeOutline=`<path class="ol" d="M45,10 L105,10 L108,95 Q114,118 104,142 L98,240 L52,240 L46,142 Q36,118 42,95 Z"/>`;
const footOutline=`<path class="ol" d="M25,10 L25,110 Q15,125 14,145 Q14,168 32,168 L138,168 Q150,166 148,154 Q146,146 130,142 L62,112 L55,105 L55,10 Z"/>`;
B.ZOOM={
 hand:{t:'Hand & wrist',vb:'0 0 300 262',mirror:true,panels:[[5,135,'Palm'],[165,295,'Back of hand']],
  outline:[handOutline,`<g transform="translate(300,0) scale(-1,1)">${handOutline}</g>`],
  regions:[
   ['thumb','thumb','thumb',P('40,146 16,119 11,102 20,96 45,124'),0],
   ['index','index finger','finger',R(44,32,13,72),0],['middle','middle finger','finger',R(64,20,13,84),0],['ring','ring finger','finger',R(84,30,13,74),0],['little','little finger','finger',R(104,52,11,52),0],
   ['thenar','base of the thumb (palm side)','thumbbase',E(56,158,13,22),0],['palm','palm','palm',R(72,118,44,74),0],
   ['wrad','wrist, thumb side','wristrad',R(56,202,24,36),0],['wuln','wrist, little finger side','wristuln',R(81,202,23,36),0],
   ['knuck','knuckles','knuckle',R(182,104,76,14),1],['dorsum','back of the hand','handback',R(184,121,72,76),1],
   ['snuff','snuffbox (hollow at the base of the thumb)','snuffbox',E(250,199,10,9),1],['bwrist','back of the wrist','wrist',R(196,210,44,28),1]]},
 knee:{t:'Knee',vb:'0 0 320 250',mirror:true,panels:[[5,150,'Front'],[170,315,'Back']],
  outline:[kneeOutline+'<ellipse class="ol" cx="75" cy="112" rx="15" ry="17" style="fill:none"/>',`<g transform="translate(165,0)">${kneeOutline}</g>`],
  regions:[
   ['above','above the kneecap','kneeabove',R(57,66,36,22),0],['patella','kneecap','patella',E(75,112,14,16),0],['below','below the kneecap','kneebelow',R(62,132,26,26),0],
   ['outer','outer side of the knee','kneelat',E(47,118,7,16),0],['inner','inner side of the knee','kneemed',E(103,118,7,16),0],
   ['backknee','back of the knee','popliteal',P('240,98 255,118 240,140 225,118'),1]]},
 foot:{t:'Ankle & foot',vb:'0 0 320 182',mirror:false,panels:[[0,160,'Outer side'],[162,322,'Inner side']],
  outline:[footOutline,`<g transform="translate(162,0)">${footOutline}</g>`],
  regions:[
   ['achilles','Achilles tendon','heel',P('19,70 29,70 29,114 17,122'),0],['latmall','outer ankle bone','latmall',E(41,118,8,8),0],['heel','heel','heel',E(30,152,12,11),0],
   ['mt5','base of the 5th toe bone (outer midfoot)','mt5',E(96,160,10,6),0],['dorsum','top of the foot','footdorsum',P('64,116 122,140 116,150 62,130'),0],['toes','smaller toes','toes',E(137,157,10,9),0],
   ['medmall','inner ankle bone','medmall',E(203,116,8,8),1],['navic','bony bump on the inner midfoot','navic',E(236,140,9,7),1],
   ['arch','arch and sole','arch',P('212,166 280,166 276,158 216,158'),1],['bigtoe','big toe joint','bigtoe',E(290,157,9,8),1]]}};
// Build both sides: [id,label,type,side,shape,view]
const mshape=(s,x0,x1)=>{const M=x=>x0+x1-x;return s.r?{r:[M(s.r[0]+s.r[2]),s.r[1],s.r[2],s.r[3]]}:s.e?{e:[M(s.e[0]),s.e[1],s.e[2],s.e[3]]}:{p:s.p.split(' ').map(q=>{const [x,y]=q.split(',');return M(+x)+','+y;}).join(' ')};};
B.ZREG=[];Object.entries(B.ZOOM).forEach(([view,z])=>['r','l'].forEach(side=>z.regions.forEach(([key,label,type,shape,pi])=>{
  const pn=z.panels[pi];const s=(side==='l'&&z.mirror)?mshape(shape,pn[0],pn[1]):shape;
  B.ZREG.push(['z_'+side+'_'+view+'_'+key,(side==='r'?'Right ':'Left ')+label,type,side,s,view]);})));
B.ZOOM_FOR={wrist:'hand',hand:'hand',knee:'knee',popliteal:'knee',ankle:'foot',foot:'foot',heel:'foot',sole:'foot'};

// ---- Causes for the new areas: [name, condition id, serious, "features (! = key)", note, sex, side]
Object.assign(B.C,{
 thumb:[['Thumb fracture or dislocation','fractures',0,'!trauma'],['Thumb ligament injury (skier’s thumb)',null,0,'trauma','Fall onto an outstretched thumb; weak pinch grip'],['Tendon sheath infection','flexorsheath',1,'!redhot fever'],['Base of thumb arthritis',null,0,'mech'],['Gout or arthritis',null,0,'redhot']],
 finger:[['Finger fracture or dislocation','fractures',0,'!trauma'],['Mallet finger',null,0,'trauma','End of the finger droops after a knock and won’t straighten'],['Tendon sheath infection','flexorsheath',1,'!redhot fever','Finger held bent, very painful to straighten'],['Nail fold infection (paronychia)',null,0,'redhot'],['Crush or fingertip injury',null,0,'trauma'],['Trigger finger',null,0,'mech'],['Gout or arthritis',null,0,'redhot']],
 snuffbox:[['Scaphoid fracture','fractures',1,'!trauma','Often looks normal on the first X-ray; treat as a fracture if tender here'],['Wrist sprain',null,0,'trauma mech'],['De Quervain’s tendinitis',null,0,'mech']],
 palm:[['Palm wound or puncture',null,1,'!trauma','Check every finger bends and can feel'],['Tendon sheath infection','flexorsheath',1,'!redhot fever'],['Deep palm infection',null,1,'!redhot fever'],['Crush injury or compartment syndrome','compartment',1,'!painoop trauma']],
 thumbbase:[['Base of thumb arthritis',null,0,'mech'],['Thumb fracture or dislocation','fractures',0,'!trauma'],['Carpal tunnel syndrome',null,0,'focal']],
 handback:[['Hand (metacarpal) fracture','fractures',0,'!trauma'],['Hand infection or cellulitis','cellulitis',1,'!redhot fever'],['Bruise',null,0,'trauma'],['Ganglion',null,0,'']],
 knuckle:[['Boxer’s fracture (knuckle)','fractures',0,'!trauma','Usually the little finger knuckle after a punch'],['Fight bite (tooth wound over a knuckle)','bites',1,'!trauma redhot','Punch to the mouth: high risk of joint infection'],['Septic arthritis','septicjoint',1,'!fever redhot'],['Gout or arthritis',null,0,'redhot']],
 wristrad:[['Distal radius fracture','fractures',1,'!trauma','Fall on an outstretched hand; often older adults'],['De Quervain’s tendinitis',null,0,'mech'],['Wrist sprain',null,0,'trauma mech'],['Septic arthritis','septicjoint',1,'!fever redhot'],['Ganglion',null,0,'']],
 wristuln:[['Wrist fracture (little finger side)','fractures',0,'!trauma'],['Wrist sprain',null,0,'trauma mech'],['Ulnar nerve irritation',null,0,'focal'],['Gout or arthritis',null,0,'redhot']],
 patella:[['Kneecap fracture','fractures',1,'!trauma','Fall onto the knee; can’t lift the leg straight'],['Kneecap dislocation',null,0,'!trauma sudden','Kneecap seen out to the side, often in young people after a twist'],['Bursitis',null,0,'redhot','Swelling in front of the kneecap (housemaid’s knee)'],['Septic arthritis','septicjoint',1,'!fever redhot'],['Kneecap pain (patellofemoral)',null,0,'mech']],
 kneemed:[['Ligament or cartilage injury',null,0,'trauma mech','Inner (medial) ligament or meniscus'],['Osteoarthritis',null,0,'mech'],['Bursitis',null,0,'redhot'],['Septic arthritis','septicjoint',1,'!fever redhot'],['Fracture or dislocation','fractures',1,'!trauma']],
 kneelat:[['Ligament or cartilage injury',null,0,'trauma mech','Outer (lateral) ligament or meniscus'],['Iliotibial band pain',null,0,'mech','Runners and cyclists'],['Osteoarthritis',null,0,'mech'],['Fracture or dislocation','fractures',1,'!trauma']],
 kneebelow:[['Patellar tendon rupture or tendinitis',null,0,'sudden mech','Can’t straighten the knee against gravity = rupture'],['Osgood–Schlatter disease',null,0,'mech','Active 10–15 year olds; tender bump below the kneecap'],['Tibial plateau or tubercle fracture','fractures',1,'!trauma'],['Bursitis',null,0,'redhot']],
 kneeabove:[['Quadriceps tendon rupture',null,1,'!sudden','Older adults; can’t straighten the knee; gap above the kneecap'],['Quadriceps strain',null,0,'mech'],['Femur fracture','hip',1,'!trauma'],['Septic arthritis','septicjoint',1,'!fever redhot']],
 latmall:[['Ankle fracture','fractures',1,'!trauma','Ottawa: tender at the back edge or tip of the outer ankle bone'],['Ankle sprain',null,0,'trauma mech'],['Peroneal tendon injury',null,0,'mech']],
 medmall:[['Ankle fracture','fractures',1,'!trauma','Ottawa: tender at the back edge or tip of the inner ankle bone'],['Ankle sprain',null,0,'trauma mech'],['Tibialis posterior tendon problem',null,0,'mech']],
 mt5:[['Base of 5th metatarsal fracture','fractures',1,'!trauma','Ottawa: tender here after turning the ankle'],['Ankle sprain',null,0,'trauma mech']],
 navic:[['Navicular or midfoot fracture','fractures',1,'!trauma','Ottawa: tender over the bony bump on the inner midfoot'],['Midfoot (Lisfranc) injury','fractures',1,'!trauma','Bruising on the sole of the midfoot is a warning sign'],['Tibialis posterior tendon problem',null,0,'mech']],
 bigtoe:[['Gout',null,0,'!redhot','Classic first attack: very hot, red, swollen big toe joint'],['Toe fracture or dislocation','fractures',0,'trauma'],['Turf toe sprain',null,0,'trauma mech'],['Bunion or arthritis',null,0,'mech'],['Ingrown toenail',null,0,''],['Diabetic foot infection','diabetes',1,'!fever redhot']],
 toes:[['Toe fracture or dislocation','fractures',0,'trauma'],['Morton’s neuroma',null,0,'mech','Burning between the 3rd and 4th toes'],['Ingrown toenail',null,0,''],['Diabetic foot infection','diabetes',1,'!fever redhot'],['Acute limb ischaemia','limbisch',1,'!coldpale']],
 footdorsum:[['Metatarsal fracture','fractures',0,'trauma mech'],['Midfoot (Lisfranc) injury','fractures',1,'!trauma'],['Cellulitis','cellulitis',1,'!redhot fever'],['Gout',null,0,'redhot'],['Extensor tendinitis',null,0,'mech']],
 arch:[['Plantar fasciitis',null,0,'mech','Worst on the first steps in the morning'],['Diabetic foot ulcer or infection','diabetes',1,'!fever redhot'],['Puncture wound or foreign body',null,0,'trauma'],['Midfoot (Lisfranc) injury','fractures',1,'!trauma']],
 ithigh:[['DVT','dvt',1,'!legswell','Swelling of the whole leg'],['Groin strain',null,0,'mech sudden','Adductor strain in sport'],['Inguinal or femoral hernia',null,0,'mech'],['Femur fracture','hip',1,'!trauma'],['Cellulitis','cellulitis',1,'!redhot fever'],['Swollen lymph glands',null,0,'fever']]});

// ---- Terms for the new areas
Object.assign(B.COMMON,{thumb:'',finger:'',snuffbox:'scaphoid area',palm:'palmar',thumbbase:'thenar',handback:'dorsum of hand',knuckle:'knuckles',wristrad:'distal radius',wristuln:'ulnar side of wrist',
 patella:'patella',kneemed:'medial joint line',kneelat:'lateral joint line',kneebelow:'patellar tendon',kneeabove:'quadriceps tendon',
 latmall:'lateral malleolus',medmall:'medial malleolus',mt5:'base of 5th metatarsal',navic:'navicular',bigtoe:'1st MTP joint',toes:'',footdorsum:'dorsum of foot',arch:'plantar',ithigh:''});
Object.assign(B.MED,{thumb:'pollex',finger:'digit',snuffbox:'anatomical snuffbox',palm:'palmar region',thumbbase:'thenar eminence',handback:'dorsum of hand',knuckle:'metacarpophalangeal joints',wristrad:'distal radius',wristuln:'distal ulna',
 patella:'patella',kneemed:'medial joint line',kneelat:'lateral joint line',kneebelow:'patellar tendon / tibial tuberosity',kneeabove:'quadriceps tendon',
 latmall:'lateral malleolus',medmall:'medial malleolus',mt5:'base of 5th metatarsal',navic:'navicular',bigtoe:'1st metatarsophalangeal joint',toes:'lesser toes',footdorsum:'dorsum of foot',arch:'plantar arch',ithigh:'medial thigh (adductors)'});
const SIDED=new Set(['temple','eye','ear','cheek','jaw','neckside','shoulder','chestside','upperarm','elbow','forearm','wrist','hand','ruq','luq','flank','rlq','llq','hip','groin','thigh','knee','shin','ankle','foot','scapula','loin','buttock','hthigh','popliteal','calf','heel','sole',
 'thumb','finger','snuffbox','palm','thumbbase','handback','knuckle','wristrad','wristuln','patella','kneemed','kneelat','kneebelow','kneeabove','latmall','medmall','mt5','navic','bigtoe','toes','footdorsum','arch','ithigh']);
const NOSIDE_COMMON=new Set(['ruq','luq','rlq','llq']);
B.medTerm=(type,side,mode)=>{mode=mode||'common';if(mode==='off')return '';const t=(mode==='full'?B.MED:B.COMMON)[type];if(!t)return '';
  const pre=SIDED.has(type)&&side&&!(mode!=='full'&&NOSIDE_COMMON.has(type))?(side==='l'?'left ':'right '):'';return pre+t;};

// ---- Area groups (which follow-up questions and findings each area gets)
B.FUMAP={chestc:'chest',chestside:'chest',scapula:'chest',upperback:'chest',
 epi:'abdo',ruq:'abdo',luq:'abdo',flank:'abdo',umb:'abdo',rlq:'abdo',llq:'abdo',supra:'abdo',
 tophead:'head',forehead:'head',temple:'head',occiput:'head',eye:'eye',ear:'ear',nose:'nose',mouth:'mouthjaw',jaw:'mouthjaw',cheek:'mouthjaw',throat:'throat',neckside:'neck',neckback:'neck',
 shoulder:'shoulder',upperarm:'arm',elbow:'arm',forearm:'arm',
 wrist:'hand',hand:'hand',thumb:'hand',finger:'hand',snuffbox:'hand',palm:'hand',thumbbase:'hand',handback:'hand',knuckle:'hand',wristrad:'hand',wristuln:'hand',
 hip:'hip',groin:'hip',genitals:'genital',thigh:'thigh',hthigh:'thigh',ithigh:'thigh',
 knee:'knee',popliteal:'knee',patella:'knee',kneemed:'knee',kneelat:'knee',kneebelow:'knee',kneeabove:'knee',shin:'leg',calf:'leg',
 ankle:'ankle',latmall:'ankle',medmall:'ankle',mt5:'ankle',navic:'ankle',heel:'ankle',
 foot:'foot',sole:'foot',bigtoe:'foot',toes:'foot',footdorsum:'foot',arch:'foot',
 lowback:'back',midback:'back',tailbone:'back',buttock:'back',loin:'loin'};
// Follow-up questions: [id, question, short tag, yes effects [[regex, weight]], no effects, alert {on,t,p}]
const AAA={t:'Older adult with sudden pain and feeling faint',p:'Leaking abdominal aortic aneurysm until proven otherwise: escalate.'};
const SKULL={t:'Fluid after a head injury',p:'Possible base of skull fracture: escalate.'};
B.FU={
 chest:[
  ['press','Worse when you press on the chest wall?','Tender to press',[[/chest wall|rib|muscle|strain|shingles/i,3],[/heart attack|acs|angina/i,-1]],[[/chest wall|rib fracture|muscle/i,-2]]],
  ['breath','Worse on breathing in or coughing?','Worse breathing in',[[/embolism|pneumothorax|pneumonia|pleurisy|rib|chest wall|chest injury/i,3]],[]],
  ['spread','Spreads to the arm, jaw, neck or back?','Spreads to arm/jaw/back',[[/heart attack|acs|angina/i,3],[/dissection/i,2]],[],{on:'y',t:'Chest pain spreading to the arm, jaw, neck or back',p:'Cardiac (or aortic dissection if tearing to the back) until proven otherwise.'}],
  ['exert','Brought on by exertion and eased by rest?','Exertional',[[/angina|heart attack|acs/i,3]],[]]],
 abdo:[
  ['still','Lying very still because moving or coughing hurts?','Lying still',[[/appendicitis|perforat|ulcer|diverticulitis|internal bleeding|ectopic|gallbladder infection|pancreatitis/i,2]],[]],
  ['restless','Restless and rolling around, can’t get comfortable?','Restless',[[/kidney stone|colic|gallstone|obstruction/i,3]],[]],
  ['swollen','Abdomen swollen, tight or hard?','Swollen or hard abdomen',[[/obstruction|internal bleeding|aneurysm|liver|ruptured/i,3]],[],{on:'y',t:'Swollen or rigid abdomen',p:'Possible obstruction, perforation or internal bleeding: escalate.'}],
  ['moved','Did it start around the belly button and move?','Pain moved',[[/appendicitis/i,3]],[]],
  ['preg','Could they be pregnant, or have they missed a period?','Possibly pregnant',[[/ectopic|miscarriage|pre-eclampsia|ovarian/i,4]],[[/ectopic|miscarriage/i,-3]],{on:'y',t:'Possible pregnancy with abdominal pain',p:'Ectopic pregnancy until proven otherwise.'}]],
 head:[
  ['thunder','Came on within seconds, or the worst headache ever?','Sudden, worst ever',[[/subarachnoid/i,6]],[],{on:'y',t:'Thunderclap headache',p:'Subarachnoid haemorrhage until proven otherwise: escalate.'}],
  ['lying','Worse lying down or coughing, or with vomiting?','Worse lying/coughing',[[/bleed|head injury|carbon monoxide/i,2]],[]],
  ['light','Light hurts their eyes, or the neck is stiff?','Light hurts/stiff neck',[[/meningitis|subarachnoid|migraine/i,2]],[]],
  ['scalp','Over 50 with a tender scalp or jaw pain when chewing?','Scalp tender/jaw pain',[[/giant cell/i,6]],[]],
  ['usual','Like their usual headaches?','Their usual headache',[[/migraine|tension/i,3],[/subarachnoid|meningitis|bleed|carbon/i,-2]],[[/migraine|tension/i,-1]]]],
 eye:[
  ['vision','Vision reduced, blurred or lost?','Vision affected',[[/glaucoma|stroke|giant cell|orbital|injury/i,3]],[],{on:'y',t:'Change in vision',p:'Needs same-day or emergency eye or stroke assessment.'}],
  ['redpain','Painful red eye?','Painful red eye',[[/glaucoma|orbital|injury|conjunctivitis|shingles/i,2]],[]],
  ['foreign','Something went in it, or a chemical splash?','Foreign body/chemical',[[/eye injury|foreign/i,6]],[]],
  ['lids','Swollen eyelids with pain moving the eye?','Swollen lids, painful movement',[[/orbital/i,6]],[]]],
 ear:[
  ['disch','Discharge from the ear?','Ear discharge',[[/ear infection|base of skull/i,2]],[]],
  ['spin','Spinning, unsteady or sudden hearing loss?','Spinning/hearing loss',[[/inner ear|stroke/i,3]],[]],
  ['behind','Red, swollen or tender behind the ear?','Swelling behind ear',[[/mastoid/i,6]],[]],
  ['fluid','Clear fluid or blood from the ear after a head injury?','Fluid after head injury',[[/base of skull/i,6]],[],Object.assign({on:'y'},SKULL)]],
 nose:[
  ['long','Bleeding for over 20 minutes despite pressure?','Prolonged bleed',[[/nosebleed/i,3]],[]],
  ['fluid','Clear fluid from the nose after a head injury?','Clear fluid',[[/base of skull/i,6]],[],Object.assign({on:'y'},SKULL)],
  ['bent','Nose bent or swollen after a blow?','Deformed',[[/broken nose/i,5]],[]]],
 mouthjaw:[
  ['exert','Pain with exertion, sweating or breathlessness?','Exertional/sweaty',[[/heart attack/i,6]],[],{on:'y',t:'Jaw or face pain with exertion or sweating',p:'Possible heart attack: treat as cardiac.'}],
  ['swell','Swelling of the face, under the chin or the tongue?','Facial swelling',[[/dental|abscess|anaphylaxis|angioedema|salivary|cellulitis/i,3]],[]],
  ['bite','Teeth don’t meet, or can’t open or close the mouth?','Bite doesn’t meet',[[/jaw fracture|facial fracture/i,5]],[]],
  ['tooth','Started in a tooth?','Tooth pain',[[/dental|tooth/i,4]],[]]],
 throat:[
  ['drool','Drooling, or can’t swallow their own saliva?','Drooling',[[/epiglott|quinsy/i,6]],[],{on:'y',t:'Drooling or unable to swallow saliva',p:'Airway at risk: keep upright and calm, don’t look in the throat, escalate.'}],
  ['voice','Muffled voice or noisy breathing (stridor)?','Muffled voice/stridor',[[/epiglott|anaphylaxis|choking|quinsy/i,4]],[]],
  ['lips','Swollen lips or tongue?','Swollen lips/tongue',[[/anaphylaxis/i,6]],[]],
  ['one','Sore on one side only, and can’t open the mouth fully?','One-sided, trismus',[[/quinsy/i,6]],[]]],
 neck:[
  ['stiff','Stiff neck, can’t touch chin to chest?','Stiff neck',[[/meningitis|subarachnoid/i,3]],[]],
  ['arms','Tingling, numbness or weakness in the arms?','Arm tingling/weak',[[/spine|cervical|neck injury|nerve/i,3]],[],{on:'y',t:'Neck pain with arm symptoms',p:'Possible spinal cord or nerve injury: spinal precautions per training.'}],
  ['stroke','Neck pain followed by stroke symptoms?','Then stroke signs',[[/dissection/i,6]],[]],
  ['injury','After a fall, collision or diving?','Injury',[[/injury|whiplash|cervical/i,3]],[]]],
 shoulder:[
  ['lift','Can they lift the arm above the shoulder?','Lifts arm',[[/dislocation|fracture/i,-2]],[[/dislocation|fracture|rotator|frozen/i,3]]],
  ['square','Shoulder looks squared off or deformed?','Deformed shoulder',[[/dislocation|fracture/i,6]],[]],
  ['tip','Pain at the shoulder tip with abdominal pain?','Tip pain + abdo pain',[[/diaphragm|ectopic|gallbladder/i,4]],[]],
  ['exert','Left shoulder or arm pain with exertion or sweating?','Exertional',[[/heart attack/i,5]],[]]],
 arm:[
  ['move','Can they move the joints fully?','Full movement',[[/fracture|dislocation/i,-2]],[[/fracture|dislocation|tendon|compartment/i,3]]],
  ['tingle','Tingling, numbness or weakness in the hand?','Hand tingling/weak',[[/nerve|compartment|fracture|ulnar|carpal/i,3]],[]],
  ['stretch','Pain on gently straightening the fingers?','Pain on stretch',[[/compartment/i,6]],[],{on:'y',t:'Pain on passive stretch',p:'Possible compartment syndrome: loosen tight dressings, escalate.'}],
  ['whole','Whole arm swollen?','Whole arm swollen',[[/dvt|lymph|cellulitis/i,4]],[]]],
 hand:[
  ['foosh','Fell onto an outstretched hand?','Fell on hand',[[/scaphoid|radius|wrist.*fracture|wrist fracture|fracture/i,3]],[]],
  ['snuff','Tender in the hollow at the base of the thumb (snuffbox)?','Snuffbox tender',[[/scaphoid/i,7],[/radius|wrist.*fracture/i,2]],[],{on:'y',t:'Snuffbox tenderness',p:'Treat as a scaphoid fracture even if it looks like a sprain: support it and refer for X-ray.'}],
  ['bent','Finger held bent and very painful to straighten?','Bent, painful finger',[[/tendon sheath/i,7]],[]],
  ['punch','Punched something or someone?','Punch injury',[[/boxer|metacarpal|hand.*fracture|fight bite/i,4]],[],{on:'y',t:'Punch injury',p:'Any wound over a knuckle is a fight bite until proven otherwise: high infection risk, needs assessment.'}],
  ['tingle','Tingling or numbness in the fingers?','Finger tingling',[[/carpal|nerve|compartment/i,3]],[]]],
 hip:[
  ['weight','Can they bear weight?','Bearing weight',[[/fracture/i,-2]],[[/hip fracture|femur|fracture/i,4]]],
  ['short','Leg shortened and turned outwards?','Shortened, rotated',[[/hip fracture|femur/i,7]],[],{on:'y',t:'Shortened, rotated leg',p:'Hip fracture: don’t stand them, keep warm, escalate.'}],
  ['lump','Lump that comes and goes?','Lump',[[/hernia/i,4]],[]],
  ['stuck','Tender lump that won’t go back, with vomiting?','Stuck tender lump',[[/strangulated/i,7]],[],{on:'y',t:'Tender lump that won’t go back',p:'Possible strangulated hernia: escalate.'}]],
 genital:[
  ['sudden','Came on suddenly (minutes to a few hours)?','Sudden onset',[[/torsion/i,5]],[[/epididym/i,2]],{on:'y',t:'Sudden testicular pain',p:'Testicular torsion until proven otherwise: time-critical surgery.'}],
  ['high','Testis sitting higher, or at an odd angle?','High-riding testis',[[/testicular torsion/i,6]],[]],
  ['urine','Burning urine or discharge?','Urinary symptoms',[[/epididym|uti|urinary/i,4]],[]],
  ['spread','Fever with spreading redness or skin colour change?','Fever, spreading',[[/fournier/i,6]],[]]],
 thigh:[
  ['swollen','Leg swollen compared with the other?','Leg swollen',[[/dvt|cellulitis/i,4]],[]],
  ['deform','Thigh deformed or shortened after an injury?','Deformed thigh',[[/femur|fracture/i,7]],[],{on:'y',t:'Possible femur fracture',p:'Major blood loss risk: escalate, watch for shock.'}],
  ['sport','Sudden pain during sport or running?','During sport',[[/strain|hamstring|tear/i,4]],[]]],
 knee:[
  ['steps','Could they take 4 steps straight after and now?','4 steps',[[/fracture/i,-2]],[[/fracture/i,4]],{on:'n',t:'Can’t take 4 steps (Ottawa knee rule)',p:'Needs an X-ray to rule out a fracture.'}],
  ['bend','Can they bend the knee to a right angle?','Bends to 90°',[],[[/fracture/i,3]]],
  ['fast','Swelled up within hours of a twist?','Rapid swelling after twist',[[/ligament|cartilage|fracture|dislocation/i,4]],[]],
  ['hot','Hot, red and swollen without an injury?','Hot swollen, no injury',[[/septic|gout|bursitis/i,4]],[]],
  ['slr','Can they lift the leg straight off the bed?','Straight-leg raise',[],[[/tendon rupture|quadriceps|patellar|kneecap fracture/i,6]]]],
 leg:[
  ['swollen','Leg swollen compared with the other?','Leg swollen',[[/dvt|baker|cellulitis/i,4]],[]],
  ['squeeze','Calf tender when gently squeezed?','Calf tender',[[/dvt|calf/i,2]],[]],
  ['cold','Foot cold, pale or without a pulse?','Cold, pale foot',[[/ischaemia|aneurysm/i,7]],[],{on:'y',t:'Cold, pale or pulseless leg',p:'Acute limb ischaemia: time-critical.'}],
  ['oop','Pain far worse than expected for the injury?','Pain out of proportion',[[/compartment|ischaemia/i,5]],[]]],
 ankle:[
  ['steps','Could they take 4 steps straight after the injury and now?','4 steps',[[/fracture/i,-2],[/sprain/i,2]],[[/fracture|lisfranc|midfoot/i,4]],{on:'n',t:'Can’t take 4 steps (Ottawa ankle rule)',p:'Needs an X-ray to rule out a fracture.'}],
  ['mall','Tender at the back edge or tip of either ankle bone?','Ankle bone tender',[[/ankle fracture/i,5]],[],{on:'y',t:'Bony tenderness at the ankle (Ottawa)',p:'Needs an X-ray to rule out a fracture.'}],
  ['mid','Tender at the base of the 5th toe bone or the bony bump on the inner midfoot?','Midfoot bone tender',[[/5th metatarsal|navicular|midfoot|lisfranc/i,5]],[]],
  ['kick','Felt like a kick to the back of the heel?','Kick at heel',[[/achilles/i,7]],[]],
  ['height','Fell from height onto their feet?','Fall from height',[[/heel bone|fracture/i,4]],[],{on:'y',t:'Fall from height onto the feet',p:'Heel fractures often come with spinal fractures: check the back.'}]],
 foot:[
  ['gout','Big toe joint hot, red and swollen?','Hot big toe',[[/gout/i,5]],[]],
  ['diab','Diabetic with a wound, ulcer or colour change?','Diabetic foot',[[/diabetic/i,6]],[],{on:'y',t:'Diabetic foot problem',p:'Can progress fast and may be painless: same-day assessment.'}],
  ['cold','Foot cold, pale or mottled?','Cold foot',[[/ischaemia/i,7]],[]],
  ['morning','Worst on the first steps in the morning?','Morning pain',[[/plantar/i,5]],[]],
  ['tread','Trod on something sharp?','Trod on something',[[/puncture|foreign/i,6]],[]]],
 back:[
  ['saddle','Numb around the bottom or genitals, or new bladder or bowel problems?','Saddle numbness/bladder',[[/cauda/i,8]],[],{on:'y',t:'Possible cauda equina syndrome',p:'Surgical emergency: escalate now.'}],
  ['leg','Pain shooting down the leg below the knee?','Pain down leg',[[/sciatica|cauda/i,3]],[]],
  ['night','Worse at night or at rest, or a history of cancer?','Night pain/cancer',[[/spinal fracture|infection|cancer/i,4]],[]],
  ['faint','Over 50 with sudden pain and feeling faint?','Sudden + faint',[[/aneurysm/i,7]],[],Object.assign({on:'y'},AAA)],
  ['urine','Fever or burning urine?','Fever/urinary',[[/kidney infection/i,4]],[]]],
 loin:[
  ['waves','Comes in waves and spreads to the groin?','Waves to groin',[[/kidney stone/i,5]],[]],
  ['fever','Fever, shivering or burning urine?','Fever/urinary',[[/kidney infection/i,5]],[]],
  ['faint','Over 60 and feeling faint?','Over 60, faint',[[/aneurysm/i,7]],[],Object.assign({on:'y'},AAA)]]};
// Findings ("What do you see?"): [id, label]; which groups get which; and how they re-rank causes
B.FIND=[['swelling','Swelling'],['bruise','Bruising'],['wound','Wound or bleeding'],['deform','Deformity'],['redhot','Red and hot'],['tender','Tender to touch'],['rash','Rash or blisters'],['nomove','Can’t move or use it'],['numb','Numb or tingling beyond'],['coldpale','Cold or pale beyond']];
const LIMB=['swelling','bruise','wound','deform','redhot','tender','rash','nomove','numb','coldpale'],TRUNK=['swelling','bruise','wound','redhot','tender','rash'],FACE=['swelling','bruise','wound','deform','tender','rash'];
B.FIND_SET={chest:TRUNK,abdo:TRUNK,back:TRUNK,loin:TRUNK,genital:TRUNK,head:FACE,eye:FACE,ear:FACE,nose:FACE,mouthjaw:FACE,throat:FACE,neck:TRUNK};
B.findFor=g=>B.FIND_SET[g]||LIMB;
B.FINDR={
 swelling:[/fracture|sprain|ligament|dvt|cellulitis|septic|gout|bursitis|abscess|baker|compartment|bite|anaphylaxis|angioedema|dental|salivary|hernia|torsion|epididym|dislocation|mastoid|orbital|infection/i,2],
 bruise:[/fracture|sprain|ligament|injury|bruise|bleed|spleen|tear|strain|haemorrhage|platelet|non-accidental|dislocation|rupture/i,2],
 wound:[/wound|laceration|bite|tendon|puncture|embedded|catastrophic|skin tear|scalp|infection|cellulitis|burn|crush|fingertip/i,3],
 deform:[/fracture|dislocation/i,6],
 redhot:[/cellulitis|septic|gout|bursitis|abscess|infection|necrotising|mastoid|orbital|fournier|tendon sheath|paronychia|diabetic|dvt/i,4],
 tender:[/fracture|strain|sprain|chest wall|rib|bruise|bursitis|tendinitis|tendon|ligament|gout|cellulitis|abscess|appendicitis|diverticulitis|gallbladder|gallstone|septic|arthritis|scaphoid|kneecap|plantar|quervain/i,2],
 rash:[/shingles|cellulitis|meningitis|anaphylaxis|hives|lyme|chickenpox|viral rash|necrotising|stevens|fournier/i,4],
 nomove:[/fracture|dislocation|septic|rupture|tendon|compartment|cauda|stroke|frozen|rotator/i,3],
 numb:[/compartment|nerve|tendon|ischaemia|cauda|spinal|stroke|carpal|sciatica|dissection|crush|fracture|dislocation|cervical/i,3],
 coldpale:[/ischaemia|compartment|fracture|dislocation|aneurysm/i,4]};
B.FIND_ALERT={deform:{t:'Deformity',p:'Check circulation, feeling and movement beyond it; support in the position found; escalate.'},
 numb:{t:'Numb or tingling beyond the injury',p:'Possible nerve or blood vessel damage: escalate.'},coldpale:{t:'Cold or pale beyond the injury',p:'Possible loss of blood supply: time-critical.'}};
})();
