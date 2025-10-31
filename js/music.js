// Simple playlist player with previous/next, seek, and cute visuals
const MusicPlayer = (() => {
  const tracks = [
    { src: 'music/Connie Francis - Pretty Little Baby (Official Audio).mp3', title: 'Connie Francis — Pretty Little Baby' },
    { src: 'music/Feast - Nina (Official Lyric Video).mp3', title: 'Feast — Nina' },
    { src: 'music/yung kai - blue (Lyrics).mp3', title: 'yung kai — blue' },
  ];

  let audio, titleEl, curTimeEl, durTimeEl, seekEl, playBtn, prevBtn, nextBtn, visualizer, disc;
  let index = 0;
  let loaded = false;
  // slider state
  let slider, slides, dotsWrap, slideIndex = 0, slideTimer;
  // quote state
  let quoteEl, quoteTimer;
  // single photo rotator
  let photoEl, photoIndex = 0;

  function formatTime(s) {
    if (!isFinite(s)) return '0:00';
    const m = Math.floor(s / 60);
    const ss = Math.floor(s % 60).toString().padStart(2, '0');
    return `${m}:${ss}`;
  }

  function load(i) {
    index = (i + tracks.length) % tracks.length;
    const t = tracks[index];
    titleEl.textContent = t.title;
    audio.src = t.src;
    audio.load();
    loaded = true;
  }

  function play() {
    if (!loaded) load(index);
    audio.play().then(() => {
      playBtn.textContent = '⏸️';
      visualizer.classList.add('playing');
      disc.classList.add('playing');
    }).catch(() => {
      titleEl.textContent = 'Tambahkan file MP3 ke folder music/';
    });
  }

  function pause() {
    audio.pause();
    playBtn.textContent = '▶️';
    visualizer.classList.remove('playing');
    disc.classList.remove('playing');
  }

  function toggle() { audio.paused ? play() : pause(); }

  function prev() { load(index - 1); play(); }
  function next() { load(index + 1); play(); }

  function onTime() {
    curTimeEl.textContent = formatTime(audio.currentTime);
    durTimeEl.textContent = formatTime(audio.duration);
    const p = (audio.currentTime / (audio.duration || 1)) * 100;
    seekEl.value = isFinite(p) ? p : 0;
  }

  function onSeek() {
    const t = (parseFloat(seekEl.value) / 100) * (audio.duration || 0);
    if (isFinite(t)) audio.currentTime = t;
  }

  function onEnd() { next(); }

  // simple slider
  function buildDots() {
    dotsWrap.innerHTML = '';
    slides.forEach((_, i) => {
      const b = document.createElement('button');
      b.className = 'dot' + (i === 0 ? ' active' : '');
      b.addEventListener('click', () => showSlide(i));
      dotsWrap.appendChild(b);
    });
  }
  function showSlide(i) {
    slideIndex = (i + slides.length) % slides.length;
    slides.forEach((el, idx) => {
      el.classList.toggle('active', idx === slideIndex);
    });
    const ds = dotsWrap.querySelectorAll('.dot');
    ds.forEach((d, idx) => d.classList.toggle('active', idx === slideIndex));
  }
  function startSlider() {
    if (slideTimer) clearInterval(slideTimer);
    slideTimer = setInterval(() => showSlide(slideIndex + 1), 3000);
  }

  const QUOTES = [
    'Semangat kuliahnya, Sani. Kopi dan doa selalu untukmu ☕️💖',
    'Kalau lelah, Sani, aku nunggu kabar baik darimu ✨',
    'Satu-satu tugasnya, aku bangga sama kamu 🌷',
    'Tetap pelan tapi pasti, Sani—kayak cinta kita 💞',
    'Jangan lupa makan dulu ya, Sani 🍱',
    'Serius boleh, tapi senyum jangan lupa ya 😊',
    'IPK tinggi penting, kamu bahagia lebih penting 💗',
    'Kalau buntu, istirahat sebentar. Aku peluk dari jauh 🤗',
    'Catatanmu rapi, hatimu lebih rapi lagi buat aku 📒',
    'Kamu tuh hebat, cuma kadang lupa kalau kamu hebat 🌟',
    'Hari ini mungkin berat, tapi kamu lebih kuat 💪',
    'Langkah kecilmu hari ini = mimpi besar besok 🌈',
    'Fokus ya, Sani—HP taruh sebentar (kecuali chat aku) 😜',
    'Aku jadi semangat karena lihat kamu berjuang 💖',
    'Deadline nggak cinta kamu, tapi aku iya 😘',
    'Sedikit lagi selesai, habis itu jajan es krim bareng 🍦',
    'Kalau grogi presentasi, bayangin aku tepuk tangan paling kenceng 👏',
    'Revisi itu tanda kamu makin keren ✍️',
    'Jangan bandingkan dirimu—kamu versi terbaikku 💝',
    'Hari ini capek, besok kita tetap hebat. Semangat! 🌼'
  ];

  function startQuotes(){
    if (!quoteEl) return;
    let qi = 0;
    const push = () => {
      quoteEl.textContent = QUOTES[qi % QUOTES.length];
      quoteEl.classList.remove('fade'); // reset
      // trigger reflow for CSS animation restart
      void quoteEl.offsetWidth; 
      quoteEl.classList.add('fade');
      qi++;
    };
    push();
    if (quoteTimer) clearInterval(quoteTimer);
    quoteTimer = setInterval(push, 5000);
  }

  function startPhotoRotator(){
    if (!photoEl) return;
    const photos = [
      'img/ayang2.jpg',
      'img/ayang3.jpg',
    ];
    let i = 0;
    // ensure first image loads and fades in
    const setImage = (idx) => {
      i = (idx + photos.length) % photos.length;
      photoEl.style.opacity = '0';
      setTimeout(() => {
        photoEl.src = photos[i];
        photoEl.onload = () => { photoEl.style.opacity = '1'; };
        photoEl.onerror = () => { // fallback if missing
          i = (i + 1) % photos.length; photoEl.src = photos[i];
        };
      }, 150);
    };
    setImage(0);
    setInterval(() => setImage(i + 1), 4500);
  }

  return {
    init() {
      audio = document.getElementById('audio');
      titleEl = document.getElementById('trackTitle');
      curTimeEl = document.getElementById('curTime');
      durTimeEl = document.getElementById('durTime');
      seekEl = document.getElementById('seek');
      playBtn = document.getElementById('playBtn');
      prevBtn = document.getElementById('prevBtn');
      nextBtn = document.getElementById('nextBtn');
      visualizer = document.querySelector('.visualizer');
      disc = document.getElementById('disc');
      slider = document.getElementById('photoSlider');
      slides = slider ? Array.from(slider.querySelectorAll('.slide')) : [];
      dotsWrap = document.getElementById('sliderDots');
      quoteEl = document.getElementById('quote');
      photoEl = document.querySelector('.ayang-photo');

      // wire events
      playBtn.addEventListener('click', toggle);
      prevBtn.addEventListener('click', prev);
      nextBtn.addEventListener('click', next);
      seekEl.addEventListener('input', onSeek);
      audio.addEventListener('timeupdate', onTime);
      audio.addEventListener('loadedmetadata', onTime);
      audio.addEventListener('ended', onEnd);

      // Preload first track but don't autoplay
      try { load(0); } catch (e) {}

      // init slider
      if (slides.length) { buildDots(); startSlider(); }
      startQuotes();
      startPhotoRotator();
    }
  }
})();
