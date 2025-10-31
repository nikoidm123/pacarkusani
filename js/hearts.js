// Floating hearts background (no dependencies)
// Usage: Hearts.start('#hearts-canvas')
(function (global) {
  const Hearts = {
    ctx: null,
    canvas: null,
    hearts: [],
    running: false,

    rand(min, max) { return Math.random() * (max - min) + min; },

    spawn() {
      const w = this.canvas.width;
      const x = this.rand(0, w);
      const size = this.rand(10, 24);
      const speed = this.rand(24, 48); // a bit faster so hearts reach higher
      const hue = this.rand(330, 360);
      const alpha = this.rand(0.5, 0.95);
      const wobble = this.rand(0.6, 1.6);
      this.hearts.push({ x, y: this.canvas.height + size + this.rand(0, 60), size, speed, hue, alpha, wobble, t: 0 });
      if (this.hearts.length > 160) this.hearts.shift();
    },

    drawHeart(x, y, size, color) {
      const ctx = this.ctx;
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(size / 32, size / 32);
      ctx.beginPath();
      // Simple heart path
      ctx.moveTo(16, 29);
      ctx.bezierCurveTo(10, 24, 2, 19, 2, 11);
      ctx.bezierCurveTo(2, 6, 6, 2, 11, 2);
      ctx.bezierCurveTo(14, 2, 16, 4, 16, 6);
      ctx.bezierCurveTo(16, 4, 18, 2, 21, 2);
      ctx.bezierCurveTo(26, 2, 30, 6, 30, 11);
      ctx.bezierCurveTo(30, 19, 22, 24, 16, 29);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
      ctx.restore();
    },

    resize() {
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      this.canvas.width = Math.floor(this.canvas.clientWidth * dpr);
      this.canvas.height = Math.floor(this.canvas.clientHeight * dpr);
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    },

    loop(ts) {
      if (!this.running) return;
      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // spawn with slight randomness
      if (Math.random() < 0.5) this.spawn();

      // update and draw
      for (let i = 0; i < this.hearts.length; i++) {
        const h = this.hearts[i];
        h.t += 0.016 * h.wobble;
        h.y -= h.speed * 0.016 * 60 * 0.032; // float a bit higher/faster
        const off = Math.sin(h.t * 2.2) * 14 * (h.size / 24);
        const color = `hsla(${h.hue}, 80%, 70%, ${h.alpha})`;
        this.drawHeart(h.x + off, h.y, h.size, color);
      }

      // remove off-screen
      this.hearts = this.hearts.filter(h => h.y + h.size > -20);

      requestAnimationFrame(this.loop.bind(this));
    },

    start(canvas) {
      const el = typeof canvas === 'string' ? document.querySelector(canvas) : canvas;
      if (!el) return;
      this.canvas = el;
      this.ctx = el.getContext('2d');
      this.running = true;
      this.resize();
      window.addEventListener('resize', this.resize.bind(this));
      this.loop();
    },

    burst(x, y, count = 18) {
      // for celebratory bursts
      for (let i = 0; i < count; i++) {
        const size = this.rand(10, 22);
        const hue = this.rand(330, 360);
        const alpha = this.rand(0.7, 1);
        this.hearts.push({ x: x + this.rand(-20, 20), y: y + this.rand(-10, 10), size, speed: this.rand(20, 42), hue, alpha, wobble: this.rand(0.5, 2), t: 0 });
      }
    }
  };

  global.Hearts = Hearts;
})(window);
