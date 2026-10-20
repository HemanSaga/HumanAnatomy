export { character } from './character.js';
const label = (x,y,t,size=15) => `<text x="${x}" y="${y}" text-anchor="middle" style="font-size:${size}px">${t}</text>`;
const path = (d,color,stages='0 1 2',reverse=false) => `<g data-stages="${stages}"><path d="${d}" stroke="${color}" stroke-width="6" fill="none" stroke-linecap="round" opacity=".6"/><path data-route="" data-stages="${stages}" ${reverse?'data-reverse=""':''} d="${d}" stroke="none" fill="none"/><path d="${d}" stroke="${color}" stroke-width="2" fill="none" marker-end="url(#arrow-${color.slice(1)})"/></g>`;
const box = (x,y,w,h,text,color) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="${color}" fill-opacity=".24" stroke="${color}" stroke-width="2"/>${label(x+w/2,y+h/2+5,text)}`;
const C={red:'#f29a91',blue:'#8bbfea',air:'#b6dec8',gold:'#edce8a'};
let serial = 0;
export function diagram(type) {
 const uid = `diagram-${++serial}-`;
 let body='';
 if(type==='circulation') {
   body=`${box(65,140,145,90,'Heart',C.red)}${box(420,140,230,90,'Tissue capillaries',C.gold)}${box(65,320,145,65,'Lung circuit',C.air)}
   ${path('M210 160H420',C.red,'0')}${label(310,130,'Arteries: away',16)}
   ${path('M455 140V65',C.red,'1')}${path('M605 65V140',C.blue,'1')}${label(455,45,'O₂ + nutrients',14)}${label(605,45,'CO₂ + wastes',14)}
   ${path('M420 210H210',C.blue,'2')}${label(310,255,'Veins: return',16)}${path('M100 230V320',C.blue,'2')}${path('M180 320V230',C.red,'2')}
   ${label(360,424,'Systemic circulation and pulmonary circulation form one loop.',14)}`;
 } else if(type==='heart') {
   body=`${box(250,85,105,75,'Right atrium',C.blue)}${box(250,200,105,90,'Right ventricle',C.blue)}${box(395,85,105,75,'Left atrium',C.red)}${box(395,200,105,90,'Left ventricle',C.red)}${box(285,8,180,44,'Lung capillaries',C.air)}${box(285,355,180,45,'Body tissues',C.gold)}
   ${path('M285 378H180V121H250',C.blue,'0')}${path('M302 160V200',C.blue,'0')}
   ${path('M250 244H218V30H285',C.blue,'1')}${path('M465 30H535V121H500',C.red,'1')}
   ${path('M448 160V200',C.red,'2')}${path('M500 244H570V378H465',C.red,'2')}
   ${label(118,193,'Venae cavae')}${label(137,48,'Pulmonary artery',13)}${label(622,72,'Pulmonary veins',13)}${label(616,305,'Aorta')}
   ${label(304,182,'valve',11)}${label(450,182,'valve',11)}
   ${label(375,327,'Right and left are the person’s sides.',13)}
   ${label(375,430,'Blue: oxygen-poor  ·  Red: oxygen-rich  ·  Blood is always red.',13)}`;
 } else if(type==='lungs'||type==='diaphragm') {
   body=`<g data-stages="${type==='diaphragm'?'0 1 2':'0 2'}"><path d="M280 35V111m0-10-65 55m65-55 65 55" stroke="#adc8bd" stroke-width="15" fill="none"/>
   <g class="breathing"><path d="M262 127Q207 60 163 174T246 280Q269 248 262 127" fill="#427d79" stroke="#a4d7c2" stroke-width="3"/><path d="M298 127Q355 60 398 174T315 280Q291 248 298 127" fill="#427d79" stroke="#a4d7c2" stroke-width="3"/></g></g>
   ${path('M280 40V106L213 165L202 233',C.air,type==='diaphragm'?'1':'0')}${path('M280 106L347 165L359 233',C.air,type==='diaphragm'?'1':'0')}
   ${path('M202 233L213 165L272 106V40',C.gold,'2')}${path('M359 233L347 165L288 106V40',C.gold,'2')}
   <path class="diaphragm-line" d="M145 319Q280 251 415 319" stroke="${C.gold}" stroke-width="9" fill="none"/>
   ${label(280,366,'Diaphragm')}${label(280,398,'Both lungs breathe in and out together.',13)}
   ${type==='lungs'?`<g data-stages="1"><circle cx="568" cy="160" r="62" fill="#689d8b" fill-opacity=".35" stroke="#b1dcc0" stroke-width="3"/>${label(568,142,'Alveolus')}${label(568,166,'air space',13)}
   <path d="M490 95Q470 260 640 232" stroke="#b46a7e" stroke-width="22" fill="none" opacity=".6"/>
   ${path('M542 187L515 218',C.red,'1')}${path('M599 232L588 190',C.blue,'1')}${label(479,254,'O₂ → blood',13)}${label(625,275,'CO₂ → air',13)}${label(569,76,'Gas exchange',17)}${label(569,315,'Thin air-sac + capillary walls',12)}</g>`:`<g data-stages="0">${label(560,100,'At rest',19)}${label(560,134,'Dome-shaped muscle',15)}</g><g data-stages="1">${label(560,193,'Contraction → inhalation',16)}${label(560,221,'Volume ↑ · pressure ↓',15)}${label(560,248,'Air flows in',15)}</g><g data-stages="2">${label(560,302,'Relaxation → exhalation',16)}${label(560,330,'Volume ↓ · pressure ↑',15)}${label(560,357,'Air flows out',15)}</g>`}`;
 } else if(type==='kidney') {
   body=`${label(150,43,'Blood enters',16)}<path d="M60 83H146Q205 22 253 83T198 154Q140 167 147 95" fill="none" stroke="${C.red}" stroke-width="10"/>
   <path d="M136 70Q98 176 225 185Q285 183 281 90" fill="none" stroke="#d8b385" stroke-width="6"/>
   ${label(217,218,'Bowman’s capsule',13)}${label(208,112,'Glomerulus',13)}
   ${path('M75 83H148Q207 39 244 86Q261 132 210 144',C.red,'0')}
   ${path('M220 150L278 184L320 220',C.gold,'0')}
   <path d="M279 184Q375 165 345 240Q308 344 403 343Q465 343 431 234Q421 205 475 208L529 240V358" stroke="#bb965a" stroke-width="23" fill="none"/>
   ${path('M279 184Q375 165 345 240Q308 344 403 343Q465 343 431 234Q421 205 475 208L529 240V358',C.gold,'1 2')}
   <path d="M328 93H617V337" stroke="${C.blue}" stroke-width="15" fill="none" opacity=".4"/>
   ${path('M363 202L378 100',C.air,'1')}${path('M474 205L492 100',C.air,'1')}
   ${label(460,72,'Back into the blood',15)}${label(418,160,'Reabsorption ↑',14)}${label(384,386,'Tubule',15)}${label(553,398,'Urine → ureter',15)}${label(360,432,'Filtration → selective reabsorption → excretion',14)}`;
 } else if(type==='digestion') {
   body=`${label(185,31,'Mouth')}${label(80,108,'Oesophagus',13)}<path d="M185 48V157Q263 109 288 177Q314 241 223 239" fill="none" stroke="#bc7d79" stroke-width="27"/>
   <path d="M167 263V365H416V263Z" fill="none" stroke="#997469" stroke-width="27" stroke-linejoin="round"/>
   ${path('M185 48V157Q262 122 274 177Q294 222 223 239',C.gold,'0 1')}
   ${path('M223 239C190 263 378 273 378 295S205 286 211 315S374 315 371 342L310 367L310 410',C.gold,'2')}
   ${label(341,180,'Stomach')}${label(288,287,'Small intestine',13)}${label(92,345,'Colon')}
   <g data-stages="2"><path d="M458 248q20-112 40 0q20-112 40 0q20-112 40 0" stroke="#e6b48a" stroke-width="6" fill="none"/>${label(525,146,'Villi: more surface area',14)}${path('M500 228L500 301',C.red,'2')}${path('M549 228L549 301',C.red,'2')}${label(525,332,'Nutrients → blood / lymph',13)}</g>
   ${label(360,439,'Food travels through the gut; nutrients cross its wall.',14)}`;
 } else if(type==='eye') {
   body=`<ellipse cx="358" cy="205" rx="147" ry="122" fill="#d8e0cb" fill-opacity=".2" stroke="#a3bdc6" stroke-width="5"/><ellipse cx="262" cy="205" rx="18" ry="57" fill="#7baaba"/>
   <path d="M452 111Q538 205 452 299" fill="none" stroke="${C.red}" stroke-width="9"/>
   ${path('M65 114L262 162L499 205',C.gold,'0')}${path('M65 296L262 248L499 205',C.gold,'0')}
   <circle data-stages="1" cx="499" cy="205" r="17" fill="${C.red}"/>
   ${path('M507 205L644 245',C.air,'2')}
   ${label(100,85,'Light rays')}${label(211,359,'Cornea',14)}${label(280,287,'Lens',14)}${label(463,356,'Retina',14)}${label(621,293,'Optic nerve',14)}${label(360,419,'Light → photoreceptors → electrical signals → brain',14)}`;
 } else if(type==='joint'||type==='muscle') {
   body=`<path d="M280 80L280 255" stroke="#dfd6b6" stroke-width="27" stroke-linecap="round"/>
   <g class="forearm"><path d="M280 255L470 285" stroke="#dfd6b6" stroke-width="24" stroke-linecap="round"/><path d="M290 269L470 300" stroke="#c1bea5" stroke-width="12" stroke-linecap="round"/></g>
   <path class="biceps" d="M277 105Q365 150 371 270" fill="none" stroke="#dd8991" stroke-width="22" stroke-linecap="round"/>
   <circle cx="280" cy="255" r="21" fill="#8cbbac" stroke="#e7f0d9" stroke-width="4"/>
   ${label(178,155,'Upper arm')}${label(506,328,'Forearm')}${label(430,92,'Biceps + tendon')}${label(209,306,'Elbow joint',14)}${label(360,404,'The shoulder attachment stays fixed as the forearm moves.',13)}`;
 } else {
   body=`<path d="M218 112Q341 46 493 123Q474 212 371 216L280 266Q207 252 218 112" fill="#986363" stroke="#d6a394" stroke-width="4"/><ellipse cx="344" cy="257" rx="19" ry="32" fill="#acc17e"/>
   ${path('M80 154L228 164L360 166L601 142',C.red,'0 1')}${path('M342 222L344 290L484 354',C.gold,'2')}
   ${label(120,115,'Blood in')}${label(592,105,'Blood out')}${label(359,136,'Liver')}${label(241,303,'Gallbladder',14)}${label(514,386,'Bile → small intestine',14)}${label(360,430,'Blood vessels and bile ducts are separate routes.',14)}`;
 }
 const defs=Object.values(C).map(c=>`<marker id="arrow-${c.slice(1)}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="${c}"/></marker>`).join('');
 return `<svg class="organ-diagram school-diagram" data-type="${type}" viewBox="0 0 720 450" role="img" aria-label="${type} mechanism, shown one stage at a time"><defs>${defs.replaceAll('id="arrow-', `id="${uid}arrow-`)}</defs>${body.replaceAll('url(#arrow-', `url(#${uid}arrow-`)}<g class="diagram-particles"></g></svg>`;
}
export function animateDiagram(root,time,chapter=0,progress=0) {
 const svg=root.querySelector('svg.school-diagram');if(!svg)return;
 const type=svg.dataset.type;
 // Breathing is cyclic; the middle chapter deliberately isolates gas exchange.
 const breath = type === 'diaphragm' ? (chapter===0 ? 0 : chapter===1 ? progress : 1-progress) : (chapter===0 ? progress : chapter===1 ? 1 : 1-progress);
 root.querySelectorAll('[data-stages]').forEach(el=>el.style.opacity=el.dataset.stages.split(' ').includes(String(chapter))?'1':'.16');
 const layer=root.querySelector('.diagram-particles');
 root.querySelectorAll('[data-route]').forEach((p,i)=>{
   const active=p.dataset.stages.split(' ').includes(String(chapter));
   for(let n=0;n<3;n++){
     const key=`dot-${i}-${n}`;let dot=layer.querySelector(`[data-dot="${key}"]`);
     if(!dot){dot=document.createElementNS('http://www.w3.org/2000/svg','circle');dot.dataset.dot=key;dot.setAttribute('r','4.5');dot.setAttribute('fill','#fff4d6');layer.append(dot);}
     dot.style.display=active?'':'none';if(!active)continue;
     const length=p.getTotalLength();const fraction=(time/5+n/3)%1;
     const pt=p.getPointAtLength(fraction*length);dot.setAttribute('cx',pt.x);dot.setAttribute('cy',pt.y);
   }
 });
 const set=(sel,value)=>root.querySelector(sel)?.setAttribute('transform',value);
 set('.breathing',`translate(280 280) scale(${1+breath*.08} ${1+breath*.06}) translate(-280 -280)`);
 // Flatten the dome, rather than simply moving an unchanged curved line.
 root.querySelector('.diaphragm-line')?.setAttribute('d',`M145 319Q280 ${251+breath*60} 415 319`);
 const angle=(chapter===1?-50*progress:chapter===2?-50+progress*50:0);
 set('.forearm',`rotate(${angle} 280 255)`);
 const rad=angle*Math.PI/180,x=280+91*Math.cos(rad)-15*Math.sin(rad),y=255+91*Math.sin(rad)+15*Math.cos(rad);
 root.querySelector('.biceps')?.setAttribute('d',`M277 105Q${310+(x-280)*.4} ${(105+y)/2-15} ${x} ${y}`);
}
