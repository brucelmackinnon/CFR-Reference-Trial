// How the body systems link together. Shown as the "Connections" tab on each system.
// links: [other system id, how they interact]; chains: "why" explanations; deeper: optional physiology.
window.CONNECT={
cardiovascular:{
 intro:'The heart and vessels deliver oxygen and fuel to every other system, so almost every serious illness shows up in the pulse, BP and skin. In return, the kidneys, brain and hormones constantly adjust the circulation.',
 links:[
  ['respiratory','Heart and lungs are one circuit. The right heart pumps blood through the lungs; if the left heart fails, pressure backs up into the lungs (pulmonary oedema: crackles, breathless lying flat). A PE blocks the lung circulation and strains the right heart.'],
  ['urinary','The kidneys receive about a fifth of cardiac output and defend BP. When BP falls they release renin, which makes angiotensin II (narrows vessels) and aldosterone (keeps salt and water). Low urine output is an early sign of poor perfusion. ACE inhibitors and ARBs block this defence, so a dehydrated patient on ramipril drops their BP faster.'],
  ['nervous','Pressure sensors in the carotids and aortic arch report to the brainstem, which adjusts heart rate and vessel tone within seconds. The brain has no reserve: confusion is often the first sign of shock, and a faint is the brain briefly losing blood flow.'],
  ['endocrine','Adrenaline and cortisol raise heart rate and BP under stress. Too much thyroid hormone causes fast AF; adrenal crisis causes shock.'],
  ['haematological','Blood volume is what the heart has to pump. Losing it means less stretch, less output, then shock. The clotting system causes heart attacks and strokes, which is why so many patients take anticoagulants or antiplatelets.']],
 chains:[
  {q:'Why does the pulse rise before the BP falls in bleeding?',steps:['Blood is lost','Less blood returns to the heart','Each beat pumps less (smaller stroke volume)','Pressure sensors notice the fall','Adrenaline speeds the heart and narrows vessels in the skin and gut','BP is held near normal: compensation','After about 30% loss, compensation fails and BP falls'],so:'A normal BP does not mean someone isn\u2019t bleeding. A rising pulse, pale cool skin, slow cap refill and anxiety come first.'},
  {q:'Why is someone with heart failure breathless lying flat?',steps:['The left ventricle can\u2019t pump out all the blood it receives','Pressure backs up into the lung veins','Fluid leaks into the alveoli','Gas exchange falls and the lungs stiffen','Lying flat returns more blood from the legs, making it worse','Sitting up pools blood in the legs and eases it'],so:'Let breathless patients sit up. Crackles and pink frothy sputum mean pulmonary oedema.'}],
 deeper:[
  ['Blood pressure in one equation','BP = cardiac output \u00d7 resistance of the vessels. Cardiac output = heart rate \u00d7 stroke volume (about 70 mL \u00d7 70 beats \u2248 5 L a minute). Every type of shock attacks one part: bleeding lowers stroke volume, sepsis and anaphylaxis drop resistance, a failing heart lowers stroke volume from the pump itself. The body fights back by raising the other terms, which is why the pulse climbs and the skin goes pale.'],
  ['Why beta blockers hide shock','Bisoprolol, atenolol and similar drugs stop the heart rate rising. A bleeding or septic patient on them may keep a pulse of 70 while deteriorating. Judge them on skin, mental state, cap refill, breathing rate and BP trend.'],
  ['Mean arterial pressure','MAP \u2248 diastolic + one third of (systolic \u2212 diastolic). Organs need a MAP of around 65 mmHg. For example, 90/60 gives a MAP of about 70.']]},

respiratory:{
 intro:'The lungs load oxygen and remove carbon dioxide, which also makes them the fastest way the body can correct acid. That\u2019s why the breathing rate changes in so many illnesses that have nothing to do with the chest.',
 links:[
  ['cardiovascular','The lungs oxygenate the blood the heart pumps. Low oxygen makes the heart race and can trigger arrhythmias; if the lungs aren\u2019t perfused (PE, shock), they can\u2019t oxygenate however well they breathe.'],
  ['urinary','Acid balance is a partnership: the lungs blow off CO\u2082 (acid) within minutes, the kidneys remove acid and keep bicarbonate over days. In DKA or sepsis the lungs speed up to compensate; in COPD the kidneys hold on to bicarbonate to balance long-term high CO\u2082.'],
  ['nervous','The brainstem drives breathing by sensing CO\u2082. Opioids, head injury and sedatives slow it; a high neck injury paralyses the diaphragm (C3, 4, 5). Low oxygen or high CO\u2082 cause confusion and drowsiness.'],
  ['musculoskeletal','Breathing needs the ribs, diaphragm and chest muscles. Rib fractures make breathing painful and shallow, which leads to pneumonia, especially in older adults.'],
  ['lymphatic_immune','The airways are a main route in for infection: pneumonia is a common source of sepsis. Allergic reactions narrow the airways (asthma, anaphylaxis).']],
 chains:[
  {q:'Why does the breathing rate rise so early when someone is unwell?',steps:['Tissues are short of oxygen (shock, sepsis)','Cells switch to anaerobic metabolism','Lactic acid builds up','The blood becomes more acidic','Sensors in the brainstem detect the acid','Breathing speeds up and deepens to blow off CO\u2082'],so:'Breathing rate is one of the earliest and most sensitive warning signs, even with a clear chest. Count it for a full 30\u201360 seconds.'},
  {q:'Why can SpO\u2082 look fine in someone who is getting worse?',steps:['SpO\u2082 shows what percentage of haemoglobin is carrying oxygen','The oxygen curve is flat at the top: big drops in blood oxygen barely move SpO\u2082 until about 90%','Below that, SpO\u2082 falls fast','Oxygen therapy can keep SpO\u2082 up while CO\u2082 rises','Cold hands, nail varnish, anaemia and carbon monoxide also mislead the probe'],so:'Treat the whole patient: rate, effort, colour and conscious level matter as much as the number.'}],
 deeper:[
  ['The oxygen curve','SpO\u2082 90% sits at the edge of the steep part of the curve. Below it, small changes in lung function cause big falls in oxygen. That\u2019s why the usual target is 94\u201398%, and 88\u201392% is only for people at risk of retaining CO\u2082 (usually on their oxygen alert card).'],
  ['Carbon monoxide','CO binds haemoglobin about 200 times more strongly than oxygen, and most pulse oximeters count it as oxygen. SpO\u2082 can read normal in serious CO poisoning. Suspect it when several people in one building have headaches or drowsiness.']]},

nervous:{
 intro:'The brain controls breathing, heart rate, hormones and temperature, and it depends completely on a steady supply of oxygen and glucose. That makes it both the conductor of the other systems and one of the first to show when they fail.',
 links:[
  ['cardiovascular','The brain takes about 15% of cardiac output and has almost no reserve. The autonomic nervous system sets heart rate and vessel tone. Pressure inside the skull causes Cushing\u2019s response: high BP, slow pulse, irregular breathing (a very late sign).'],
  ['respiratory','The brainstem controls breathing. Reduced consciousness lets the tongue block the airway and removes the gag reflex, so vomit can be inhaled.'],
  ['endocrine','The hypothalamus and pituitary run most hormone systems. The brain uses glucose almost exclusively: a hypo causes confusion, aggression, seizures and signs that look like a stroke.'],
  ['musculoskeletal','Nerves drive the muscles; a spinal injury disconnects them. Many falls start in the nervous system: stroke, Parkinson\u2019s, fainting.'],
  ['homeostasis','The hypothalamus is the body\u2019s thermostat. Head injury, stroke, drugs and sepsis all disturb temperature control.']],
 chains:[
  {q:'Why do infections make older people confused?',steps:['Infection triggers inflammatory chemicals and fever','Blood flow and oxygen to the brain fall','Inflammation acts directly on brain cells','A vulnerable brain (age, dementia, medicines) fails first','Acute confusion (delirium) appears, often before fever or other signs'],so:'New confusion scores 3 on NEWS2 by itself and is often the first sign of sepsis in older adults. Ask family what\u2019s normal for them.'},
  {q:'Why does one pupil blow in a head injury?',steps:['Bleeding or swelling inside the rigid skull','Pressure rises','Brain tissue is pushed downwards','The third cranial nerve (CN III) is squeezed','It can no longer constrict the pupil on that side','A dilated, sluggish pupil appears, then GCS falls'],so:'A new unequal pupil with falling GCS is time-critical.'}],
 deeper:[
  ['Brain perfusion pressure','Cerebral perfusion pressure = mean arterial pressure \u2212 pressure inside the skull. If pressure in the skull rises, or BP falls, blood flow to the brain drops. That\u2019s why low BP is so harmful after a head injury.'],
  ['Fight or flight vs rest and digest','Sympathetic (fight or flight): fast pulse, dilated pupils, sweating, pale skin, raised glucose. Parasympathetic (rest and digest, mostly via the vagus nerve): slows the heart, constricts pupils, speeds up the gut. A simple faint is a sudden surge of parasympathetic activity.']]},

digestive:{
 intro:'The gut supplies fuel and fluid, the liver makes clotting factors and clears drugs and toxins, and the pancreas controls glucose. Gut problems quickly become circulation, kidney, blood and brain problems.',
 links:[
  ['cardiovascular','The gut can hide or lose large amounts of blood (GI bleed, ruptured AAA). Vomiting and diarrhoea cause dehydration and low BP. In shock the gut is one of the first places blood is diverted from.'],
  ['haematological','The liver makes clotting factors, so liver disease causes bleeding. Iron and B12 are absorbed in the gut; problems there cause anaemia.'],
  ['endocrine','The pancreas makes insulin and glucagon. Vomiting upsets diabetes control, causing hypos or DKA.'],
  ['nervous','Liver failure lets ammonia reach the brain, causing confusion (hepatic encephalopathy). Pain from organs is felt in odd places: gallbladder in the right shoulder, heart in the upper abdomen.'],
  ['urinary','Dehydration from vomiting or diarrhoea reduces blood flow to the kidneys and can cause acute kidney injury, especially with ACE inhibitors, diuretics or NSAIDs.']],
 chains:[
  {q:'Why does an upper GI bleed cause black stools?',steps:['Blood enters the upper gut (ulcer, varices)','Stomach acid and gut bacteria digest the haemoglobin','The iron turns dark','Black, sticky, tarry, foul-smelling stool (melaena)','Large volumes can be lost before it appears'],so:'Melaena means significant upper GI bleeding: check carefully for shock.'},
  {q:'Why is shoulder-tip pain a warning sign with abdominal pain?',steps:['Blood or fluid in the abdomen (ruptured ectopic, spleen, perforation)','It irritates the underside of the diaphragm','The diaphragm\u2019s nerve (phrenic, C3\u20135) shares a spinal level with the shoulder skin','The brain reads it as shoulder pain (referred pain)'],so:'Abdominal pain with shoulder-tip pain suggests internal bleeding or perforation.'}],
 deeper:[['Referred pain','Organs share spinal nerve levels with areas of skin. Heart: left arm, jaw, upper abdomen. Stomach: upper abdomen. Appendix: starts around the umbilicus then moves to the right lower quadrant. Kidney: loin to groin. Diaphragm: shoulder tip.']]},

urinary:{
 intro:'The kidneys control blood volume, salt, potassium and acid, help set blood pressure and clear many drugs. When circulation fails, urine output is one of the first things to drop.',
 links:[
  ['cardiovascular','The kidneys control blood volume and BP through the renin\u2013angiotensin\u2013aldosterone system. Low BP means less filtration and less urine. Heart failure and kidney failure worsen each other through fluid overload.'],
  ['respiratory','The kidneys balance acid over hours to days; the lungs over minutes. In kidney failure acid builds up and breathing becomes fast and deep.'],
  ['nervous','Kidney failure lets toxins build up (uraemia): confusion and drowsiness. Many drugs are cleared by the kidneys and become toxic in kidney failure, including morphine, lithium, digoxin and gabapentin.'],
  ['endocrine','The adrenal glands sit on the kidneys. The kidneys also make erythropoietin (red cell production) and activate vitamin D.'],
  ['haematological','Kidney disease reduces erythropoietin, causing anaemia. High potassium from kidney failure causes dangerous arrhythmias.']],
 chains:[
  {q:'Why does low urine output matter so much?',steps:['Poor perfusion (shock, dehydration, sepsis)','The kidneys receive less blood','Filtration falls','Hormones (ADH, aldosterone) hold on to water','Urine output drops','If it continues, kidney cells are damaged (acute kidney injury)','Potassium and acid rise and can cause arrhythmias'],so:'\u201cNot passed urine in 18 hours\u201d is a sepsis red flag and a clue to poor perfusion.'},
  {q:'Why do some medicines become dangerous in a dehydrated patient?',steps:['Dehydration reduces blood flow to the kidneys','ACE inhibitors and ARBs switch off the kidney\u2019s own pressure defence','NSAIDs narrow the kidney\u2019s blood vessels','Diuretics remove even more fluid (the \u201ctriple whammy\u201d)','Acute kidney injury','Drugs cleared by the kidney build up: metformin, lithium, digoxin, opioids'],so:'Ask about these medicines in anyone vomiting, with diarrhoea or not drinking.'}],
 deeper:[['Numbers','The kidneys filter about 180 litres of plasma a day and reabsorb 99% of it. Normal urine output is at least 0.5 mL per kg per hour: about 35 mL an hour for a 70 kg adult.']]},

musculoskeletal:{
 intro:'Bones and muscles protect organs, power breathing and movement, and store blood cells and minerals. Injuries to them affect circulation, nerves, breathing and the kidneys.',
 links:[
  ['cardiovascular','Fractures bleed: up to 1.5 L from a femur and over 2 L from a pelvis. The calf muscle pump returns venous blood; immobility leads to DVT.'],
  ['nervous','Nerves run alongside bones and through joints, so fractures and dislocations can trap them. Always check circulation, sensation and movement beyond an injury. Spinal fractures threaten the cord.'],
  ['respiratory','Ribs and muscles power breathing. Rib fractures cause shallow breathing and pneumonia, especially in older adults.'],
  ['urinary','Crushed muscle, or muscle compressed during a long lie, releases myoglobin (rhabdomyolysis), which blocks kidney tubules and causes kidney injury. It also releases potassium, which causes arrhythmias.'],
  ['haematological','Bone marrow makes blood cells. Fat from long-bone fractures can travel to the lungs and brain (fat embolism).']],
 chains:[
  {q:'Why is a long lie dangerous even without a fracture?',steps:['Hours on the floor','Muscle is compressed and starved of blood','Muscle cells break down (rhabdomyolysis)','Myoglobin and potassium are released','Dark urine and kidney injury; high potassium causes arrhythmias','Also pressure damage, hypothermia, dehydration and pneumonia'],so:'Always ask how long they were on the floor, and escalate long lies even if the patient looks well.'}],
 deeper:[['Compartment syndrome','Swelling inside a closed muscle compartment raises the pressure until blood can\u2019t get in. Muscles and nerves starve. Pain is out of proportion to the injury and worse when the muscle is stretched; pulses are often still present until very late.']]},

endocrine:{
 intro:'Hormones coordinate the other systems over minutes to months: glucose, stress responses, metabolism, fluid balance. Hormone emergencies usually show up as problems in other systems first.',
 links:[
  ['nervous','The hypothalamus and pituitary control the thyroid, adrenals and reproductive hormones. The brain depends on glucose.'],
  ['cardiovascular','Adrenaline, cortisol, thyroid hormone and aldosterone all raise heart rate or BP. Adrenal crisis causes shock; thyroid storm causes fast AF.'],
  ['urinary','High glucose spills into the urine and drags water with it: thirst, passing lots of urine, dehydration. Aldosterone and ADH act on the kidneys.'],
  ['digestive','The pancreas makes insulin. Vomiting means the patient can\u2019t eat or keep steroid tablets down, leading to hypos or adrenal crisis.'],
  ['lymphatic_immune','Cortisol suppresses immunity, so long-term steroid users get infections with few signs. The stress of infection raises glucose and can trigger DKA.']],
 chains:[
  {q:'Why does DKA cause deep breathing and dehydration?',steps:['Not enough insulin','Cells can\u2019t use glucose','The body burns fat instead','Ketones (acids) build up','The blood becomes acidic','The lungs compensate with deep, rapid breathing','High glucose spills into the urine, dragging water with it','Severe dehydration and vomiting'],so:'Deep sighing breathing with vomiting in a diabetic (especially type 1, or anyone on an SGLT2 inhibitor such as dapagliflozin) means think DKA.'},
  {q:'Why can steroid-dependent patients collapse when they\u2019re unwell?',steps:['Long-term steroids or Addison\u2019s disease','The adrenal glands can\u2019t make extra cortisol','Illness, injury or vomiting needs more cortisol','Without it, vessels don\u2019t respond to adrenaline and glucose falls','Shock, vomiting, abdominal pain, collapse (adrenal crisis)'],so:'Ask about a steroid emergency card and emergency hydrocortisone injection.'}],
 deeper:[['Glucose control','Insulin moves glucose into muscle, fat and liver cells. Glucagon, adrenaline and cortisol push glucose up. The brain uses about 120 g of glucose a day and can\u2019t store it, which is why hypoglycaemia affects the brain first.']]},

lymphatic_immune:{
 intro:'The immune system protects every other system, but when its response becomes overwhelming (sepsis, anaphylaxis) it damages them. Many of the sickest patients you see are suffering from their own immune response.',
 links:[
  ['cardiovascular','In sepsis and anaphylaxis, immune chemicals widen and leak blood vessels, causing low BP (distributive shock). The spleen filters the blood.'],
  ['respiratory','Anaphylaxis narrows the airways; pneumonia is the commonest source of sepsis.'],
  ['haematological','White cells are made in the marrow. Chemotherapy lowers them (neutropenia), so infection can become sepsis within hours. Sepsis also disturbs clotting, causing bruising and bleeding.'],
  ['nervous','Inflammatory chemicals act on the brain, causing confusion, and on the hypothalamus, causing fever.'],
  ['urinary','Urinary and kidney infections are a common source of sepsis, and sepsis causes kidney injury.']],
 chains:[
  {q:'How does an infection become sepsis?',steps:['A local infection (urine, chest, skin, abdomen)','The immune system releases inflammatory chemicals','In sepsis the response spreads through the whole body','Blood vessels dilate and leak','BP falls and tissues receive less oxygen','Organs start to fail: brain (confusion), lungs (fast breathing), kidneys (no urine), skin (mottling)'],so:'Sepsis is the body\u2019s response damaging its own organs. Look for signs of organ dysfunction, not just signs of infection.'},
  {q:'Why does anaphylaxis cause collapse?',steps:['Contact with the allergen','Mast cells release histamine and other chemicals','Vessels dilate and leak fluid: low BP, swelling','Airways constrict: wheeze','Throat and tongue swell: stridor','Blood pools and leaks, less returns to the heart','Collapse'],so:'Airway, breathing or circulation problems after a trigger mean anaphylaxis. Lie them flat if faint, and don\u2019t sit or stand them up suddenly.'}],
 deeper:[['Why fever happens','Inflammatory chemicals reset the hypothalamus thermostat higher. The body feels cold at its normal temperature, so it shivers (rigors) and narrows skin vessels to reach the new set point. Uncontrollable shaking rigors suggest bacteria in the blood.']]},

integumentary:{
 intro:'The skin is a barrier, a temperature regulator and a window on the circulation. Its colour, temperature and moisture tell you what the heart, blood and immune system are doing.',
 links:[
  ['cardiovascular','Skin blood flow reflects the circulation: vessels narrow in shock (pale, cool, clammy, slow cap refill) and widen in early sepsis, anaphylaxis and heat illness.'],
  ['homeostasis','The skin controls heat loss through sweating and widening vessels. Burns and exposure lead to hypothermia.'],
  ['lymphatic_immune','Skin is the main barrier against infection. Burns, wounds, ulcers and cellulitis let infection in and can lead to sepsis.'],
  ['haematological','Petechiae and purpura suggest low platelets or meningococcal sepsis; jaundice points to the liver or to red cell breakdown.']],
 chains:[{q:'Why do large burns cause shock?',steps:['Burned skin loses its barrier','Damaged capillaries leak plasma into the tissues and out of the wound','Circulating volume falls over hours','Burn shock and dehydration','Heat loss and infection risk add to it'],so:'Burns over about 10% in adults (5% in children) need hospital fluids. Cool the burn but keep the patient warm.'}],
 deeper:[['Reading skin in darker skin tones','Pallor, cyanosis and rashes are harder to see on darker skin. Look at the lips, gums, tongue, conjunctivae, palms and nail beds, and feel for temperature and moisture.']]},

reproductive:{
 intro:'Pregnancy changes almost every system: more blood, a faster pulse, higher clot risk and a uterus that can squeeze the main vein. That changes how you interpret obs.',
 links:[
  ['cardiovascular','Blood volume rises by about 40\u201350% and heart rate by 10\u201320 beats, so bleeding shows late. After 20 weeks, lying flat lets the uterus compress the vena cava.'],
  ['respiratory','Oxygen demand rises and the diaphragm is pushed up. Breathlessness is common, but a breathing rate over 20 is not normal.'],
  ['haematological','Pregnancy makes blood clot more readily: DVT and PE risk rises. Bleeding in pregnancy or after birth can be massive.'],
  ['endocrine','Hormones drive the cycle and pregnancy; gestational diabetes can develop. The pill and HRT increase clot risk.']],
 chains:[{q:'Why can a pregnant woman lose a lot of blood before her obs change?',steps:['Blood volume is 40\u201350% higher in late pregnancy','She can lose 1\u20131.5 L before pulse or BP change','Her body diverts blood away from the uterus to protect her','The baby shows distress (reduced movements) before she does'],so:'Take bleeding in pregnancy seriously even when the obs look normal.'}],
 deeper:[['Aortocaval compression','From about 20 weeks, the uterus lying on the inferior vena cava can cut the blood returning to the heart by up to a third when she lies flat on her back. Tilting her to the left, or pushing the bump to the left, restores it.']]},

sensory:{
 intro:'Eyes, ears and balance organs feed directly into the brain. Changes in them are often the first sign of a problem in the nervous or circulatory system.',
 links:[
  ['nervous','Eyes and ears connect straight into the brain. The pupils show brainstem and CN III function; sudden vertigo can be a stroke.'],
  ['musculoskeletal','Balance depends on the inner ear, vision and sensation from the feet working together to prevent falls.'],
  ['cardiovascular','Sudden loss of vision in one eye can be a clot from the carotid or heart: a TIA or stroke warning.']],
 chains:[{q:'Why do older people fall so easily?',steps:['Poorer vision (cataracts), inner ear decline and less feeling in the feet','Balance relies on fewer inputs','Medicines (BP tablets, sedatives) add dizziness','A small trip or a stand-up becomes a fall'],so:'Always ask why they fell, and look for new causes such as infection, arrhythmia or a change in medicines.'}],
 deeper:[['Pupil pathways','Light entering one eye travels along CN II to the brainstem, which sends signals down both CN IIIs, so both pupils constrict. A pupil that doesn\u2019t react to light but constricts when light shines in the other eye points to an optic nerve (CN II) problem; one that reacts to neither points to CN III.']]},

haematological:{
 intro:'Blood carries oxygen, heat and immune cells to every system and seals leaks when vessels are damaged. Problems with it show up as breathlessness, bleeding, clots or infection elsewhere.',
 links:[
  ['cardiovascular','Blood volume is what the heart pumps; losing it causes shock. Clots cause heart attacks, strokes and PEs.'],
  ['respiratory','Haemoglobin carries the oxygen. Anaemia makes people breathless with a fast pulse even with a normal SpO\u2082.'],
  ['urinary','The kidneys make erythropoietin; kidney disease causes anaemia.'],
  ['digestive','The liver makes clotting factors; the gut absorbs iron and B12; GI bleeding is a common cause of anaemia.'],
  ['lymphatic_immune','White cells fight infection. Low counts after chemotherapy lead to neutropenic sepsis.']],
 chains:[
  {q:'Why does bleeding get worse if the patient gets cold?',steps:['Blood loss plus exposure: the patient cools','Clotting enzymes work poorly when cold','Poor perfusion builds up acid','Acid makes clotting fail further','More bleeding: the \u201clethal triad\u201d of cold, acid and clotting failure'],so:'Keep bleeding patients warm, off cold ground, and covered.'},
  {q:'Why do anaemic patients look well until they suddenly don\u2019t?',steps:['Slow blood loss or poor production','The body adapts: higher cardiac output, more oxygen released to tissues','SpO\u2082 stays normal because the haemoglobin present is fully loaded','Very little reserve remains','Any extra demand (infection, exertion, a new bleed) tips them over'],so:'SpO\u2082 says nothing about how much haemoglobin there is. Pale, breathless and a fast pulse means think anaemia or bleeding.'}],
 deeper:[['Oxygen delivery','Oxygen delivered to the tissues = cardiac output \u00d7 haemoglobin \u00d7 saturation. Halving the haemoglobin halves delivery just as much as halving the saturation would, even though the pulse oximeter still reads 98%.']]},

homeostasis:{
 intro:'Homeostasis is every system working together to keep temperature, fluid, glucose, oxygen and acid in range. Your obs are really measuring how hard the body is working to stay balanced.',
 links:[
  ['nervous','The hypothalamus senses temperature, fluid and hormone levels and directs the response.'],
  ['urinary','The kidneys control fluid, salt, potassium and acid.'],
  ['respiratory','The lungs correct acid within minutes by changing breathing.'],
  ['integumentary','The skin gains or loses heat through blood flow and sweating.'],
  ['endocrine','Insulin, glucagon, cortisol, ADH and aldosterone fine-tune glucose, stress and fluid.']],
 chains:[
  {q:'Why do shocked patients go cold, pale and confused?',steps:['Poor perfusion from any cause','The sympathetic system diverts blood from skin and gut to heart and brain','Skin cools and pales; cap refill slows','Eventually brain blood flow drops too: confusion','Heat production falls and the temperature can drop, especially in older adults'],so:'A low temperature in an unwell patient can mean severe sepsis, not reassurance.'},
  {q:'Why do older people get dehydrated so easily?',steps:['A weaker thirst response','Kidneys less able to concentrate urine','Diuretics and other medicines','Mobility or confusion limits drinking','Illness, heat or diarrhoea tips the balance','Low BP, falls, confusion, kidney injury'],so:'Ask about fluid intake, urine and medicines in every older patient who is unwell.'}],
 deeper:[['Compensation vs decompensation','Every obs change is either the illness or the body compensating for it. Fast breathing compensates for acid; fast pulse compensates for low volume; pale skin compensates for low BP. Decompensation is when compensation can no longer keep up: BP falls, consciousness drops, breathing slows. The aim is to recognise the patient while they are still compensating.']]}
};
