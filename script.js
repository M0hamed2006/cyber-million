const STORAGE = {
  players: "pulse_party_players_v2",
  settings: "pulse_party_settings_v2",
  sound: "pulse_party_sound_v2",
};

const avatarColors = [
  "#8b5cf6", "#ec4899", "#22c55e", "#06b6d4",
  "#f59e0b", "#ef4444", "#14b8a6", "#a855f7"
];

const PROMPTS = {
  truth: {
    chill: [
      "إيه الحاجة الصغيرة اللي بتخليك تضحك من قلبك؟",
      "مين أكثر شخص ترتاح له بسرعة؟",
      "إيه الهواية اللي نفسك تبدأها؟",
      "إيه أكتر فيلم أو مسلسل بتعيده؟",
      "مين الشخص اللي دايمًا يخفف مودك؟",
      "إيه أجمل حاجة حصلت لك الأسبوع ده؟"
    ],
    funny: [
      "إيه أكثر موقف مضحك اتزنقت فيه؟",
      "لو عندك اسم مستعار غريب، هيكون إيه؟",
      "إيه أكتر عادة غريبة عندك؟",
      "مين من صحابك بيضحكك من غير ما يقصد؟",
      "إيه أكتر أكل ممكن تهجم عليه في أي وقت؟",
      "إيه أغرب إشاعة سمعتها عن نفسك؟"
    ],
    chaos: [
      "إيه أكتر حاجة هتتغير لو بدّلنا يومك مع يوم شخص مشهور؟",
      "لو عملنا فيلم عنك، عنوانه هيبقى إيه؟",
      "إيه أكثر كلمة بتقولها بدون ما تحس؟",
      "إيه أغرب شيء في شخصيتك الناس بتكتشفه متأخر؟",
      "لو صحيت بكرة واتبعتك كاميرا، أول لقطة هتكون إيه؟",
      "إيه أكثر تصرف ندمت عليه وبعدها ضحكت منه؟"
    ]
  },
  dare: {
    chill: [
      "قل اسمك بنبرة إعلان سينمائي.",
      "اعمل بوستة/وضعية بطولية لمدة 5 ثواني.",
      "قلد روبوت وهو بيصحى من النوم.",
      "اتكلم 10 ثواني وكأنك مذيع أخبار.",
      "اعمل Heart بإيدك للكاميرا/للي قدامك.",
      "خد نفس عميق وابتسم كأنك كسبت جائزة."
    ],
    funny: [
      "قلد شخصية كرتونية لمدة 10 ثواني.",
      "اعمل حركة رقص غريبة بدون توقف 8 ثواني.",
      "تكلم 15 ثانية بصوت طفل ذكي جدًا.",
      "مثّل إنك بتقدم أوسكار لصاحبك.",
      "اعمل مشية بطيئة جدًا كأنك داخل معركة أسطورية.",
      "قل جملة: أنا نجم الليلة، بثقة مبالغ فيها."
    ],
    chaos: [
      "اعمل إعلان درامي عن كوب مياه.",
      "قلد مذيع مباراة وهو بيشرح دخولك للغرفة.",
      "اعمل تمثيل صامت لمشهد أكشن 10 ثواني.",
      "صفّق لنفسك كأنك أنهيت إنجاز تاريخي.",
      "غيّر صوتك 3 مرات في نفس الجملة.",
      "اعمل pose نهائي كأنك بطل اللعبة."
    ]
  }
};

let players = loadPlayers();
let settings = loadSettings();
let currentIndex = 0;
let roundCount = 0;
let gameStarted = false;
let usedPrompts = new Set();
let promptHistory = [];
let soundEnabled = loadSoundState();
let audioCtx = null;

function loadPlayers() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE.players)) || [];
  } catch {
    return [];
  }
}

function loadSettings() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE.settings)) || {
      mode: "mix",
      vibe: "funny"
    };
  } catch {
    return { mode: "mix", vibe: "funny" };
  }
}

function loadSoundState() {
  const saved = localStorage.getItem(STORAGE.sound);
  return saved === null ? true : saved === "true";
}

function savePlayers() {
  localStorage.setItem(STORAGE.players, JSON.stringify(players));
}

function saveSettings() {
  localStorage.setItem(STORAGE.settings, JSON.stringify({
    mode: document.getElementById("mode").value,
    vibe: document.getElementById("vibe").value
  }));
}

function saveSoundState() {
  localStorage.setItem(STORAGE.sound, String(soundEnabled));
}

function makeBeep() {
  if (!soundEnabled) return;
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = "sine";
    osc.frequency.value = 620;
    gain.gain.value = 0.06;

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.12);
  } catch {
    // no-op
  }
}

function speak(text) {
  if (!soundEnabled || !("speechSynthesis" in window)) return;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "ar-EG";
  utter.rate = 1;
  utter.pitch = 1.05;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}

function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function playerColor(index) {
  return avatarColors[index % avatarColors.length];
}

function initials(name) {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map(p => p[0] || "").join("").toUpperCase().slice(0, 2);
}

function renderPlayers() {
  const list = document.getElementById("players-list");
  const count = document.getElementById("players-count");

  count.textContent = `${players.length} لاعب`;

  if (!players.length) {
    list.innerHTML = `
      <div class="rounded-2xl border border-dashed border-white/15 bg-white/5 px-4 py-5 text-sm text-white/60">
        لسه مفيش لاعبين. ابدأ بإضافة اسم واحد على الأقل.
      </div>
    `;
    return;
  }

  list.innerHTML = players.map((name, i) => {
    const color = playerColor(i);
    return `
      <div class="player-chip">
        <span class="player-dot" style="background:${color}"></span>
        <span class="font-semibold">${escapeHtml(name)}</span>
        <button class="player-remove" onclick="removePlayer(${i})" aria-label="Remove player">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    `;
  }).join("");
}

function renderStats() {
  const bestScore = players.reduce((m, p) => Math.max(m, p.score || 0), 0);
  document.getElementById("best-score").textContent = String(bestScore);
  document.getElementById("score-summary").textContent = String(players.reduce((s, p) => s + (p.score || 0), 0));
  document.getElementById("turn-count").textContent = String(roundCount);
  document.getElementById("game-status").textContent = gameStarted ? "شغّال" : "جاهز";
}

function renderHistory() {
  const el = document.getElementById("history-list");
  if (!promptHistory.length) {
    el.innerHTML = `<div class="text-sm text-white/55">لسه مفيش جولات.</div>`;
    return;
  }

  el.innerHTML = promptHistory.slice(0, 5).map(item => `
    <div class="history-item">
      <div class="flex items-center justify-between gap-3">
        <strong class="text-white">${escapeHtml(item.player)}</strong>
        <span class="text-xs uppercase tracking-[0.18em] text-white/55">${item.type}</span>
      </div>
      <div class="mt-2 text-sm text-white/80">${escapeHtml(item.text)}</div>
    </div>
  `).join("");
}

function syncSettingsToUI() {
  document.getElementById("mode").value = settings.mode || "mix";
  document.getElementById("vibe").value = settings.vibe || "funny";
  updateSoundButton();
}

function updateSoundButton() {
  const label = document.getElementById("sound-label");
  const btn = document.getElementById("sound-toggle");
  label.textContent = soundEnabled ? "ON" : "OFF";
  btn.classList.toggle("opacity-70", !soundEnabled);
}

function addPlayer() {
  const input = document.getElementById("player-name");
  const name = input.value.trim().replace(/\s+/g, " ");

  if (!name) return;
  if (players.length >= 12) {
    alert("خليهم 12 لاعب أو أقل عشان اللعبة تفضل سلسة.");
    return;
  }

  const exists = players.some(p => p.name.toLowerCase() === name.toLowerCase());
  if (exists) {
    alert("الاسم ده موجود بالفعل.");
    return;
  }

  players.push({ name, score: 0 });
  savePlayers();
  input.value = "";
  renderPlayers();
  renderStats();
}

function removePlayer(index) {
  players.splice(index, 1);
  savePlayers();
  if (currentIndex >= players.length) currentIndex = 0;
  renderPlayers();
  renderStats();
}

function shufflePlayers() {
  players = players.sort(() => Math.random() - 0.5);
  savePlayers();
  renderPlayers();
  makeBeep();
  toast("اتعمل Shuffle للاعبين");
}

function getPromptBank() {
  const mode = document.getElementById("mode").value;
  const vibe = document.getElementById("vibe").value;

  if (mode === "truth") return { type: "Truth", list: PROMPTS.truth[vibe] };
  if (mode === "dare") return { type: "Dare", list: PROMPTS.dare[vibe] };

  const pickTruth = Math.random() > 0.5;
  return pickTruth
    ? { type: "Truth", list: PROMPTS.truth[vibe] }
    : { type: "Dare", list: PROMPTS.dare[vibe] };
}

function nextPrompt(forceAdvance = true) {
  if (!players.length) {
    toast("أضف لاعبين الأول");
    return;
  }

  if (!gameStarted) {
    gameStarted = true;
    document.getElementById("game-area").classList.remove("hidden");
  }

  if (forceAdvance) {
    currentIndex = currentIndex % players.length;
  }

  const currentPlayer = players[currentIndex];
  const bank = getPromptBank();
  const vibe = document.getElementById("vibe").value;

  let candidates = bank.list.filter(t => !usedPrompts.has(t));
  if (!candidates.length) {
    usedPrompts.clear();
    candidates = bank.list.slice();
  }

  const text = rand(candidates);
  usedPrompts.add(text);

  roundCount += 1;
  promptHistory.unshift({
    player: currentPlayer.name,
    type: bank.type,
    text
  });

  const avatar = document.getElementById("player-avatar");
  avatar.textContent = initials(currentPlayer.name) || "?";
  avatar.style.background = `linear-gradient(135deg, ${playerColor(currentIndex)}, #ec4899)`;

  document.getElementById("current-player").textContent = currentPlayer.name;
  document.getElementById("current-turn").textContent = `${currentPlayer.name} • ${bank.type}`;
  document.getElementById("prompt-chip").textContent = `${document.getElementById("mode").value.toUpperCase()} / ${vibe.toUpperCase()}`;
  document.getElementById("prompt-type").textContent = bank.type;
  document.getElementById("prompt-difficulty").textContent = vibe === "chill" ? "هدوء" : vibe === "funny" ? "فِكاهة" : "فوضى خفيفة";
  document.getElementById("question").textContent = text;

  const card = document.getElementById("prompt-card");
  card.classList.remove("pop-anim");
  void card.offsetWidth;
  card.classList.add("pop-anim");

  currentIndex = (currentIndex + 1) % players.length;

  renderStats();
  renderHistory();
  makeBeep();
  speak(`${currentPlayer.name}. ${bank.type}.`);
  burst();
}

function startGame() {
  if (players.length < 2) {
    toast("لازم لاعبين على الأقل");
    return;
  }

  saveSettings();
  gameStarted = true;
  currentIndex = 0;
  roundCount = 0;
  usedPrompts.clear();
  document.getElementById("game-area").classList.remove("hidden");
  nextPrompt(false);
}

function markDone() {
  if (!gameStarted || !players.length) return;
  const prevIndex = (currentIndex - 1 + players.length) % players.length;
  players[prevIndex].score = (players[prevIndex].score || 0) + 1;
  savePlayers();
  renderStats();
  renderPlayers();
  burst();
  toast("نقطة كاملة!");
  nextTurn();
}

function skipPrompt() {
  if (!gameStarted) return;
  toast("اتعدّى السؤال");
  nextTurn();
}

function nextTurn() {
  if (!gameStarted) return;
  nextPrompt(true);
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  saveSoundState();
  updateSoundButton();
  makeBeep();
}

function clearSavedData() {
  if (!confirm("تمسح اللاعبين والإعدادات المحفوظة؟")) return;
  localStorage.removeItem(STORAGE.players);
  localStorage.removeItem(STORAGE.settings);
  localStorage.removeItem(STORAGE.sound);
  players = [];
  settings = { mode: "mix", vibe: "funny" };
  soundEnabled = true;
  currentIndex = 0;
  roundCount = 0;
  gameStarted = false;
  usedPrompts.clear();
  promptHistory = [];
  document.getElementById("game-area").classList.add("hidden");
  syncSettingsToUI();
  renderPlayers();
  renderStats();
  renderHistory();
  toast("اتعمل Reset كامل");
}

function burst() {
  if (typeof confetti !== "function") return;
  confetti({
    particleCount: 80,
    spread: 70,
    startVelocity: 28,
    origin: { y: 0.7 }
  });
}

function toast(message) {
  const existing = document.getElementById("toast");
  if (existing) existing.remove();

  const t = document.createElement("div");
  t.id = "toast";
  t.className = "fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full border border-white/15 bg-black/70 px-5 py-3 text-sm font-semibold text-white shadow-2xl backdrop-blur-xl";
  t.textContent = message;
  document.body.appendChild(t);

  setTimeout(() => {
    t.style.opacity = "0";
    t.style.transform = "translate(-50%, 10px)";
    t.style.transition = "all 0.25s ease";
  }, 1200);

  setTimeout(() => t.remove(), 1600);
}

function escapeHtml(str) {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

document.getElementById("player-name").addEventListener("keydown", (e) => {
  if (e.key === "Enter") addPlayer();
});

document.getElementById("mode").addEventListener("change", () => {
  saveSettings();
  renderStats();
});

document.getElementById("vibe").addEventListener("change", () => {
  saveSettings();
  renderStats();
});

syncSettingsToUI();
renderPlayers();
renderStats();
renderHistory();
updateSoundButton();
