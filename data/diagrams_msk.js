// Detailed musculoskeletal diagrams (v31). Front views: patient's right on viewer's LEFT.
(function(){
const {T,L,svg}=window.DG, D=window.DIAGRAMS;

// ---- Full skeleton -------------------------------------------------------------
const ribs=[30,40,47,51,54,55,54,51,46,38].map((w,i)=>{const y=138+i*11;return `<path class="rib" d="M203,${y}Q${210-w-10},${y-3} ${210-w},${y+22}"/>`;}).join('');
const half=`
<path class="clav" d="M204,128Q176,118 150,124"/>
<path class="scap" d="M150,128L174,132L166,190Z"/>
${ribs}
<path d="M204,300Q172,284 150,294Q138,318 156,338Q170,352 190,356L202,348Z"/><ellipse cx="184" cy="344" rx="7" ry="5" class="hole"/>
<circle cx="148" cy="134" r="9"/><path class="long" d="M146,142L128,250"/><ellipse cx="127" cy="256" rx="11" ry="6"/>
<path class="long2" d="M121,262L104,352"/><path class="long3" d="M133,262L115,354"/>
<g class="carp"><circle cx="102" cy="362" r="3.6"/><circle cx="109" cy="360" r="3.6"/><circle cx="116" cy="363" r="3.6"/><circle cx="104" cy="369" r="3.6"/><circle cx="111" cy="368" r="3.6"/><circle cx="118" cy="370" r="3.6"/></g>
<path class="mc" d="M101,373L92,398M106,374L100,404M111,374L108,406M116,374L116,404M121,372L125,396"/>
<path class="ph" d="M92,400L86,414M100,406L96,428M108,408L106,432M116,406L117,429M125,398L131,412"/>
<circle cx="171" cy="351" r="9"/><path class="long" d="M170,354L159,365"/><circle cx="156" cy="363" r="6"/>
<path class="long fem" d="M160,366L178,498"/><ellipse cx="178" cy="505" rx="12" ry="7"/><circle cx="180" cy="507" r="6" class="pat"/>
<ellipse cx="182" cy="518" rx="12" ry="5"/><path class="long" d="M182,520L184,612"/><path class="long3" d="M168,522L171,610"/><circle cx="171" cy="613" r="3.5"/><circle cx="185" cy="614" r="4"/>
<ellipse cx="180" cy="626" rx="10" ry="6"/><path class="mc" d="M172,630L164,648M177,631L172,652M182,631L180,654M187,631L188,652M192,629L196,646"/>`;
D.skeleton2={cap:"The skeleton: named bones (front view)",svg:svg(420,662,`
<g class="bone2">${half}<g transform="translate(420,0) scale(-1,1)">${half}</g>
<ellipse cx="210" cy="52" rx="34" ry="40"/><ellipse cx="198" cy="58" rx="8" ry="7" class="hole"/><ellipse cx="222" cy="58" rx="8" ry="7" class="hole"/>
<path class="hole" d="M210,64L205,76H215Z"/><path d="M186,76Q188,104 210,108Q232,104 234,76Q222,86 210,86Q198,86 186,76Z"/><path class="teeth" d="M198,88H222"/>
${[0,1,2,3,4,5].map(i=>`<rect x="204" y="${109+i*3.4}" width="12" height="2.6" rx="1"/>`).join('')}
<path d="M202,128H218L216,146H204Z"/><rect x="203" y="147" width="14" height="66" rx="4"/><path d="M205,213H215L210,226Z"/>
${[0,1,2,3,4].map(i=>`<rect x="201" y="${244+i*11}" width="18" height="9" rx="2"/>`).join('')}
<path d="M198,300H222L210,340Z"/><path d="M208,340H212L210,348Z"/>
<path class="sym" d="M204,354H216"/>
</g>
${L(186,36,10,30,'Cranium (skull)')}${L(192,98,10,92,'Mandible')}${L(208,118,10,120,'Cervical vertebrae (C1–7)')}${L(168,121,10,146,'Clavicle')}
${L(137,196,10,196,'Humerus')}${L(123,300,10,296,'Ulna')}${L(111,324,10,320,'Radius')}${L(104,365,10,352,'Carpals (8)')}${L(106,388,10,380,'Metacarpals')}${L(97,420,10,410,'Phalanges')}
${L(170,440,10,446,'Femur')}${L(180,507,10,494,'Patella')}${L(170,570,10,562,'Fibula')}${L(180,626,10,616,'Tarsals')}${L(176,644,10,648,'Metatarsals')}
${L(222,58,300,40,'Orbit','start')}${L(260,152,300,100,'Scapula (behind)','start')}${L(210,136,300,124,'Manubrium','start')}${L(210,176,300,148,'Sternum','start')}${L(258,196,300,172,'Ribs (12 pairs)','start')}${L(210,221,300,196,'Xiphoid process','start')}
${L(210,272,300,246,'Lumbar spine (L1–5)','start')}${L(262,316,300,280,'Ilium (pelvis)','start')}${L(212,318,300,304,'Sacrum','start')}${L(249,351,300,328,'Femoral head (hip)','start')}${L(256,360,300,350,'Neck of femur','start')}
${L(210,354,300,372,'Pubic symphysis','start')}${L(264,363,300,394,'Greater trochanter','start')}${L(242,507,300,500,'Knee joint','start')}${L(236,570,300,566,'Tibia','start')}${L(238,614,300,612,'Malleoli (ankle)','start')}
`,'Front view of the skeleton with the main bones named')};
D.skeleton2.note="206 bones in adults. Pelvis, femur and multiple rib fractures can cause major internal blood loss. Neck of femur fractures are the classic injury after a fall in older adults.";

// ---- Long bone structure -------------------------------------------------------
D.longbone={cap:"Inside a long bone (e.g. femur)",svg:svg(400,330,`
<defs><pattern id="spg" width="9" height="9" patternUnits="userSpaceOnUse"><rect width="9" height="9" fill="#E9C9A6"/><circle cx="4.5" cy="4.5" r="2.4" fill="#C0584F" opacity=".75"/></pattern></defs>
<path d="M66,50Q120,2 174,50L162,96H78Z" fill="url(#spg)" stroke="#A89878"/>
<path d="M68,48Q120,4 172,48" class="artc"/>
<path d="M80,96H160" class="gplate"/>
<rect x="84" y="96" width="72" height="170" class="perio"/>
<rect x="88" y="96" width="64" height="170" fill="var(--boneC)" stroke="#A89878"/>
<rect x="104" y="104" width="32" height="154" rx="10" fill="#F2D36B"/>
<path d="M78,266H162L174,300Q120,334 66,300Z" fill="url(#spg)" stroke="#A89878"/>
<path d="M68,302Q120,330 172,302" class="artc"/>
<path d="M158,172L140,180L128,178" class="nutr"/>
${L(154,34,200,22,'Articular cartilage','start')}${L(120,60,200,48,'Spongy bone with red marrow','start')}${L(150,96,200,80,'Growth plate (epiphyseal line)','start')}
${L(150,140,200,120,'Compact bone','start')}${L(120,190,200,150,'Medullary cavity: yellow marrow','start')}${L(157,210,200,178,'Periosteum (nerves, vessels)','start')}${L(156,172,200,206,'Nutrient artery','start')}
<path d="M58,50V96M58,270V304" class="brkt"/><path d="M58,100V264" class="brkt2"/>${T(52,78,'Epiphysis','end','sm')}${T(52,186,'Diaphysis','end','sm')}${T(52,196,'(shaft)','end','sm')}
`,'Cross-section of a long bone')};
D.longbone.note="Bone is living, well-vascularised tissue: that's why fractures bleed and hurt. The periosteum is packed with nerves, so a broken bone is painful even when it looks normal.";

// ---- Synovial joint ------------------------------------------------------------
D.synovial={cap:"A synovial joint (e.g. knee)",svg:svg(400,260,`
<path d="M110,20H200V80Q200,112 155,112Q110,112 110,80Z" fill="var(--boneC)" stroke="#A89878"/>
<path d="M110,240H200V168Q200,142 155,142Q110,142 110,168Z" fill="var(--boneC)" stroke="#A89878"/>
<path d="M112,86Q114,110 155,110Q196,110 198,86" class="artc2"/><path d="M112,164Q114,144 155,144Q196,144 198,164" class="artc2"/>
<path d="M100,70Q84,127 100,184M210,70Q226,127 210,184" class="caps"/>
<path d="M104,74Q92,127 104,180M206,74Q218,127 206,180" class="synm"/>
<ellipse cx="155" cy="127" rx="44" ry="10" class="sfl"/>
<path d="M96,60L98,196M214,60L212,196" class="lig"/>
${L(198,90,250,40,'Articular cartilage','start')}${L(222,120,250,72,'Joint capsule','start')}${L(208,140,250,104,'Synovial membrane','start')}
${L(175,128,250,136,'Synovial fluid (lubricates)','start')}${L(213,170,250,168,'Ligament (bone to bone)','start')}${L(150,60,250,200,'Bone','start')}
`,'Diagram of a synovial joint')};
D.synovial.note="Dislocations tear the capsule and ligaments and can trap nerves and blood vessels. Always check circulation, sensation and movement beyond the joint.";
})();
