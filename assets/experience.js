import { LESSONS } from './lessons.js';
import { GUIDES } from './learning-guides.js';
import { character, diagram, animateDiagram } from './diagrams.js';

const $ = id => document.getElementById(id);
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const timeLabel = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

export function createExperience({ organs, selectOrgan, stopAudio, setStill, prepareMotion, onMuteChanged }) {
  let selected = organs.find(o => o.id === 'human_heart_3d_model');
  let lessonOrgan = selected;
  let model = null, motion = false, motionTime = 0;
  let playing = false, elapsed = 0, speed = 1, chapter = -1;
  let muted = false, speechActive = false, speechToken = 0, utterance = null;
  let lastFrame = performance.now(), studioOpen = false, voiceName = '';
  let modelLesson = false, stepMode = false, voiceTimer = null;
  try { voiceName = localStorage.getItem('corpus_voice') || ''; } catch {}
  let lesson = LESSONS[lessonOrgan.id];
  let boundaries = [], duration = 0;

  const dock = document.createElement('section');
  dock.className = 'working-dock';
  dock.setAttribute('aria-label', 'Organ working demonstration');
  dock.innerHTML = `<div class="dock-top"><div><span class="live-dot"></span><span class="eyebrow">ANATOMY IN MOTION</span></div><span class="motion-tag" id="motionTag">Ready to explore</span></div>
    <div class="dock-main"><div><h2 id="workingTitle">See the heart at work</h2><p id="workingDescription">A closer look at the rhythm of life.</p></div><button id="motionToggle" class="primary-button" disabled>▶ Animate</button></div>
    <div class="model-narration" id="modelNarration" hidden><div class="model-milo">${character}</div><div><span class="model-chapter" id="modelChapter"></span><p id="modelCaption"></p></div></div><div id="modelMechanism" class="model-mechanism" hidden></div><div class="dock-bottom"><span id="motionNote">Illustrative motion · not a clinical simulation</span><button id="workingLesson" class="text-button">Watch with Milo ↗</button></div>`;
  document.querySelector('.viewer').append(dock);
  $('modelNarration').append($('modelMechanism'));

  const studio = document.createElement('section');
  studio.id = 'lessonStudio'; studio.hidden = true;
  studio.setAttribute('aria-label', 'Animated video lessons');
  studio.innerHTML = `<div class="studio-main"><div class="studio-heading"><div><div class="eyebrow">THE EXPLAINER SERIES</div><h2 id="lessonTitle"></h2></div><span class="lesson-badge">ANIMATED LESSON</span></div>
    <div class="lesson-player" id="lessonPlayer"><div class="player-top"><span><span class="live-dot"></span> CORPUS ORIGINALS</span><span id="chapterCounter">01 / 03</span></div>
      <div class="lesson-visual"><div class="diagram-area" id="lessonDiagram"></div><div class="character-area"><div class="character-bubble" id="miloBubble">Let’s look inside!</div><div class="milo" id="milo">${character}</div><div class="milo-label">MILO <span>Your anatomy guide</span></div></div></div>
      <div class="caption-area"><span class="caption-speaker">MILO</span><p id="lessonCaption" aria-live="off"></p></div>
      <div class="player-controls"><input id="lessonSeek" type="range" min="0" max="100" value="0" step="0.1" aria-label="Lesson progress"><div class="control-row"><button id="lessonPlay" class="play-button" aria-label="Play lesson">▶</button><button id="lessonRestart" class="icon-button" aria-label="Restart lesson" title="Restart lesson">↺</button><span id="lessonTime" class="time-label"></span><span id="voiceStatus">Voiceover ready</span><div class="controls-right"><button id="lessonMute" class="icon-button" aria-label="Mute voiceover" aria-pressed="false">Sound on</button><label class="sr-only" for="lessonSpeed">Playback speed</label><select id="lessonSpeed"><option value="0.75">0.75×</option><option value="1" selected>1×</option><option value="1.25">1.25×</option><option value="1.5">1.5×</option></select><button id="lessonFullscreen" class="icon-button" aria-label="Fullscreen lesson" title="Fullscreen lesson">⛶</button></div></div></div>
    </div>
    <div class="classroom-toolbar"><button id="previousChapter">← Previous</button><label><input id="stepMode" type="checkbox"> Pause after each chapter</label><button id="nextChapter">Next →</button></div><div class="chapter-buttons" id="lessonChapters"></div><section class="learning-focus"><div><span class="eyebrow">WATCH FOR THIS</span><h3 id="watchFor"></h3><p id="keyTerm"></p></div><details id="checkUnderstanding"><summary id="checkQuestion"></summary><p id="checkAnswer"></p></details></section>
    <div class="lesson-detail"><div><h3>A little understanding goes a long way.</h3><p id="lessonSubtitle"></p><p class="lesson-disclosure">Animated diagrams simplify the process; organ motion is illustrative. Captions are always available.</p><a id="lessonSource" target="_blank" rel="noopener noreferrer"></a></div><div class="voice-picker"><label for="lessonVoice">Narrator voice</label><select id="lessonVoice"><option value="">Best available English voice</option></select><button id="previewVoice" class="text-button">▶ Preview this voice</button><p class="voice-note">Voice quality depends on voices installed on your device. Choose and preview before presenting.</p><button class="text-button" id="viewIn3D">Explore this organ in 3D ↗</button></div></div>
    <details class="lesson-transcript"><summary>Read the full lesson transcript</summary><div id="lessonTranscript"></div></details>
    </div><aside class="lesson-library"><div class="library-head"><div class="eyebrow">SMALL LESSONS. BIG DISCOVERIES.</div><h3>Inside the human body</h3><p>10 stories, told by Milo.</p></div><div id="lessonCards"></div><div class="library-footer">Made for curious minds.<br><span>Explore at your own pace.</span></div></aside>`;
  $('app').append(studio);

  organs.forEach((organ, i) => {
    const data = LESSONS[organ.id];
    const button = document.createElement('button');
    button.className = 'lesson-card'; button.dataset.organ = organ.id;
    button.innerHTML = `<span class="lesson-thumbnail" style="--lesson-color:${data.color}"><span>${organ.icon}</span><span class="thumb-play">▶</span></span><span class="lesson-card-copy"><span class="lesson-card-number">${String(i + 1).padStart(2,'0')} · ${organ.name}</span><strong>${data.title}</strong><span class="lesson-card-meta">3 chapters · Voice + captions</span></span>`;
    button.onclick = () => { loadLesson(organ); if (window.innerWidth < 760) studio.scrollIntoView({ block:'start', behavior: reducedMotion.matches ? 'instant' : 'smooth' }); };
    $('lessonCards').append(button);
  });

  function cancelSpeech() {
    speechToken++;
    clearTimeout(voiceTimer);
    speechActive = false;
    utterance = null;
    window.speechSynthesis?.cancel();
    $('milo').classList.remove('talking');
  }
  function stop() {
    playing = false; motion = false; modelLesson = false;
    $('modelNarration').hidden = true;
    $('modelMechanism').hidden = true;
    dock.classList.remove('demonstrating');
    cancelSpeech();
    model?.traverse(node => node.userData.resetNative?.());
    model?.scale.set(1,1,1);
    if (model) model.position.y = 0;
    $('motionToggle').textContent = '▶ Watch it work';
    $('motionToggle').setAttribute('aria-pressed','false');
    $('motionTag').textContent = 'Ready to explore';
    $('lessonPlayer').classList.remove('is-playing');
    $('voiceStatus').textContent = muted ? 'Captions only' : 'Voiceover ready';
    updateControls();
    requestAnimationFrame(() => window.dispatchEvent(new Event('resize')));
  }
  function showStudio(value) {
    stop(); stopAudio(); studioOpen = value;
    studio.hidden = !value;
    $('explorer').hidden = value;
    document.querySelector('.experience-heading').hidden = value;
    $('studioNav').classList.toggle('selected',value);
    $('exploreNav').classList.toggle('selected',!value);
    $('studioNav').setAttribute('aria-current', value ? 'page' : 'false');
    $('exploreNav').setAttribute('aria-current', value ? 'false' : 'page');
    requestAnimationFrame(() => {
      window.dispatchEvent(new Event('resize'));
      studio.scrollTop = 0;
      window.scrollTo(0, 0);
    });
  }
  function openLesson(organ) {
    showStudio(true); loadLesson(organ);
  }
  function loadLesson(organ) {
    stop(); stopAudio();
    lessonOrgan = organ; lesson = LESSONS[organ.id];
    duration = 0; boundaries = [0];
    lesson.steps.forEach(([, text]) => { duration += Math.max(10, text.split(/\s+/).length / 2.2); boundaries.push(duration); });
    elapsed = 0; chapter = -1;
    $('lessonTitle').textContent = lesson.title;
    $('lessonSubtitle').textContent = lesson.subtitle;
    $('lessonDiagram').innerHTML = diagram(lesson.type);
    $('lessonSource').textContent = `Read more: ${lesson.source[0]} ↗`;
    $('lessonSource').href = lesson.source[1];
    $('lessonChapters').innerHTML = '';
    $('lessonTranscript').innerHTML = '';
    lesson.steps.forEach(([title,text],i) => {
      const button = document.createElement('button');
      button.innerHTML = `<span>${String(i + 1).padStart(2,'0')}</span>${title}<span class="chapter-duration">${timeLabel(boundaries[i])}</span>`;
      button.onclick = () => seek(boundaries[i]);
      $('lessonChapters').append(button);
      const para = document.createElement('p');
      const strong = document.createElement('strong'); strong.textContent = `${title}. `;
      para.append(strong,document.createTextNode(text)); $('lessonTranscript').append(para);
    });
    document.querySelectorAll('.lesson-card').forEach(card => {
      const active = card.dataset.organ === organ.id;
      card.classList.toggle('active',active); card.setAttribute('aria-pressed',String(active));
    });
    setChapter(0,false); animateDiagram($('lessonDiagram'),0,0,0); updateControls();
  }
  const novelty=/Albert|Bad News|Bahh|Bells|Boing|Bubbles|Cellos|Good News|Jester|Organ|Trinoids|Whisper|Wobble|Zarvox/i;
  const voiceScore=v=>(/natural|neural|premium|enhanced/i.test(v.name)?100:0)+(/Google|Microsoft.*Online/i.test(v.name)?70:0)+(/Samantha|Daniel|Karen|Moira|Rishi/i.test(v.name)?40:0)+(v.default?10:0);
  function chooseVoice(){const voices=(window.speechSynthesis?.getVoices()||[]).filter(v=>/^en/.test(v.lang)&&!novelty.test(v.name));return voices.find(v=>v.name===voiceName)||voices.sort((a,b)=>voiceScore(b)-voiceScore(a))[0];}
  function narrate() {
    cancelSpeech();
    if (muted || !playing) { $('voiceStatus').textContent = muted ? 'Captions only' : 'Voiceover ready'; return; }
    if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) { $('voiceStatus').textContent = 'Voice unavailable · captions on'; return; }
    const token = speechToken;
    // Restart at the sentence containing the seek position, retaining the timeline.
    const text = lesson.steps[chapter][1];
    const sentences = text.match(/[^.!?]+[.!?]*/g) || [text];
    const fraction = (elapsed - boundaries[chapter]) / (boundaries[chapter+1] - boundaries[chapter]);
    const targetCharacter = Math.max(0, fraction) * text.length;
    let sentenceIndex = 0, characters = 0;
    while (sentenceIndex < sentences.length - 1 && characters + sentences[sentenceIndex].length < targetCharacter) characters += sentences[sentenceIndex++].length;
    function saySentence(index) {
      if(token!==speechToken||!playing)return;
      if(index>=sentences.length){speechActive=false;$('milo').classList.remove('talking');elapsed=boundaries[chapter+1];return;}
      utterance=new SpeechSynthesisUtterance(sentences[index].trim());
      const voice=chooseVoice();if(voice)utterance.voice=voice;
      utterance.lang=voice?.lang||'en-US';utterance.rate=.94*speed;utterance.pitch=1;
      speechActive=true;
      utterance.onstart=()=>{if(token!==speechToken)return;$('voiceStatus').textContent='Narrating · '+(voice?.name||'English');$('milo').classList.add('talking');$('lessonCaption').textContent=sentences[index].trim();$('modelCaption').textContent=sentences[index].trim();};
      utterance.onend=()=>{if(token!==speechToken)return;$('milo').classList.remove('talking');voiceTimer=setTimeout(()=>saySentence(index+1),240/speed);};
      utterance.onerror=()=>{if(token!==speechToken)return;speechActive=false;$('milo').classList.remove('talking');$('voiceStatus').textContent='Voice unavailable · captions on';$('lessonCaption').textContent=text;$('modelCaption').textContent=text;};
      speechSynthesis.resume();speechSynthesis.speak(utterance);
    }
    $('voiceStatus').textContent='Starting narration…';
    saySentence(sentenceIndex);
  }

  function setChapter(index,speak=true) {
    chapter = index;
    const guide=GUIDES[lesson.type];
    $('watchFor').textContent=guide.watch[index];
    $('keyTerm').textContent=guide.terms[index];
    $('checkQuestion').textContent='Check your understanding: '+guide.question;
    $('checkAnswer').textContent=guide.answer;
    $('checkUnderstanding').open=false;
    $('previousChapter').disabled=index===0;
    $('nextChapter').disabled=index===lesson.steps.length-1;
    $('lessonCaption').textContent = lesson.steps[index][1];
    $('modelCaption').textContent = lesson.steps[index][1];
    $('modelChapter').textContent = `${index+1} / 3 · ${lesson.steps[index][0]}`;
    $('chapterCounter').textContent = `${String(index+1).padStart(2,'0')} / 03`;
    $('miloBubble').textContent = lesson.steps[index][0] + ' — let’s see how.';
    [...$('lessonChapters').children].forEach((button,i) => { button.classList.toggle('active',i===index); button.setAttribute('aria-pressed',String(i===index)); });
    animateDiagram($('lessonDiagram'), elapsed, index, (elapsed-boundaries[index])/(boundaries[index+1]-boundaries[index]));
    if(speak) narrate();
  }
  function seek(value) {
    cancelSpeech(); elapsed = Math.max(0,Math.min(duration,value));
    const index = Math.min(2,boundaries.findIndex((end,i) => i>0 && elapsed<end)-1);
    setChapter(index < 0 ? 2 : index);
    animateDiagram($('lessonDiagram'), elapsed, chapter, (elapsed-boundaries[chapter])/(boundaries[chapter+1]-boundaries[chapter])); updateControls();
  }
  function updateControls() {
    $('lessonPlay').textContent = playing ? 'Ⅱ' : elapsed >= duration ? '↺' : '▶';
    $('lessonPlay').setAttribute('aria-label',playing ? 'Pause lesson' : elapsed >= duration ? 'Replay lesson' : 'Play lesson');
    $('lessonSeek').value = duration ? elapsed/duration*100 : 0;
    $('lessonTime').textContent = `${timeLabel(elapsed)} / ${timeLabel(duration)}`;
    $('lessonSeek').setAttribute('aria-valuetext', `${timeLabel(elapsed)} of ${timeLabel(duration)}`);
  }
  function playToggle() {
    if(playing) {
      playing = false;
      cancelSpeech();
      $('milo').classList.remove('talking');
      $('voiceStatus').textContent = 'Paused';
    } else {
      if (!speechActive) stopAudio();
      playing = true;
      if(elapsed>=duration){elapsed=0;setChapter(0,false);}
      if(speechActive && window.speechSynthesis?.paused) { speechSynthesis.resume(); $('milo').classList.add('talking'); $('voiceStatus').textContent='Milo is explaining…'; }
      else { narrate(); }
    }
    $('lessonPlayer').classList.toggle('is-playing',playing); updateControls();
  }
  $('lessonPlay').onclick = playToggle;
  $('stepMode').onchange=e=>stepMode=e.target.checked;
  $('previousChapter').onclick=()=>seek(boundaries[Math.max(0,chapter-1)]);
  $('nextChapter').onclick=()=>seek(boundaries[Math.min(2,chapter+1)]);
  $('lessonRestart').onclick = () => { seek(0); };
  $('lessonSeek').oninput = e => seek(Number(e.target.value)/100*duration);
  $('lessonSpeed').onchange = e => { speed=Number(e.target.value); narrate(); updateControls(); };
  $('lessonMute').onclick = () => setMuted(!muted);
  function setMuted(value) {
    muted=value;
    onMuteChanged?.(muted);
    $('lessonMute').textContent=muted?'Sound off':'Sound on';
    $('lessonMute').setAttribute('aria-label',muted?'Enable voiceover':'Mute voiceover');
    $('lessonMute').setAttribute('aria-pressed',String(muted));
    if(muted){cancelSpeech();$('lessonCaption').textContent=lesson.steps[chapter][1];$('modelCaption').textContent=lesson.steps[chapter][1];$('voiceStatus').textContent='Captions only';}
    else if(playing){narrate();}
  }
  $('lessonVoice').onchange=e=>{voiceName=e.target.value;try{localStorage.setItem('corpus_voice',voiceName);}catch{}if(playing){narrate();}};
  $('previewVoice').onclick=()=>{stop();stopAudio();if(!window.speechSynthesis)return;const sample=new SpeechSynthesisUtterance('Let’s trace the path of oxygen. Air enters the lungs, then oxygen diffuses into the blood.');sample.voice=chooseVoice();sample.rate=.94;speechSynthesis.resume();speechSynthesis.speak(sample);};
  const updateVoices = () => {
    $('lessonVoice').replaceChildren(new Option('Best available English voice',''));
    (window.speechSynthesis?.getVoices()||[]).filter(v=>/^en/.test(v.lang)&&!novelty.test(v.name)).sort((a,b)=>voiceScore(b)-voiceScore(a)).forEach(v=>$('lessonVoice').add(new Option(`${v.name} (${v.lang})`,v.name)));
    $('lessonVoice').value=voiceName;
    if(!window.speechSynthesis) $('voiceStatus').textContent='Voice unavailable · captions on';
  };
  window.speechSynthesis?.addEventListener('voiceschanged',updateVoices); updateVoices();
  $('lessonFullscreen').onclick=async()=>{
    try { if(document.fullscreenElement) await document.exitFullscreen(); else if($('lessonPlayer').requestFullscreen) await $('lessonPlayer').requestFullscreen(); else $('voiceStatus').textContent='Fullscreen unavailable on this device'; }
    catch { $('voiceStatus').textContent='Fullscreen unavailable on this device'; }
  };
  $('studioNav').onclick=()=>openLesson(selected);
  $('exploreNav').onclick=()=>showStudio(false);
  $('featuredLesson').onclick=()=>openLesson(organs.find(o=>o.id==='human_heart_3d_model'));
  $('workingLesson').onclick=()=>openLesson(selected);
  $('viewIn3D').onclick=()=>{showStudio(false);selectOrgan(lessonOrgan);};
  function startModelLesson() {
    if (!model) return;
    if (modelLesson) { stop(); return; }
    loadLesson(selected);
    stopAudio(); prepareMotion(); setStill();
    modelLesson = true; motion = true; playing = true; motionTime = 0;
    $('modelNarration').hidden = false;
    const deform = ['heart','lungs','diaphragm'].includes(lesson.type);
    $('modelMechanism').hidden = false;
    $('modelMechanism').innerHTML = diagram(lesson.type);
    dock.classList.add('demonstrating');
    $('motionToggle').textContent = '■ Stop';
    $('motionToggle').setAttribute('aria-pressed','true');
    $('motionTag').textContent = 'Guided demonstration';
    narrate();
    requestAnimationFrame(() => window.dispatchEvent(new Event('resize')));
  }
  $('motionToggle').onclick = startModelLesson;
  document.addEventListener('visibilitychange',()=>{if(document.hidden){if(playing)playToggle();if(motion)$('motionToggle').click();}});
  document.addEventListener('keydown',e=>{
    if(studioOpen && e.code==='Space' && !['INPUT','SELECT','BUTTON','TEXTAREA','SUMMARY'].includes(e.target.tagName)){e.preventDefault();playToggle();}
  });
  loadLesson(selected);
  return {
    stop,setMuted,openLesson,
    select(organ,newModel){
      stop();selected=organ;model=newModel;
      const data=LESSONS[organ.id];
      $('workingTitle').textContent=data.title;
      $('workingDescription').textContent=data.metric;
      const deform=['heart','lungs','diaphragm'].includes(data.type);
      $('motionToggle').disabled=false;
      $('motionToggle').textContent='▶ Watch it work';
      $('motionToggle').onclick = startModelLesson;
      $('motionNote').textContent=organ.schematic ? 'Circulation schematic · original model data unavailable' : deform?'Illustrative motion · not a clinical simulation':'Working diagram accompanies the static anatomy model';
    },
    tick(){
      const now=performance.now(),dt=Math.min((now-lastFrame)/1000,.1);lastFrame=now;
      if(motion && model && playing){
        if(!reducedMotion.matches)model.traverse(node => node.userData.updateFlow?.(motionTime));
        motionTime+=dt*speed;
        const type=LESSONS[selected.id].type;
        const fraction=Math.min(1,(elapsed-boundaries[chapter])/(boundaries[chapter+1]-boundaries[chapter]));
        const breath=type==='diaphragm'?(chapter===0?0:chapter===1?fraction:1-fraction):(chapter===0?fraction:chapter===1?1:1-fraction);
        if(type==='heart' && !reducedMotion.matches) { model.traverse(node=>node.userData.animateNative?.(motionTime)); $('motionTag').textContent='Native heartbeat animation'; }
        if(type==='lungs' && !reducedMotion.matches){model.scale.set(1+breath*.065,1+breath*.045,1+breath*.055);$('motionTag').textContent=chapter===0?'Inhaling · expanding':chapter===1?'Gas exchange':'Exhaling · recoiling';}
        if(type==='diaphragm' && !reducedMotion.matches){model.position.y=-breath*.13;model.scale.y=1-breath*.09;$('motionTag').textContent=chapter===0?'Dome at rest':chapter===1?'Contracting · descending':'Relaxing · rising';}
      }
      if(playing){
        elapsed+=dt*speed;
        // Allow speech to finish each chapter; a bounded grace period prevents a stuck voice from blocking playback.
        if(speechActive && elapsed>=boundaries[chapter+1] && elapsed<boundaries[chapter+1]+8) {
          if(!utterance?._waitStart) { if(utterance)utterance._waitStart=now; }
          if(utterance && now-utterance._waitStart<8000) elapsed=boundaries[chapter+1]-.01;
          else cancelSpeech();
        }
        if(elapsed>=duration){elapsed=duration;playing=false;cancelSpeech();$('lessonPlayer').classList.remove('is-playing');$('voiceStatus').textContent='Lesson complete · replay anytime';}
        else if(elapsed>=boundaries[chapter+1]) { if(stepMode && !modelLesson){playing=false;cancelSpeech();$('lessonPlayer').classList.remove('is-playing');setChapter(chapter+1,false);$('voiceStatus').textContent='Paused at next chapter · press Play';}else setChapter(chapter+1); }
        if(!reducedMotion.matches) {
          animateDiagram($('lessonDiagram'),elapsed,chapter,Math.min(1,(elapsed-boundaries[chapter])/(boundaries[chapter+1]-boundaries[chapter])));
          if(modelLesson && !$('modelMechanism').hidden) animateDiagram($('modelMechanism'),elapsed,chapter,Math.min(1,(elapsed-boundaries[chapter])/(boundaries[chapter+1]-boundaries[chapter])));
        }
        if(modelLesson && elapsed>=duration) { model.traverse(node=>node.userData.resetNative?.()); motion=false; model.scale.set(1,1,1); model.position.y=0; $('motionTag').textContent='Demonstration complete'; $('motionToggle').textContent='↺ Replay'; modelLesson=false; }
        updateControls();
      }
    }
  };
}
