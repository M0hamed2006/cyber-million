const data = {
  truth: ["أكبر سر مخبيه؟", "مين بتحبه؟"],
  dare: ["غني أغنية", "اعمل 10 ضغط"]
};

let players = [];
let current = 0;

function addPlayer() {
  const input = document.getElementById("player-name");
  if (input.value.trim()) {
    players.push(input.value);
    input.value = "";
    renderPlayers();
  }
}

function renderPlayers() {
  document.getElementById("players-list").innerHTML =
    players.map(p => `<span class="bg-white/20 px-3 py-1 rounded">${p}</span>`).join("");
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
  const type = Math.random() > 0.5 ? "truth" : "dare";
  const q = data[type][Math.floor(Math.random() * data[type].length)];
  const player = players[current];

  document.getElementById("current-player").innerText = player;
  document.getElementById("question").innerText = q;

  current = (current + 1) % players.length;
}
