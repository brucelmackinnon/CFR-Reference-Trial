// Pain & symptom checker: detailed regions with area-specific causes.
// Front and head views: patient's right on the viewer's LEFT. Back view: patient's left on the viewer's LEFT.
(function(){
const R=(x,y,w,h)=>({r:[x,y,w,h]}), E=(x,y,rx,ry)=>({e:[x,y,rx,ry]}), P=p=>({p});
const mir=(pts,W)=>pts.split(' ').map(pt=>{const [x,y]=pt.split(',');return (W-+x)+','+y;}).join(' ');
const M=p=>P(mir(p,360));
// [id, label, type, side, shape]
const FRONT=[
 ['head','Head and face (tap for detail)','zoom','',E(180,38,21,25)],['throat_f','Throat / front of neck','throat','',R(171,62,18,13)],
 ['sh_r','Right shoulder','shoulder','r',E(138,88,9,10)],['sh_l','Left shoulder','shoulder','l',E(222,88,9,10)],
 ['chest_r','Right chest','chestside','r',R(143,82,22,46)],['chest_c','Centre of chest','chestc','',R(165,82,30,46)],['chest_l','Left chest','chestside','l',R(195,82,22,46)],
 ['uarm_r','Right upper arm','upperarm','r',P('126,98 141,98 139,150 123,150')],['uarm_l','Left upper arm','upperarm','l',M('126,98 141,98 139,150 123,150')],
 ['elbow_r','Right elbow','elbow','r',E(129,161,9,9)],['elbow_l','Left elbow','elbow','l',E(231,161,9,9)],
 ['farm_r','Right forearm','forearm','r',P('119,171 136,175 129,220 111,218')],['farm_l','Left forearm','forearm','l',M('119,171 136,175 129,220 111,218')],
 ['wrist_r','Right wrist','wrist','r',P('110,220 129,222 127,231 108,230')],['wrist_l','Left wrist','wrist','l',M('110,220 129,222 127,231 108,230')],
 ['hand_r','Right hand and fingers','hand','r',P('107,232 127,233 122,248 103,245')],['hand_l','Left hand and fingers','hand','l',M('107,232 127,233 122,248 103,245')],
 ['ruq','Right upper abdomen','ruq','r',R(143,130,22,28)],['epi','Upper centre (epigastric)','epi','',R(165,130,30,28)],['luq','Left upper abdomen','luq','l',R(195,130,22,28)],
 ['flank_r','Right side of abdomen','flank','r',R(143,158,22,28)],['umb','Around the belly button','umb','',R(165,158,30,28)],['flank_l','Left side of abdomen','flank','l',R(195,158,22,28)],
 ['rlq','Right lower abdomen','rlq','r',R(143,186,22,34)],['supra','Lower centre (above pubic bone)','supra','',R(165,186,30,30)],['llq','Left lower abdomen','llq','l',R(195,186,22,34)],
 ['hip_r','Right hip (outer)','hip','r',P('141,222 150,222 150,248 143,244')],['hip_l','Left hip (outer)','hip','l',M('141,222 150,222 150,248 143,244')],
 ['groin_r','Right groin crease','groin','r',P('151,222 167,228 166,245 151,241')],['groin_l','Left groin crease','groin','l',M('151,222 167,228 166,245 151,241')],
 ['genitals','Genitals (testes, scrotum, vulva)','genitals','',P('170,219 190,219 188,247 172,247')],
 ['thigh_r','Right thigh','thigh','r',P('148,256 176,258 174,310 152,310')],['thigh_l','Left thigh','thigh','l',M('148,256 176,258 174,310 152,310')],
 ['knee_r','Right knee','knee','r',E(163,321,12,9)],['knee_l','Left knee','knee','l',E(197,321,12,9)],
 ['shin_r','Right shin','shin','r',P('152,332 175,332 174,377 156,377')],['shin_l','Left shin','shin','l',M('152,332 175,332 174,377 156,377')],
 ['ankle_r','Right ankle','ankle','r',R(154,379,21,10)],['ankle_l','Left ankle','ankle','l',R(185,379,21,10)],
 ['foot_r','Right foot and toes','foot','r',R(150,390,27,15)],['foot_l','Left foot and toes','foot','l',R(183,390,27,15)]];
const BACK=[
 ['head_b','Back of head','occiput','',E(180,32,20,20)],['neck_b','Back of neck','neckback','',R(170,56,20,20)],
 ['bsh_l','Left shoulder (back)','shoulder','l',E(138,88,9,10)],['bsh_r','Right shoulder (back)','shoulder','r',E(222,88,9,10)],
 ['scap_l','Left shoulder blade','scapula','l',P('147,84 171,84 169,130 149,126')],['scap_r','Right shoulder blade','scapula','r',M('147,84 171,84 169,130 149,126')],
 ['spine_up','Spine between the shoulder blades','upperback','',R(172,84,16,48)],
 ['loin_l','Left loin (kidney area)','loin','l',R(143,136,26,48)],['mid_back','Middle of the back','midback','',R(169,136,22,48)],['loin_r','Right loin (kidney area)','loin','r',R(191,136,26,48)],
 ['low_back','Lower back','lowback','',R(150,186,60,30)],['tail','Tailbone (coccyx)','tailbone','',P('171,216 189,216 180,234')],
 ['butt_l','Left buttock','buttock','l',P('143,218 169,218 175,254 147,252')],['butt_r','Right buttock','buttock','r',M('143,218 169,218 175,254 147,252')],
 ['buarm_l','Back of left upper arm','upperarm','l',P('126,98 141,98 139,150 123,150')],['buarm_r','Back of right upper arm','upperarm','r',M('126,98 141,98 139,150 123,150')],
 ['belbow_l','Point of left elbow','elbow','l',E(129,161,9,9)],['belbow_r','Point of right elbow','elbow','r',E(231,161,9,9)],
 ['bfarm_l','Back of left forearm','forearm','l',P('119,171 136,175 129,220 111,218')],['bfarm_r','Back of right forearm','forearm','r',M('119,171 136,175 129,220 111,218')],
 ['bhand_l','Back of left hand and wrist','hand','l',P('108,221 129,223 122,248 103,245')],['bhand_r','Back of right hand and wrist','hand','r',M('108,221 129,223 122,248 103,245')],
 ['hthigh_l','Back of left thigh','hthigh','l',P('148,258 176,260 174,310 152,310')],['hthigh_r','Back of right thigh','hthigh','r',M('148,258 176,260 174,310 152,310')],
 ['popl_l','Back of left knee','popliteal','l',E(163,321,11,8)],['popl_r','Back of right knee','popliteal','r',E(197,321,11,8)],
 ['calf_l','Left calf','calf','l',P('152,332 175,332 174,377 156,377')],['calf_r','Right calf','calf','r',M('152,332 175,332 174,377 156,377')],
 ['heel_l','Left heel and Achilles','heel','l',R(154,379,21,12)],['heel_r','Right heel and Achilles','heel','r',R(185,379,21,12)],
 ['sole_l','Sole of left foot','sole','l',R(150,392,27,13)],['sole_r','Sole of right foot','sole','r',R(183,392,27,13)]];
const H=p=>P(mir(p,240));
const HEAD=[
 ['top_head','Top of head','tophead','',E(120,38,48,18)],['forehead','Forehead','forehead','',R(78,52,84,34)],
 ['temple_r','Right temple','temple','r',E(60,94,13,22)],['temple_l','Left temple','temple','l',E(180,94,13,22)],
 ['eye_r','Right eye','eye','r',E(95,106,17,11)],['eye_l','Left eye','eye','l',E(145,106,17,11)],
 ['ear_r','Right ear','ear','r',E(42,118,11,25)],['ear_l','Left ear','ear','l',E(198,118,11,25)],
 ['nose','Nose','nose','',P('112,116 128,116 131,146 109,146')],
 ['cheek_r','Right cheek and sinus','cheek','r',E(80,140,17,15)],['cheek_l','Left cheek and sinus','cheek','l',E(160,140,17,15)],
 ['mouth','Mouth, teeth and tongue','mouth','',E(120,166,22,10)],
 ['jaw_r','Right jaw','jaw','r',P('58,152 80,160 96,188 70,180')],['jaw_l','Left jaw','jaw','l',H('58,152 80,160 96,188 70,180')],
 ['throat','Throat (front of neck)','throat','',R(102,204,36,52)],
 ['neck_r','Right side of neck','neckside','r',R(84,204,17,52)],['neck_l','Left side of neck','neckside','l',R(139,204,17,52)]];

// Area-specific causes: [name, condition id, serious, "features (! = key)", note, sex, side]
const C={
 tophead:[['Subarachnoid haemorrhage','sah',1,'!sudden headache vomit neckstiff faint confused','Thunderclap \u201cworst ever\u201d headache'],['Bleed after head injury','headinj',1,'!trauma vomit confused headache','Higher risk on anticoagulants or over 65'],['Meningitis','meningitis',1,'!fever neckstiff rash headache confused vomit'],['Carbon monoxide poisoning','co',1,'headache dizzy vomit confused','Others in the building unwell'],['Tension headache',null,0,'headache','Band-like, both sides'],['Migraine',null,0,'headache vomit speech','Often with aura or light sensitivity'],['Scalp wound',null,0,'trauma']],
 forehead:[['Sinusitis',null,0,'headache fever','Worse bending forward, blocked nose'],['Tension headache',null,0,'headache'],['Migraine',null,0,'headache vomit speech'],['Head injury','headinj',1,'!trauma vomit confused'],['Subarachnoid haemorrhage','sah',1,'!sudden headache vomit neckstiff'],['Meningitis','meningitis',1,'!fever neckstiff rash'],['Shingles of the forehead',null,1,'rash headache','Near the eye needs same-day assessment']],
 temple:[['Giant cell (temporal) arteritis',null,1,'headache !speech','Over 50, tender temple, jaw pain on chewing, vision loss: same-day treatment'],['Migraine',null,0,'headache vomit speech'],['Tension headache',null,0,'headache'],['Temple injury (bleed risk)','headinj',1,'!trauma confused vomit','Temple fractures can tear an artery (extradural bleed)'],['Jaw joint (TMJ) pain',null,0,'mech']],
 eye:[['Acute glaucoma',null,1,'!vomit headache sudden','Painful red eye, blurred vision, halos'],['Stroke or TIA (vision loss)','stroke',1,'!speech focal sudden','Sudden loss of vision in one eye or half the field'],['Giant cell (temporal) arteritis',null,1,'speech headache','Over 50: risk of permanent blindness'],['Eye injury or foreign body',null,0,'trauma'],['Eye-socket (orbital) cellulitis',null,1,'!fever redhot swelling','Swollen lids, pain moving the eye'],['Shingles near the eye',null,1,'rash','Same-day eye assessment'],['Migraine aura',null,0,'headache speech'],['Conjunctivitis',null,0,'redhot']],
 ear:[['Ear infection',null,0,'fever','Common in children'],['Mastoiditis',null,1,'fever !redhot','Red, swollen, tender behind the ear'],['Base of skull fracture','headinj',1,'!trauma','Blood or clear fluid from the ear, bruising behind the ear'],['Inner ear problem (labyrinthitis, vertigo)',null,0,'dizzy vomit','Spinning, worse moving the head'],['Posterior circulation stroke','stroke',1,'dizzy !focal speech','Vertigo plus slurred speech, double vision or unsteadiness'],['Ear injury or foreign body',null,0,'trauma']],
 nose:[['Nosebleed',null,0,'','Lean forward, pinch the soft part for 10\u201315 min; anticoagulants and high BP make it worse'],['Broken nose',null,0,'trauma'],['Sinusitis',null,0,'fever headache'],['Foreign body (children)',null,0,''],['Base of skull fracture','headinj',1,'!trauma','Clear fluid from the nose after a head injury']],
 cheek:[['Dental abscess',null,1,'fever redhot swelling','Spreading facial swelling can threaten the airway'],['Sinusitis',null,0,'fever headache'],['Facial fracture',null,1,'!trauma','Check eye movements and bite'],['Trigeminal neuralgia',null,0,'sharp','Brief electric-shock pains'],['Facial cellulitis','cellulitis',1,'!fever redhot'],['Stroke (facial droop)','stroke',1,'!focal speech','Run BE-FAST']],
 mouth:[['Anaphylaxis or angioedema','anaphylaxis',1,'!swelling breathless rash trigger','Swollen lips or tongue; ACE inhibitors can cause angioedema'],['Dental abscess or toothache',null,0,'fever swelling'],['Stroke (slurred speech)','stroke',1,'!speech focal'],['Mouth injury, bleeding',null,0,'trauma'],['Mouth ulcers or oral thrush',null,0,'']],
 jaw:[['Heart attack (jaw pain)','acs',1,'!tight sweat breathless vomit','Jaw ache with exertion or sweating'],['Dental infection or abscess',null,1,'fever swelling redhot'],['Giant cell (temporal) arteritis',null,1,'headache speech','Over 50, pain on chewing'],['Jaw fracture or dislocation',null,0,'!trauma','Can\u2019t close the mouth or teeth don\u2019t meet'],['Jaw joint (TMJ) pain',null,0,'mech'],['Swollen salivary gland',null,0,'fever swelling']],
 throat:[['Epiglottitis or deep neck infection',null,1,'!swallow fever breathless','Drooling, muffled voice, stridor: keep upright and calm'],['Anaphylaxis','anaphylaxis',1,'!swelling breathless rash trigger'],['Tonsillitis or sore throat',null,0,'fever swallow'],['Quinsy (tonsil abscess)',null,1,'fever swallow','One-sided, can\u2019t open mouth fully'],['Choking or foreign body',null,1,'!breathless sudden swallow'],['Heart attack (throat tightness)','acs',1,'!tight sweat breathless'],['Neck injury',null,1,'trauma']],
 neckside:[['Swollen lymph glands',null,0,'fever','Usually from infection'],['Muscle strain or wry neck',null,0,'mech'],['Carotid artery dissection',null,1,'!sudden headache focal speech','Neck pain then stroke symptoms, sometimes after minor trauma'],['Meningitis','meningitis',1,'!neckstiff fever rash headache'],['Neck (cervical spine) injury','cauda',1,'!trauma focal'],['Heart attack (referred)','acs',1,'tight sweat']],
 occiput:[['Tension headache',null,0,'headache'],['Subarachnoid haemorrhage','sah',1,'!sudden headache vomit neckstiff'],['Meningitis','meningitis',1,'!fever neckstiff rash'],['Head injury','headinj',1,'!trauma vomit confused'],['Posterior circulation stroke','stroke',1,'dizzy !focal speech'],['Pain from the neck (cervicogenic)',null,0,'mech']],
 neckback:[['Muscle strain or whiplash',null,0,'mech trauma'],['Neck (cervical spine) injury','cauda',1,'!trauma focal','Spinal precautions per training'],['Meningitis','meningitis',1,'!neckstiff fever'],['Subarachnoid haemorrhage','sah',1,'!sudden headache neckstiff'],['Vertebral artery dissection',null,1,'!sudden dizzy focal speech']],
 shoulder:[['Heart attack (referred)','acs',1,'!tight sweat breathless','Left shoulder or arm with chest pain','','l'],['Blood under the diaphragm (shoulder-tip pain)',null,1,'!faint dizzy','Ruptured ectopic, spleen or perforation'],['Ruptured ectopic pregnancy','ectopic',1,'!pregbleed faint','Shoulder-tip pain with abdominal pain','f'],['Gallbladder (referred)',null,0,'vomit fever','With right upper abdominal pain','','r'],['Dislocation or fracture',null,1,'!trauma'],['Rotator cuff or frozen shoulder',null,0,'mech'],['Polymyalgia rheumatica',null,0,'','Older adult, both shoulders stiff']],
 chestc:[['Chest injury with pneumothorax or internal bleeding',null,1,'!trauma breathless faint','Don\u2019t remove embedded objects; time-critical'],['Heart attack (ACS)','acs',1,'!tight sweat breathless vomit faint','Crushing, heavy, sweaty'],['Aortic dissection','dissection',1,'!tearing sudden faint','Through to the back'],['Pulmonary embolism','pe',1,'!breathless pleuritic sudden legswell'],['Oesophageal rupture',null,1,'vomit sudden','After forceful vomiting'],['Angina','angina',0,'tight breathless','Exertional, settles with rest or GTN'],['Reflux or indigestion',null,0,'burning'],['Chest wall pain',null,0,'mech','Tender to press'],['Anxiety or panic','panic',0,'palp breathless','Only after ruling out the rest']],
 chestside:[['Chest injury with pneumothorax or internal bleeding',null,1,'!trauma breathless faint','Don\u2019t remove embedded objects; time-critical'],['Heart attack','acs',1,'!tight sweat breathless','','','l'],['Pulmonary embolism','pe',1,'!pleuritic breathless sudden legswell'],['Pneumothorax','ptx',1,'!sudden breathless sharp'],['Pneumonia or pleurisy','pneumonia',1,'!fever cough pleuritic'],['Rib fracture or chest wall injury',null,0,'trauma mech'],['Shingles (before the rash)',null,0,'burning rash','Burning band on one side']],
 upperarm:[['Heart attack (referred)','acs',1,'!tight sweat breathless','Arm heaviness with chest pain','','l'],['Fracture of the upper arm',null,1,'!trauma'],['Upper limb DVT',null,1,'!legswell','Whole arm swollen, often with a line or pacemaker'],['Cellulitis','cellulitis',1,'!redhot fever'],['Muscle strain or tendinitis',null,0,'mech'],['Trapped nerve in the neck',null,0,'focal','Pain or tingling running down the arm']],
 elbow:[['Elbow fracture or dislocation',null,1,'!trauma','Check pulse and feeling in the hand'],['Infected bursitis',null,1,'!redhot fever','Swelling on the point of the elbow'],['Septic arthritis',null,1,'!fever redhot'],['Tennis or golfer\u2019s elbow',null,0,'mech'],['Gout',null,0,'redhot'],['Ulnar nerve irritation',null,0,'focal','Tingling in ring and little fingers']],
 forearm:[['Forearm fracture',null,1,'!trauma'],['Compartment syndrome',null,1,'!painoop trauma','Pain far worse than expected, worse stretching the fingers'],['Cellulitis','cellulitis',1,'!redhot fever'],['Upper limb DVT',null,1,'legswell'],['Muscle or tendon strain',null,0,'mech']],
 wrist:[['Wrist (scaphoid or radius) fracture',null,1,'!trauma','Fall on an outstretched hand; often older adults with fragile bones'],['Sprain',null,0,'trauma mech'],['Septic arthritis',null,1,'!fever redhot'],['Carpal tunnel syndrome',null,0,'focal','Tingling thumb to ring finger, worse at night'],['Gout or arthritis',null,0,'redhot'],['Ganglion',null,0,'']],
 hand:[['Hand or finger fracture',null,0,'trauma','Punch injuries: check for a tooth wound over the knuckle'],['Hand infection or cellulitis','cellulitis',1,'!redhot fever'],['Tendon sheath infection',null,1,'!fever redhot mech','Swollen finger held bent, very painful to straighten'],['Crush injury or compartment syndrome',null,1,'!painoop trauma'],['Acute limb ischaemia',null,1,'!coldpale','Cold, pale, painful hand'],['Carpal tunnel syndrome',null,0,'focal'],['Gout or arthritis',null,0,'redhot']],
 ruq:[['Internal bleeding from injury',null,1,'!trauma faint dizzy','Pale, fast pulse, falling BP: time-critical'],['Gallbladder infection or cholangitis',null,1,'!fever vomit','Fever, jaundice, rigors'],['Gallstone pain',null,0,'colicky vomit','After fatty food'],['Pneumonia (lower right lung)','pneumonia',1,'!cough fever pleuritic'],['Liver disease or hepatitis','cirrhosis',1,''],['HELLP / pre-eclampsia','preeclampsia',1,'!pregbleed headache','Pregnant or recently given birth','f'],['Muscle strain or shingles',null,0,'mech rash']],
 epi:[['Internal bleeding from injury',null,1,'!trauma faint dizzy','Pale, fast pulse, falling BP: time-critical'],['Heart attack','acs',1,'!tight sweat breathless vomit','\u201cIndigestion\u201d with sweating or breathlessness'],['Abdominal aortic aneurysm','aaa',1,'!faint sudden sweat','Older adult, pain to the back, collapse'],['Pancreatitis','pancreatitis',1,'!vomit sudden fever','Severe, through to the back'],['Bleeding or perforated ulcer','gibleed',1,'!gibleed faint sudden vomit'],['Indigestion, reflux or gastritis',null,0,'burning'],['Gallstones',null,0,'colicky vomit'],['Early appendicitis','appendicitis',0,'vomit','Later moves to the right lower abdomen']],
 luq:[['Ruptured spleen',null,1,'!trauma faint','After a blow to the left lower ribs'],['Pancreatitis','pancreatitis',1,'!vomit fever'],['Pneumonia (lower left lung)','pneumonia',1,'!cough fever pleuritic'],['Heart attack','acs',1,'tight sweat'],['Gastritis',null,0,'burning'],['Constipation or wind',null,0,'colicky']],
 flank:[['Internal bleeding from injury',null,1,'!trauma faint dizzy','Pale, fast pulse, falling BP: time-critical'],['Kidney infection','uti',1,'!fever urinary'],['Kidney stone','colic',0,'!colicky vomit urinary'],['Abdominal aortic aneurysm','aaa',1,'!faint sudden'],['Constipation',null,0,'colicky'],['Muscle strain',null,0,'mech']],
 umb:[['Internal bleeding from injury',null,1,'!trauma faint dizzy','Pale, fast pulse, falling BP: time-critical'],['Abdominal aortic aneurysm','aaa',1,'!faint sudden sweat'],['Bowel obstruction','obstruction',1,'!vomit colicky'],['Early appendicitis','appendicitis',1,'vomit fever'],['Gut ischaemia (mesenteric)',null,1,'painoop','Older adult with AF, pain out of proportion'],['Gastroenteritis','gastro',0,'!diarrhoea vomit fever'],['Constipation or IBS',null,0,'colicky'],['Umbilical hernia',null,0,'mech']],
 rlq:[['Internal bleeding from injury',null,1,'!trauma faint dizzy','Pale, fast pulse, falling BP: time-critical'],['Appendicitis','appendicitis',1,'!vomit fever mech'],['Ectopic pregnancy','ectopic',1,'!pregbleed faint dizzy','','f'],['Ovarian torsion or cyst',null,1,'!sudden vomit','','f'],['Testicular torsion (referred)',null,1,'!sudden vomit','Always check the testes','m'],['Kidney stone','colic',0,'colicky urinary'],['Constipation, IBS or period pain',null,0,'colicky']],
 llq:[['Internal bleeding from injury',null,1,'!trauma faint dizzy','Pale, fast pulse, falling BP: time-critical'],['Diverticulitis',null,1,'!fever','Older adult'],['Ectopic pregnancy','ectopic',1,'!pregbleed faint dizzy','','f'],['Ovarian torsion or cyst',null,1,'!sudden vomit','','f'],['Testicular torsion (referred)',null,1,'!sudden vomit','Always check the testes','m'],['Kidney stone','colic',0,'colicky urinary'],['Constipation, IBS or period pain',null,0,'colicky']],
 supra:[['Internal bleeding from injury',null,1,'!trauma faint dizzy','Pale, fast pulse, falling BP: time-critical'],['Urinary retention',null,1,'!urinary','Can\u2019t pass urine, tender swelling above the pubic bone'],['Urinary tract infection','uti',0,'!urinary fever'],['Miscarriage or ectopic','ectopic',1,'!pregbleed faint','','f'],['Pelvic infection',null,1,'fever','','f'],['Period pain',null,0,'colicky','','f'],['Constipation',null,0,'colicky']],
 hip:[['Hip fracture','hip',1,'!trauma','Older adult after a fall, shortened rotated leg'],['Septic arthritis',null,1,'!fever'],['Bursitis (outer hip)',null,0,'mech'],['Hip arthritis',null,0,'mech'],['Sciatica (referred)',null,0,'focal']],
 groin:[['Strangulated hernia','obstruction',1,'!vomit colicky','Tender lump that won\u2019t go back'],['Inguinal or femoral hernia',null,0,'mech'],['Hip fracture (felt in the groin)','hip',1,'!trauma'],['Kidney stone (radiating)','colic',0,'colicky urinary'],['Testicular torsion (referred)',null,1,'!sudden vomit','','m'],['Swollen lymph glands',null,0,'fever'],['Groin strain',null,0,'mech']],
 genitals:[['Testicular torsion',null,1,'!sudden vomit','Sudden testicular pain: time-critical surgery (6 hours)','m'],['Epididymitis or orchitis',null,0,'fever urinary','More gradual, often with urinary symptoms','m'],['Fournier\u2019s gangrene',null,1,'!fever painoop faint','Spreading infection of the genital skin; diabetics','m'],['Strangulated hernia into the scrotum','obstruction',1,'!vomit','','m'],['Urinary retention or UTI','uti',0,'urinary'],['Miscarriage or ectopic','ectopic',1,'!pregbleed faint','','f'],['Bartholin\u2019s abscess',null,0,'fever','','f'],['Straddle or genital injury',null,0,'trauma','Consider safeguarding where the story doesn\u2019t fit']],
 thigh:[['Femur fracture','hip',1,'!trauma','Major blood loss risk'],['DVT','dvt',1,'!legswell'],['Cellulitis','cellulitis',1,'!redhot fever'],['Compartment syndrome',null,1,'!painoop trauma'],['Muscle strain or bruise',null,0,'mech trauma'],['Sciatica (referred)',null,0,'focal']],
 knee:[['Septic arthritis',null,1,'!fever redhot','Hot, swollen, can\u2019t bend it'],['Fracture or dislocation',null,1,'!trauma','Check pulses below the knee'],['Ligament or cartilage injury',null,0,'trauma mech'],['Gout or pseudogout',null,0,'redhot'],['Osteoarthritis',null,0,'mech'],['Bursitis',null,0,'redhot']],
 shin:[['Tibia fracture',null,1,'!trauma'],['Compartment syndrome',null,1,'!painoop trauma'],['DVT','dvt',1,'!legswell'],['Cellulitis','cellulitis',1,'!redhot fever'],['Acute limb ischaemia',null,1,'!coldpale'],['Pretibial skin tear',null,0,'trauma','Older, fragile skin'],['Shin splints',null,0,'mech']],
 ankle:[['Ankle fracture',null,1,'!trauma','Can\u2019t weight-bear, bony tenderness'],['Sprain',null,0,'trauma mech'],['Septic arthritis',null,1,'!fever redhot'],['Gout',null,0,'redhot'],['Cellulitis','cellulitis',1,'redhot fever']],
 foot:[['Foot or toe fracture',null,0,'trauma'],['Gout',null,0,'redhot','Hot red big toe joint'],['Diabetic foot infection','diabetes',1,'!fever redhot','May be painless'],['Acute limb ischaemia',null,1,'!coldpale'],['Cellulitis','cellulitis',1,'redhot fever'],['Ingrown toenail',null,0,'']],
 scapula:[['Muscle strain',null,0,'mech'],['Heart attack (referred)','acs',1,'!tight sweat','','','l'],['Gallbladder (referred)',null,0,'vomit fever','','','r'],['Pulmonary embolism','pe',1,'!pleuritic breathless'],['Pneumonia or pleurisy','pneumonia',1,'!fever cough pleuritic'],['Shingles',null,0,'rash burning']],
 upperback:[['Aortic dissection','dissection',1,'!tearing sudden faint','Tearing pain between the shoulder blades'],['Heart attack','acs',1,'!tight sweat breathless'],['Vertebral fracture','osteoporosis',1,'!trauma','Older adult, minor or no trauma'],['Pancreatitis (referred)','pancreatitis',1,'vomit'],['Muscular back pain',null,0,'mech']],
 loin:[['Kidney infection','uti',1,'!fever urinary'],['Kidney stone','colic',0,'!colicky vomit'],['Abdominal aortic aneurysm','aaa',1,'!faint sudden','Over 60, first \u201crenal colic\u201d'],['Muscle strain',null,0,'mech']],
 midback:[['Aortic dissection','dissection',1,'!tearing sudden'],['Spinal fracture or infection',null,1,'trauma fever'],['Pancreatitis','pancreatitis',1,'vomit'],['Mechanical back pain',null,0,'mech']],
 lowback:[['Abdominal aortic aneurysm','aaa',1,'!faint sudden sweat','Older adult with abdominal pain or collapse'],['Cauda equina syndrome','cauda',1,'!urinary focal','Saddle numbness, new bladder or bowel problems'],['Spinal fracture, infection or cancer',null,1,'trauma fever','Night pain, weight loss, history of cancer'],['Kidney infection','uti',1,'!fever urinary'],['Mechanical back pain',null,0,'mech'],['Sciatica',null,0,'focal','Pain down the leg']],
 tailbone:[['Coccyx injury',null,0,'trauma'],['Pilonidal abscess',null,0,'fever redhot'],['Pressure sore (long lie)',null,1,'','Check skin after any long lie'],['Cauda equina syndrome','cauda',1,'!urinary focal']],
 buttock:[['Sciatica',null,0,'focal'],['Cauda equina syndrome','cauda',1,'!urinary focal'],['Hip fracture','hip',1,'!trauma'],['Abscess',null,0,'fever redhot'],['Pressure sore (long lie)',null,1,''],['Bruise',null,0,'trauma']],
 hthigh:[['Hamstring strain or tear',null,0,'sudden mech'],['Sciatica',null,0,'focal'],['DVT','dvt',1,'!legswell']],
 popliteal:[['DVT','dvt',1,'!legswell'],['Ruptured Baker\u2019s cyst',null,0,'legswell','Mimics a DVT'],['Popliteal aneurysm or limb ischaemia',null,1,'!coldpale'],['Hamstring tendon strain',null,0,'mech']],
 calf:[['DVT','dvt',1,'!legswell','Swollen, warm, tender'],['Acute limb ischaemia',null,1,'!coldpale'],['Compartment syndrome',null,1,'!painoop trauma'],['Calf muscle tear',null,0,'sudden mech'],['Cellulitis','cellulitis',1,'redhot fever'],['Cramp',null,0,'']],
 heel:[['Achilles tendon rupture',null,0,'!sudden','Felt like a kick to the back of the heel'],['Achilles tendinitis',null,0,'mech'],['Heel bone fracture',null,1,'!trauma','Fall from height: check the spine too'],['Pressure sore (long lie)',null,1,''],['Plantar fasciitis',null,0,'mech']],
 sole:[['Plantar fasciitis',null,0,'mech','Worst on first steps in the morning'],['Diabetic foot ulcer or infection','diabetes',1,'!fever redhot'],['Puncture wound or foreign body',null,0,'trauma'],['Stress fracture',null,0,'mech']]
};
const has=(sel,...ids)=>ids.some(i=>sel.includes(i));
const CHEST=['chest_c','chest_l','chest_r'], ABDO=['epi','umb','rlq','llq','supra','ruq','luq','flank_l','flank_r'], HEADS=['top_head','forehead','temple_r','temple_l','head_b','head'];
const PATTERNS=[
 {when:s=>has(s,...CHEST)&&has(s,'uarm_l','sh_l','elbow_l','farm_l','jaw_l','jaw_r','throat','throat_f','neck_l','neck_r','bsh_l','buarm_l'),t:'Chest pain spreading to the arm, jaw or neck',p:'Cardiac until proven otherwise.',cond:'acs'},
 {when:s=>has(s,...CHEST)&&has(s,'spine_up','mid_back','scap_l','scap_r'),t:'Chest pain going through to the back',p:'Think aortic dissection, especially if tearing; check both arm BPs if trained.',cond:'dissection'},
 {when:s=>has(s,'epi','umb','flank_l','flank_r')&&has(s,'low_back','loin_l','loin_r','mid_back'),t:'Abdominal pain with back pain',p:'In an older adult, think AAA until proven otherwise. Also pancreatitis and kidney causes.',cond:'aaa'},
 {when:s=>has(s,'loin_l','loin_r','flank_l','flank_r')&&has(s,'groin_l','groin_r','genitals','rlq','llq'),t:'Loin to groin',p:'Classic kidney stone. If over 60 with a first episode, rule out AAA.',cond:'colic'},
 {when:s=>has(s,...ABDO)&&has(s,'sh_l','sh_r','bsh_l','bsh_r'),t:'Abdominal pain with shoulder-tip pain',p:'Blood or fluid under the diaphragm: ruptured ectopic, spleen or perforation.',cond:'ectopic'},
 {when:s=>has(s,'ruq')&&has(s,'sh_r','bsh_r','scap_r'),t:'Right upper abdomen with right shoulder or shoulder blade',p:'Typical of gallbladder pain; fever or jaundice suggests infection.',cond:null},
 {when:s=>has(s,'epi')&&has(s,'spine_up','mid_back'),t:'Upper abdomen through to the back',p:'Think pancreatitis, AAA and a posterior ulcer.',cond:'pancreatitis'},
 {when:s=>has(s,'umb')&&has(s,'rlq'),t:'Pain moving from the belly button to the right lower abdomen',p:'Classic appendicitis.',cond:'appendicitis'},
 {when:s=>has(s,'low_back','tail')&&has(s,'butt_l','butt_r','hthigh_l','hthigh_r','calf_l','calf_r'),t:'Back pain into the buttock or leg',p:'Usually sciatica, but always ask about saddle numbness and bladder or bowel changes (cauda equina).',cond:'cauda'},
 {when:s=>has(s,'calf_l','calf_r','popl_l','popl_r','shin_l','shin_r','thigh_l','thigh_r','hthigh_l','hthigh_r')&&has(s,...CHEST,'spine_up','scap_l','scap_r'),t:'Leg pain with chest pain',p:'DVT with pulmonary embolism: check breathing and SpO\u2082.',cond:'pe'},
 {when:s=>has(s,...HEADS)&&has(s,'neck_b','neck_l','neck_r'),t:'Headache with neck pain or stiffness',p:'Think meningitis (fever, rash) and subarachnoid haemorrhage (sudden onset).',cond:'meningitis'},
 {when:s=>has(s,'genitals')&&has(s,'groin_l','groin_r','rlq','llq','supra'),t:'Testicular or groin pain spreading to the lower abdomen',p:'In a young male, testicular torsion until proven otherwise: time-critical.',cond:null},
 {when:s=>has(s,'temple_l','temple_r')&&has(s,'jaw_l','jaw_r','eye_l','eye_r'),t:'Temple pain with jaw or eye symptoms',p:'In over-50s, giant cell arteritis: same-day treatment to protect sight.',cond:null}];
window.BODYMAP={FRONT,BACK,HEAD,C,PATTERNS};
})();

// ---------------- Symptom checker: features and ranked causes ----------------
// Features the user can tick alongside (or instead of) pain locations.
(function(){
const F=[
 ['pain','Type of pain',[['tight','Tight, heavy or crushing'],['sharp','Sharp or stabbing'],['pleuritic','Worse on breathing in'],['tearing','Tearing or ripping'],['colicky','Comes in waves (colicky)'],['burning','Burning'],['sudden','Came on suddenly'],['mech','Worse on moving or pressing']]],
 ['sym','Other symptoms',[['headache','Headache'],['breathless','Breathless'],['faint','Fainted or collapsed'],['dizzy','Dizzy or light-headed'],['vomit','Nausea or vomiting'],['sweat','Sweaty or clammy'],['fever','Fever or shivering'],['palp','Palpitations'],['confused','Confused or drowsy'],['focal','Weakness, numbness or droop on one side'],['speech','Slurred speech or vision change'],['cough','Cough'],['diarrhoea','Diarrhoea'],['gibleed','Vomiting blood or black stools'],['rash','Rash'],['swelling','Swelling of face, lips or tongue'],['legswell','Swollen arm or leg'],['redhot','Red, hot or swollen area'],['coldpale','Cold, pale or mottled limb'],['painoop','Pain far worse than expected'],['swallow','Difficulty swallowing or drooling'],['trigger','New food, medicine or sting in the last few hours'],['urinary','Urinary problems'],['neckstiff','Stiff neck or dislikes light'],['pregbleed','Pregnant, missed period or vaginal bleeding'],['trauma','Recent injury or fall']]]];
// Ranked causes: [name, condition id, serious, regions (group or group:side), features, sex, note]
const K=[
 ['Heart attack (ACS)','acs',1,['chestc','chestside:l','shoulder:l','arm:l','face','neck','epi','upperback'],['tight','sweat','breathless','vomit','faint','palp','dizzy'],'','Crushing pain with sweating; older, female and diabetic patients may just be breathless or unwell'],
 ['Angina','angina',0,['chestc','chestside:l','arm:l','neck','face'],['tight','breathless'],'','Brought on by exertion, settles with rest or GTN'],
 ['Aortic dissection','dissection',1,['chestc','upperback','midback','epi'],['tearing','sudden','faint','focal','sweat'],'','Tearing pain to the back; BP difference between arms'],
 ['Pulmonary embolism','pe',1,['chestside','chestc','calf','leg','thigh','hthigh'],['breathless','pleuritic','sharp','sudden','faint','palp','legswell','cough'],'','Sudden breathlessness, pleuritic pain, maybe a swollen calf'],
 ['Pneumothorax','ptx',1,['chestside','shoulder'],['breathless','sharp','sudden','pleuritic','trauma'],'','Sudden one-sided pain and breathlessness'],
 ['Pneumonia / chest infection','pneumonia',1,['chestside','ruq','luq'],['fever','cough','breathless','pleuritic','confused'],'','Fever, cough; older adults may just be confused'],
 ['Asthma attack','asthma',1,['chestc'],['breathless','cough','tight'],'','Wheeze; a quiet chest is dangerous'],
 ['COPD flare-up','copd',0,['chestc'],['breathless','cough','fever'],'','Known COPD, more sputum'],
 ['Heart failure','hf',1,['chestc'],['breathless','legswell','cough'],'','Breathless lying flat, swollen ankles'],
 ['Atrial fibrillation / arrhythmia','af',1,['chestc'],['palp','dizzy','faint','breathless'],'','Irregular or very fast or slow pulse'],
 ['Anaphylaxis','anaphylaxis',1,['face','neck'],['swelling','rash','breathless','faint','dizzy','vomit','trigger'],'','Rapid onset after a trigger'],
 ['Abdominal aortic aneurysm','aaa',1,['epi','umb','flank','loin','lowback','groin'],['faint','sudden','sweat','tearing','dizzy'],'','Older adult, back or abdominal pain, collapse'],
 ['Gastrointestinal bleed','gibleed',1,['epi','umb'],['gibleed','faint','dizzy','vomit','sweat'],'','Vomiting blood or black tarry stools'],
 ['Pancreatitis','pancreatitis',1,['epi','upperback','luq'],['vomit','fever','sudden'],'','Severe epigastric pain to the back'],
 ['Appendicitis','appendicitis',1,['rlq','umb'],['vomit','fever','mech'],'','Pain moves from belly button to right lower abdomen'],
 ['Bowel obstruction','obstruction',1,['umb','groin','rlq','llq'],['vomit','colicky'],'','Vomiting, swollen abdomen, no bowel movement'],
 ['Ectopic pregnancy','ectopic',1,['rlq','llq','supra','shoulder'],['pregbleed','faint','dizzy','sharp','sudden'],'f','Missed period, bleeding, shoulder-tip pain, collapse'],
 ['Bleeding in pregnancy','aph',1,['supra','rlq','llq'],['pregbleed','faint','dizzy'],'f',''],
 ['Pre-eclampsia','preeclampsia',1,['head','ruq','epi'],['headache','speech','swelling','vomit','pregbleed'],'f','Pregnant or recently given birth, high BP'],
 ['Testicular torsion',null,1,['groin','rlq','llq'],['sudden','vomit'],'m','Young male, sudden pain: time-critical'],
 ['Kidney stone','colic',0,['loin','flank','groin','rlq','llq'],['colicky','vomit','urinary','sudden'],'','Loin to groin, restless'],
 ['Kidney or urine infection','uti',1,['supra','loin','flank','lowback'],['urinary','fever','confused'],'','Burning urine; fever and loin pain mean kidney infection'],
 ['Gastroenteritis','gastro',0,['umb','epi'],['vomit','diarrhoea','fever','colicky'],'',''],
 ['Subarachnoid haemorrhage','sah',1,['head','neck'],['headache','sudden','vomit','neckstiff','faint','confused'],'','Sudden \u201cworst ever\u201d headache'],
 ['Meningitis','meningitis',1,['head','neck'],['headache','fever','neckstiff','rash','vomit','confused'],'','Fever, stiff neck, rash'],
 ['Stroke / TIA','stroke',1,['head','face'],['focal','speech','headache','confused','dizzy','sudden'],'','BE-FAST: record time last known well'],
 ['Head injury bleed','headinj',1,['head','face'],['trauma','headache','vomit','confused'],'','Higher risk on anticoagulants or over 65'],
 ['Carbon monoxide poisoning','co',1,['head'],['headache','dizzy','vomit','confused'],'','Several people unwell in one building'],
 ['Hypoglycaemia','hypo',1,[],['sweat','confused','dizzy','faint','focal'],'','Check glucose if trained'],
 ['Diabetic ketoacidosis','dka',1,['epi','umb'],['vomit','breathless','confused'],'','Diabetic with deep breathing and vomiting'],
 ['Sepsis','sepsis',1,[],['fever','confused','breathless','faint','rash','dizzy'],'','Infection with organ warning signs'],
 ['Faint (vasovagal)','syncope',0,[],['faint','dizzy','sweat','vomit'],'','Warning signs, quick full recovery'],
 ['Panic / hyperventilation','panic',0,['chestc'],['breathless','palp','tight','dizzy'],'','Only after ruling out physical causes'],
 ['DVT','dvt',1,['calf','leg','thigh','hthigh','knee'],['legswell'],'','One swollen, tender leg'],
 ['Cellulitis','cellulitis',1,['leg','foot','hand','thigh','arm','face'],['fever','rash','legswell'],'','Red, hot, spreading skin'],
 ['Hip fracture','hip',1,['groin','thigh','buttock'],['trauma'],'','Older adult after a fall'],
 ['Cauda equina syndrome','cauda',1,['lowback','buttock'],['urinary','focal'],'','Saddle numbness, bladder or bowel change'],
 ['Heat illness','heat',1,[],['headache','sweat','vomit','confused','dizzy'],'','Hot environment or exertion'],
 ['Adrenal crisis','adrenal',1,['epi','umb'],['vomit','faint','dizzy','confused'],'','On long-term steroids'],
 ['Sickle cell crisis','sickle',1,['chestc','lowback','thigh','arm'],['fever','breathless'],'','Known sickle cell'],
 ['Overdose / poisoning','overdose',1,[],['confused','vomit'],'','What, how much, when?'],
 ['Delirium','delirium',1,[],['confused','fever'],'','Sudden confusion in an older person: find the cause']];
// Symptom-driven patterns (checked with regions and features together)
const has=(a,...x)=>x.some(i=>a.includes(i)), CH=['chest_c','chest_l','chest_r'], AB=['epi','umb','rlq','llq','supra','ruq','luq','flank_l','flank_r'];
const P2=[
 {when:(s,f)=>has(s,...CH)&&has(f,'sweat','vomit','tight'),t:'Chest pain with sweating, vomiting or a crushing feel',p:'Treat as a heart attack: rest, AED nearby, escalate.',cond:'acs'},
 {when:(s,f)=>has(f,'tearing'),t:'Tearing or ripping pain',p:'Think aortic dissection or a leaking aneurysm.',cond:'dissection'},
 {when:(s,f)=>has(f,'headache')&&has(f,'sudden'),t:'Sudden severe headache',p:'Thunderclap headache is a subarachnoid haemorrhage until proven otherwise.',cond:'sah'},
 {when:(s,f)=>has(f,'headache','neckstiff')&&has(f,'fever')&&has(f,'rash','neckstiff','confused'),t:'Fever with headache, stiff neck, rash or confusion',p:'Think meningitis: check for a non-blanching rash, time-critical.',cond:'meningitis'},
 {when:(s,f)=>has(f,'focal','speech'),t:'One-sided weakness, droop, speech or vision change',p:'Run BE-FAST, record time last known well, check glucose if trained.',cond:'stroke'},
 {when:(s,f)=>has(f,'breathless')&&(has(f,'legswell')||has(s,'calf_l','calf_r','shin_l','shin_r','popl_l','popl_r')),t:'Breathless with a painful or swollen leg',p:'Think pulmonary embolism.',cond:'pe'},
 {when:(s,f)=>has(f,'swelling')&&has(f,'breathless','rash','faint','dizzy'),t:'Facial swelling with breathing, rash or circulation problems',p:'Anaphylaxis: adrenaline within scope, escalate immediately.',cond:'anaphylaxis'},
 {when:(s,f)=>(has(s,...AB)||has(f,'pregbleed'))&&has(f,'faint','dizzy')&&(has(f,'pregbleed')),t:'Abdominal pain or bleeding with fainting in a woman who may be pregnant',p:'Ruptured ectopic pregnancy until proven otherwise.',cond:'ectopic'},
 {when:(s,f)=>has(f,'faint')&&has(f,'palp','breathless')||(has(f,'faint')&&has(s,...CH)),t:'Collapse with palpitations, breathlessness or chest pain',p:'Think arrhythmia, heart attack or PE rather than a simple faint.',cond:'af'},
 {when:(s,f)=>has(f,'fever')&&has(f,'confused','breathless','faint'),t:'Fever with confusion, breathlessness or collapse',p:'Run the sepsis screen.',cond:'sepsis'},
 {when:(s,f)=>has(f,'gibleed'),t:'Vomiting blood or black stools',p:'GI bleed: check for shock.',cond:'gibleed'},
 {when:(s,f)=>has(f,'vomit')&&has(f,'breathless')&&!has(s,...CH),t:'Vomiting with fast or deep breathing',p:'In a diabetic, think DKA; also sepsis.',cond:'dka'},
 {when:(s,f)=>has(f,'headache')&&has(f,'pregbleed'),t:'Headache in pregnancy or after birth',p:'Think pre-eclampsia: check BP.',cond:'preeclampsia'},
 {when:(s,f)=>has(f,'confused')&&has(f,'sweat'),t:'Confused and sweaty',p:'Check glucose if trained: hypoglycaemia.',cond:'hypo'}];
Object.assign(window.BODYMAP,{FEATS:F,KB:K,PATTERNS2:P2});
})();

// ---------------- Context (age, duration, what happened before, existing conditions) ----------------
(function(){
const CTX=[
 ['age','About the patient','one',[['age_child','Child (under 16)'],['age_adult','Adult'],['age_old','Older adult (65+)']]],
 ['dur','How long','one',[['dur_min','Minutes (just started)'],['dur_hrs','Hours'],['dur_days','Days'],['dur_wks','Weeks, or keeps coming back']]],
 ['injury','What happened: injuries and accidents','many',[['fall_stand','Fall from standing or less'],['fall_height','Fall from height (over 1 m or 5 stairs)'],['rtc','Road traffic collision'],['assault','Assault or blow'],['head_hit','Hit their head'],['sport','Sports or twisting injury'],['crush','Crushed or trapped'],['stab','Cut, stab or puncture'],['bite','Animal bite or insect sting'],['burn','Burn, scald or electric shock'],['fumes','Smoke, fumes or fire'],['water','Water or near-drowning']]],
 ['triggers','Possible triggers','many',[['newmed','New medicine or dose change'],['allergen','Food or known allergen'],['missed','Missed regular medicines'],['illness','Recent infection or illness'],['abroad','Recent travel abroad'],['immobile','Long journey, bed rest or recent surgery'],['stress','Stress or emotional upset']]],
 ['before','When it started: what were they doing?','many',[['exertion','Exertion or exercise'],['rest','At rest or woke them from sleep'],['eating','Eating or just eaten'],['strain','Vomiting, coughing or straining'],['lifting','Lifting or carrying'],['alcohol','Alcohol or recreational drugs'],['heat','In a hot environment'],['cold','Cold exposure or a long lie on the floor']]],
 ['hx','Past medical history and medicines','many',[['hx_heart','Heart disease or angina'],['hx_bp','High blood pressure'],['hx_diab','Diabetes'],['hx_lung','Asthma or COPD'],['hx_clot','Previous DVT or PE'],['hx_anticoag','Takes blood thinners'],['hx_preg','Pregnant or recently given birth'],['hx_cancer','Cancer or chemotherapy'],['hx_immuno','Steroids or immunosuppressed'],['hx_kidney','Kidney disease or dialysis'],['hx_liver','Liver disease or heavy drinking'],['hx_epilepsy','Epilepsy'],['hx_frail','Frail, osteoporosis or falls'],['hx_sickle','Sickle cell disease'],['hx_smoke','Smoker'],['hx_aaa','Known aneurysm']]]];
// Rules: [context id, regex on cause name, condition ids, weight]
const CXR=[
 ['exertion',/heart attack|angina|dissection|hamstring|calf muscle|achilles|strain|sprain|heat/i,['acs','angina'],2],
 ['rest',/heart attack|subarachnoid|stroke/i,[],1],
 ['eating',/reflux|indigestion|gastritis|gallstone|gallbladder|pancreatitis|anaphylaxis|angioedema|choking|oesophag/i,['anaphylaxis','pancreatitis'],2],
 ['strain',/oesophageal rupture|hernia|subarachnoid|rib|muscle|pneumothorax/i,[],2],
 ['lifting',/strain|sprain|hernia|mechanical|sciatica|cauda|tendon|rupture|tear|dislocation/i,['cauda'],2],
 ['immobile',/dvt|embolism|pressure sore/i,['pe','dvt'],3],
 ['alcohol',/pancreatitis|bleed|ulcer|liver|head injury|gastritis|overdose|hypoglyc/i,['pancreatitis','gibleed','cirrhosis','headinj','overdose','hypo','alcohol'],2],
 ['heat',/heat/i,['heat'],3],
 ['cold',/hypothermia|pressure sore|limb ischaemia|hip fracture/i,['hypothermia'],2],
 ['dur_min',/subarachnoid|dissection|torsion|embolism|pneumothorax|rupture|heart attack|anaphylaxis|angioedema|stroke|choking|aneurysm|catastrophic|glaucoma|fracture|dislocation|bleed/i,[],2],
 ['dur_hrs',/appendicitis|cellulitis|obstruction|pancreatitis|stone|sepsis|meningitis|torsion|infection|gastroenteritis|ketoacidosis|ectopic|retention|compartment|gout/i,[],1],
 ['dur_days',/cellulitis|abscess|infection|pneumonia|shingles|dvt|diverticulitis|gout|septic|sinusitis|tonsillitis|quinsy|urinary|epididym|lyme/i,[],1],
 ['dur_wks',/arthritis|fasciitis|tendinitis|bursitis|carpal|ganglion|osteoarthritis|ibs|reflux|mechanical|plantar|polymyalgia|neuralgia|migraine|tension|giant cell|angina|heart failure|sciatica|frozen|rotator|tennis|cancer/i,[],2],
 ['dur_wks',/subarachnoid|dissection|torsion|rupture|choking|anaphylaxis|embolism|pneumothorax|catastrophic/i,[],-2],
 ['age_child',/appendicitis|torsion|foreign body|meningitis|ear infection|tonsillitis|epiglottitis|chickenpox|non-accidental|febrile|croup|bronchiolitis/i,[],2],
 ['age_child',/aneurysm|giant cell|polymyalgia|hip fracture|osteoarthritis|vertebral fracture|diverticulitis|heart attack|angina|limb ischaemia|gut ischaemia|skin tear|pressure sore/i,['aaa','acs','angina','hip'],-3],
 ['age_old',/aneurysm|giant cell|polymyalgia|hip fracture|vertebral fracture|osteoarthritis|diverticulitis|heart attack|angina|stroke|dissection|gut ischaemia|limb ischaemia|pressure sore|skin tear|wrist|retention|shingles|glaucoma|delirium/i,['aaa','acs','hip','stroke'],2],
 ['age_old',/torsion|chickenpox|ectopic|ovarian/i,[],-2],
 ['fall_stand',/fracture|head injury|hip|wrist|skin tear|bruise|sprain|pressure sore|dislocation/i,['hip','headinj'],2],
 ['fall_height',/fracture|spinal|neck|cervical|head injury|heel bone|ruptured spleen|pneumothorax|cauda|rib/i,['headinj','cauda','ptx'],3],
 ['rtc',/fracture|spinal|neck|whiplash|head injury|ruptured spleen|pneumothorax|rib|chest wall|compartment|dissection|bleed/i,['headinj','cauda','ptx'],3],
 ['assault',/fracture|head injury|facial|jaw|nose|rib|ruptured spleen|bleed|eye injury|non-accidental|scalp/i,['headinj'],3],
 ['head_hit',/head injury|bleed after head|base of skull|scalp|neck|temple injury/i,['headinj'],4],
 ['sport',/sprain|ligament|strain|tear|achilles|dislocation|fracture|hamstring|calf muscle|tendon|cartilage/i,[],2],
 ['crush',/crush|compartment|fracture|limb ischaemia/i,[],3],
 ['stab',/penetrating|internal bleeding|wound|laceration|bleed|tendon|puncture|catastrophic|embedded|pneumothorax/i,['ptx'],3],
 ['bite',/anaphylaxis|angioedema|cellulitis|infection|bite|sting|tendon sheath/i,['anaphylaxis','cellulitis'],2],
 ['burn',/burn/i,[],3],
 ['fumes',/carbon monoxide|asthma|copd|airway|choking/i,['co','asthma','copd'],3],
 ['water',/hypothermia|pneumonia|neck|cervical/i,['hypothermia','pneumonia'],2],
 ['newmed',/anaphylaxis|angioedema|hives|drug|bleed|hypoglyc|delirium|stevens/i,['anaphylaxis','hypo','delirium'],2],
 ['allergen',/anaphylaxis|angioedema|hives|asthma/i,['anaphylaxis','asthma'],3],
 ['missed',/ketoacidosis|hypoglyc|seizure|epilep|adrenal|heart failure|angina|asthma/i,['dka','adrenal','epilepsy','hf','parkinsons'],3],
 ['illness',/sepsis|meningitis|pneumonia|kidney infection|cellulitis|delirium|ketoacidosis|septic|tonsillitis|quinsy|sinusitis|mastoiditis|ear infection|epiglottitis/i,['sepsis','pneumonia','dka','delirium'],2],
 ['abroad',/embolism|dvt|lyme|tick|infection|sepsis|gastroenteritis|meningitis/i,['pe','dvt','gastro','sepsis'],2],
 ['stress',/panic|anxiety|heart attack|angina|tension headache|faint/i,['panic','syncope'],1],
 ['hx_heart',/heart attack|angina|heart failure|arrhythm/i,['acs','angina','hf','af'],3],
 ['hx_bp',/dissection|aneurysm|stroke|subarachnoid|heart attack|pre-eclampsia/i,[],1],
 ['hx_diab',/heart attack|hypoglyc|ketoacidosis|diabetic|cellulitis|infection|fournier|necrotising|sepsis|stroke|limb ischaemia|abscess/i,['acs','hypo','dka','diabetes'],2],
 ['hx_lung',/asthma|copd|pneumothorax|pneumonia/i,['asthma','copd','ptx','pneumonia'],3],
 ['hx_clot',/dvt|embolism/i,['pe','dvt'],3],
 ['hx_anticoag',/bleed|haemorrhage|head injury|subarachnoid|ulcer|nosebleed|bruise|platelet|base of skull/i,['headinj','gibleed','sah'],3],
 ['hx_preg',/ectopic|miscarriage|pre-eclampsia|hellp|pregnancy|embolism|dvt/i,['ectopic','aph','preeclampsia','pe','dvt'],3],
 ['hx_cancer',/embolism|dvt|spinal fracture|cancer|sepsis|platelet|cauda|vertebral/i,['pe','dvt','sepsis','cauda'],2],
 ['hx_immuno',/infection|sepsis|cellulitis|abscess|necrotising|septic|pneumonia|meningitis|shingles|adrenal/i,['sepsis','cellulitis','pneumonia','meningitis','adrenal'],2],
 ['hx_kidney',/kidney|urinary|retention/i,['ckd','uti','colic'],2],
 ['hx_liver',/liver|cirrhosis|bleed|pancreatitis/i,['cirrhosis','gibleed','pancreatitis'],2],
 ['hx_epilepsy',/seizure|head injury|dislocation|tongue/i,['epilepsy','headinj'],2],
 ['hx_frail',/fracture|pressure sore|skin tear|head injury|delirium/i,['hip','headinj','osteoporosis'],2],
 ['hx_sickle',/sickle|septic|stroke|bone/i,['sickle'],3],
 ['hx_smoke',/heart attack|angina|aneurysm|copd|pneumothorax|limb ischaemia|stroke|embolism/i,['acs','aaa'],1],
 ['hx_aaa',/aneurysm/i,['aaa'],4]];
const has=(a,...x)=>x.some(i=>a.includes(i));
const HEADR=['top_head','forehead','temple_r','temple_l','head_b','head','eye_r','eye_l','ear_r','ear_l','nose','cheek_r','cheek_l','jaw_r','jaw_l'];
const ABDR=['epi','umb','rlq','llq','supra','ruq','luq','flank_l','flank_r','low_back','loin_l','loin_r'];
// Context-driven alerts: (regions, features, context) -> alert
const CPAT=[
 {when:(s,f,c)=>has(c,'hx_anticoag')&&(has(s,...HEADR)||has(f,'trauma','headache','confused')),t:'Head injury or headache on blood thinners',p:'High risk of a bleed inside the skull, even if they look well: escalate per head injury pathway.',cond:'headinj'},
 {when:(s,f,c)=>has(c,'hx_preg')&&(has(s,...ABDR,'sh_l','sh_r')||has(f,'faint','pregbleed')),t:'Abdominal pain, bleeding or fainting in pregnancy',p:'Think ectopic pregnancy (early) or abruption (later); state gestation to EOC.',cond:'ectopic'},
 {when:(s,f,c)=>has(c,'hx_preg')&&has(f,'headache','speech','swelling'),t:'Headache, visual change or swelling in pregnancy or after birth',p:'Think pre-eclampsia: check BP, escalate.',cond:'preeclampsia'},
 {when:(s,f,c)=>has(c,'immobile','hx_clot','hx_cancer','hx_preg')&&(has(f,'breathless','legswell')||has(s,'calf_l','calf_r','popl_l','popl_r','shin_l','shin_r','chest_l','chest_r')),t:'Clot risk with breathlessness, chest or leg symptoms',p:'Think DVT and pulmonary embolism.',cond:'pe'},
 {when:(s,f,c)=>has(c,'age_old','hx_aaa','hx_smoke')&&has(s,'epi','umb','flank_l','flank_r','low_back','loin_l','loin_r')&&(has(f,'faint','sudden','dizzy')||has(c,'dur_min','hx_aaa')),t:'Older adult with abdominal or back pain',p:'A leaking aortic aneurysm until proven otherwise, especially with fainting or sudden onset.',cond:'aaa'},
 {when:(s,f,c)=>has(c,'hx_cancer','hx_immuno')&&has(f,'fever'),t:'Fever in someone on chemotherapy, steroids or immunosuppressants',p:'Possible neutropenic sepsis or severe infection: time-critical.',cond:'sepsis'},
 {when:(s,f,c)=>has(c,'hx_diab')&&has(f,'confused','sweat','faint','focal'),t:'Diabetic who is confused, sweaty or has stroke-like signs',p:'Check glucose if trained: hypoglycaemia.',cond:'hypo'},
 {when:(s,f,c)=>has(c,'age_child')&&has(s,'genitals','groin_l','groin_r','rlq','llq'),t:'Child or young person with testicular, groin or lower abdominal pain',p:'Testicular torsion in boys is time-critical; consider appendicitis.',cond:null},
 {when:(s,f,c)=>has(c,'exertion')&&(has(s,'chest_c','chest_l','chest_r','jaw_l','jaw_r','uarm_l')||has(f,'tight')),t:'Chest, jaw or arm pain brought on by exertion',p:'Cardiac pain until proven otherwise.',cond:'acs'},
 {when:(s,f,c)=>has(c,'heat')&&has(f,'confused','faint','headache','vomit'),t:'Unwell in the heat',p:'Heat exhaustion or heatstroke: cool and escalate if confused.',cond:'heat'},
 {when:(s,f,c)=>has(c,'cold')&&has(c,'age_old','hx_frail'),t:'Older or frail person after a long lie or cold exposure',p:'Check temperature, pressure areas and for a hip fracture; ask why they fell.',cond:'hypothermia'},
 {when:(s,f,c)=>has(c,'fall_height','rtc'),t:'High-energy mechanism',p:'Spinal precautions per training; look for hidden chest, abdominal, pelvic and long-bone injuries; escalate.',cond:null},
 {when:(s,f,c)=>has(c,'head_hit')&&has(c,'age_old','hx_anticoag','hx_frail','alcohol'),t:'Hit their head and is older, frail, on blood thinners or has been drinking',p:'High risk of a bleed inside the skull: follow the head injury pathway even if they seem well.',cond:'headinj'},
 {when:(s,f,c)=>has(c,'fall_stand')&&has(c,'age_old','hx_frail'),t:'Fall in an older or frail person',p:'Ask why they fell: infection, arrhythmia, stroke, low BP, medicines. Check for a long lie, hip fracture and head injury.',cond:'syncope'},
 {when:(s,f,c)=>has(c,'assault'),t:'Assault',p:'Your safety first. Consider safeguarding and police involvement; look for injuries hidden by clothing and hair.',cond:null},
 {when:(s,f,c)=>has(c,'crush'),t:'Crushed or trapped',p:'Watch for compartment syndrome; if trapped for a long time, crush syndrome on release: escalate before release where possible.',cond:null},
 {when:(s,f,c)=>has(c,'stab')&&has(s,'chest_c','chest_l','chest_r','epi','umb','ruq','luq','flank_l','flank_r','rlq','llq','supra','spine_up','mid_back','loin_l','loin_r','low_back','scap_l','scap_r','throat','throat_f','neck_l','neck_r'),t:'Penetrating injury to the neck, chest, abdomen or back',p:'Time-critical: control bleeding, don\u2019t remove embedded objects, escalate.',cond:null},
 {when:(s,f,c)=>has(c,'burn','fumes'),t:'Burn, smoke or fumes',p:'Check the airway (soot, hoarse voice) and think carbon monoxide. Use Visual lookup for burn depth and first aid.',cond:'co'},
 {when:(s,f,c)=>has(c,'missed'),t:'Missed regular medicines',p:'Insulin: DKA or high glucose. Epilepsy medicines: seizures. Steroids: adrenal crisis. Parkinson\u2019s medicines: severe stiffness. Heart failure tablets: fluid on the lungs.',cond:null},
 {when:(s,f,c)=>has(c,'allergen','newmed','bite')&&has(f,'breathless','swelling','rash','faint','dizzy'),t:'Possible trigger with breathing, swelling, rash or faint',p:'Anaphylaxis until proven otherwise: adrenaline within scope, escalate.',cond:'anaphylaxis'},
 {when:(s,f,c)=>has(c,'water'),t:'Water or near-drowning',p:'Even if they seem well, breathing can worsen over hours. Think hypothermia, and neck injury if they dived.',cond:'hypothermia'},
 {when:(s,f,c)=>has(c,'dur_min')&&has(f,'headache'),t:'Headache that started minutes ago',p:'Sudden onset: think subarachnoid haemorrhage.',cond:'sah'}];
// Medical terms for each area type (shown on the map and in notes)
const MED={zoom:'',tophead:'vertex',forehead:'frontal region',temple:'temporal region',eye:'orbital region',ear:'auricular region',nose:'nasal region',cheek:'maxillary region',mouth:'oral cavity',jaw:'mandibular region',throat:'anterior cervical region',neckside:'lateral cervical region',occiput:'occipital region',neckback:'nuchal region',
 shoulder:'glenohumeral region',chestc:'retrosternal',chestside:'lateral chest wall',upperarm:'brachial region',elbow:'cubital region',forearm:'antebrachial region',wrist:'carpal region',hand:'manus',
 ruq:'hypochondrium',epi:'epigastrium',luq:'hypochondrium',flank:'lumbar region (flank)',umb:'umbilical region',rlq:'iliac fossa',llq:'iliac fossa',supra:'hypogastrium (suprapubic)',
 hip:'trochanteric region',groin:'inguinal region',genitals:'genital region',thigh:'femoral region',knee:'patellar region',shin:'pretibial region',ankle:'malleolar region',foot:'pedal region',
 scapula:'scapular region',upperback:'interscapular (thoracic spine)',loin:'renal angle',midback:'thoracolumbar spine',lowback:'lumbar spine',tailbone:'coccygeal region',buttock:'gluteal region',hthigh:'posterior thigh (hamstrings)',popliteal:'popliteal fossa',calf:'sural region',heel:'calcaneal region',sole:'plantar region'};
const sided=new Set(['temple','eye','ear','cheek','jaw','neckside','shoulder','chestside','upperarm','elbow','forearm','wrist','hand','ruq','luq','flank','rlq','llq','hip','groin','thigh','knee','shin','ankle','foot','scapula','loin','buttock','hthigh','popliteal','calf','heel','sole']);
// Everyday handover terms (default). Empty = no common term; the plain area name is used instead.
const COMMON={tophead:'',forehead:'frontal',temple:'temporal',eye:'periorbital',ear:'',nose:'',cheek:'maxillary',mouth:'',jaw:'',throat:'anterior neck',neckside:'',occiput:'occipital',neckback:'cervical spine',
 shoulder:'',chestc:'retrosternal',chestside:'',upperarm:'',elbow:'',forearm:'',wrist:'',hand:'',
 ruq:'RUQ',epi:'epigastric',luq:'LUQ',flank:'flank',umb:'periumbilical',rlq:'RIF',llq:'LIF',supra:'suprapubic',
 hip:'',groin:'inguinal',genitals:'',thigh:'',knee:'',shin:'',ankle:'',foot:'',
 scapula:'',upperback:'thoracic spine',loin:'renal angle',midback:'thoracic spine',lowback:'lumbar',tailbone:'coccyx',buttock:'',hthigh:'',popliteal:'popliteal fossa',calf:'',heel:'',sole:''};
const unsidedCommon=new Set(['ruq','luq','rlq','llq']);
const medTerm=(type,side,mode)=>{mode=mode||'common';if(mode==='off')return '';
  const t=(mode==='full'?MED:COMMON)[type];if(!t)return '';
  const pre=sided.has(type)&&side&&!(mode!=='full'&&unsidedCommon.has(type))?(side==='l'?'left ':'right '):'';return pre+t;};
Object.assign(window.BODYMAP,{CTX,CXR,CPAT,MED,COMMON,medTerm});
})();

// ---------------- Medicines -> context (auto-ticks existing conditions from the patient's medicines) ----------------
(function(){
// [context id, regex tested against "generic name | brands | class"]
const MEDCTX=[
 ['hx_anticoag',/anticoagulant|antiplatelet|warfarin|apixaban|rivaroxaban|edoxaban|dabigatran|enoxaparin|dalteparin|clopidogrel|ticagrelor|prasugrel/i],
 ['hx_immuno',/corticosteroid|immunosuppress|biologic|dmard|prednisolone|hydrocortisone|dexamethasone|methotrexate|azathioprine|adalimumab|etanercept|tacrolimus|mycophenolate|ciclosporin/i],
 ['hx_cancer',/chemotherapy|capecitabine|tamoxifen|anastrozole|letrozole|aromatase/i],
 ['hx_diab',/insulin|metformin|gliclazide|glimepiride|gliptin|sglt2|glp-1|gip\/glp-1|pioglitazone|sulfonylurea/i],
 ['hx_heart',/nitrate|glyceryl|nicorandil|ranolazine|ivabradine|digoxin|amiodarone|flecainide|antiarrhythmic|sacubitril|heart failure|loop diuretic/i],
 ['hx_bp',/ace inhibitor|angiotensin receptor|calcium-channel|thiazide|alpha blocker|doxazosin|beta blocker/i],
 ['hx_lung',/beta-2 agonist|inhaled corticosteroid|inhaler|antimuscarinic \(lama\)|lama|leukotriene|theophylline|home oxygen|salbutamol|symbicort|fostair|spiriva|trelegy/i],
 ['hx_epilepsy',/antiepileptic|levetiracetam|lamotrigine|valproate|carbamazepine|phenytoin|clobazam|buccal midazolam/i],
 ['hx_kidney',/phosphate binder|sevelamer|sodium bicarbonate tablets/i],
 ['hx_liver',/rifaximin/i],
 ['hx_frail',/bisphosphonate|alendronic|risedronate|denosumab|calcium and vitamin d/i]];
const findMed=name=>{const n=String(name||'').toLowerCase().trim();if(!n||!window.MEDS)return null;
  return MEDS.find(m=>m[0].toLowerCase()===n)||MEDS.find(m=>(m[1]||'').toLowerCase().split(',').map(s=>s.trim()).includes(n))||MEDS.find(m=>n.includes(m[0].toLowerCase()));};
const medCtx=name=>{const m=findMed(name);const hay=m?(m[0]+' | '+m[1]+' | '+m[2]):String(name);return MEDCTX.filter(([,re])=>re.test(hay)).map(([id])=>id);};
Object.assign(window.BODYMAP,{MEDCTX,findMed,medCtx});
})();
