// Visual lookup: bites and stings, rashes, wounds, burns, red / swollen / infected areas.
// A guided checklist of what you can SEE. Possible causes to consider, not a diagnosis.
(function(){
const TYPES=[['bite','Bite or sting','zap'],['rash','Rash or spots','sun'],['wound','Wound or skin injury','drop'],['burn','Burn or scald','thermo'],['infect','Red, swollen or infected area','sepsis']];
// Feature groups: [group title, [[id, label, types (or '*')]]]
const FEATS=[
 ['What it looks like',[
  ['blanch_no','Does NOT fade when a glass is pressed on it',['rash']],['blanch_yes','Fades when a glass is pressed on it',['rash']],
  ['purple','Purple, red-purple or bruise-like spots',['rash']],['wheals','Raised itchy welts (hives)',['rash','bite']],
  ['bullseye','Bullseye or expanding red ring',['bite','rash']],['band','Band or strip on one side of the body',['rash']],
  ['blisters','Blisters',['rash','burn','infect']],['crops','Spots at different stages (new and scabbed)',['rash']],
  ['peeling','Skin peeling, or sores in the mouth or eyes',['rash']],
  ['edge','Spreading redness, warm to touch',['infect','bite','wound']],['streaks','Red streaks tracking up the limb',['infect','bite','wound']],
  ['pus','Pus, or a swelling with a soft centre',['infect','wound','bite']],['dusky','Dusky, purple, grey or black skin',['infect','wound','bite','burn']],
  ['crepitus','Crackling feeling under the skin',['infect','wound']],
  ['red_painful','Red and painful, no blisters',['burn']],['white','White, waxy, leathery or charred',['burn']],
  ['puncture','Puncture marks',['bite','wound']],['tick','Tick attached or recently removed',['bite']],['fang','Two fang marks with swelling spreading from the bite',['bite']],
  ['animal','Dog, cat or human bite',['bite']],['deep','Deep or gaping, edges apart',['wound']],['flap','Flap of torn, thin skin',['wound']],
  ['embedded','Something embedded in it',['wound']],['spurting','Spurting or won\u2019t stop bleeding',['wound','bite']],['dirty','Dirty or contaminated',['wound','bite']]]],
 ['Where and how big',[
  ['face','Face, eyes, lips or genitals',['burn','bite','infect','rash']],['handfoot','Hands, feet or over a joint',['burn','wound','bite','infect']],
  ['large','Large area, or spreading fast',['burn','infect','rash','bite']],['circ','Goes all the way round a limb or the chest',['burn']],
  ['airway','Mouth or throat, hoarse voice, soot around nose or mouth',['burn','bite']],['wholeleg','Whole lower leg swollen',['infect']],
  ['chemical','Chemical or electrical burn',['burn']]]],
 ['How the patient is',[
  ['fever','Fever, shivering or feeling very unwell','*'],['breath','Breathing difficulty, or swollen lips, tongue or throat','*'],
  ['faint','Faint, dizzy or looks shocked','*'],['rapid','Getting rapidly worse (over hours)','*'],['painoop','Pain far worse than it looks',['infect','wound','bite']],
  ['numb','Numb, pale or can\u2019t move fingers or toes beyond it',['wound','burn','bite']],['itch','Itchy',['rash','bite']],
  ['trigger','New medicine, food or sting in the last few hours',['rash','bite']],['vulnerable','Diabetic, on chemotherapy, steroids or immunosuppressed',['infect','wound','bite']],
  ['story','The story doesn\u2019t fit the injury',['wound','burn']]]]];
// Causes: [name, condition id, serious, types, features ('!' = key feature), note]
const K=[
 ['Meningococcal septicaemia','meningitis',1,['rash'],['!blanch_no','purple','fever','rapid','faint'],'Time-critical: can kill within hours'],
 ['Low platelets or bleeding disorder',null,1,['rash'],['!blanch_no','purple'],'Non-blanching spots without fever; on chemotherapy or anticoagulants'],
 ['Anaphylaxis','anaphylaxis',1,['rash','bite'],['!breath','wheals','trigger','faint','rapid'],'Airway, breathing or circulation problem after a trigger'],
 ['Severe drug reaction (Stevens\u2013Johnson syndrome)',null,1,['rash'],['!peeling','blisters','trigger','fever','face','large'],'Blistering, peeling skin, mouth or eye sores after a new medicine'],
 ['Sepsis','sepsis',1,['rash','infect','wound','bite','burn'],['!fever','faint','rapid','dusky'],'Infection with organ warning signs: run the sepsis screen'],
 ['Hives (urticaria)',null,0,['rash','bite'],['!wheals','itch','blanch_yes','trigger'],'Common and usually harmless unless breathing or circulation affected'],
 ['Viral rash',null,0,['rash'],['blanch_yes','fever'],'Fades with the glass test; child otherwise well'],
 ['Chickenpox',null,0,['rash'],['!crops','blisters','itch','fever'],'Riskier in pregnancy, newborns and the immunosuppressed'],
 ['Shingles',null,0,['rash'],['!band','blisters'],'Painful band on one side; near the eye needs same-day assessment'],
 ['Lyme disease (tick bite)',null,0,['bite','rash'],['!bullseye','tick'],'Expanding bullseye rash days to weeks after a tick bite: needs antibiotics via GP'],
 ['Tick bite',null,0,['bite'],['!tick'],'Remove promptly with fine-tipped tweezers or a tick tool, close to the skin'],
 ['Local sting or bite reaction',null,0,['bite'],['wheals','itch','large'],'Swelling around the bite; large local reactions can last days'],
 ['Adder bite',null,1,['bite'],['!fang','puncture','faint','breath','large','rapid'],'The UK\u2019s only venomous snake: keep still and escalate'],
 ['Dog, cat or human bite (infection risk)',null,1,['bite'],['!animal','puncture','handfoot','dirty','numb'],'Cat and human bites, and bites to hands, often get infected; tendons can be damaged'],
 ['Infected bite or wound (cellulitis)','cellulitis',1,['bite','wound'],['!edge','streaks','pus','fever'],'Redness, heat and swelling spreading from the wound'],
 ['Catastrophic bleeding',null,1,['wound','bite'],['!spurting','faint'],'Direct pressure now; tourniquet or haemostatic dressing if trained'],
 ['Deep wound with tendon or nerve damage',null,1,['wound'],['!deep','numb','handfoot'],'Check movement and feeling beyond the wound'],
 ['Laceration needing closure',null,0,['wound'],['deep','face','dirty'],'Gaping wounds usually need closing within hours'],
 ['Skin tear',null,0,['wound'],['!flap'],'Common in older, thin or steroid-treated skin'],
 ['Puncture wound or embedded object',null,1,['wound'],['!embedded','puncture','dirty'],'Don\u2019t remove embedded objects; tetanus risk'],
 ['Crush injury or compartment syndrome',null,1,['wound'],['!painoop','numb','rapid'],'Pain on stretching the muscle; pulses may still be present'],
 ['Necrotising fasciitis',null,1,['infect','wound','bite'],['!painoop','dusky','rapid','crepitus','fever','vulnerable','blisters'],'Flesh-destroying infection: pain far worse than it looks, rapid spread'],
 ['Non-accidental injury (safeguarding)',null,1,['wound','burn'],['!story'],'Follow SCAS safeguarding procedure; don\u2019t confront, document facts'],
 ['Superficial burn',null,0,['burn'],['!red_painful'],'Like sunburn; not counted in burn area'],
 ['Partial-thickness burn',null,0,['burn'],['!blisters'],'Blistered and very painful'],
 ['Full-thickness burn',null,1,['burn'],['!white','numb'],'May be painless because nerves are destroyed'],
 ['Airway burn',null,1,['burn'],['!airway','face','breath'],'Swelling can block the airway within hours'],
 ['Major burn',null,1,['burn'],['!large','face','handfoot','circ','faint'],'Over 10% in adults or 5% in children, or face, hands, feet, genitals'],
 ['Circumferential burn',null,1,['burn'],['!circ','numb','breath'],'Can cut off circulation or restrict breathing'],
 ['Chemical or electrical burn',null,1,['burn'],['!chemical'],'Chemical: prolonged irrigation. Electrical: internal damage, heart rhythm risk'],
 ['Cellulitis','cellulitis',1,['infect'],['!edge','streaks','fever','large','handfoot'],'Mark the edge with a pen and note the time'],
 ['Abscess',null,0,['infect','wound'],['!pus'],'May need draining; fever or spreading redness makes it more urgent'],
 ['Septic arthritis',null,1,['infect'],['handfoot','fever','edge'],'Hot, swollen, painful joint that won\u2019t move'],
 ['Eye-area (orbital) cellulitis',null,1,['infect'],['face','edge','fever','rapid'],'Swelling around the eye with pain on eye movement or vision change'],
 ['DVT (can look like cellulitis)','dvt',1,['infect'],['!wholeleg'],'Whole calf swollen, usually less red and hot'],
 ['Diabetic foot infection','diabetes',1,['infect','wound'],['vulnerable','handfoot','pus','dusky'],'May be painless; can progress fast']];
const has=(f,...x)=>x.some(i=>f.includes(i));
const PAT=[
 {when:(t,f)=>has(f,'blanch_no')&&has(f,'fever','faint','rapid','purple'),t:'Non-blanching rash in an unwell patient',p:'Treat as meningococcal septicaemia: time-critical, escalate now.',cond:'meningitis'},
 {when:(t,f)=>has(f,'breath')&&(has(f,'wheals','trigger')||t==='bite'),t:'Breathing or swallowing problems after a trigger or sting',p:'Anaphylaxis: adrenaline within scope, lie flat (sit up if breathing difficulty), escalate.',cond:'anaphylaxis'},
 {when:(t,f)=>has(f,'painoop')&&has(f,'dusky','rapid','crepitus','blisters'),t:'Pain far worse than it looks, with rapid spread or skin changes',p:'Think necrotising fasciitis: time-critical.',cond:null},
 {when:(t,f)=>has(f,'spurting'),t:'Spurting or uncontrolled bleeding',p:'Catastrophic haemorrhage: direct pressure, tourniquet or haemostatic dressing if trained, escalate.',cond:null},
 {when:(t,f)=>t==='burn'&&has(f,'airway'),t:'Possible airway burn',p:'Airway can swell shut: escalate immediately, sit up, watch breathing.',cond:null},
 {when:(t,f)=>has(f,'fang'),t:'Possible adder bite',p:'Keep the patient and limb still, remove rings and watches, note the time, escalate. Don\u2019t cut, suck or apply a tourniquet.',cond:null},
 {when:(t,f)=>has(f,'fever')&&has(f,'faint','rapid','dusky'),t:'Infection with shock or rapid deterioration',p:'Run the sepsis screen and escalate.',cond:'sepsis'},
 {when:(t,f)=>has(f,'story'),t:'Injury pattern doesn\u2019t match the story',p:'Consider safeguarding: follow SCAS procedure and record facts as told to you.',cond:null},
 {when:(t,f)=>has(f,'circ'),t:'Burn all the way round a limb or chest',p:'Can restrict circulation or breathing: escalate.',cond:null},
 {when:(t,f)=>has(f,'chemical'),t:'Chemical or electrical burn',p:'Chemical: brush off powder then irrigate for a long time. Electrical: scene safety first; internal injury and arrhythmia risk.',cond:null},
 {when:(t,f)=>has(f,'numb')&&t!=='rash',t:'Numb, pale or not moving beyond the injury',p:'Possible nerve, tendon or blood supply damage: check circulation, sensation and movement, escalate.',cond:null},
 {when:(t,f)=>has(f,'peeling')&&has(f,'trigger','fever','blisters'),t:'Blistering or peeling skin after a new medicine',p:'Possible severe drug reaction: escalate.',cond:null}];
// First aid within CFR scope, by type
const DO={
 bite:['Clean with running water; control bleeding with pressure','Remove a tick promptly with fine tweezers or a tick tool, close to the skin; don\u2019t squeeze or burn it','Adder bite: keep still, immobilise the limb, remove rings, note the time; no cutting, sucking or tourniquet','Watch for anaphylaxis; mark the edge of any redness','Animal or human bites usually need antibiotics and a tetanus check'],
 rash:['Glass test: press the side of a clear glass firmly on the rash; if the spots can still be seen, it\u2019s non-blanching','Check palms, soles, inside the eyelids and the roof of the mouth (easier on darker skin)','Full obs and the sepsis screen','Non-blanching rash in an unwell patient: escalate immediately'],
 wound:['Catastrophic bleeding first: direct pressure, tourniquet or haemostatic dressing if trained','Don\u2019t remove embedded objects: pad around them','Cover with a clean non-stick dressing; realign skin-tear flaps gently','Check circulation, sensation and movement beyond the wound','Ask about tetanus vaccination'],
 burn:['Cool with cool running water for 20 minutes (worthwhile up to 3 hours after)','Remove jewellery and clothing unless stuck','Cover loosely with cling film in layers, not wrapped round a limb','Keep the patient warm: cool the burn, not the patient','No ice, creams or bursting blisters; chemical: brush off powder then irrigate'],
 infect:['Mark the edge of redness with a pen and write the time','Full obs, temperature and the sepsis screen','Raise the limb if comfortable','Escalate if spreading fast, pain out of proportion or signs of sepsis']};
// Reference figures per type (diagram keys and illustration pack ids)
const FIGS={burn:{dg:['skin','nines'],ill:['sk_burns','sk_skin']},rash:{dg:[],ill:['sk_skin']},infect:{dg:['skin'],ill:['sk_skin','ly_system']},wound:{dg:['skin'],ill:['sk_skin']},bite:{dg:[],ill:['sk_skin']}};
window.VISUAL={TYPES,FEATS,K,PAT,DO,FIGS};
})();
