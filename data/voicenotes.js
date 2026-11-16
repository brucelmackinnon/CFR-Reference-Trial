// Voice notes (v50): short spoken briefings for common conditions, read aloud by the phone's own voice.
// Written for listening: short sentences, numbers spelt the way they should be said. UK CFR scope.
// Fields: id, n (name), cond (condition page id, or null), link (other page), sats (one-line target shown in the list),
// s: what (what it is), sym (symptoms), cause (common causes), do (what to do), obs (sats and obs to expect),
// watch (what to watch out for).
window.VOICENOTE_SECTIONS=[['what','What it is'],['sym','Symptoms'],['cause','Common causes'],['do','What to do'],['obs','Sats and obs to expect'],['watch','Watch out for']];
window.VOICENOTES=[
{id:'asthma',n:'Asthma attack',cond:'asthma',sats:'Aim 94 to 98 percent',s:{
 what:'Asthma is narrowing of the small airways in the lungs. The airway walls swell, tighten and fill with mucus, so air struggles to get out. Most people know they have it and carry a blue reliever inhaler.',
 sym:'Wheeze, a tight chest, coughing and shortness of breath. They may be unable to finish a sentence, sitting forward with their hands on their knees, using their neck and shoulder muscles to breathe.',
 cause:'Colds and chest infections, pollen, dust, pets, smoke, cold air, exercise, stress, or simply not taking their preventer inhaler.',
 do:'Sit them upright and keep them calm. Help them take their own reliever inhaler, ideally through a spacer: one puff every 30 to 60 seconds, up to 10 puffs. Give oxygen if you are trained and sats are below 94 percent. Loosen tight clothing and take a full set of obs. Update control with how many words they can say per breath.',
 obs:'Sats should be 94 to 98 percent. Below 92 percent is a life-threatening attack. Expect a fast breathing rate and a fast pulse. A pulse over 110, or a breathing rate over 25, means a severe attack.',
 watch:'A quiet chest is a danger sign, not an improvement: there is so little air moving that the wheeze disappears. Also watch for exhaustion, confusion, drowsiness, blue lips, or a falling pulse. Any of these: tell control immediately and be ready for cardiac arrest.'}},

{id:'copd',n:'COPD flare-up',cond:'copd',sats:'Aim 88 to 92 percent',s:{
 what:'COPD, chronic obstructive pulmonary disease, is long-term lung damage, usually from smoking. It covers emphysema and chronic bronchitis. A flare-up, or exacerbation, is when their breathing gets much worse than their normal.',
 sym:'More breathless than usual, more cough, more phlegm that may turn green or yellow, wheeze, and tiredness. They often breathe out through pursed lips and may be sitting forward.',
 cause:'Chest infections and colds are the most common cause. Also cold weather, air pollution, and not using their usual inhalers.',
 do:'Sit them upright. Help them use their own inhalers. Ask whether they have an oxygen alert card or a home oxygen plan, and follow it. If you give oxygen, aim for sats of 88 to 92 percent, not higher. Take a full set of obs, and use NEWS2 scale 2 for sats only if a clinician has set them a target of 88 to 92 percent.',
 obs:'Their normal sats may be 88 to 92 percent, so a low number is not always new. Ask what their usual reading is. Breathing rate is often raised. Temperature may be up if there is an infection.',
 watch:'Too much oxygen can make some COPD patients drowsy and slow their breathing. Watch for new drowsiness, confusion, a headache, or warm, flushed hands. Also watch for sudden sharp chest pain, which could be a collapsed lung.'}},

{id:'acs',n:'Heart attack',cond:'acs',sats:'Aim 94 to 98 percent',s:{
 what:'A heart attack happens when a coronary artery is blocked, usually by a clot on a fatty plaque. The heart muscle beyond the blockage starts to die. Time is muscle: the faster it is opened in hospital, the more heart is saved.',
 sym:'Central chest pain, heaviness, tightness or pressure, often spreading to the arm, jaw, neck, back or stomach. It lasts more than 15 minutes and doesn’t settle with rest. They may be sweaty, grey, sick or breathless. Older people, women and diabetics may have little or no pain, just breathlessness, sickness or feeling unwell.',
 cause:'Coronary heart disease. Risk factors are smoking, high blood pressure, diabetes, high cholesterol, family history, older age and being male.',
 do:'Sit them in a comfortable position, often half sitting, and keep them still and calm. Give 300 milligrams of aspirin to chew, if there are no contraindications and they haven’t already had it. Help them take their own GTN spray if they have it and their blood pressure allows. Give oxygen only if sats are below 94 percent. Take obs, note the time the pain started, and have the AED close by.',
 obs:'Sats are often normal, 94 to 98 percent. The pulse may be fast, slow or irregular. Blood pressure can be high, normal or low. Low blood pressure with chest pain is a bad sign.',
 watch:'Cardiac arrest can happen at any moment, so keep the AED next to the patient. Also watch for a falling blood pressure, a very slow or very fast pulse, new breathlessness, or the pain tearing through to the back, which could be an aortic dissection.'}},

{id:'angina',n:'Angina',cond:'angina',sats:'Aim 94 to 98 percent',s:{
 what:'Angina is chest pain when the heart muscle isn’t getting enough oxygen, usually on exertion, because the coronary arteries are narrowed. Unlike a heart attack, the muscle isn’t dying, and the pain settles.',
 sym:'Chest tightness or heaviness that may spread to the arm, jaw or neck. It comes on with exertion, cold, stress or a big meal, and usually settles within a few minutes of rest or GTN.',
 cause:'Coronary heart disease. Episodes are triggered by anything that makes the heart work harder.',
 do:'Stop and rest. Help them take their own GTN spray. If the pain isn’t gone 5 minutes after the first dose, they can take a second. If it is still there after another 5 minutes, or it is worse than usual, treat it as a heart attack: aspirin if no contraindications, update control, and keep the AED close.',
 obs:'Sats usually normal, 94 to 98 percent. Pulse may be raised during the pain. GTN can drop the blood pressure, so check it before and after.',
 watch:'New angina, angina at rest, or pain that is lasting longer or coming more often is unstable angina. That is an emergency, the same as a heart attack.'}},

{id:'stroke',n:'Stroke',cond:'stroke',sats:'Aim 94 to 98 percent',s:{
 what:'A stroke is when part of the brain loses its blood supply, from a clot blocking an artery, or bleeds into the brain. Brain cells die by the minute, and clot-busting treatment only works within a few hours, so time matters more than anything.',
 sym:'Use BE FAST. Balance: sudden loss of balance or dizziness. Eyes: sudden loss of vision or double vision. Face: one side drooping. Arms: one arm weak or numb. Speech: slurred, muddled or unable to speak. Time: note when they were last seen well.',
 cause:'Clots from narrowed arteries or from the heart in atrial fibrillation. Bleeds from high blood pressure or blood thinners. Risk factors are high blood pressure, AF, smoking, diabetes and older age.',
 do:'Note the time they were last known to be well; this is the single most important fact. Do the BE FAST check and tell control straight away. Check their blood sugar, because a hypo can look exactly like a stroke. Nothing to eat or drink, as swallowing may be affected. Keep them comfortable, and in the recovery position if their consciousness is reduced. Give oxygen only if sats are below 94 percent.',
 obs:'Sats usually normal. Blood pressure is often high. An irregular pulse may be atrial fibrillation. Check the blood sugar every time.',
 watch:'A low blood sugar, a falling level of consciousness, vomiting, or a sudden severe headache, which could be a bleed. If the symptoms go away completely, it may have been a TIA, a mini stroke. They still need to be seen urgently.'}},

{id:'hypo',n:'Low blood sugar (hypo)',cond:'hypo',sats:'Usually normal',s:{
 what:'A hypo is when the blood sugar falls below 4 millimoles per litre. The brain runs on sugar, so it is the first organ to suffer. It mostly happens in people with diabetes who take insulin or certain tablets.',
 sym:'Sweating, shaking, pale, hungry, anxious, irritable. Then confusion, odd or aggressive behaviour, slurred speech, which can look like being drunk. Severe hypos cause fitting, unconsciousness, or stroke-like weakness.',
 cause:'Too much insulin, a missed or late meal, more exercise than usual, alcohol, illness or vomiting.',
 do:'Check the blood sugar. If they are awake and can swallow safely, give a fast sugar: a sugary drink, juice, jelly sweets, or glucose gel. Recheck after 10 to 15 minutes and repeat if it is still below 4. Once it is over 4, give a starchy snack such as a sandwich or biscuits. If they can’t swallow safely, don’t give anything by mouth; put them in the recovery position and tell control.',
 obs:'Sats are normally fine. The pulse is often fast and the skin cold and sweaty. BM below 4 is a hypo.',
 watch:'Never give food or drink to someone who can’t protect their airway. Long-acting insulin and some tablets can make the sugar drop again later, so they shouldn’t be left alone. Any hypo with a seizure, injury or no obvious cause needs a crew.'}},

{id:'dka',n:'High blood sugar (DKA)',cond:'dka',sats:'Aim 94 to 98 percent',s:{
 what:'Diabetic ketoacidosis, or DKA, happens when the body has too little insulin. It can’t use sugar, so it burns fat and makes acids called ketones. The blood becomes acidic and the person becomes very dehydrated. It is a medical emergency.',
 sym:'Very thirsty, passing lots of urine, tummy pain, being sick, deep sighing breathing, a sweet pear-drop smell on the breath, drowsiness and confusion.',
 cause:'Infection or illness, missed insulin doses, a faulty insulin pump, or a new, undiagnosed type 1 diabetic, often a child or young adult.',
 do:'Check the blood sugar. Keep them comfortable and in the recovery position if drowsy. Small sips of water only if they are alert and not vomiting. Take a full set of obs and tell control the BM reading and that you suspect DKA. Don’t give sugar.',
 obs:'BM usually high, often over 11 and sometimes reading just HI. Breathing is fast and deep, the pulse fast, blood pressure may be low from dehydration. Sats usually normal.',
 watch:'Drowsiness, falling blood pressure, and children, who can deteriorate fast. If you’re unsure whether a diabetic is high or low and you have no meter, treat it as low.'}},

{id:'seizure',n:'Seizure (fit)',cond:'epilepsy',sats:'Aim 94 to 98 percent once settled',s:{
 what:'A seizure is a burst of abnormal electrical activity in the brain. The most recognised kind is a tonic clonic seizure: the person goes stiff, falls, and jerks. Many people with epilepsy have a care plan.',
 sym:'Stiffening and jerking of the limbs, unresponsive, noisy breathing, maybe a bitten tongue or incontinence. Afterwards they are drowsy and confused for a while; this is called the post-ictal phase.',
 cause:'Epilepsy, missed medication, lack of sleep, alcohol or drug withdrawal, a head injury, low blood sugar, infection, a stroke, or fever in young children.',
 do:'Note the time it started. Protect them from harm, cushion the head, and move things out of the way. Don’t hold them down and put nothing in their mouth. When the jerking stops, check their breathing and put them in the recovery position. Check the blood sugar. Follow their care plan if they have one, which may include their own rescue medicine.',
 obs:'During the fit, sats may drop and lips go blue; this usually recovers within minutes. Afterwards expect a raised pulse and drowsiness. Sats should return to 94 to 98 percent.',
 watch:'A seizure lasting 5 minutes or longer, or one fit after another without waking in between, is status epilepticus: tell control immediately. Also a first ever seizure, a head injury, pregnancy, low blood sugar, or breathing that doesn’t recover.'}},

{id:'sepsis',n:'Sepsis',cond:'sepsis',sats:'Aim 94 to 98 percent',s:{
 what:'Sepsis is the body’s extreme response to an infection, which starts to damage its own organs. It can kill within hours, and early treatment saves lives.',
 sym:'Look for an infection plus signs of being very unwell. Slurred speech or confusion. Extreme shivering or muscle pain. Passing no urine in a day. Severe breathlessness. Feeling like they are going to die. Mottled, bluish or very pale skin. Some people have a high temperature, but some are cold.',
 cause:'Chest infections, urine infections, tummy infections, infected wounds or skin, and meningitis. More likely in the very young, the elderly, diabetics, people on chemotherapy or steroids, and after recent surgery.',
 do:'Take a full set of obs and calculate NEWS2. Use the sepsis screen in the app. Tell control early that you suspect sepsis and give them the NEWS2 score. Keep them warm and comfortable. Give oxygen if sats are below 94 percent. Note any rashes and when they last passed urine.',
 obs:'A NEWS2 of 5 or more with a possible infection is a red flag for sepsis. Expect a fast breathing rate, fast pulse, low or normal blood pressure, and a temperature over 38 or under 36 degrees.',
 watch:'A purple rash that doesn’t fade under a glass is meningitis until proven otherwise. A breathing rate over 25, systolic blood pressure under 90, new confusion, or mottled skin are all red flags.'}},

{id:'anaphylaxis',n:'Anaphylaxis',cond:'anaphylaxis',sats:'Aim 94 to 98 percent',s:{
 what:'Anaphylaxis is a severe, life-threatening allergic reaction. It affects the airway, the breathing, or the circulation, and can develop within minutes.',
 sym:'Swelling of the lips, tongue or throat, a hoarse voice, difficulty swallowing, wheeze and breathlessness, feeling faint, a fast pulse, and collapse. There is often, but not always, an itchy raised rash and flushing.',
 cause:'Foods such as nuts, shellfish and eggs, insect stings, medicines such as antibiotics, and latex.',
 do:'Tell control it is anaphylaxis straight away. Remove the trigger if you can, for example scrape away a sting. Help them use their own adrenaline auto-injector into the outer thigh, through clothing if needed. If there is no improvement after 5 minutes and they have a second pen, help them use it. Position: lie them flat with legs raised if they are faint; sit them up if breathing is the main problem. Don’t let them stand or walk. Give oxygen if you are trained.',
 obs:'Sats may fall if the airway or chest is involved. Pulse is fast. Blood pressure may be low. A rash alone with normal obs is likely a milder allergic reaction, but keep watching.',
 watch:'Never sit someone up suddenly if they are faint; this can cause cardiac arrest. Reactions can come back hours later, so everyone who has used adrenaline needs to go to hospital. Be ready for CPR.'}},

{id:'faint',n:'Faint (collapse)',cond:'syncope',sats:'Aim 94 to 98 percent',s:{
 what:'A faint is a brief loss of consciousness because not enough blood reached the brain. Most are harmless, but some are a warning of a heart problem.',
 sym:'Feeling light-headed, hot, sick, pale and sweaty, blurred vision, then collapse. They come round within a minute or so, once lying flat. There may be a few jerks, which isn’t necessarily a fit.',
 cause:'Standing for a long time, heat, pain, the sight of blood, emotional shock, dehydration, standing up quickly, blood pressure tablets. Heart rhythm problems are less common but more serious.',
 do:'Lie them flat and raise their legs if they feel faint again. Check for injuries from the fall, especially the head. Take a full set of obs, including lying and standing blood pressure if they are well enough, and a blood sugar. Ask what happened just before. Let them get up slowly.',
 obs:'Sats normal. Pulse may be slow during the faint and return to normal quickly. Blood pressure may be low at first, then recover.',
 watch:'Red flags for a heart cause: fainting during exercise or while lying down, chest pain or palpitations beforehand, no warning at all, a family history of sudden death, a known heart condition, or an abnormal pulse. Also pregnancy and bleeding, or a head injury on blood thinners.'}},

{id:'fall',n:'Fall in an older person',cond:'hip',sats:'Aim 94 to 98 percent',s:{
 what:'Falls are one of the most common CFR calls. The fall itself may be minor, but it can be the result of an illness, and lying on the floor for a long time causes its own problems.',
 sym:'Look for pain, a shortened and outward-turned leg, which suggests a broken hip, head injury, bruising, and inability to get up. Ask how long they have been on the floor.',
 cause:'Trips and slips, but also dizziness, faints, low blood pressure, infections such as a urine or chest infection, new medicines, strokes and heart rhythm problems.',
 do:'Don’t rush to get them up. First check for injuries and ask why they fell: did they trip, or did they feel dizzy or black out? Take a full set of obs and a blood sugar. If they hit their head and take blood thinners, they need a crew. Keep them warm on the floor, as hypothermia sets in quickly. Only help them up if there are no injuries and they’re able, using lifting equipment if available.',
 obs:'Sats should be 94 to 98 percent. A long lie can cause a low temperature, dehydration and muscle damage. A new irregular pulse, low blood pressure or high NEWS2 points to an underlying illness.',
 watch:'Head injury on blood thinners, a long lie, hip or neck pain, new confusion, and any fall that has no clear reason. Also look out for signs they aren’t coping at home, and raise a safeguarding concern if needed.'}},

{id:'headinj',n:'Head injury',cond:'headinj',sats:'Aim 94 to 98 percent',s:{
 what:'A head injury can range from a bump to bleeding inside the skull. Bleeding can build up slowly, so someone who seems fine can get worse hours later.',
 sym:'Headache, a wound or swelling, confusion, memory loss of the event, being sick, drowsiness, blurred vision, clear fluid from the nose or ears, or unequal pupils.',
 cause:'Falls, sport, assaults, and road traffic collisions.',
 do:'If the injury was forceful, or they have neck pain or tingling, keep the head and neck still. Control any bleeding with pressure, but not on an obvious skull fracture. Assess their level of response using ACVPU and note any change. Take obs, check pupils, and ask about blood thinners. Keep them still and calm.',
 obs:'Sats should be normal. A rising blood pressure with a slowing pulse is a late and serious sign of pressure building in the skull.',
 watch:'Any loss of consciousness, repeated vomiting, drowsiness, worsening headache, a seizure, unequal pupils, or blood thinners. Also over 65s, and children where the story doesn’t match the injury.'}},

{id:'pneumonia',n:'Chest infection',cond:'pneumonia',sats:'Aim 94 to 98 percent; 88 to 92 percent if COPD',s:{
 what:'A chest infection, or pneumonia, is an infection in the lungs. The air sacs fill with fluid and pus, so less oxygen gets into the blood.',
 sym:'Cough, often with green, yellow or blood-stained phlegm, breathlessness, high temperature, shivering, sharp chest pain when breathing in, and feeling generally unwell. Older people may just be confused or off their legs.',
 cause:'Bacteria or viruses, often after a cold or flu. More likely in older people, smokers, people with lung conditions, and those with swallowing problems.',
 do:'Sit them upright. Take a full set of obs and calculate NEWS2. Check for sepsis. Give oxygen if sats are below target and you are trained. Encourage fluids if they can swallow safely.',
 obs:'Sats may be low, below 94 percent. Breathing rate and pulse are raised. Temperature is often over 38 degrees, but may be normal or low in older people.',
 watch:'Sepsis: confusion, a NEWS2 of 5 or more, low blood pressure, or mottled skin. Also breathing rate over 25, and sats that won’t come up.'}},

{id:'hf',n:'Heart failure (fluid on the lungs)',cond:'hf',sats:'Aim 94 to 98 percent',s:{
 what:'Heart failure means the heart isn’t pumping as well as it should. When it suddenly gets worse, fluid backs up into the lungs. This is called acute heart failure or pulmonary oedema.',
 sym:'Severe breathlessness, worse lying flat, so they want to sit bolt upright. Crackly or bubbly breathing, a cough with frothy, maybe pink-tinged phlegm, anxiety, sweating, and swollen ankles.',
 cause:'Heart attack, a fast irregular heart rhythm, very high blood pressure, infection, or not taking their tablets, especially water tablets.',
 do:'Sit them upright, legs down if possible. Don’t lie them flat. Give oxygen if sats are below 94 percent. Take a full set of obs. Have the AED close. Tell control it may be heart failure.',
 obs:'Sats are often low. Breathing rate and pulse are fast. Blood pressure is often high, but low blood pressure is a very bad sign.',
 watch:'Chest pain, which may mean a heart attack, a falling blood pressure, exhaustion, and drowsiness.'}},

{id:'af',n:'Palpitations and AF',cond:'af',sats:'Aim 94 to 98 percent',s:{
 what:'Atrial fibrillation, AF, is the most common irregular heart rhythm. The top chambers of the heart quiver instead of beating properly, so the pulse becomes irregular and often fast.',
 sym:'Palpitations, a fluttering or pounding heart, breathlessness, dizziness, tiredness and chest discomfort. Some people don’t notice anything.',
 cause:'Older age, high blood pressure, heart disease, an overactive thyroid, alcohol, caffeine, infection, and lung disease.',
 do:'Sit them comfortably. Take a full set of obs, feeling the pulse for a full minute. Ask about chest pain, breathlessness, fainting and when it started. Tell control the rate and that it is irregular.',
 obs:'Pulse is irregularly irregular, often over 100. Sats usually normal. Blood pressure may be low if the rate is very fast.',
 watch:'Chest pain, fainting, low blood pressure, or breathlessness with a fast rate: these mean the heart is struggling. AF also raises the risk of stroke, so do a BE FAST check.'}},

{id:'panic',n:'Panic attack and over-breathing',cond:'panic',sats:'98 to 100 percent',s:{
 what:'A panic attack is a sudden surge of fear with strong physical symptoms. Breathing too fast blows off carbon dioxide, which causes many of the symptoms.',
 sym:'Fast breathing, a pounding heart, tight chest, tingling in the fingers and around the mouth, cramping hands, dizziness, and a feeling of doom.',
 cause:'Anxiety, stress, a past panic disorder, or a frightening event.',
 do:'Stay calm and reassuring. Move them somewhere quiet. Coach their breathing: in through the nose for 4, out slowly for 6. Don’t use a paper bag. Take a full set of obs to rule out a physical cause.',
 obs:'Sats should be high, 98 to 100 percent. Low sats are not explained by panic. Pulse fast, blood pressure may be raised.',
 watch:'Panic is a diagnosis of last resort. Asthma, a heart attack, a blood clot in the lung, a hypo, DKA, and sepsis can all cause fast breathing. Low sats, chest pain, or a history of clots means it isn’t panic until proven otherwise.'}},

{id:'pe',n:'Blood clot in the lung (PE)',cond:'pe',sats:'Aim 94 to 98 percent',s:{
 what:'A pulmonary embolism, or PE, is a blood clot that has travelled to the lungs, usually from a deep vein in the leg. It blocks blood flow through the lungs, and a large one can be fatal.',
 sym:'Sudden breathlessness, sharp chest pain that is worse breathing in, coughing up blood, a fast pulse, feeling faint, and sometimes a swollen, painful calf.',
 cause:'Recent surgery, long journeys, being immobile, cancer, pregnancy or recent birth, the contraceptive pill or HRT, and a previous clot.',
 do:'Sit them in the most comfortable position. Give oxygen if sats are below 94 percent. Take a full set of obs and tell control you suspect a clot. Ask about risk factors. Have the AED close.',
 obs:'Sats are often low. Pulse and breathing rate are fast. Blood pressure may be low in a large clot.',
 watch:'Collapse, low blood pressure, and sats that don’t improve with oxygen. Don’t mistake it for panic.'}},

{id:'overdose',n:'Overdose',cond:'overdose',sats:'Aim 94 to 98 percent',s:{
 what:'An overdose is taking more of a substance than the body can handle, whether by accident or on purpose. Effects depend on what was taken.',
 sym:'Drowsiness, slow or noisy breathing, pin-point or very large pupils, being sick, confusion, agitation, a fast or slow pulse, or seizures.',
 cause:'Prescription medicines such as paracetamol or antidepressants, opioids such as heroin or strong painkillers, alcohol, and recreational drugs.',
 do:'Make sure the scene is safe, watch for needles. Check the airway and breathing first. If drowsy, put them in the recovery position. Find out what, how much and when, and keep any packets for the crew. Take a full set of obs and a blood sugar. If they carry naloxone and you are trained to use it, follow your training. Tell control.',
 obs:'With opioids, breathing becomes slow and shallow and sats fall. Stimulants raise the pulse, blood pressure and temperature.',
 watch:'Slow breathing under 10 a minute, falling sats, or no response. Paracetamol overdoses can look completely well at first but still be deadly. Take any mention of self-harm seriously and don’t leave them alone.'}},

{id:'heat',n:'Heat exhaustion and heat stroke',cond:'heat',sats:'Aim 94 to 98 percent',s:{
 what:'Heat exhaustion is when the body is losing the battle to stay cool, mainly through dehydration and salt loss. Heat stroke is when cooling fails, the temperature climbs over 40 degrees and the brain is affected. Heat stroke is an emergency.',
 sym:'Heat exhaustion: headache, dizziness, sweating, cramps, sickness, a fast pulse, and feeling weak. Heat stroke: confusion, odd behaviour, fits, collapse, and hot skin that may be dry.',
 cause:'Hot weather, exercise in the heat, heavy clothing, dehydration, alcohol, and some medicines. The very young and old are most at risk.',
 do:'Move them somewhere cool and shaded. Remove extra clothing. Lie them down with legs raised if faint. Cool them actively with water spray and fanning, and cool packs in the armpits and groin. Give cool water to sip if they are alert. Take obs including temperature. Heat stroke: tell control immediately and keep cooling.',
 obs:'Temperature over 38 degrees in heat exhaustion, over 40 in heat stroke. Pulse fast, blood pressure may be low. Sats usually normal.',
 watch:'Any confusion or change in behaviour means heat stroke. Also fits and collapse. Should recover within 30 minutes of cooling; if not, get help.'}},

{id:'hypothermia',n:'Hypothermia',cond:'hypothermia',sats:'Aim 94 to 98 percent (may not read)',s:{
 what:'Hypothermia is when the core body temperature falls below 35 degrees. The body slows down, and below 30 degrees the heart can go into a dangerous rhythm.',
 sym:'Shivering, cold pale skin, slurred speech, clumsiness and confusion. As it gets worse, shivering stops, they become drowsy, and the pulse and breathing slow.',
 cause:'Cold weather, being in cold water, a long lie after a fall, alcohol, and older people in cold homes.',
 do:'Handle them gently. Move them out of the cold and wind. Replace wet clothes with dry, and wrap them in blankets, covering the head. Warm sweet drinks only if they are fully alert. Don’t rub their skin and don’t use direct heat. Keep them lying flat. Take obs and a blood sugar.',
 obs:'Temperature below 35 degrees. Sats may not read on cold fingers. Pulse and breathing slow as the temperature falls.',
 watch:'Rough handling can trigger cardiac arrest. If there is no pulse, start CPR. Check the pulse for up to a minute, because it may be very slow and weak.'}},

{id:'choking',n:'Choking',cond:'choking',sats:'Aim 94 to 98 percent',s:{
 what:'Choking happens when something blocks the airway. A partial blockage still lets some air through. A complete blockage is life-threatening within minutes.',
 sym:'Mild: they can cough, speak and breathe. Severe: they can’t speak, cough or breathe, may clutch their throat, and turn blue.',
 cause:'Food, especially meat or sweets, and small objects in children. More likely with swallowing problems, dementia and alcohol.',
 do:'If they can cough, encourage them to keep coughing. If the cough becomes ineffective, give up to 5 back blows, between the shoulder blades, with them leaning forward. If that fails, give up to 5 abdominal thrusts. Keep alternating. If they become unresponsive, start CPR and tell control.',
 obs:'Sats fall quickly with a complete blockage. Once the object is out, sats and colour should come back.',
 watch:'Anyone who has had abdominal thrusts must be checked in hospital for internal injury. Ongoing cough or breathlessness after may mean something is still in the airway.'}},

{id:'bleeding',n:'Severe bleeding',cond:'haemorrhage',sats:'Aim 94 to 98 percent',s:{
 what:'Severe bleeding is a fast loss of blood that can lead to shock and death within minutes. Catastrophic bleeding comes before airway in your priorities.',
 sym:'Blood spurting or pouring from the wound, or soaking through dressings. Signs of shock: pale, cold, clammy skin, a fast weak pulse, fast breathing, thirst, anxiety, and confusion.',
 cause:'Cuts from glass or knives, crush injuries, road traffic collisions, and falls on blood thinners. Hidden bleeding can come from the abdomen, pelvis or thigh bone.',
 do:'Apply firm direct pressure with a dressing. If blood soaks through, add more on top and press harder. Raise the limb if you can. If you’re trained and pressure isn’t working on a limb, apply a tourniquet high and tight, and note the time. Lie them down and keep them warm. Tell control.',
 obs:'Pulse rises and becomes weak. Breathing rate rises. Blood pressure stays normal until late, then falls quickly. Sats may be hard to read on cold fingers.',
 watch:'Falling blood pressure, confusion and drowsiness are late signs. Keep them warm, as cold makes bleeding worse.'}},

{id:'burns',n:'Burns',cond:'burns',sats:'Aim 94 to 98 percent',s:{
 what:'A burn is damage to the skin and deeper tissues from heat, chemicals, electricity or radiation.',
 sym:'Red, painful skin in shallow burns. Blisters in partial thickness burns. White, brown or leathery skin, often painless, in full thickness burns.',
 cause:'Scalds from hot drinks and bath water, flames, contact with hot objects, chemicals and electrical injuries.',
 do:'Make sure the scene is safe. Cool the burn with cool running water for 20 minutes, as soon as possible. Remove jewellery and clothing near the burn, unless stuck. Cover loosely with cling film, laid on not wrapped. Keep the rest of the patient warm. Give Entonox for pain if trained.',
 obs:'Obs may be normal at first. With large burns, the pulse rises and blood pressure falls as fluid is lost.',
 watch:'Burns to the face, neck, or soot around the nose and mouth, a hoarse voice or noisy breathing: the airway may swell. Also electrical burns, chemical burns, burns to hands, feet and genitals, and burns in children or the elderly. Think about safeguarding if the story doesn’t fit.'}},

{id:'confusion',n:'New confusion in an older person',cond:'delirium',sats:'Aim 94 to 98 percent',s:{
 what:'Delirium is sudden confusion, over hours or days, caused by a physical illness. It is a medical emergency, and it is different from dementia, which comes on slowly.',
 sym:'Muddled thinking, drowsiness or agitation, seeing things, poor attention, and changes that come and go through the day. Families often say they are just not themselves.',
 cause:'Infections, especially urine and chest infections, dehydration, constipation, pain, new medicines, low or high blood sugar, low oxygen, alcohol withdrawal, and strokes.',
 do:'Ask the family or carers what is normal for them. Take a full set of obs, including temperature and blood sugar. New confusion scores 3 on NEWS2 on its own, so tell control. Do a BE FAST check. Be calm and reassuring.',
 obs:'Any of the obs can be abnormal depending on the cause. A temperature, fast breathing, or low sats point to infection.',
 watch:'Sepsis, stroke, a hypo, and head injury. Never assume new confusion is just dementia.'}},

{id:'abdo',n:'Tummy pain and AAA',cond:'aaa',sats:'Aim 94 to 98 percent',s:{
 what:'Tummy pain has many causes, from mild to life-threatening. An abdominal aortic aneurysm, or AAA, is a swelling of the main artery in the tummy. If it leaks or ruptures, it is a time-critical emergency.',
 sym:'AAA: sudden severe pain in the tummy or back, sometimes spreading to the groin, often in a man over 65, with signs of shock and collapse. Other causes: pain with being sick, fever, diarrhoea or constipation.',
 cause:'AAA, appendicitis, gallstones, kidney stones, bowel blockage, pancreatitis, ectopic pregnancy, and urine infection.',
 do:'Let them lie in the position they find most comfortable. Nothing to eat or drink. Take a full set of obs. For women of child-bearing age, ask about pregnancy. If you suspect AAA, tell control straight away and keep them lying still.',
 obs:'AAA: fast pulse, low blood pressure, and pale, cold, sweaty skin. Infections: raised temperature and pulse.',
 watch:'Older patient, sudden pain with collapse or low blood pressure: think AAA. Young women with tummy pain and fainting: think ectopic pregnancy.'}},

{id:'gastro',n:'Diarrhoea, vomiting and dehydration',cond:'gastro',sats:'Aim 94 to 98 percent',s:{
 what:'Gastroenteritis is an infection of the gut that causes diarrhoea and vomiting. The main danger is dehydration, especially in the very young and the old.',
 sym:'Diarrhoea, being sick, tummy cramps, and fever. Dehydration: thirst, dry mouth, dizziness on standing, passing little dark urine, and tiredness.',
 cause:'Viruses such as norovirus, food poisoning, and some medicines.',
 do:'Wear gloves and wash your hands. Encourage small, frequent sips of fluid. Take a full set of obs including lying and standing blood pressure if safe. Ask how often they are being sick or passing stools, and when they last passed urine.',
 obs:'Pulse fast, blood pressure may be low, especially on standing. Temperature may be raised.',
 watch:'Blood in vomit or stools, severe tummy pain, signs of sepsis, confusion, no urine for 12 hours or more, and diabetics, who can go into DKA.'}},

{id:'arrest',n:'Cardiac arrest',cond:null,link:'#/arrest',sats:'Not applicable',s:{
 what:'Cardiac arrest is when the heart stops pumping blood. Without CPR and a defibrillator, brain damage starts within minutes.',
 sym:'Unresponsive and not breathing normally. Gasping, also called agonal breathing, is not normal breathing. A short seizure can happen at the start.',
 cause:'Heart attack and heart rhythm problems are the most common. Also choking, drowning, severe bleeding, overdose, and hypothermia.',
 do:'Check for danger, check for response, open the airway, and look for normal breathing for no more than 10 seconds. If not breathing normally, tell control and start CPR: 30 compressions to 2 breaths, at 100 to 120 a minute, 5 to 6 centimetres deep. Attach the AED as soon as it arrives and follow its prompts. Swap compressors every 2 minutes. Use the cardiac arrest tool in the app for the metronome and log.',
 obs:'Not applicable. If they start breathing normally, put them in the recovery position, take obs, and keep the AED attached.',
 watch:'Keep interruptions to compressions as short as possible. Watch for return of normal breathing, and be ready to restart CPR if they arrest again.'}}
];
