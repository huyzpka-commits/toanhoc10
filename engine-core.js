/* ===== TOÁN 10 ENGINE CORE ===== */
const APP = { name:'', prefix:'', topics:[], themeColor:'#6366f1' };

function randInt(min, max){ return Math.floor(Math.random()*(max-min+1)) + min; }
function pick(arr){ return arr[randInt(0,arr.length-1)]; }
function shuffle(arr){
  const a = [...arr];
  for(let i=a.length-1;i>0;i--){ const j=randInt(0,i); [a[i],a[j]]=[a[j],a[i]]; }
  return a;
}
function clamp(v,min,max){ return Math.max(min,Math.min(max,v)); }

function makeMC(correct, distractors, format){
  const choices = shuffle([correct, ...distractors]);
  return { choices, answer: choices.indexOf(correct) };
}

// LocalStorage
function loadData(){
  try{ return JSON.parse(localStorage.getItem(`toan10_${APP.prefix}_v1`)) || {}; }catch{ return {}; }
}
function saveData(d){
  localStorage.setItem(`toan10_${APP.prefix}_v1`, JSON.stringify(d));
}

// Audio
var audioCtx = null;
function getAudioCtx(){
  if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}
function playTones(seq){
  const ac = getAudioCtx();
  if(!localStorage.getItem(`toan10_${APP.prefix}_sound`)!=='off' || localStorage.getItem(`toan10_${APP.prefix}_sound`)==='off') return;
  seq.forEach(([freq,dur,delay,type]) => {
    const osc = ac.createOscillator(); const gain = ac.createGain();
    osc.type = type||'sine'; osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.15, ac.currentTime+delay);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime+delay+dur);
    osc.connect(gain); gain.connect(ac.destination);
    osc.start(ac.currentTime+delay); osc.stop(ac.currentTime+delay+dur);
  });
}
function soundCorrect(){ playTones([[784,0.12,0],[1047,0.18,0.12]]); }
function soundWrong(){ playTones([[311,0.2,0,'triangle'],[233,0.25,0.15,'triangle']]); }
function soundFanfare(){ playTones([[523,0.15,0],[659,0.15,0.15],[784,0.15,0.3],[1047,0.25,0.45]]); }

// Confetti
function confetti(amount){
  if(window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  const container = document.createElement('div'); container.className = 'confetti-container';
  document.body.appendChild(container);
  const colors = ['#6366f1','#8b5cf6','#f59e0b','#22c55e','#ef4444','#3b82f6'];
  for(let i=0;i<(amount||60);i++){
    const p = document.createElement('div'); p.className = 'confetti-piece';
    p.style.left = randInt(5,95)+'%'; p.style.background = pick(colors);
    p.style.width = randInt(6,12)+'px'; p.style.height = randInt(6,12)+'px';
    p.style.borderRadius = pick(['0','50%']);
    p.style.animationDuration = (randInt(12,22)/10)+'s';
    p.style.animationDelay = (randInt(0,15)/10)+'s';
    container.appendChild(p);
  }
  setTimeout(() => container.remove(), 2500);
}

// KaTeX render
function renderMath(el){
  if(window.katex && el){
    el.querySelectorAll('.math').forEach(m => {
      try{ katex.render(m.textContent, m, { displayMode: m.classList.contains('d') }); }catch(e){}
    });
  }
}

// Theme
function initTheme(){
  const saved = localStorage.getItem('toan10_theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  const btn = document.getElementById('themeBtn');
  if(btn) btn.textContent = saved==='dark' ? '☀️' : '🌙';
}
function toggleTheme(){
  const t = document.documentElement;
  const isDark = t.getAttribute('data-theme')==='dark';
  t.setAttribute('data-theme', isDark?'light':'dark');
  localStorage.setItem('toan10_theme', isDark?'light':'dark');
  const btn = document.getElementById('themeBtn');
  if(btn) btn.textContent = isDark?'🌙':'☀️';
}

// Quiz state
let Q = { topic:null, questions:[], index:0, correct:0, streak:0, bestStreak:0, records:[], isMixed:false };
let S = {}; // persistent data

function loadState(){
  S = loadData();
  if(!S.topics) S.topics = {};
  if(!S.badges) S.badges = {};
  APP.topics.forEach(t => { if(!S.topics[t.id]) S.topics[t.id] = { correct:0, seen:0, bestStreak:0 }; });
  S.xp = S.xp||0; S.totalCorrect = S.totalCorrect||0; S.totalSeen = S.totalSeen||0;
  S.bestStreak = S.bestStreak||0; S.streakDays = S.streakDays||0;
  S.daily = S.daily||{ date:'', count:0, rewarded:false };
  S.lastActive = S.lastActive||'';
  S.activityLog = S.activityLog||{};
}
function saveState(){ saveData(S); }

function levelFromXP(xp){ return Math.floor(xp/100)+1; }

// Home screen
function renderHome(){
  document.getElementById('screen-home').classList.remove('hidden');
  document.getElementById('screen-quiz').classList.add('hidden');
  document.getElementById('screen-result').classList.add('hidden');
  document.getElementById('screen-achievements').classList.add('hidden');

  // Daily
  const today = new Date().toISOString().slice(0,10);
  if(S.daily.date !== today){ S.daily = { date:today, count:0, rewarded:false }; saveState(); }
  document.getElementById('dailyGoal').textContent = `🎯 Hôm nay: ${S.daily.count}/${APP.dailyGoal} câu`;

  // Stats header
  document.getElementById('xpDisplay').textContent = `⭐ ${S.xp} XP`;
  document.getElementById('streakDisplay').textContent = S.daily.count > 0 ? `🔥 ${S.daily.count}` : '';

  // Topic grid
  const grid = document.getElementById('topicGrid');
  grid.innerHTML = '';
  APP.topics.forEach(t => {
    const ts = S.topics[t.id]||{ correct:0, seen:0 };
    const pct = ts.seen > 0 ? Math.round(ts.correct/ts.seen*100) : 0;
    const div = document.createElement('div'); div.className = 'topic';
    div.innerHTML = `<div class="topic-icon">${t.icon}</div>
      <div class="topic-name">${t.name}</div>
      <div class="topic-pct">${pct}%</div>
      <div class="topic-bar"><i style="width:${pct}%"></i></div>`;
    div.addEventListener('click', () => startPractice(t.id));
    grid.appendChild(div);
  });

  // Mixed button
  document.getElementById('mixedBtn').addEventListener('click', startMixed);
  // Achievements button
  document.getElementById('achBtn').addEventListener('click', renderAchievements);

  renderHomeStats();
}

function renderHomeStats(){
  const total = APP.topics.reduce((s,t) => s + (S.topics[t.id]?.seen||0), 0);
  const done = APP.topics.reduce((s,t) => s + (S.topics[t.id]?.correct||0), 0);
  document.getElementById('homeTotal').textContent = `${done}/${total}`;
}

// Start practice
function startPractice(topicId){
  const topic = APP.topics.find(t => t.id === topicId);
  if(!topic) return;
  Q.topic = topicId; Q.isMixed = false; Q.index = 0; Q.correct = 0; Q.streak = 0; Q.records = [];
  Q.questions = [];
  for(let i=0;i<APP.quizLen;i++){
    const q = APP.genQuestion(topicId, i);
    if(q) Q.questions.push(q);
  }
  if(Q.questions.length===0) return;
  showQuiz();
}

// Start mixed
function startMixed(){
  const len = APP.mixedLen;
  Q.topic = null; Q.isMixed = true; Q.index = 0; Q.correct = 0; Q.streak = 0; Q.records = [];
  Q.questions = [];
  for(let i=0;i<len;i++){
    const tid = pick(APP.topics).id;
    const q = APP.genQuestion(tid, i);
    if(q) Q.questions.push(q);
  }
  if(Q.questions.length===0) return;
  showQuiz();
}

function showQuiz(){
  document.getElementById('screen-home').classList.add('hidden');
  document.getElementById('screen-quiz').classList.remove('hidden');
  document.getElementById('screen-result').classList.add('hidden');
  document.getElementById('screen-achievements').classList.add('hidden');
  loadQuestion();
}

// Load question
function loadQuestion(){
  const q = Q.questions[Q.index];
  if(!q) return endQuiz();

  const topic = APP.topics.find(t => t.id === q.topic);
  document.getElementById('qTopic').textContent = Q.isMixed ? (topic ? topic.name : '') : (topic ? topic.name : '');
  document.getElementById('qProgress').textContent = `Câu ${Q.index+1}/${Q.questions.length}`;

  const card = document.getElementById('qCard');
  card.innerHTML = '';

  const stem = document.createElement('div'); stem.className = 'stem';
  stem.innerHTML = q.stem;
  card.appendChild(stem);

  if(q.type === 'mcq' || q.type === 'mc'){
    const choices = document.createElement('div'); choices.className = 'choices';
    q.choices.forEach((c,i) => {
      const btn = document.createElement('button'); btn.className = 'choice';
      btn.innerHTML = c; btn.dataset.i = i;
      btn.addEventListener('click', () => selectChoice(i));
      choices.appendChild(btn);
    });
    card.appendChild(choices);
    Q.selectedIndex = -1;
  } else if(q.type === 'input'){
    const row = document.createElement('div'); row.className = 'inputrow';
    const inp = document.createElement('input'); inp.className = 'input';
    inp.type = 'text'; inp.inputMode = 'numeric'; inp.autocomplete = 'off';
    inp.id = 'answerInput'; inp.placeholder = 'Nhập đáp án...';
    row.appendChild(inp);
    card.appendChild(row);
    setTimeout(() => inp.focus(), 100);
  }

  const fb = document.createElement('div'); fb.className = 'feedback'; fb.id = 'feedback';
  card.appendChild(fb);

  document.getElementById('checkBtn').classList.remove('hidden');
  document.getElementById('nextBtn').classList.add('hidden');
  document.getElementById('nextBtn').textContent = 'Câu tiếp →';
  document.getElementById('explainBox').classList.add('hidden');
  document.getElementById('checkBtn').disabled = false;

  renderMath(document.getElementById('screen-quiz'));
}

function selectChoice(i){
  document.querySelectorAll('.choice').forEach((b,j) => b.classList.toggle('selected', j===i));
  Q.selectedIndex = i;
  document.getElementById('checkBtn').disabled = false;
}

function checkAnswer(){
  const q = Q.questions[Q.index];
  if(!q) return;
  const fb = document.getElementById('feedback');
  let correct = false;
  let userAns = '';

  if(q.type === 'mcq' || q.type === 'mc'){
    if(Q.selectedIndex < 0) return;
    userAns = Q.selectedIndex === q.answer ? 'Đúng' : 'Sai';
    correct = Q.selectedIndex === q.answer;
    document.querySelectorAll('.choice').forEach((b,i) => {
      b.classList.add(i===q.answer?'correct':'wrong');
      if(i===Q.selectedIndex && i!==q.answer) b.classList.add('wrong');
    });
  } else {
    const inp = document.getElementById('answerInput');
    if(!inp) return;
    userAns = inp.value.trim();
    const normalized = normalizeAnswer(userAns);
    const expected = normalizeAnswer(String(q.answer));
    correct = normalized === expected || Math.abs(parseFloat(normalized)-parseFloat(expected)) < 0.001;
    if(correct){ inp.style.borderColor = 'var(--ok)'; }
    else { inp.style.borderColor = 'var(--warn)'; }
  }

  Q.records.push({ question:q, userAnswer:userAns, correct });

  if(correct){
    Q.correct++; Q.streak++;
    fb.className = 'feedback show ok';
    fb.innerHTML = '✅ Đúng rồi!' + (q.diff==='hard'?' (+25 XP)':q.diff==='medium'?' (+15 XP)':' (+10 XP)');
    soundCorrect(); confetti(40);
    const xp = q.diff==='hard'?25:q.diff==='medium'?15:10;
    const bonus = Math.floor(Q.streak/3)*5;
    S.xp = (S.xp||0) + xp + bonus;
    S.totalCorrect = (S.totalCorrect||0) + 1;
    const ts = S.topics[q.topic];
    if(ts){ ts.correct = (ts.correct||0)+1; ts.bestStreak = Math.max(ts.bestStreak||0, Q.streak); }
    S.bestStreak = Math.max(S.bestStreak||0, Q.streak);
    // Daily
    const today = new Date().toISOString().slice(0,10);
    if(S.daily.date === today) S.daily.count++;
    else S.daily = { date:today, count:1, rewarded:false };
    // Activity
    if(!S.activityLog[today]) S.activityLog[today] = 0;
    S.activityLog[today]++;
    if(S.daily.count >= APP.dailyGoal && !S.daily.rewarded){
      S.daily.rewarded = true;
      S.xp += 50;
      setTimeout(() => { fb.innerHTML += '<br>🎯 Đạt mục tiêu hôm nay! +50 XP'; }, 300);
    }
  } else {
    Q.streak = 0;
    fb.className = 'feedback show bad';
    fb.innerHTML = '❌ Chưa đúng.';
    soundWrong();
    if(q.explain){
      document.getElementById('explainBox').classList.remove('hidden');
      document.getElementById('explainText').innerHTML = q.explain;
      renderMath(document.getElementById('explainBox'));
    }
  }
  S.totalSeen = (S.totalSeen||0)+1;
  const ts = S.topics[q.topic];
  if(ts) ts.seen = (ts.seen||0)+1;
  saveState();
  updateXPDisplay();

  document.getElementById('checkBtn').classList.add('hidden');
  document.getElementById('nextBtn').classList.remove('hidden');
  if(Q.index >= Q.questions.length-1)
    document.getElementById('nextBtn').textContent = '🏁 Xem kết quả';
  else
    document.getElementById('nextBtn').textContent = 'Câu tiếp →';
}

function normalizeAnswer(s){
  if(s==null) return '';
  return s.trim().toLowerCase()
    .replace(/\\sqrt\{/g, 'sqrt(').replace(/\}/g, ')')
    .replace(/√/g, 'sqrt')
    .replace(/π/g, 'pi').replace(/∞/g, 'inf')
    .replace(/\s+/g, '')
    .replace(/\[/g,'(').replace(/\]/g,')')
    .replace(/\{/g,'(').replace(/\}/g,')');
}

function nextQuestion(){
  Q.index++;
  if(Q.index >= Q.questions.length){ endQuiz(); return; }
  loadQuestion();
}

function endQuiz(){
  document.getElementById('screen-quiz').classList.add('hidden');
  document.getElementById('screen-result').classList.remove('hidden');

  const total = Q.records.length;
  const correct = Q.records.filter(r => r.correct).length;
  const pct = total > 0 ? Math.round(correct/total*100) : 0;

  document.getElementById('resultEmoji').textContent = pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '💪';
  document.getElementById('resultMsg').textContent = pct >= 80 ? 'Xuất sắc!' : pct >= 50 ? 'Khá tốt! Cố gắng thêm nhé.' : 'Cần ôn lại. Đừng nản!';
  document.getElementById('resultScore').textContent = `${correct}/${total} — ${pct}%`;
  document.getElementById('resultXp').textContent = `⭐ +${S.xp - (loadData().xp||0)} XP`;
  document.getElementById('resultStreak').textContent = `🔥 Streak: ${Q.streak}`;

  // Review
  const list = document.getElementById('reviewList');
  list.innerHTML = '';
  Q.records.forEach((r,i) => {
    const div = document.createElement('div'); div.className = 'review-item';
    div.innerHTML = `<div class="review-q">Câu ${i+1}: ${r.question.stem}</div>
      <div class="review-a"><span class="${r.correct?'ok':'warn'}">${r.correct?'✅ Đúng':'❌ Sai'}</span> — Đáp án: ${r.question.answer}</div>`;
    if(!r.correct && r.question.explain){
      const ex = document.createElement('div'); ex.className = 'review-explain';
      ex.innerHTML = '💡 ' + r.question.explain;
      div.appendChild(ex);
    }
    list.appendChild(div);
  });
  renderMath(document.getElementById('screen-result'));

  if(pct >= 80) soundFanfare();
  if(pct === 100) confetti(100);

  document.getElementById('resultHomeBtn').onclick = () => { renderHome(); };
  document.getElementById('resultRetryBtn').onclick = () => {
    if(Q.isMixed) startMixed(); else startPractice(Q.topic);
  };
}

function updateXPDisplay(){
  document.getElementById('xpDisplay').textContent = `⭐ ${S.xp||0} XP`;
}

// Achievements
function renderAchievements(){
  document.getElementById('screen-home').classList.add('hidden');
  document.getElementById('screen-quiz').classList.add('hidden');
  document.getElementById('screen-result').classList.add('hidden');
  document.getElementById('screen-achievements').classList.remove('hidden');

  const grid = document.getElementById('badgeGrid');
  grid.innerHTML = '';
  APP.achievements.forEach(a => {
    const earned = !!S.badges[a.id];
    const div = document.createElement('div'); div.className = `bcard ${earned?'earned':''}`;
    div.innerHTML = `<div class="bcard-icon">${a.icon}</div>
      <div class="bcard-name">${a.name}</div>
      <div class="bcard-desc">${a.desc}</div>
      <div class="bcard-status">${earned?'✅ Đã đạt':'🔒 Chưa đạt'}</div>`;
    grid.appendChild(div);
  });

  // Activity heatmap (7 days)
  const heat = document.getElementById('activityHeat');
  heat.innerHTML = '<div style="font-weight:600;margin-bottom:8px">Hoạt động 7 ngày qua</div>';
  const days = [];
  for(let i=6;i>=0;i--){
    const d = new Date(); d.setDate(d.getDate()-i);
    const key = d.toISOString().slice(0,10);
    const count = S.activityLog[key]||0;
    const label = ['CN','T2','T3','T4','T5','T6','T7'][d.getDay()];
    const intensity = count === 0 ? 0 : count <= 3 ? 1 : count <= 7 ? 2 : 3;
    days.push({ label, count, intensity });
  }
  const bars = document.createElement('div'); bars.style.cssText = 'display:flex;gap:8px;align-items:flex-end';
  const maxCount = Math.max(...days.map(d=>d.count),1);
  days.forEach(d => {
    const col = document.createElement('div'); col.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:4px;flex:1';
    const bar = document.createElement('div');
    const h = Math.max(4, (d.count/maxCount)*60);
    bar.style.cssText = `width:100%;height:${h}px;border-radius:4px 4px 0 0;background:${['var(--bg-alt)','#6366f1','#4f46e5','#3730a3'][d.intensity]}`;
    col.appendChild(bar);
    const l = document.createElement('div'); l.textContent = d.label; l.style.cssText = 'font-size:11px;color:var(--ink-muted)';
    col.appendChild(l);
    bars.appendChild(col);
  });
  heat.appendChild(bars);

  document.getElementById('achBackBtn').onclick = renderHome;
}

// Init
function initApp(config){
  try {
    Object.assign(APP, config);
    loadState();
    initTheme();
    renderHome();
    document.getElementById('checkBtn').addEventListener('click', () => { checkAnswer(); if(window._postCheck) window._postCheck(); });
    document.getElementById('nextBtn').addEventListener('click', nextQuestion);
    document.getElementById('homeBtn').addEventListener('click', renderHome);
    document.getElementById('themeBtn').addEventListener('click', toggleTheme);
    document.getElementById('soundBtn').addEventListener('click', () => {
      const cur = localStorage.getItem(`toan10_${APP.prefix}_sound`);
      const off = cur === 'off';
      localStorage.setItem(`toan10_${APP.prefix}_sound`, off ? 'on' : 'off');
      document.getElementById('soundBtn').textContent = off ? '🔈' : '🔇';
    });
    if(localStorage.getItem(`toan10_${APP.prefix}_sound`)==='off')
      document.getElementById('soundBtn').textContent = '🔇';
  } catch(e) {
    const log = document.getElementById('debugLog');
    if(log){ log.style.display='block'; log.innerHTML += '<div>initApp ERROR: ' + e.message + ' ' + e.stack + '</div>'; }
    throw e;
  }
}

// Check achievements periodically
function checkAchievements(){ /* run after each question in topic generator */ }
