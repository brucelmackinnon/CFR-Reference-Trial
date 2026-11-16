// Illustration pack manifest. Downloaded once from Wikimedia Commons via Settings.
// title = exact Commons file name when known; q/must = search fallback (English-labelled original is chosen).
// sys = body system id; sec = tab id where it appears (overview, anatomy, works, fails, or a topic id).
window.ILLUS=[
// ---- Nervous
{id:'nv_lobes',sys:'nervous',sec:'overview',title:'Blausen_0111_BrainLobes.png',q:'Blausen 0111 BrainLobes',must:'blausen lobes',cap:'Lobes of the brain'},
{id:'nv_motor',sys:'nervous',sec:'works',q:'Blausen 0102 Brain Motor Sensory',must:'blausen 0102',cap:'Motor and sensory areas of the brain'},
{id:'nv_neuron',sys:'nervous',sec:'works',title:'Blausen_0672_NeuralTissue.png',q:'Blausen 0672 NeuralTissue',must:'blausen neural',cap:'Nerve cells (neurons)'},
{id:'nv_cranial',sys:'nervous',sec:'cranial',title:'Blausen_0284_CranialNerves.png',q:'Blausen 0284 CranialNerves',must:'blausen cranial',cap:'The cranial nerves'},
{id:'nv_stroke',sys:'nervous',sec:'stroke',title:'Blausen_0836_Stroke.png',q:'Blausen 0836 Stroke',must:'blausen stroke',cap:'Stroke: a blocked artery starves part of the brain'},
{id:'nv_spinal',sys:'nervous',sec:'spinal',title:'Blausen_0822_SpinalCord.png',q:'Blausen 0822 SpinalCord',must:'blausen spinal',cap:'The spinal cord and nerve roots'},
// ---- Musculoskeletal
{id:'ms_app',sys:'musculoskeletal',sec:'skeleton',title:'Appendicular_Skeleton.png',q:'Appendicular Skeleton Blausen',must:'appendicular skeleton',cap:'Appendicular skeleton: limbs and girdles'},
{id:'ms_ax',sys:'musculoskeletal',sec:'skeleton',q:'Axial Skeleton Blausen',must:'axial skeleton',cap:'Axial skeleton: skull, spine and ribs'},
{id:'ms_skull',sys:'musculoskeletal',sec:'skeleton',title:'Blausen_0393_FacialBones_01.png',q:'Blausen 0393 FacialBones',must:'blausen facial',cap:'Bones of the face'},
{id:'ms_types',sys:'musculoskeletal',sec:'bonejoint',title:'Blausen_0229_ClassificationofBones.png',q:'Blausen 0229 ClassificationofBones',must:'blausen bones',cap:'Types of bone'},
{id:'ms_knee',sys:'musculoskeletal',sec:'bonejoint',q:'Blausen knee anatomy',must:'blausen knee',cap:'The knee joint'},
{id:'ms_muscle',sys:'musculoskeletal',sec:'works',title:'Blausen_0801_SkeletalMuscle.png',q:'Blausen 0801 SkeletalMuscle',must:'blausen muscle',cap:'Skeletal muscle structure'},
{id:'ms_frac',sys:'musculoskeletal',sec:'fractures',q:'Blausen fracture types',must:'blausen fracture',cap:'Types of fracture'},
// ---- Cardiovascular
{id:'cv_section',sys:'cardiovascular',sec:'overview',q:'Blausen 0457 heart',must:'blausen 0457',cap:'Inside the heart: chambers, valves and blood flow'},
{id:'cv_front',sys:'cardiovascular',sec:'anatomy',q:'Blausen 0451 heart anterior',must:'blausen 0451',cap:'The heart from the front'},
{id:'cv_coronary',sys:'cardiovascular',sec:'anatomy',title:'Blausen_0260_CoronaryVessels_Anterior.png',q:'Blausen 0260 CoronaryVessels',must:'blausen coronary',cap:'Coronary arteries: the heart\u2019s own blood supply'},
{id:'cv_mi',sys:'cardiovascular',sec:'fails',q:'Blausen 0463 heart attack',must:'blausen 0463',cap:'Heart attack: a blocked coronary artery'},
{id:'cv_tamponade',sys:'cardiovascular',sec:'fails',title:'Blausen_0164_CardiacTamponade_02.png',q:'Blausen 0164 CardiacTamponade',must:'blausen tamponade',cap:'Cardiac tamponade'},
{id:'cv_wall',sys:'cardiovascular',sec:'arteries',q:'Blausen 0055 artery wall structure',must:'blausen 0055',cap:'Structure of an artery wall'},
{id:'cv_plaque',sys:'cardiovascular',sec:'arteries',title:'Blausen_0053_Artery_NormalvsDiseasedVessel.png',q:'Blausen 0053 Artery NormalvsDiseasedVessel',must:'blausen artery',cap:'Healthy artery vs one narrowed by plaque'},
{id:'cv_carotid',sys:'cardiovascular',sec:'arteries',q:'Blausen carotid arteries',must:'blausen carotid',cap:'The carotid arteries'},
{id:'cv_legart',sys:'cardiovascular',sec:'arteries',q:'Blausen leg arteries',must:'blausen leg arter',cap:'Arteries of the leg'},
{id:'cv_legvein',sys:'cardiovascular',sec:'veins',q:'Blausen leg veins',must:'blausen leg vein',cap:'Veins of the leg'},
{id:'cv_dvt',sys:'cardiovascular',sec:'veins',q:'Blausen deep vein thrombosis',must:'blausen thrombosis',cap:'Deep vein thrombosis (DVT)'},
// ---- Respiratory
{id:'rs_system',sys:'respiratory',sec:'overview',q:'Blausen respiratory system',must:'blausen respiratory',cap:'The respiratory system'},
{id:'rs_alveoli',sys:'respiratory',sec:'works',q:'Blausen alveoli',must:'blausen alveol',cap:'Alveoli, where gas exchange happens'},
{id:'rs_asthma',sys:'respiratory',sec:'fails',q:'Blausen asthma',must:'blausen asthma',cap:'Asthma: narrowed, inflamed airways'},
{id:'rs_ptx',sys:'respiratory',sec:'fails',q:'Blausen pneumothorax',must:'blausen pneumothorax',cap:'Pneumothorax'},
// ---- Digestive
{id:'dg_system',sys:'digestive',sec:'overview',q:'Blausen digestive system',must:'blausen digestive',cap:'The digestive system'},
{id:'dg_gall',sys:'digestive',sec:'anatomy',q:'Blausen gallbladder anatomy',must:'blausen gallbladder',cap:'Liver, gallbladder and bile ducts'},
{id:'dg_append',sys:'digestive',sec:'fails',q:'Blausen appendicitis',must:'blausen appendicitis',cap:'Appendicitis'},
// ---- Urinary
{id:'ur_system',sys:'urinary',sec:'overview',q:'Blausen urinary system',must:'blausen urinary',cap:'The urinary system'},
{id:'ur_kidney',sys:'urinary',sec:'anatomy',q:'Blausen kidney anatomy',must:'blausen kidney',cap:'Inside the kidney'},
{id:'ur_nephron',sys:'urinary',sec:'works',q:'Blausen nephron',must:'blausen nephron',cap:'The nephron: the kidney\u2019s filter'},
// ---- Endocrine
{id:'en_system',sys:'endocrine',sec:'overview',q:'Blausen endocrine system',must:'blausen endocrine',cap:'Endocrine glands'},
{id:'en_thyroid',sys:'endocrine',sec:'anatomy',q:'Blausen thyroid gland',must:'blausen thyroid',cap:'The thyroid gland'},
{id:'en_pancreas',sys:'endocrine',sec:'works',q:'Blausen pancreas anatomy',must:'blausen pancrea',cap:'The pancreas'},
// ---- Lymphatic / immune
{id:'ly_system',sys:'lymphatic_immune',sec:'overview',q:'Lymphatic System Female Blausen',must:'lymphatic system',cap:'The lymphatic system'},
{id:'ly_wbc',sys:'lymphatic_immune',sec:'works',q:'Blausen white blood cells',must:'blausen white',cap:'White blood cells'},
// ---- Skin
{id:'sk_skin',sys:'integumentary',sec:'overview',q:'Blausen skin anatomy',must:'blausen skin',cap:'Layers of the skin'},
{id:'sk_burns',sys:'integumentary',sec:'fails',q:'Blausen burns degrees',must:'blausen burn',cap:'Burn depth'},
// ---- Reproductive
{id:'rp_female',sys:'reproductive',sec:'overview',q:'Blausen female reproductive system',must:'blausen female reproductive',cap:'Female reproductive organs'},
{id:'rp_ectopic',sys:'reproductive',sec:'fails',q:'Blausen ectopic pregnancy',must:'blausen ectopic',cap:'Ectopic pregnancy'},
// ---- Sensory
{id:'se_eye',sys:'sensory',sec:'overview',q:'Blausen eye anatomy',must:'blausen eye',cap:'Anatomy of the eye'},
{id:'se_ear',sys:'sensory',sec:'anatomy',q:'Blausen ear anatomy',must:'blausen ear',cap:'Anatomy of the ear'},
// ---- Blood
{id:'hb_cells',sys:'haematological',sec:'overview',q:'Blausen blood cells',must:'blausen blood',cap:'Blood cells'},
{id:'hb_clot',sys:'haematological',sec:'works',title:'Blausen_0088_BloodClot.png',q:'Blausen 0088 BloodClot',must:'blausen clot',cap:'How a blood clot forms'},
// ---- Visual lookup photos (clinical photos; vt = visual type, causes = Visual lookup cause names; graphic = blur until tapped)
{id:'vp_lyme',sys:'visual',sec:'rash',vt:['rash','bite'],causes:['Lyme disease (tick bite)'],title:'Erythema_migrans_-_erythematous_rash_in_Lyme_disease_-_PHIL_9875.jpg',q:'Erythema migrans Lyme disease PHIL 9875',must:'erythema migrans',cap:'Bullseye rash (erythema migrans) after a tick bite'},
{id:'vp_petechiae',sys:'visual',sec:'rash',vt:['rash'],causes:['Meningococcal septicaemia','Low platelets or bleeding disorder'],title:'Petechial_rash.JPG',q:'Petechial rash',must:'petechia',cap:'Petechiae: tiny non-blanching spots'},
{id:'vp_purpura',sys:'visual',sec:'rash',vt:['rash'],causes:['Meningococcal septicaemia','Low platelets or bleeding disorder'],title:'Purpura.jpg',q:'Purpura spots',must:'purpura',cap:'Purpura: larger non-blanching purple patches'},
{id:'vp_shingles',sys:'visual',sec:'rash',vt:['rash'],causes:['Shingles'],title:'Shingles_on_the_chest.jpg',q:'Shingles herpes zoster chest',must:'shingles',cap:'Shingles: blistering band on one side'},
{id:'vp_hives',sys:'visual',sec:'rash',vt:['rash','bite'],causes:['Hives (urticaria)','Anaphylaxis','Local sting or bite reaction'],title:'Hives_Urticaria.jpg',q:'Hives urticaria wheals',must:'urticaria',cap:'Hives (urticaria): raised itchy welts'},
{id:'vp_chickenpox',sys:'visual',sec:'rash',vt:['rash'],causes:['Chickenpox'],q:'Chickenpox rash varicella',must:'chickenpox',cap:'Chickenpox: spots at different stages'},
{id:'vp_cellulitis',sys:'visual',sec:'infect',vt:['infect','bite','wound'],causes:['Cellulitis','Infected bite or wound (cellulitis)'],title:'Cellulitis_Left_Leg.JPG',q:'Cellulitis left leg',must:'cellulitis',cap:'Cellulitis: red, hot, swollen, spreading'},
{id:'vp_abscess',sys:'visual',sec:'infect',vt:['infect','wound'],causes:['Abscess'],q:'Skin abscess',must:'abscess',cap:'Skin abscess: swelling with a soft centre',graphic:1},
{id:'vp_nf',sys:'visual',sec:'infect',vt:['infect','wound','bite'],causes:['Necrotising fasciitis'],q:'Necrotizing fasciitis leg',must:'fasciitis',cap:'Necrotising fasciitis: dusky, spreading, blistered skin',graphic:1},
{id:'vp_tick',sys:'visual',sec:'bite',vt:['bite'],causes:['Tick bite','Lyme disease (tick bite)'],q:'Ixodes ricinus tick on skin',must:'ixodes',cap:'Tick (Ixodes) attached to skin'},
{id:'vp_adder',sys:'visual',sec:'bite',vt:['bite'],causes:['Adder bite'],q:'Vipera berus adder',must:'vipera berus',cap:'Adder (Vipera berus): the UK\u2019s only venomous snake, zigzag pattern'},
{id:'vp_burn1',sys:'visual',sec:'burn',vt:['burn'],causes:['Superficial burn'],q:'First degree burn',must:'burn',cap:'Superficial burn: red, painful, no blisters'},
{id:'vp_burn2',sys:'visual',sec:'burn',vt:['burn'],causes:['Partial-thickness burn'],q:'Second degree burn blister',must:'burn',cap:'Partial-thickness burn: blistered',graphic:1},
{id:'vp_burn3',sys:'visual',sec:'burn',vt:['burn'],causes:['Full-thickness burn'],q:'Third degree burn',must:'burn',cap:'Full-thickness burn: white, leathery or charred',graphic:1}
];
