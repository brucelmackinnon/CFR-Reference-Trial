// v31 detailed topics. Each topic becomes its own tab on the body system page.
// Block types: {fig}, {p}, {h}, {table:{head,rows}}, {pearls:[]}, {callout:[tone,html]}
(function(){
const S=id=>window.SYSTEMS.find(s=>s.id===id);

/* ======================= NERVOUS ======================= */
const nerv=S('nervous');
nerv.figs=['brain','territories','cranial','dermatomes','cns'];
nerv.topics=[
{id:'cranial',t:'Cranial nerves',blocks:[
 {p:'Twelve pairs of nerves leave the brain directly (not via the spinal cord). They run the eyes, face, mouth, throat and some of the heart and gut. Most start in the brainstem, so cranial nerve problems plus reduced consciousness can mean the brainstem itself is under pressure.'},
 {fig:'cranial'},
 {table:{head:['No.','Nerve','Type','What it does','How to check','What you might see'],rows:[
  ['I','Olfactory','Sensory','Smell','Rarely tested on scene','Loss of smell after a head injury (front of skull)'],
  ['II','Optic','Sensory','Vision; senses light for the pupil reflex','Can they see, read, count fingers? Pupil reaction','Sudden vision loss or half the field missing in stroke'],
  ['III','Oculomotor','Motor','Most eye movements; lifts the eyelid; constricts the pupil','Follow your finger in an H shape; pupils','Dilated, sluggish pupil with droopy lid and eye looking down and out: pressure on the brain, time-critical'],
  ['IV','Trochlear','Motor','Moves the eye down and in','Look down towards the nose','Double vision on looking down (stairs)'],
  ['V','Trigeminal','Both','Feeling in the face; chewing muscles','Light touch on forehead, cheek, jaw; clench teeth','Facial numbness; severe stabbing face pain (trigeminal neuralgia)'],
  ['VI','Abducens','Motor','Moves the eye outwards','Look to each side','Eye won\u2019t turn out, double vision; can be an early sign of raised pressure'],
  ['VII','Facial','Both','Facial expression; taste at front of tongue','Raise eyebrows, screw eyes shut, smile, puff cheeks','Stroke: forehead is spared. Bell\u2019s palsy: whole side including forehead'],
  ['VIII','Vestibulocochlear','Sensory','Hearing and balance','Hearing, balance, jerky eye movement (nystagmus)','Vertigo and hearing loss; vertigo with other neuro signs can be a stroke'],
  ['IX','Glossopharyngeal','Both','Swallowing; gag sensation; taste at back of tongue','Can they swallow safely?','Swallowing problems and aspiration risk'],
  ['X','Vagus','Both','Voice, swallowing, slows the heart, gut movement','Voice quality; say \u201cahh\u201d','Hoarse voice, choking on fluids; strong vagal activity causes fainting and slow pulse'],
  ['XI','Accessory','Motor','Shoulder shrug and head turning','Shrug against resistance','Weak shrug on one side'],
  ['XII','Hypoglossal','Motor','Tongue movement','Stick tongue out straight','Tongue points towards the weak side']]}},
 {h:'Remembering them'},
 {pearls:['Names, in order: \u201cOh Oh Oh To Touch And Feel Very Good Velvet, Such Heaven\u201d (Olfactory, Optic, Oculomotor, Trochlear, Trigeminal, Abducens, Facial, Vestibulocochlear, Glossopharyngeal, Vagus, Spinal accessory, Hypoglossal).','Type, in order: \u201cSome Say Marry Money, But My Brother Says Big Brains Matter More\u201d (S = sensory, M = motor, B = both).','On scene the ones that matter most are II and III (pupils and vision), VII (facial droop), IX and X (swallowing, so keep stroke patients nil by mouth) and XII (tongue deviation).']},
 {callout:['red','alert','<b>A newly dilated pupil with falling GCS</b> means CN III is being squeezed by swelling or bleeding inside the skull. Escalate immediately.']}
]},
{id:'stroke',t:'Stroke & blood supply',blocks:[
 {p:'The brain gets its blood from two systems. The front (anterior) circulation comes from the carotid arteries and splits into the anterior and middle cerebral arteries. The back (posterior) circulation comes from the vertebral arteries, which join as the basilar artery to feed the brainstem, cerebellum and the back of the brain. Which artery is blocked decides what the patient looks like.'},
 {fig:'territories'},
 {table:{head:['Artery','Area it feeds','What you see','BE-FAST'],rows:[
  ['Middle cerebral (MCA)','Side of the brain: movement and feeling for face and arm; speech (usually left side)','Face and arm weakness or numbness on the opposite side; speech problems if left-sided; ignoring one side (neglect) if right-sided; eyes may look towards the affected side','Face, Arms, Speech usually positive'],
  ['Anterior cerebral (ACA)','Top and inner surface: leg area; judgement and behaviour','Leg weaker than arm on the opposite side; confusion, apathy; incontinence','May be FAST-negative: check both legs'],
  ['Posterior cerebral (PCA)','Back of the brain: vision','Loss of the same half of vision in both eyes; bumping into things on one side; confusion','Eyes'],
  ['Vertebral / basilar (posterior circulation, incl. PICA)','Brainstem and cerebellum','Vertigo, vomiting, unsteadiness, double vision, slurred speech, swallowing problems; face affected on one side and body on the other; reduced consciousness','Balance, Eyes; often FAST-negative'],
  ['Small deep vessels (lacunar)','Deep pathways','Pure weakness or pure numbness of face, arm and leg equally, without speech or vision problems','Face, Arms']]}},
 {pearls:['Left brain controls the right body. Speech lives on the left in almost all right-handed people and most left-handed people.','Time is brain: roughly 1.9 million brain cells die every minute during a large stroke. Record the time last seen well exactly.','FAST-negative strokes are easily missed: sudden vertigo, unsteadiness, double vision or sudden severe headache still need escalation.','Stroke mimics: hypoglycaemia, seizure (post-ictal weakness), migraine, sepsis in older adults, head injury. Always check glucose if trained.']},
 {callout:['info','info','Use the <a href="#/befast">BE-FAST tool</a> to record findings and time last known well.']}
]},
{id:'spinal',t:'Spinal cord & nerves',blocks:[
 {p:'The spinal cord runs from the brainstem to about the first lumbar vertebra, carrying movement signals down and sensation up. Each pair of spinal nerves supplies a strip of skin (dermatome) and a group of muscles (myotome). The level where function changes after an injury tells you roughly where the cord is damaged.'},
 {fig:'dermatomes'},
 {table:{head:['Level','Movement (myotome)','Feeling (dermatome)'],rows:[
  ['C3, 4, 5','Diaphragm (breathing)','Neck and top of shoulder'],['C5','Lift arm out to side; bend elbow','Outer upper arm'],['C6','Bend wrist back','Thumb'],['C7','Straighten elbow','Middle finger'],['C8','Grip (bend fingers)','Little finger'],['T1','Spread fingers','Inner elbow'],
  ['T4','Chest muscles','Nipple line'],['T10','Abdominal muscles','Umbilicus'],['L1, 2','Bend hip','Groin, upper thigh'],['L3','Straighten knee','Knee'],['L4','Lift foot up (dorsiflex)','Inner shin and ankle'],['L5','Lift big toe','Top of foot, big toe'],['S1','Stand on tiptoe','Outer foot, little toe'],['S2, 3, 4','Bladder, bowel, erection','Saddle area']]}},
 {pearls:['\u201cC3, 4, 5 keeps the diaphragm alive\u201d: injuries at C5 or higher can stop breathing.','\u201cS2, 3, 4 keeps the poo off the floor\u201d: new saddle numbness or incontinence with back pain suggests cauda equina syndrome.','Neurogenic shock after spinal injury: low BP with a slow pulse and warm, pink skin below the injury (different from the fast pulse and pale skin of bleeding).','A normal walking patient can still have a spinal injury: follow your spinal assessment training.']}
]},
{id:'loc',t:'Consciousness',blocks:[
 {p:'Consciousness needs two things: arousal (being awake), run by the reticular activating system in the brainstem, and awareness (knowing who and where you are), run by both cerebral hemispheres. Anything that affects the brainstem, or both hemispheres at once, reduces consciousness.'},
 {table:{head:['Level','What it looks like','Roughly'],rows:[
  ['Alert','Awake, attentive, orientated to person, place and time','GCS 15, A on ACVPU'],
  ['Confused','Awake but disorientated, muddled answers, may be agitated','GCS 14, C on ACVPU (scores 3 on NEWS2)'],
  ['Drowsy (lethargic)','Sleepy, wakes to voice, drifts off without stimulation','V on ACVPU'],
  ['Obtunded','Hard to rouse, needs repeated loud voice or shaking','V or P'],
  ['Stuporous','Responds only to painful stimuli: grunts, withdraws','P, GCS around 8\u201312'],
  ['Comatose','No eye opening or purposeful response to anything','U, GCS 8 or below']]}},
 {h:'Causes: AEIOU TIPS'},
 {table:{head:['','Cause'],rows:[['A','Alcohol and other drugs'],['E','Epilepsy (post-ictal), electrolytes, encephalopathy (liver)'],['I','Insulin: hypoglycaemia or DKA'],['O','Oxygen (hypoxia), opioids, overdose'],['U','Uraemia (kidney failure)'],['T','Trauma (head injury), temperature (hypo- or hyperthermia)'],['I','Infection: sepsis, meningitis'],['P','Poisoning (including carbon monoxide), psychiatric'],['S','Stroke, shock, space-occupying lesion (bleed, tumour)']]}},
 {pearls:['The trend matters more than a single number: a GCS falling by 2 or more is a red flag.','GCS 8 or below: the patient may not protect their own airway.','Always check glucose in anyone with reduced consciousness if trained. It is the quickest reversible cause to find.','Some causes are in the environment: several people drowsy in one house suggests carbon monoxide. Get everyone out.']},
 {callout:['info','info','Score it with the <a href="#/gcs">GCS calculator</a>.']}
]}
];

/* ======================= MUSCULOSKELETAL ======================= */
const msk=S('musculoskeletal');
msk.figs=['skeleton2','longbone','synovial','skeleton'];
msk.topics=[
{id:'skeleton',t:'The skeleton',blocks:[
 {p:'The adult skeleton has 206 bones: 80 in the axial skeleton (skull, spine, ribs and sternum) that protects the brain, cord and chest organs, and 126 in the appendicular skeleton (limbs and the girdles that attach them).'},
 {fig:'skeleton2'},
 {table:{head:['Region','Bones','Notes'],rows:[
  ['Skull','22 (plus 6 ear ossicles and the hyoid)','8 cranial, 14 facial'],['Spine','26 in adults','7 cervical, 12 thoracic, 5 lumbar, sacrum (5 fused), coccyx (3\u20135 fused)'],['Ribs','24 (12 pairs)','Pairs 1\u20137 join the sternum directly; 8\u201310 via cartilage; 11\u201312 float'],['Sternum','1 (three parts)','Manubrium, body, xiphoid process'],
  ['Upper limbs','64 (32 each side)','Clavicle, scapula, humerus, radius, ulna, 8 carpals, 5 metacarpals, 14 phalanges'],['Lower limbs','62 (31 each side)','Hip bone, femur, patella, tibia, fibula, 7 tarsals, 5 metatarsals, 14 phalanges']]}},
 {table:{head:['Bone type','Examples','Job'],rows:[['Long','Femur, humerus, tibia','Levers for movement; contain marrow'],['Short','Carpals, tarsals','Stability with some movement'],['Flat','Skull, ribs, sternum, scapula','Protection; red marrow in adults'],['Irregular','Vertebrae, pelvis, facial bones','Complex shapes'],['Sesamoid','Patella','Sits inside a tendon']]}},
 {pearls:['The radius is on the thumb side and the ulna on the little-finger side.','The tibia takes the weight; the fibula is the thin outer bone.','Babies have around 300 bones; many fuse as they grow.']}
]},
{id:'bonejoint',t:'Bones & joints',blocks:[
 {p:'Bone is living tissue with its own blood supply and nerves. A hard outer layer of compact bone surrounds a honeycomb of spongy bone and the marrow cavity. Red marrow makes blood cells; yellow marrow stores fat. The periosteum wrapping the outside is packed with nerves, which is why fractures are so painful.'},
 {fig:'longbone'},{fig:'synovial'},
 {table:{head:['Joint type','Movement','Examples'],rows:[['Fibrous','None','Skull sutures'],['Cartilaginous','Slight','Discs between vertebrae, pubic symphysis'],['Synovial: hinge','Bend and straighten','Elbow, knee, fingers'],['Synovial: ball and socket','All directions','Shoulder, hip'],['Synovial: pivot','Rotation','Top of the neck (C1\u2013C2), forearm'],['Synovial: saddle','Two planes','Base of thumb'],['Synovial: condyloid','Two planes','Wrist'],['Synovial: gliding','Small slides','Between carpals and tarsals']]}},
 {pearls:['The shoulder is the most mobile joint and the one most often dislocated.','After any dislocation or fracture, check circulation, sensation and movement (CSM) beyond it, and compare with the other side.']}
]},
{id:'fractures',t:'Fractures & blood loss',blocks:[
 {table:{head:['Fracture','What it means'],rows:[['Closed','Skin intact'],['Open (compound)','Bone has broken the skin or a wound connects to it: infection risk, cover with a sterile dressing'],['Greenstick','Bends and partly breaks; children\u2019s bones'],['Transverse','Straight across; direct blow'],['Oblique / spiral','Angled or twisted; twisting force. Spiral fractures in non-walking children raise safeguarding concern'],['Comminuted','Several fragments; high energy'],['Compression','Crushed, usually vertebrae in osteoporosis'],['Avulsion','Tendon or ligament pulls a fragment off'],['Displaced','Ends out of line: visible deformity'],['Fragility / pathological','Breaks with little force: osteoporosis or cancer in the bone']]}},
 {h:'Estimated internal blood loss'},
 {table:{head:['Site','Possible loss'],rows:[['Rib (each)','About 125 mL'],['Radius or ulna','250\u2013500 mL'],['Humerus','500\u2013750 mL'],['Tibia or fibula','500\u20131,000 mL'],['Femur (closed shaft)','1,000\u20131,500 mL'],['Pelvis','1,500\u20133,000 mL or more']]}},
 {pearls:['Two long-bone fractures or a pelvic fracture can hide enough blood to cause shock: watch pulse, skin and conscious level.','Neck of femur fracture: often after a fall in older adults; shortened, externally rotated leg; unable to weight-bear. Ask why they fell.','Don\u2019t spring or rock the pelvis to test it; it can restart bleeding.','Blood loss estimates are adult averages and vary widely.']}
]}
];

/* ======================= CARDIOVASCULAR ======================= */
const cv=S('cardiovascular');
cv.figs=['heart','circulation','arteries','veins'];
cv.topics=[
{id:'arteries',t:'Arteries & pulses',blocks:[
 {p:'Arteries carry blood away from the heart under high pressure. They have thick muscular walls and pulse with every heartbeat. The aorta leaves the left ventricle, arches over the heart and runs down in front of the spine, giving branches to every region before splitting into the iliac arteries at about the level of the umbilicus.'},
 {fig:'arteries'},
 {table:{head:['Pulse','Where to feel','What it tells you'],rows:[
  ['Carotid','Beside the windpipe, under the angle of the jaw (one side at a time)','Central pulse: use in collapse and for pulse checks in adults'],
  ['Brachial','Inner elbow crease, or inner upper arm in infants','Pulse check in infants under 1; BP cuff position'],
  ['Radial','Thumb side of the wrist','Routine rate and rhythm; weak or absent in shock'],
  ['Femoral','Groin, midway between hip bone and pubic bone','Central pulse in shock or arrest'],
  ['Popliteal','Deep behind the knee, knee slightly bent','Leg circulation after knee injury'],
  ['Posterior tibial','Behind the inner ankle bone','Foot circulation (CSM checks)'],
  ['Dorsalis pedis','Top of the foot, between 1st and 2nd tendons','Foot circulation; absent in about 10% of people normally']]}},
 {table:{head:['Artery','Supplies','Why it matters'],rows:[
  ['Aorta','Whole body','Aneurysm or dissection: tearing pain to the back, collapse'],['Coronary arteries','Heart muscle','Blockage causes a heart attack'],['Carotid (common, internal, external)','Brain (internal), face and scalp (external)','Narrowing causes TIAs and strokes'],['Vertebral / basilar','Brainstem, cerebellum, back of brain','Posterior circulation strokes'],['Subclavian, axillary, brachial','Arm','BP taken over the brachial'],['Radial, ulnar','Forearm and hand','Joined by the palmar arch'],['Coeliac, mesenteric','Gut, liver, spleen','Blocked gut artery: severe pain with few signs'],['Renal','Kidneys','Receive about 20\u201325% of cardiac output'],['Iliac, femoral','Pelvis and leg','Large bleeds from groin wounds'],['Popliteal, tibial','Lower leg and foot','Checked after leg injuries']]}},
 {pearls:['The old rule that a palpable radial pulse means systolic BP is above 80 has been shown to overestimate BP. Use it as a rough sign, not a measurement.','Check a pulse for no more than 10 seconds in an unresponsive patient: if you\u2019re not sure, start CPR.','Always compare pulses on both sides after limb injuries.']}
]},
{id:'veins',t:'Veins',blocks:[
 {p:'Veins return blood to the heart at low pressure. They have thin walls and one-way valves, and rely on muscles squeezing them (the muscle pump) and breathing to keep blood moving. About two thirds of the blood volume is in the veins at any time, which is why they act as the body\u2019s reservoir in bleeding and dehydration.'},
 {fig:'veins'},
 {table:{head:['Vein','Where','Why it matters'],rows:[
  ['Superior vena cava','Returns blood from head and arms','Blockage causes a swollen face and arms'],['Inferior vena cava','Returns blood from abdomen and legs','Compressed by the pregnant uterus when lying flat after 20 weeks'],['Internal jugular','Deep in the neck','Raised neck veins (JVP) in heart failure, tension pneumothorax, tamponade'],['External jugular','Visible on the side of the neck','Flat neck veins when lying flat suggest low blood volume'],['Cephalic, basilic, median cubital','Arm and elbow crease','Common cannula and blood test sites'],['Femoral vein','Groin, just inside the femoral artery','Common site of DVT'],['Great saphenous','Inner leg from ankle to groin','Longest vein; varicose veins; used in heart bypass grafts'],['Small saphenous','Back of the calf','Varicose veins'],['Hepatic portal vein','Gut to liver','Liver disease backs pressure up into varices that can bleed']]}},
 {pearls:['DVT risk: immobility, surgery, long journeys, cancer, pregnancy, the pill or HRT.','Varicose veins can bleed heavily: lie the patient down, raise the leg and press firmly.','Lying a late-pregnancy patient on her left side takes the uterus off the inferior vena cava.']}
]}
];
})();
