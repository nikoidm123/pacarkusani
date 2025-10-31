// Game 2: Tap Hati — klik hati bergerak untuk skor dalam 30 detik
const TapHearts = (() => {
  let canvas, ctx, startBtn, resetBtn, scoreEl, timeEl;
  let hearts = [], running = false, score = 0, timeLeft = 30, timerId;

  function rand(a,b){ return Math.random()*(b-a)+a; }

  function spawnHeart(){
    const r = rand(12,22);
    const x = rand(r, canvas.width - r);
    const y = rand(r, canvas.height - r);
    const vx = rand(-1.2, 1.2);
    const vy = rand(-0.8, 0.8);
    hearts.push({x,y,r,vx,vy,life:rand(6,12)});
    if (hearts.length>30) hearts.shift();
  }

  function drawHeart(x,y,size,color){
    ctx.save(); ctx.translate(x,y); ctx.scale(size/16,size/16);
    ctx.beginPath();
    ctx.moveTo(8,14); ctx.bezierCurveTo(5,12,2,9,2,6);
    ctx.bezierCurveTo(2,4,4,2,6,2);
    ctx.bezierCurveTo(7,2,8,3,8,4);
    ctx.bezierCurveTo(8,3,9,2,10,2);
    ctx.bezierCurveTo(12,2,14,4,14,6);
    ctx.bezierCurveTo(14,9,11,12,8,14);
    ctx.closePath(); ctx.fillStyle=color; ctx.fill(); ctx.restore();
  }

  function loop(){
    if(!running) return;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    if (Math.random()<0.06) spawnHeart();
    hearts.forEach(h=>{
      h.x+=h.vx*2; h.y+=h.vy*2; h.life-=0.016;
      if (h.x<h.r||h.x>canvas.width-h.r) h.vx*=-1;
      if (h.y<h.r||h.y>canvas.height-h.r) h.vy*=-1;
      drawHeart(h.x,h.y,h.r,`hsla(${rand(330,360)},80%,70%,0.9)`);
    });
    hearts = hearts.filter(h=>h.life>0);
    requestAnimationFrame(loop);
  }

  function click(e){
    if(!running) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    let hit = false;
    for (let i=hearts.length-1;i>=0;i--){
      const h = hearts[i];
      const dx=x-h.x, dy=y-h.y;
      if (Math.hypot(dx,dy) < h.r) { hearts.splice(i,1); score++; hit=true; break; }
    }
    if (hit && window.Hearts) Hearts.burst(e.clientX, e.clientY + window.scrollY, 12);
    scoreEl.textContent = score;
  }

  function start(){
    if (running) return; running = true; score=0; timeLeft=30; hearts=[]; scoreEl.textContent=score; timeEl.textContent=timeLeft;
    timerId = setInterval(()=>{
      timeLeft--; timeEl.textContent=timeLeft; if (timeLeft<=0) end();
    },1000);
    loop();
  }
  function end(){ running=false; clearInterval(timerId); }
  function reset(){ end(); ctx.clearRect(0,0,canvas.width,canvas.height); score=0; timeLeft=30; scoreEl.textContent=0; timeEl.textContent=30; }

  function resize(){
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio||1));
    const container = document.getElementById('game2');
    let cssW = canvas.clientWidth || (container ? container.clientWidth - 32 : 480);
    cssW = Math.max(240, Math.min(cssW, 640));
    const cssH = Math.max(200, Math.round(cssW * 0.6)); // keep ~3:2 aspect

    // keep CSS height in sync to avoid stretch
    canvas.style.width = cssW + 'px';
    canvas.style.height = cssH + 'px';

    canvas.width = Math.floor(cssW * dpr);
    canvas.height = Math.floor(cssH * dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }

  return {
    init(){
      canvas = document.getElementById('tapCanvas');
      if (!canvas) return; ctx = canvas.getContext('2d');
      startBtn = document.getElementById('start2');
      resetBtn = document.getElementById('reset2');
      scoreEl = document.getElementById('score2');
      timeEl = document.getElementById('time2');
      canvas.addEventListener('click', click);
      startBtn.addEventListener('click', start);
      resetBtn.addEventListener('click', reset);
      window.addEventListener('resize', resize);
      resize();
    }
  };
})();
