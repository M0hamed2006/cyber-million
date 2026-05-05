const data = {
  truth: [
    "أكبر سر مخبيه؟ 😏",
    "مين بتحبه؟ ❤️",
    "موقف محرج حصل لك؟ 😂"
  ],
  dare: [
    "غني أغنية 🎤",
    "اعمل 10 ضغط 💪",
    "ارقص 20 ثانية 🕺"
  ]
};

let players = JSON.parse(localStorage.getItem("players")) || [];
let current = 0;

const sound = new Audio("https://www.soundjay.com/buttons/sounds/button-16.mp3");

function addPlayer() {
  const input = document.getElementById("player-name");

  if (input.value.trim()) {
    players.push(input.value);
    localStorage.setItem("players", JSON.stringify(players));
    input.value = "";
    renderPlayers();
  }
}

function renderPlayers() {
  document.getElementById("players-list").innerHTML =
    players.map((p, i) => `
      <span class="bg-white/20 px-3 py-1 rounded flex items-center gap-2">
        ${p}
        <button onclick="removePlayer(${i})">❌</button>
      </span>
    `).join("");
}

function removePlayer(i) {
  players.splice(i, 1);
  localStorage.setItem("players", JSON.stringify(players));
  renderPlayers();
}

function startGame() {
  if (players.length < 2) {
    alert("لازم لاعبين على الأقل 😅");
    return;
  }

  document.getElementById("game-area").classList.remove("hidden");
  nextQuestion();
}

function nextQuestion() {
  sound.play();

  const type = Math.random() > 0.5 ? "truth" : "dare";
  const q = data[type][Math.floor(Math.random() * data[type].length)];
  const player = players[current];

  const box = document.getElementById("question");

  box.classList.remove("fade-in");
  void box.offsetWidth;
  box.classList.add("fade-in");

  document.getElementById("current-player").innerHTML =
    `🔥 دور <span style="color:yellow">${player}</span>`;

  box.innerText = q;

  current = (current + 1) % players.length;

  // اهتزاز
  document.body.classList.add("shake");
  setTimeout(() => document.body.classList.remove("shake"), 300);

  // Confetti
  confetti();
}

// تحميل اللاعبين
renderPlayers();
