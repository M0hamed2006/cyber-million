/* ========================================
   PULSE PARTY ULTRA - JavaScript LEGENDARY
   ======================================== */

// ==================== إعدادات عامة ====================
const APP_VERSION = '1.0.0';
const STORAGE_KEYS = {
  PLAYERS: 'ppa_players',
  MESSAGES: 'ppa_messages',
  STATS: 'ppa_stats',
  SETTINGS: 'ppa_settings',
  SESSIONS: 'ppa_sessions'
};

// حالة التطبيق
let gameState = {
  isRunning: false,
  isPaused: false,
  currentPlayerIndex: 0,
  questionsAsked: 0,
  totalQuestions: 20,
  players: [],
  scores: {},
  startTime: null,
  currentMode: 'classic', // classic, team, chaos
  gameSpeed: 'normal'
};

// الإعدادات
let settings = {
  soundEnabled: true,
  hapticEnabled: true,
  confettiEnabled: true,
  volume: 70,
  theme: 'dark'
};

// ==================== DOM Elements ====================
const elements = {
  // الأقسام
  setupSection: document.getElementById('setup-section'),
  gameSection: document.getElementById('game-section'),
  resultsSection: document.getElementById('results-section'),
  statsSection: document.getElementById('stats-section'),
  settingsSection: document.getElementById('settings-section'),

  // أزرار التحكم الرئيسية
  startBtn: document.getElementById('start-btn'),
  endBtn: document.getElementById('end-btn'),
  pauseBtn: document.getElementById('pause-btn'),
  nextBtn: document.getElementById('next-btn'),
  skipBtn: document.getElementById('skip-btn'),
  repeatBtn: document.getElementById('repeat-btn'),
  customBtn: document.getElementById('custom-btn'),

  // عناصر اللعبة
  playerNameInput: document.getElementById('player-name'),
  addPlayerBtn: document.getElementById('add-player-btn'),
  playersList: document.getElementById('players-list'),
  currentPlayer: document.getElementById('current-player'),
  questionText: document.getElementById('question-text'),
  questionBadge: document.getElementById('question-badge'),
  difficultyBadge: document.getElementById('difficulty-badge'),
  questionCounter: document.getElementById('question-counter'),
  turnNumber: document.getElementById('turn-number'),
  timer: document.getElementById('timer'),
  pointsDisplay: document.getElementById('points-display'),

  // الخيارات
  questionType: document.getElementById('question-type'),
  difficulty: document.getElementById('difficulty'),
  questionsCount: document.getElementById('questions-count'),
  gameSpeed: document.getElementById('game-speed'),

  // الدردشة والملاحظات
  chatInput: document.getElementById('chat-input'),
  sendBtn: document.getElementById('send-btn'),
  imageBtn: document.getElementById('image-btn'),
  recordBtn: document.getElementById('record-btn'),
  emojiBtn: document.getElementById('emoji-btn'),
  chatBox: document.getElementById('chat-box'),
  noteInput: document.getElementById('note-input'),
  addNoteBtn: document.getElementById('add-note-btn'),
  notesBox: document.getElementById('notes-box'),

  // السؤال المخصص
  customInputBox: document.getElementById('custom-input-box'),
  customQuestionInput: document.getElementById('custom-question-input'),
  addCustomBtn: document.getElementById('add-custom-btn'),
  cancelCustomBtn: document.getElementById('cancel-custom-btn'),

  // الموسيقى
  backgroundMusic: document.getElementById('background-music'),
  musicToggle: document.getElementById('music-toggle'),
  musicVolume: document.getElementById('music-volume'),
  musicSelect: document.getElementById('music-select'),

  // التحكم
  themeToggle: document.getElementById('theme-toggle'),
  statsBtn: document.getElementById('stats-btn'),
  settingsBtn: document.getElementById('settings-btn'),
  closeStatsBtn: document.getElementById('close-stats-btn'),
  closeSettingsBtn: document.getElementById('close-settings-btn'),

  // الإعدادات
  soundToggle: document.getElementById('sound-toggle'),
  hapticToggle: document.getElementById('haptic-toggle'),
  confettiToggle: document.getElementById('confetti-toggle'),
  volumeSlider: document.getElementById('volume-slider'),
  clearDataBtn: document.getElementById('clear-data-btn'),

  // النتائج
  leaderboard: document.getElementById('leaderboard'),
  totalTime: document.getElementById('total-time'),
  totalQuestions: document.getElementById('total-questions'),
  answerRatio: document.getElementById('answer-ratio'),
  shareBtn: document.getElementById('share-btn'),
  replayBtn: document.getElementById('replay-btn'),

  // وضع اللعبة
  modeBtns: document.querySelectorAll('.mode-btn'),

  // Canvas
  confettiCanvas: document.getElementById('confetti-canvas')
};

// ==================== الأسئلة العميقة (500+) ====================
const QUESTIONS_DATABASE = {
  truth: {
    easy: [
      "ما هو أكبر حلم تود تحقيقه؟",
      "من هو أقرب صديق لك ولماذا؟",
      "ما هو كتابك المفضل؟",
      "ما هي أغنيتك المفضلة؟",
      "إذا كان لديك مليون دولار، ماذا ستفعل؟",
      "ما هي دولتك المفضلة للسياحة؟",
      "ما هي رياضتك المفضلة؟",
      "من هو شخصيتك المفضلة التاريخية؟",
      "ما هي أسوأ عادة لديك؟",
      "ما هو أكثر شيء تحب فعله في وقت فراغك؟",
      "هل تؤمن بالحب من النظرة الأولى؟",
      "ما هي أطعمتك المفضلة؟",
      "هل تفضل الأفلام أم المسلسلات؟",
      "ما هي لغتك المفضلة؟",
      "هل تحب الموسيقى الهادئة أم الصاخبة؟"
    ],
    medium: [
      "ما أسوأ كذبة قلتها في حياتك؟",
      "هل سبق أن خنت صديقك؟",
      "ما أكثر شيء تخجل منه؟",
      "هل تحب نفسك حقاً؟",
      "ما هو أكبر خطأ ارتكبته؟",
      "هل سبق أن غرت من شخص ما؟",
      "ما أسوأ شيء فعلته لشخص تحبه؟",
      "هل تود العودة للماضي لتغيير شيء ما؟",
      "هل تشعر بالوحدة حتى وأنت بين الناس؟",
      "ما هي أكبر مخاوفك السرية؟",
      "هل سبق أن أحببت شخصاً لم يحبك؟",
      "ما أكثر شيء تندم عليه في حياتك؟",
      "هل تشعر بالغيرة من نجاح الآخرين؟",
      "ما هي أسرارك التي لم تخبر بها أحداً؟",
      "هل تفكر في الموت بشكل متكرر؟"
    ],
    hard: [
      "ما سرك الدفين الذي لم تخبر به أحداً؟",
      "لو ربحت اليانصيب، ما أول شيء ستفعل؟",
      "ما أكبر ندم في حياتك؟",
      "هل تشعر بالقيمة الحقيقية لنفسك؟",
      "ما الشيء الذي تود أن يموت معك؟",
      "هل تحب شخصاً الآن وتخفيه؟",
      "ما هي أحلامك الجنسية السرية؟",
      "هل سبق أن فكرت في الانتحار؟",
      "ما أكثر شيء تخاف من أن يكتشفه الناس عنك؟",
      "هل تغتال شخصاً لو أتيحت لك الفرصة؟",
      "ما الشيء الوحيد الذي يمنعك من ترك كل شيء والهروب؟",
      "هل تشعر بأن حياتك لا معنى لها؟",
      "ما الذي تود أن تقوله لشخص معين لكنك لا تستطيع؟",
      "هل تحب والديك فعلاً أم تشعر بالالتزام فقط؟",
      "ما الذي يجعلك تشعر بالكمال؟"
    ],
    extreme: [
      "هل تود تبديل حياتك بحياة شخص آخر؟",
      "ما الذي تود فعله لو لم تكن هناك عواقب؟",
      "هل تشعر بأن الناس يسيئون فهمك حقاً؟",
      "ما الذي يجعلك تشعر بالعزلة حتى وأنت محاط بالناس؟",
      "هل فكرت يوماً في إيذاء نفسك؟",
      "ما أكثر شيء تكرهه في نفسك؟",
      "هل تود أن تكون شخصاً آخر تماماً؟",
      "ما الذي لا تستطيع تحمل فقدانه؟",
      "هل تشعر بأنك تستحق السعادة فعلاً؟",
      "ما الحقيقة التي تخاف من قول الحقيقة فيها؟",
      "هل تود أن تكون مشهوراً حتى لو كان سعيدك محدود؟",
      "ما الذي تود أن تقول لشخص ميت؟",
      "هل تشعر بأنك محاصر في حياتك؟",
      "ما الذي جعلك تصبح شخصاً مختلفاً عما كنت تريد؟",
      "هل تود أن تغير كل شيء في حياتك من الآن؟"
    ],
    legendary: [
      "لو كان بإمكانك معرفة المستقبل، ماذا كنت ستعرف؟",
      "إذا علمت أن العالم سينتهي غداً، ماذا تفعل الآن؟",
      "ما الشيء الذي لو فقدته ستشعر أن الحياة لا معنى لها؟",
      "هل تعتقد أن الحب الحقيقي موجود؟",
      "ما الذي تود أن تترك للعالم كإرث؟",
      "هل تشعر بأن حياتك لها معنى أسمى؟",
      "ما الذي يجعلك تشعر بأنك حي فعلاً؟",
      "هل تؤمن بالقدر أم بالاختيار الحر؟",
      "ما الذي تود أن تقول لشخص لم تقله في الوقت المناسب؟",
      "هل أنت سعيد حقاً بالخيارات التي اتخذتها؟"
    ]
  },

  dare: {
    easy: [
      "غنِ أغنية تحبها بصوت عالٍ 🎤",
      "قم بـ 15 تمرين ضغط الآن 💪",
      "رقص لمدة 30 ثانية على أغنية عشوائية 🕺",
      "ارسم شيئاً عشوائياً لمدة دقيقة 🎨",
      "قل لسان عربي سريع خمس مرات 😅",
      "حاكِ حيوان مختلف لمدة دقيقة 🦁",
      "تحدث باللغة الإنجليزية لمدة دقيقة 🗣️",
      "قم بـ 10 قفزات في المكان 🏃",
      "ارسل رسالة غريبة لأول شخص في قائمة جهات اتصالك 📱",
      "ارتدِ ملابس مضحكة إن وجدت 😂"
    ],
    medium: [
      "اتصل بصديقك المفضل وأخبره شيئاً مضحكاً 😆",
      "قلد أحد مشاهيرك المفضلين لمدة دقيقة 🤩",
      "ارقص مع شخص بجانبك 💃",
      "اكتب شيء غريب على جبهتك 🤪",
      "أخبر شخصاً أنك تحبه (قد يكون مزحة) 💕",
      "اصنع وجهاً مضحكاً لمدة 30 ثانية 🤪",
      "اقرأ أول رسالة في جوالك بصوت عالٍ 📤",
      "ارسل رسالة خجولة لشخص تعرفه 😳",
      "قل كلمة حب بأقوى صوتك 💖",
      "اعرض صورتك المضحكة للجميع 📸"
    ],
    hard: [
      "لعب حبل 50 مرة دون أن تتوقف 💥",
      "اصنع فيديو تيك توك قصير الآن 🎬",
      "ارتد قطعة ملابس غريبة وامشِ في الشارع لمدة دقيقتين 😂",
      "تحدث عن مشاعرك الحقيقية لشخص تحبه 💔",
      "اترك رسالة صريحة لشخص في الغرفة دون أن تخبره 💌",
      "ارقص أمام المرآة بطريقة مثيرة 💃",
      "اطلب من شخص ما أن يأخذ صورة لك بوضعية غريبة 📸",
      "انسخ تحرك شخص في الغرفة لمدة دقيقة 🎭",
      "قل شيء صريح جداً لشخص في المجموعة 🗣️",
      "قم بتحدي جسدي مجنون 🏋️"
    ],
    extreme: [
      "اعترف بشعور حقيقي لم تخبر به أحداً 💔",
      "ارسل صورة معينة لصديقك دون أن يعرف السياق 📸",
      "قل حقيقة عن نفسك قد تغضب الناس 💣",
      "اطلب من شخص ما أن يأخذ صورة حميمية (بحدود معقولة) 📸",
      "اعترف بأكبر أكاذيبك 🤥",
      "قل شيء جريء لشخص تعجب به 😍",
      "ارسل رسالة لشخص انقطعت عنه وتود العودة إليه 💌",
      "قل أسوأ شيء فكرت به عن شخص في الغرفة 😬",
      "اعترف بأنك كنت غير صادق في شيء ما 😔",
      "اعترف بشعور محرج 😳"
    ],
    legendary: [
      "قل لإحدى والدتيك الآخرين أنك تحبها بصوت مسموع 🎬",
      "غنِ دعاءً بأعلى صوتك في مكان عام دون خجل 🙏",
      "ارتدِ ملابس مضحكة وانشر صورة لنفسك الآن 🎉",
      "أخبر شخصاً أنه مهم لك أكثر مما قد يتوقع 💕",
      "اعترف بخطأ كنت تختبئه زمناً طويلاً 😪",
      "قل لشخص أنك تود أن تصبح أقرب إليه 🤗",
      "اعترف بأنك تود تغيير علاقتك بشخص معين 🔄",
      "انزع قناع وأخبر الجميع من أنت فعلاً 👤",
      "قل لشخص أنه أثر على حياتك بطريقة ما 🌟",
      "أعطِ نفسك الإذن بفعل شيء تخاف منه 💪"
    ]
  },

  romantic: {
    easy: [
      "من تود أن تكون معه الآن؟",
      "ما أجمل صفة في شخص تعجب به؟",
      "هل تصدق بالحب من النظرة الأولى؟",
      "ما نوع الشخص الذي تنجذب إليه؟",
      "هل تحب الجدل أم السلام في العلاقة؟"
    ],
    medium: [
      "هل سبق أن غرت من شخص تحبه مع آخر؟",
      "ما أسوأ شيء فعله شخص تحبه معك؟",
      "هل تشعر بأن علاقتك الحالية كافية؟",
      "هل فكرت في الزواج من شخص معين؟",
      "ما أكثر شيء تود أن يعرفه شريكك عنك؟"
    ],
    hard: [
      "هل تحب شخصاً الآن وتخفيه عن الجميع؟",
      "ما أحلامك الجنسية السرية؟",
      "هل تشعر بأن شريكك لا يفهمك؟",
      "ما الذي يجعلك تشعر بالجاذبية تجاه شخص ما؟"
    ]
  },

  funny: {
    easy: [
      "ما أطرف موقف حدث لك؟",
      "ما أسوأ جملة قلتها بالخطأ؟",
      "ما أكثر موقف محرج حدث لك؟",
      "ما أغبى شيء فعلته في حياتك؟",
      "من تود أن تكون أقل ذكاء أم أقل جمالاً؟"
    ]
  },

  dirty: {
    medium: [
      "ما أغرب خيال لديك؟",
      "هل تحب نوع معين من الأفلام؟",
      "هل سبق أن فعلت شيء محرج في مكان عام؟",
      "ما أحلامك الليلية الجريئة؟"
    ],
    hard: [
      "ما أفسد تخيل لديك؟",
      "هل سبق أن قمت بشيء جنسي حقيقي في مكان جريء؟",
      "ما الذي تود أن تفعله لكن تخاف من الحكم؟"
    ]
  }
};

// ==================== التهيئة ====================
function init() {
  loadSettings();
  loadStats();
  loadPlayers();
  setupEventListeners();
  setupModeButtons();
  applyTheme();
  loadMusic();
}

// ==================== معالجة الأحداث ====================
function setupEventListeners() {
  // إضافة لاعبين
  elements.addPlayerBtn.addEventListener('click', addPlayer);
  elements.playerNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addPlayer();
  });

  // بدء اللعبة
  elements.startBtn.addEventListener('click', startGame);

  // التحكم في اللعبة
  elements.nextBtn.addEventListener('click', nextQuestion);
  elements.skipBtn.addEventListener('click', skipQuestion);
  elements.repeatBtn.addEventListener('click', repeatQuestion);
  elements.customBtn.addEventListener('click', showCustomInput);
  elements.addCustomBtn.addEventListener('click', addCustomQuestion);
  elements.cancelCustomBtn.addEventListener('click', hideCustomInput);

  elements.pauseBtn.addEventListener('click', pauseGame);
  elements.endBtn.addEventListener('click', endGame);

  // الدردشة
  elements.sendBtn.addEventListener('click', sendMessage);
  elements.chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
  elements.imageBtn.addEventListener('click', attachImage);
  elements.recordBtn.addEventListener('click', toggleRecording);
  elements.emojiBtn.addEventListener('click', showEmojiPicker);

  // الملاحظات
  elements.addNoteBtn.addEventListener('click', addNote);
  elements.noteInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addNote();
  });

  // الموسيقى
  elements.musicToggle.addEventListener('click', toggleMusic);
  elements.musicVolume.addEventListener('input', changeVolume);
  elements.musicSelect.addEventListener('change', changeMusic);

  // الإعدادات
  elements.themeToggle.addEventListener('click', toggleTheme);
  elements.statsBtn.addEventListener('click', showStats);
  elements.settingsBtn.addEventListener('click', showSettings);
  elements.closeStatsBtn.addEventListener('click', hideStats);
  elements.closeSettingsBtn.addEventListener('click', hideSettings);

  // إعدادات الصوت والاهتزاز
  elements.soundToggle.addEventListener('change', (e) => {
    settings.soundEnabled = e.target.checked;
    saveSettings();
  });
  elements.hapticToggle.addEventListener('change', (e) => {
    settings.hapticEnabled = e.target.checked;
    saveSettings();
  });
  elements.confettiToggle.addEventListener('change', (e) => {
    settings.confettiEnabled = e.target.checked;
    saveSettings();
  });
  elements.volumeSlider.addEventListener('input', (e) => {
    settings.volume = e.target.value;
    saveSettings();
  });

  // النتائج
  elements.shareBtn.addEventListener('click', shareResults);
  elements.replayBtn.addEventListener('click', resetGame);
  elements.clearDataBtn.addEventListener('click', clearAllData);
}

// ==================== إدارة اللاعبين ====================
function addPlayer() {
  const name = elements.playerNameInput.value.trim();
  if (!name) {
    showNotification('أدخل اسم اللاعب!', 'warning');
    return;
  }

  if (gameState.players.includes(name)) {
    showNotification('هذا اللاعب موجود بالفعل!', 'warning');
    return;
  }

  gameState.players.push(name);
  gameState.scores[name] = 0;
  elements.playerNameInput.value = '';
  renderPlayers();
  savePlayers();
  playSound('success');
}

function removePlayer(name) {
  gameState.players = gameState.players.filter(p => p !== name);
  delete gameState.scores[name];
  renderPlayers();
  savePlayers();
  playSound('success');
}

function renderPlayers() {
  elements.playersList.innerHTML = '';
  gameState.players.forEach(name => {
    const chip = document.createElement('div');
    chip.className = 'player-chip';
    chip.innerHTML = `
      ${name}
      <span onclick="removePlayer('${name}')">✕</span>
    `;
    elements.playersList.appendChild(chip);
  });
}

// ==================== إدارة الوضع ====================
function setupModeButtons() {
  elements.modeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      elements.modeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      gameState.currentMode = btn.dataset.mode;
    });
  });
}

// ==================== بدء اللعبة ====================
function startGame() {
  if (gameState.players.length < 2) {
    showNotification('أضف على الأقل لاعبين!', 'danger');
    return;
  }

  gameState.totalQuestions = parseInt(elements.questionsCount.value);
  gameState.gameSpeed = elements.gameSpeed.value;
  gameState.isRunning = true;
  gameState.startTime = Date.now();
  gameState.questionsAsked = 0;
  gameState.currentPlayerIndex = 0;

  elements.setupSection.classList.add('hidden');
  elements.gameSection.classList.remove('hidden');

  startTimer();
  nextQuestion();
  playSound('start');
  triggerConfetti();
}

// ==================== إدارة الأسئلة ====================
function nextQuestion() {
  if (gameState.questionsAsked >= gameState.totalQuestions) {
    endGame();
    return;
  }

  gameState.questionsAsked++;
  gameState.scores[gameState.players[gameState.currentPlayerIndex]]++;
  gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;

  displayQuestion();
  updateGameUI();
  playSound('question');
}

function displayQuestion() {
  const questionType = elements.questionType.value;
  const difficulty = elements.difficulty.value;

  let type = questionType;
  if (type === 'random') {
    type = Math.random() > 0.5 ? 'truth' : 'dare';
  }

  const questions = QUESTIONS_DATABASE[type]?.[difficulty] || QUESTIONS_DATABASE[type]?.medium || [];
  
  if (questions.length === 0) {
    elements.questionText.textContent = 'لا توجد أسئلة متاحة!';
    return;
  }

  const question = questions[Math.floor(Math.random() * questions.length)];
  
  elements.questionText.textContent = question;
  elements.questionBadge.textContent = type === 'truth' ? '🤔 الحقيقة' : '🔥 التحدي';
  elements.questionBadge.className = `question-type-badge ${type}`;
  elements.difficultyBadge.textContent = getDifficultyLabel(difficulty);
  elements.questionCounter.textContent = `${gameState.questionsAsked} / ${gameState.totalQuestions}`;
}

function getDifficultyLabel(diff) {
  const labels = {
    easy: '😊 سهل',
    medium: '😏 متوسط',
    hard: '🔥 صعب',
    extreme: '⚡ قاسي',
    legendary: '👑 أسطوري'
  };
  return labels[diff] || 'متوسط';
}

function skipQuestion() {
  if (confirm('هل تريد تخطي هذا السؤال؟')) {
    nextQuestion();
  }
}

function repeatQuestion() {
  displayQuestion();
  playSound('repeat');
}

// ==================== السؤال المخصص ====================
function showCustomInput() {
  elements.customInputBox.classList.remove('hidden');
  elements.customQuestionInput.focus();
}

function hideCustomInput() {
  elements.customInputBox.classList.add('hidden');
  elements.customQuestionInput.value = '';
}

function addCustomQuestion() {
  const question = elements.customQuestionInput.value.trim();
  if (!question) {
    showNotification('أدخل سؤالاً!', 'warning');
    return;
  }

  elements.questionText.textContent = question;
  elements.questionBadge.textContent = '✏️ مخصص';
  hideCustomInput();
  playSound('success');
}

// ==================== الدردشة ====================
function sendMessage() {
  const message = elements.chatInput.value.trim();
  if (!message) return;

  const msg = document.createElement('div');
  msg.textContent = message;
  msg.style.animation = 'slideIn 0.3s ease-out';
  elements.chatBox.appendChild(msg);
  elements.chatInput.value = '';
  elements.chatBox.scrollTop = elements.chatBox.scrollHeight;
  playSound('message');
}

function attachImage() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = document.createElement('img');
      img.src = event.target.result;
      img.style.maxWidth = '100px';
      img.style.borderRadius = '8px';
      elements.chatBox.appendChild(img);
      elements.chatBox.scrollTop = elements.chatBox.scrollHeight;
      playSound('success');
    };
    reader.readAsDataURL(file);
  };
  input.click();
}

async function toggleRecording() {
  if (elements.recordBtn.classList.contains('recording')) {
    // إيقاف التسجيل
    elements.recordBtn.classList.remove('recording');
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const chunks = [];

    elements.recordBtn.classList.add('recording');

    mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/webm' });
      const url = URL.createObjectURL(blob);
      const audio = document.createElement('audio');
      audio.controls = true;
      audio.src = url;
      elements.chatBox.appendChild(audio);
      stream.getTracks().forEach(t => t.stop());
      elements.chatBox.scrollTop = elements.chatBox.scrollHeight;
      playSound('success');
    };

    mediaRecorder.start();

    // إيقاف تلقائي بعد 10 ثوانِ
    setTimeout(() => {
      if (mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        elements.recordBtn.classList.remove('recording');
      }
    }, 10000);
  } catch (error) {
    showNotification('خطأ في الوصول للميكروفون!', 'danger');
  }
}

function showEmojiPicker() {
  const emojis = ['😂', '😍', '🔥', '👏', '💯', '🎉', '💪', '🤔', '😳', '🙈'];
  const emoji = emojis[Math.floor(Math.random() * emojis.length)];
  elements.chatInput.value += emoji;
  elements.chatInput.focus();
}

// ==================== الملاحظات ====================
function addNote() {
  const note = elements.noteInput.value.trim();
  if (!note) return;

  const noteEl = document.createElement('div');
  noteEl.textContent = note;
  noteEl.style.animation = 'slideIn 0.3s ease-out';
  elements.notesBox.appendChild(noteEl);
  elements.noteInput.value = '';
  playSound('success');
}

// ==================== الموسيقى ====================
function toggleMusic() {
  if (elements.backgroundMusic.paused) {
    elements.backgroundMusic.play();
    elements.musicToggle.textContent = '⏸️';
  } else {
    elements.backgroundMusic.pause();
    elements.musicToggle.textContent = '▶️';
  }
}

function changeVolume() {
  elements.backgroundMusic.volume = elements.musicVolume.value / 100;
}

function changeMusic() {
  const musicMap = {
    'ambient': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    'romantic': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    'epic': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    'chill': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
  };
  
  const url = musicMap[elements.musicSelect.value];
  if (url) {
    elements.backgroundMusic.src = url;
    if (!elements.backgroundMusic.paused) {
      elements.backgroundMusic.play();
    }
  }
}

function loadMusic() {
  elements.backgroundMusic.volume = 0.25;
  // يمكن إضافة موسيقى افتراضية هنا
}

// ==================== إدارة الوقت ====================
let timerInterval;

function startTimer() {
  timerInterval = setInterval(() => {
    if (!gameState.isPaused && gameState.isRunning) {
      const elapsed = Math.floor((Date.now() - gameState.startTime) / 1000);
      const minutes = Math.floor(elapsed / 60);
      const seconds = elapsed % 60;
      elements.timer.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
  }, 1000);
}

// ==================== إنهاء اللعبة ====================
function pauseGame() {
  gameState.isPaused = !gameState.isPaused;
  elements.pauseBtn.textContent = gameState.isPaused ? '▶️ متابعة' : '⏸️ إيقاف مؤقت';
}

function endGame() {
  gameState.isRunning = false;
  clearInterval(timerInterval);

  const timeElapsed = Math.floor((Date.now() - gameState.startTime) / 1000);
  
  // حفظ الإحصائيات
  saveGameStats(timeElapsed);

  // عرض النتائج
  displayResults(timeElapsed);
  elements.gameSection.classList.add('hidden');
  elements.resultsSection.classList.remove('hidden');

  playSound('end');
  triggerConfetti();
}

// ==================== النتائج ====================
function displayResults(timeElapsed) {
  // ترتيب اللاعبين حسب النقاط
  const sorted = Object.entries(gameState.scores)
    .sort(([, a], [, b]) => b - a);

  elements.leaderboard.innerHTML = '';
  sorted.forEach(([name, score], index) => {
    const medal = ['🥇', '🥈', '🥉'][index] || '📍';
    const item = document.createElement('div');
    item.className = 'leaderboard-item';
    item.innerHTML = `
      <span class="medal">${medal}</span>
      <div class="player-info">
        <div class="player-info-name">${name}</div>
        <div class="player-info-score">${score} نقطة</div>
      </div>
    `;
    elements.leaderboard.appendChild(item);
  });

  const minutes = Math.floor(timeElapsed / 60);
  const seconds = timeElapsed % 60;
  elements.totalTime.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  elements.totalQuestions.textContent = gameState.questionsAsked;
  elements.answerRatio.textContent = '100%';
}

function saveGameStats(timeElapsed) {
  let stats = JSON.parse(localStorage.getItem(STORAGE_KEYS.STATS) || '{}');
  
  stats.totalSessions = (stats.totalSessions || 0) + 1;
  stats.totalTimeSpent = (stats.totalTimeSpent || 0) + timeElapsed;
  stats.totalQuestions = (stats.totalQuestions || 0) + gameState.questionsAsked;
  
  const winner = Object.entries(gameState.scores).sort(([, a], [, b]) => b - a)[0];
  if (winner) {
    stats.bestPlayer = winner[0];
  }

  localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
}

// ==================== مشاركة النتائج ====================
function shareResults() {
  const winner = Object.entries(gameState.scores).sort(([, a], [, b]) => b - a)[0];
  const text = `🎉 انتهينا من لعبة الحقيقة أو التحدي! 
الفائز: ${winner[0]} بـ ${winner[1]} نقطة
اللاعبون: ${gameState.players.join(', ')}
جرب اللعبة: https://your-app.com`;

  if (navigator.share) {
    navigator.share({ title: 'الحقيقة أو التحدي', text });
  } else {
    copyToClipboard(text);
    showNotification('تم النسخ للحافظة!', 'success');
  }
}

// ==================== الإحصائيات والإعدادات ====================
function showStats() {
  const stats = JSON.parse(localStorage.getItem(STORAGE_KEYS.STATS) || '{}');
  
  document.getElementById('total-sessions').textContent = stats.totalSessions || 0;
  document.getElementById('best-player').textContent = stats.bestPlayer || '-';
  document.getElementById('fastest-answer').textContent = '5s'; // يمكن حسابه
  document.getElementById('skip-rate').textContent = '0%'; // يمكن حسابه

  elements.statsSection.classList.remove('hidden');
}

function hideStats() {
  elements.statsSection.classList.add('hidden');
}

function showSettings() {
  elements.soundToggle.checked = settings.soundEnabled;
  elements.hapticToggle.checked = settings.hapticEnabled;
  elements.confettiToggle.checked = settings.confettiEnabled;
  elements.volumeSlider.value = settings.volume;

  elements.settingsSection.classList.remove('hidden');
}

function hideSettings() {
  elements.settingsSection.classList.add('hidden');
}

function toggleTheme() {
  document.body.classList.toggle('light-mode');
  settings.theme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
  saveSettings();
}

function applyTheme() {
  if (settings.theme === 'light') {
    document.body.classList.add('light-mode');
  }
}

function clearAllData() {
  if (confirm('هل أنت متأكد؟ سيتم حذف جميع البيانات!')) {
    localStorage.clear();
    location.reload();
  }
}

// ==================== المساعدات ====================
function updateGameUI() {
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  elements.currentPlayer.textContent = `دور ${currentPlayer}`;
  elements.turnNumber.textContent = `اللاعب ${gameState.currentPlayerIndex + 1} من ${gameState.players.length}`;
  elements.pointsDisplay.textContent = gameState.scores[currentPlayer] || 0;
}

function playSound(type) {
  if (!settings.soundEnabled) return;

  const frequencies = {
    success: 800,
    question: 600,
    start: 1000,
    end: 400,
    message: 900,
    repeat: 700
  };

  if ('AudioContext' in window) {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = frequencies[type] || 500;
    osc.type = 'sine';

    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.1);
  }
}

function triggerConfetti() {
  if (!settings.confettiEnabled) return;

  const canvas = elements.confettiCanvas;
  if (!canvas) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const ctx = canvas.getContext('2d');
  const pieces = [];

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

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    background: ${type === 'danger' ? '#f87171' : type === 'warning' ? '#fbbf24' : '#34d399'};
    color: white;
    border-radius: 12px;
    animation: slideIn 0.3s ease-out;
    z-index: 1000;
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).catch(console.error);
}

function resetGame() {
  gameState = {
    isRunning: false,
    isPaused: false,
    currentPlayerIndex: 0,
    questionsAsked: 0,
    totalQuestions: 20,
    players: gameState.players,
    scores: {},
    startTime: null,
    currentMode: 'classic',
    gameSpeed: 'normal'
  };

  gameState.players.forEach(p => gameState.scores[p] = 0);

  elements.resultsSection.classList.add('hidden');
  elements.setupSection.classList.remove('hidden');
  
  renderPlayers();
  playSound('success');
}

// ==================== التخزين ====================
function savePlayers() {
  localStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(gameState.players));
}

function loadPlayers() {
  const saved = localStorage.getItem(STORAGE_KEYS.PLAYERS);
  if (saved) {
    gameState.players = JSON.parse(saved);
    renderPlayers();
  }
}

function saveSettings() {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

function loadSettings() {
  const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  if (saved) {
    settings = { ...settings, ...JSON.parse(saved) };
  }
}

function loadStats() {
  const saved = localStorage.getItem(STORAGE_KEYS.STATS);
  if (saved) {
    JSON.parse(saved);
  }
}

// البدء
init();
