// Global SFX and background lofi
(function(){
  const clickSfx = new Audio('music/efek-button.mp3');
  clickSfx.preload = 'auto';
  clickSfx.volume = 0.35;

  const bg = new Audio('music/lofi-song-jinsei-by-lofium-236730.mp3');
  bg.loop = true;
  bg.volume = 0.25;
  bg.preload = 'auto';

  let interacted = false;
  function resumeAudio() {
    if (interacted) return;
    interacted = true;
    bg.play().catch(()=>{});
  }

  function bindClicks(root=document) {
    root.addEventListener('click', (e) => {
      // play subtle click sfx on UI clicks
      const target = e.target.closest('button, a, input[type="button"], input[type="submit"]');
      if (target) {
        try { clickSfx.currentTime = 0; clickSfx.play(); } catch(_) {}
      }
    });
  }

  function createToggle() {
    const btn = document.createElement('button');
    btn.className = 'sound-toggle';
    btn.title = 'Toggle Backsound';
    btn.textContent = '🔊';
    btn.addEventListener('click', () => {
      if (bg.paused) { bg.play().catch(()=>{}); } else { bg.pause(); }
      btn.textContent = bg.paused ? '🔈' : '🔊';
    });
    document.body.appendChild(btn);
    // hint bubble if autoplay blocked
    const hint = document.createElement('div');
    hint.className = 'sound-hint hidden';
    hint.textContent = 'Tap di sini untuk nyalakan musik';
    document.body.appendChild(hint);

    function updateHint(){
      if (bg.paused) hint.classList.remove('hidden'); else hint.classList.add('hidden');
    }
    btn.addEventListener('click', updateHint);
    document.addEventListener('pointerdown', updateHint);
    setTimeout(updateHint, 800);
  }

  window.addEventListener('pointerdown', resumeAudio, { once: true });
  window.addEventListener('keydown', resumeAudio, { once: true });
  // Try autoplay on load (especially for home page); if blocked, hint will show
  window.addEventListener('DOMContentLoaded', () => { bg.play().catch(()=>{}); });

  bindClicks();
  createToggle();
})();
