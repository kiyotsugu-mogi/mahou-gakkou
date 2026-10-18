// はなび🎆
// つかいかた: <script src="../../common/fireworks.js"></script> を入れて、fireworks(3) のように よぶ
(function () {
  const COLORS = ["#ff5c8a", "#ffd34d", "#6fcf97", "#56ccf2", "#bb6bd9", "#ff9f43"];
  const pick = (list) => list[Math.floor(Math.random() * list.length)];

  const canvas = document.createElement("canvas");
  canvas.style.cssText = "position:fixed; inset:0; width:100%; height:100%; z-index:5; pointer-events:none;";
  const ctx = canvas.getContext("2d");
  let rockets = [];
  let sparks = [];
  let running = false;

  function setup() {
    if (!canvas.isConnected) document.body.appendChild(canvas);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", setup);

  function launchRocket() {
    setup();
    const w = canvas.width;
    const h = canvas.height;
    rockets.push({
      x: w * (0.15 + Math.random() * 0.7),
      y: h,
      vy: -(h * 0.018 + Math.random() * 4),
      targetY: h * (0.15 + Math.random() * 0.3),
      color: pick(COLORS),
    });
    if (!running) { running = true; requestAnimationFrame(draw); }
  }

  function explode(r) {
    const count = 50;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = 2 + Math.random() * 4;
      sparks.push({
        x: r.x,
        y: r.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        color: Math.random() < 0.7 ? r.color : pick(COLORS),
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    rockets = rockets.filter((r) => {
      r.y += r.vy;
      ctx.fillStyle = r.color;
      ctx.beginPath();
      ctx.arc(r.x, r.y, 4, 0, Math.PI * 2);
      ctx.fill();
      if (r.y <= r.targetY) { explode(r); return false; }
      return true;
    });

    sparks = sparks.filter((s) => {
      s.x += s.vx;
      s.y += s.vy;
      s.vx *= 0.98;
      s.vy = s.vy * 0.98 + 0.06; // すこしずつ おちる
      s.life -= 0.012;
      if (s.life <= 0) return false;
      ctx.globalAlpha = s.life;
      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.arc(s.x, s.y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      return true;
    });

    if (rockets.length || sparks.length) {
      requestAnimationFrame(draw);
    } else {
      running = false;
    }
  }

  // n こ うちあげる
  window.fireworks = function (n) {
    for (let i = 0; i < n; i++) setTimeout(launchRocket, i * 350);
  };
})();
