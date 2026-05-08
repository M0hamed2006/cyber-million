/* ============================================
   PULSE PARTY ULTRA - PRO EDITION
   main.js - الملف الأساسي للوظائف
   ============================================ */

// ==================== إعدادات عامة ====================
const APP_CONFIG = {
  VERSION: '2.0.0 PRO',
  STORAGE_PREFIX: 'ppa_',
  MAX_PLAYERS: 20,
  MIN_PLAYERS: 2,
  QUESTION_LIMIT: 500,
  GAME_SPEED: {
    slow: 3000,
    normal: 2000,
    fast: 1000,
    crazy: 500
  }
};

// ==================== State Management ====================
const gameState = {
  isRunning: false,
  isPaused: false,
  currentPlayerIndex: 0,
  questionsAsked: 0,
  totalQuestions: 20,
  players: [],
  scores: {},
  teamScores: {},
  startTime: null,
  currentMode: 'classic',
  gameSpeed: 'normal',
  currentQuestion: null,
  usedQuestions: new Set(),
  chatMessages: [],
  notes: [],
  recordings: [],
  sessionStats: {
    totalTime: 0,
    averageAnswerTime: 0,
    skippedCount: 0
  }
};

// ==================== Settings ====================
const settings = {
  soundEnabled: true,
  hapticEnabled: true,
  confettiEnabled: true,
  volume: 25,
  theme: 'dark',
  musicTrack: 'blindlove',
  notifications: true
};

// ==================== DOM Elements ====================
const DOM = {
  // الأقسام الرئيسية
  setupSection: document.getElementById('setup-section'),
  gameSection: document.getElementById('game-section'),
  resultsSection: document.getElementById('results-section'),

  // زر البداية والتحكم
  playerNameInput: document.getElementById('player-name'),
  addPlayerBtn: document.getElementById('add-player-btn'),
  startBtn: document.getElementById('start-btn'),
  playersList: document.getElementById('players-list'),

  // خيارات اللعبة
  questionType: document.getElementById('question-type'),
  difficulty: document.getElementById('difficulty'),
  questionsCount: document.getElementById('questions-count'),
  gameSpeed: document.getElementById('game-speed'),

  // الموسيقى
  backgroundMusic: document.getElementById('background-music'),
  musicToggle: document.getElementById('music-toggle'),
  musicVolume: document.getElementById('music-volume'),
  backgroundSelect: document.getElementById('background-select'),

  // وضع اللعبة
  modeBtns: document.querySelectorAll('.mode-btn'),

  // Canvas للتأثيرات
  confettiCanvas: document.getElementById('confetti-canvas')
};

// ==================== التهيئة ====================
function init() {
  console.log('🚀 تهيئة التطبيق...');
  
  loadSettings();
  setupEventListeners();
  setupModeButtons();
  applyTheme();
  loadPlayers();
  setupMusicPlayer();
  
  console.log('✅ تم التهيئة بنجاح!');
}

// ==================== معالجات الأحداث ====================
function setupEventListeners() {
  // إضافة لاعبين
  DOM.addPlayerBtn.addEventListener('click', addPlayer);
  DOM.playerNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addPlayer();
  });

  // بدء اللعبة
  DOM.startBtn.addEventListener('click', startGame);

  // الموسيقى
  DOM.musicToggle.addEventListener('click', toggleMusic);
  DOM.musicVolume.addEventListener('input', changeVolume);
  DOM.backgroundSelect.addEventListener('change', changeMusic);
}

// ==================== إدارة اللاعبين ====================
function addPlayer() {
  const name = DOM.playerNameInput.value.trim();
  
  if (!name) {
    showNotification('أدخل اسم اللاعب!', 'warning');
    return;
  }

  if (name.length > 20) {
    showNotification('الاسم طويل جداً!', 'warning');
    return;
  }

  if (gameState.players.includes(name)) {
    showNotification('هذا اللاعب موجود بالفعل!', 'warning');
    return;
  }

  if (gameState.players.length >= APP_CONFIG.MAX_PLAYERS) {
    showNotification(`الحد الأقصى ${APP_CONFIG.MAX_PLAYERS} لاعبين!`, 'warning');
    return;
  }

  gameState.players.push(name);
  gameState.scores[name] = 0;
  gameState.teamScores[name] = { team: '', score: 0 };
  
  DOM.playerNameInput.value = '';
  renderPlayers();
  savePlayers();
  playSound('success');
  
  // Focus input للاعب التالي
  DOM.playerNameInput.focus();
}

function removePlayer(name) {
  gameState.players = gameState.players.filter(p => p !== name);
  delete gameState.scores[name];
  delete gameState.teamScores[name];
  renderPlayers();
  savePlayers();
  playSound('success');
}

function renderPlayers() {
  DOM.playersList.innerHTML = '';
  gameState.players.forEach(name => {
    const chip = document.createElement('div');
    chip.className = 'player-chip';
    chip.innerHTML = `
      <span>${name}</span>
      <span onclick="removePlayer('${name}')" style="cursor: pointer; font-weight: bold;">✕</span>
    `;
    DOM.playersList.appendChild(chip);
  });
}

// ==================== اختيار الوضع ====================
function setupModeButtons() {
  DOM.modeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      DOM.modeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      gameState.currentMode = btn.dataset.mode;
    });
  });
}

// ==================== بدء اللعبة ====================
function startGame() {
  // التحقق من البيانات
  if (gameState.players.length < APP_CONFIG.MIN_PLAYERS) {
    showNotification(`أضف على الأقل ${APP_CONFIG.MIN_PLAYERS} لاعبين!`, 'danger');
    return;
  }

  // الحصول على الإعدادات
  gameState.totalQuestions = parseInt(DOM.questionsCount.value) || 20;
  gameState.gameSpeed = DOM.gameSpeed.value;
  gameState.isRunning = true;
  gameState.startTime = Date.now();
  gameState.questionsAsked = 0;
  gameState.currentPlayerIndex = 0;
  gameState.usedQuestions.clear();

  // إعادة تعيين النقاط
  gameState.players.forEach(p => {
    gameState.scores[p] = 0;
  });

  // إخفاء الإعداد وإظهار اللعبة
  DOM.setupSection.classList.add('hidden');
  DOM.gameSection.classList.remove('hidden');
  DOM.resultsSection.classList.add('hidden');

  // بدء المؤقت
  startTimer();
  displayQuestion();
  playSound('start');
  triggerConfetti();

  console.log('🎮 تم بدء اللعبة!', gameState);
}

// ==================== نظام الأسئلة الذكي ====================
function displayQuestion() {
  let questionType = DOM.questionType.value;
  const difficulty = DOM.difficulty.value;

  // إذا كان عشوائي
  if (questionType === 'random') {
    questionType = Math.random() > 0.5 ? 'truth' : 'dare';
  }

  // الحصول على الأسئلة من قاعدة البيانات
  // سيتم تحميلها من config.js
  const questions = getQuestionsFromDatabase(questionType, difficulty);

  if (!questions || questions.length === 0) {
    console.warn('⚠️ لا توجد أسئلة متاحة!');
    showNotification('لا توجد أسئلة لهذا المستوى!', 'warning');
    return;
  }

  // فلتر الأسئلة المستخدمة
  let availableQuestions = questions.filter(q => !gameState.usedQuestions.has(q));

  // إذا انتهت الأسئلة، أعد تعيينها
  if (availableQuestions.length === 0) {
    gameState.usedQuestions.clear();
    availableQuestions = questions;
  }

  // اختر سؤال عشوائي
  const randomIndex = Math.floor(Math.random() * availableQuestions.length);
  const question = availableQuestions[randomIndex];

  // أضفه للأسئلة المستخدمة
  gameState.usedQuestions.add(question);
  gameState.currentQuestion = question;

  // إظهار السؤال
  updateQuestionDisplay(question, questionType, difficulty);
}

function getQuestionsFromDatabase(type, difficulty) {
  // سيتم تحميل من config.js لاحقاً
  // في الوقت الحالي، سيكون هناك placeholder
  try {
    if (window.QUESTIONS_DATABASE && window.QUESTIONS_DATABASE[type]) {
      return window.QUESTIONS_DATABASE[type][difficulty] || [];
    }
  } catch (e) {
    console.error('❌ خطأ في تحميل الأسئلة:', e);
  }
  return [];
}

function updateQuestionDisplay(question, type, difficulty) {
  // سيتم تطويره لاحقاً عندما نضيف HTML اللعبة
  console.log(`📝 السؤال: ${question}`);
  console.log(`نوع: ${type === 'truth' ? '🤔 الحقيقة' : '🔥 التحدي'}`);
  console.log(`مستوى: ${difficulty}`);
}

// ==================== إدارة الأسئلة ====================
function nextQuestion() {
  if (gameState.questionsAsked >= gameState.totalQuestions) {
    endGame();
    return;
  }

  gameState.questionsAsked++;
  
  // إضافة نقطة للاعب الحالي
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  gameState.scores[currentPlayer]++;

  // الانتقال للاعب التالي
  gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;

  // عرض السؤال التالي
  displayQuestion();
  
  playSound('question');
}

function skipQuestion() {
  gameState.sessionStats.skippedCount++;
  nextQuestion();
  playSound('skip');
}

function repeatQuestion() {
  updateQuestionDisplay(gameState.currentQuestion, DOM.questionType.value, DOM.difficulty.value);
  playSound('repeat');
}

// ==================== المؤقت ====================
let timerInterval;
let elapsedSeconds = 0;

function startTimer() {
  elapsedSeconds = 0;
  timerInterval = setInterval(() => {
    if (!gameState.isPaused && gameState.isRunning) {
      elapsedSeconds++;
      updateTimerDisplay();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  // سيتم تحديث العنصر في HTML لاحقاً
}

function pauseGame() {
  gameState.isPaused = !gameState.isPaused;
  playSound(gameState.isPaused ? 'pause' : 'resume');
}

function endGame() {
  gameState.isRunning = false;
  clearInterval(timerInterval);

  gameState.sessionStats.totalTime = elapsedSeconds;

  // حفظ الإحصائيات
  saveGameSession();

  // عرض النتائج
  displayResults();

  DOM.gameSection.classList.add('hidden');
  DOM.resultsSection.classList.remove('hidden');

  playSound('end');
  triggerConfetti();

  console.log('🏆 انتهت اللعبة!');
}

// ==================== النتائج ====================
function displayResults() {
  // ترتيب اللاعبين حسب النقاط
  const sorted = Object.entries(gameState.scores)
    .sort(([, a], [, b]) => b - a)
    .map(([name, score], index) => ({
      name,
      score,
      position: index + 1,
      medal: ['🥇', '🥈', '🥉'][index] || '📍'
    }));

  console.log('🏆 النتائج النهائية:', sorted);

  // سيتم عرض النتائج في HTML لاحقاً
}

// ==================== الدردشة ====================
function sendMessage(message) {
  if (!message || !message.trim()) return;

  gameState.chatMessages.push({
    text: message,
    timestamp: Date.now(),
    type: 'text'
  });

  saveChat();
  playSound('message');
}

function addNote(note) {
  if (!note || !note.trim()) return;

  gameState.notes.push({
    text: note,
    timestamp: Date.now()
  });

  saveNotes();
  playSound('success');
}

// ==================== تسجيل صوت وفيديو ====================
let mediaRecorder;
let audioChunks = [];

async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];

    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      const audioUrl = URL.createObjectURL(audioBlob);

      gameState.recordings.push({
        url: audioUrl,
        timestamp: Date.now(),
        type: 'audio'
      });

      saveRecordings();
      playSound('success');
      showNotification('تم تسجيل الصوت بنجاح! ✅', 'success');

      // إيقاف الميكروفون
      stream.getTracks().forEach(track => track.stop());
    };

    mediaRecorder.start();
    showNotification('التسجيل جاري... 🎤', 'info');
  } catch (error) {
    console.error('❌ خطأ في الميكروفون:', error);
    showNotification('لا يمكن الوصول إلى الميكروفون!', 'danger');
  }
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
  }
}

async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { width: { ideal: 1280 }, height: { ideal: 720 } }
    });

    console.log('📹 الكاميرا تعمل!');
    showNotification('الكاميرا تعمل! 📹', 'success');

    // يمكن إضافة فيديو stream لاحقاً
    stream.getTracks().forEach(track => track.stop());
  } catch (error) {
    console.error('❌ خطأ في الكاميرا:', error);
    showNotification('لا يمكن الوصول إلى الكاميرا!', 'danger');
  }
}

// ==================== الموسيقى والأصوات ====================
function setupMusicPlayer() {
  const audio = DOM.backgroundMusic;
  
  // تعيين الموسيقى الافتراضية (الحب الأعمى)
  setMusicTrack('blindlove');
  
  // تعيين الصوت الافتراضي
  audio.volume = settings.volume / 100;
}

function toggleMusic() {
  const audio = DOM.backgroundMusic;
  
  if (audio.paused) {
    audio.play().catch(e => console.error('خطأ في التشغيل:', e));
    DOM.musicToggle.textContent = '⏸️';
    playSound('musicStart');
  } else {
    audio.pause();
    DOM.musicToggle.textContent = '▶️';
  }
}

function changeVolume() {
  const volume = DOM.musicVolume.value;
  settings.volume = volume;
  DOM.backgroundMusic.volume = volume / 100;
  saveSettings();
}

function changeMusic() {
  const track = DOM.backgroundSelect.value;
  setMusicTrack(track);
}

function setMusicTrack(track) {
  const musicUrl = getMusicUrl(track);
  
  if (musicUrl) {
    DOM.backgroundMusic.src = musicUrl;
    if (!DOM.backgroundMusic.paused) {
      DOM.backgroundMusic.play().catch(e => console.error(e));
    }
    settings.musicTrack = track;
    saveSettings();
  }
}

function getMusicUrl(track) {
  // سيتم تحميل من config.js
  const musicMap = {
    'blindlove': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    'ocean': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    'forest': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    'sunset': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    'night': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3'
  };

  return musicMap[track] || musicMap['blindlove'];
}

function playSound(type) {
  if (!settings.soundEnabled) return;

  const frequencies = {
    success: 800,
    question: 600,
    start: 1000,
    end: 400,
    message: 900,
    repeat: 700,
    skip: 500,
    pause: 750,
    resume: 750,
    musicStart: 600
  };

  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    const freq = frequencies[type] || 500;
    oscillator.frequency.value = freq;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  } catch (e) {
    console.warn('⚠️ Web Audio API غير متاح');
  }
}

// ==================== تأثيرات بصرية ====================
function triggerConfetti() {
  if (!settings.confettiEnabled) return;

  const canvas = DOM.confettiCanvas;
  if (!canvas) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const ctx = canvas.getContext('2d');
  const pieces = [];

  // إنشاء 100 قطعة كونفيتي
  for (let i = 0; i < 100; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      size: Math.random() * 10 + 5,
      speedX: Math.random() * 8 - 4,
      speedY: Math.random() * 8 + 4,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`
    });
  }

  // رسم الكونفيتي
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    pieces.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.speedY += 0.1;

      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    });

    if (pieces.some(p => p.y < canvas.height)) {
      requestAnimationFrame(animate);
    }
  }

  animate();
}

// ==================== المظهر ====================
function toggleTheme() {
  const isDark = document.body.classList.toggle('light-mode');
  settings.theme = isDark ? 'light' : 'dark';
  saveSettings();
  playSound('success');
}

function applyTheme() {
  if (settings.theme === 'light') {
    document.body.classList.add('light-mode');
  }
}

// ==================== الإخطارات ====================
function showNotification(message, type = 'info') {
  if (!settings.notifications) return;

  const colors = {
    success: '#34d399',
    warning: '#fbbf24',
    danger: '#f87171',
    info: '#60a5fa'
  };

  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    background: ${colors[type]};
    color: white;
    border-radius: 12px;
    font-family: 'Cairo', sans-serif;
    font-weight: 600;
    z-index: 1000;
    animation: slideIn 0.3s ease-out;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  `;

  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// ==================== التخزين المحلي ====================
function savePlayers() {
  const data = JSON.stringify(gameState.players);
  localStorage.setItem(APP_CONFIG.STORAGE_PREFIX + 'players', data);
}

function loadPlayers() {
  const data = localStorage.getItem(APP_CONFIG.STORAGE_PREFIX + 'players');
  if (data) {
    gameState.players = JSON.parse(data);
    renderPlayers();
  }
}

function saveSettings() {
  const data = JSON.stringify(settings);
  localStorage.setItem(APP_CONFIG.STORAGE_PREFIX + 'settings', data);
}

function loadSettings() {
  const data = localStorage.getItem(APP_CONFIG.STORAGE_PREFIX + 'settings');
  if (data) {
    Object.assign(settings, JSON.parse(data));
  }
}

function saveChat() {
  const data = JSON.stringify(gameState.chatMessages);
  localStorage.setItem(APP_CONFIG.STORAGE_PREFIX + 'chat', data);
}

function saveNotes() {
  const data = JSON.stringify(gameState.notes);
  localStorage.setItem(APP_CONFIG.STORAGE_PREFIX + 'notes', data);
}

function saveRecordings() {
  const data = JSON.stringify(gameState.recordings.map(r => ({ ...r, url: null })));
  localStorage.setItem(APP_CONFIG.STORAGE_PREFIX + 'recordings', data);
}

function saveGameSession() {
  const session = {
    players: gameState.players,
    scores: gameState.scores,
    duration: gameState.sessionStats.totalTime,
    questionsAsked: gameState.questionsAsked,
    timestamp: Date.now(),
    mode: gameState.currentMode
  };

  const sessions = JSON.parse(localStorage.getItem(APP_CONFIG.STORAGE_PREFIX + 'sessions') || '[]');
  sessions.push(session);
  localStorage.setItem(APP_CONFIG.STORAGE_PREFIX + 'sessions', JSON.stringify(sessions));
}

// ==================== دوال مساعدة ====================
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

function throttle(func, limit) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      func(...args);
    }
  };
}

// ==================== استدعاء التهيئة ====================
document.addEventListener('DOMContentLoaded', init);

// ==================== التصدير للاستخدام الخارجي ====================
window.gameAPI = {
  addPlayer,
  removePlayer,
  startGame,
  nextQuestion,
  skipQuestion,
  repeatQuestion,
  pauseGame,
  endGame,
  sendMessage,
  addNote,
  startRecording,
  stopRecording,
  startCamera,
  toggleMusic,
  changeVolume,
  changeMusic,
  toggleTheme,
  playSound,
  showNotification
};

console.log('✅ main.js محمّل بنجاح!');
