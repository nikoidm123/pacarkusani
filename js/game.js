// Bucin mini-game: the "Enggak" button dodges, "Mau" gives hearts and victory
const BucinGame = (() => {
  let yesBtn, noBtn, scoreEl, card;
  let score = 0;

  function moveNoButton() {
    const rect = card.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();
    const pad = 12;
    const maxX = rect.width - btnRect.width - pad;
    const maxY = rect.height - btnRect.height - pad;
    const x = Math.random() * maxX;
    const y = Math.random() * maxY;
    noBtn.style.position = 'absolute';
    noBtn.style.left = `${x}px`;
    noBtn.style.top = `${y}px`;
  }

  function addHeartsBurst() {
    const rect = yesBtn.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2 + window.scrollY;
    if (window.Hearts && Hearts.burst) Hearts.burst(x, y, 24);
  }

  function winState() {
    card.innerHTML = `
      <h2>YAY! Kamu pilih aku! 💘</h2>
      <p>Kamu sudah ngumpulin <b>${score}</b> love untuk kita.</p>
      <p>Aku janji bakal jagain kamu tiap hari. 😘</p>
      <a href="index.html" class="btn btn-main" style="display:inline-block;margin-top:12px;">Kembali ke Menu</a>
    `;
    addHeartsBurst();
  }

  function bind() {
    yesBtn.addEventListener('click', () => {
      score += 1;
      scoreEl.textContent = score;
      addHeartsBurst();
      if (score >= 7) winState();
    });

    const dodge = () => moveNoButton();
    noBtn.addEventListener('mouseenter', dodge);
    noBtn.addEventListener('click', (e) => { e.preventDefault(); dodge(); });
  }

  return {
    init() {
      yesBtn = document.getElementById('yesBtn');
      noBtn = document.getElementById('noBtn');
      scoreEl = document.getElementById('score');
      card = document.getElementById('gameCard');
      card.style.position = 'relative';
      bind();
    }
  }
})();

