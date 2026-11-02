/* Abertura animada: névoa, lampiões a gás, sombra de Sherlock e Big Ben. */
(() => {
  const tela = document.getElementById("abertura");
  const sombra = tela.querySelector(".capa-sombra");
  const lampioes = [...tela.querySelectorAll(".lampiao")];
  const canvas = tela.querySelector(".nevoa");
  const c2 = canvas.getContext("2d");
  let ativo = false, timers = [], raf = 0;

  // sprite de névoa (mancha suave)
  const sprite = document.createElement("canvas"); sprite.width = sprite.height = 256;
  const sg = sprite.getContext("2d"), grad = sg.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, "rgba(205,212,220,1)"); grad.addColorStop(0.5, "rgba(190,198,208,.45)"); grad.addColorStop(1, "rgba(180,190,200,0)");
  sg.fillStyle = grad; sg.fillRect(0, 0, 256, 256);

  let manchas = [];
  function criarManchas() {
    manchas = Array.from({ length: 16 }, (_, i) => ({
      x: Math.random(), y: i < 10 ? 0.62 + Math.random() * 0.36 : 0.2 + Math.random() * 0.5,
      r: 0.35 + Math.random() * 0.45, v: (Math.random() < 0.5 ? -1 : 1) * (0.004 + Math.random() * 0.008),
      a: i < 10 ? 0.10 + Math.random() * 0.10 : 0.04 + Math.random() * 0.06, fase: Math.random() * 6.28
    }));
  }
  function desenhar(t) {
    if (!ativo) return;
    const w = canvas.width, h = canvas.height;
    c2.clearRect(0, 0, w, h);
    manchas.forEach(m => {
      m.x += m.v / 60; if (m.x > 1.4) m.x = -0.4; if (m.x < -0.4) m.x = 1.4;
      const s = m.r * w * 2, a = m.a * (0.75 + 0.25 * Math.sin(t / 2400 + m.fase));
      c2.globalAlpha = a; c2.drawImage(sprite, m.x * w - s / 2, m.y * h - s / 2, s, s * 0.6);
    });
    raf = requestAnimationFrame(desenhar);
  }
  function tamanhoCanvas() {
    const r = canvas.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(r.width * dpr / 2); canvas.height = Math.round(r.height * dpr / 2); // meia resolução: névoa é suave
  }

  function tremular() {
    if (!ativo) return;
    lampioes.forEach(l => {
      const f = 0.72 + Math.random() * 0.28;
      l.style.opacity = f; l.style.transform = `translate(-50%,-50%) scale(${0.95 + Math.random() * 0.1})`;
    });
    timers.push(setTimeout(tremular, 70 + Math.random() * 120));
  }

  // sombra: aparece, some devagar, volta
  function cicloSombra(visivel) {
    if (!ativo) return;
    sombra.style.opacity = visivel ? 1 : 0;
    timers.push(setTimeout(() => cicloSombra(!visivel), visivel ? 8000 + Math.random() * 3000 : 5000 + Math.random() * 2000));
  }

  function agendarBigBen(primeira) {
    timers.push(setTimeout(() => {
      if (!ativo) return;
      Som.bigBen(Math.random() < 0.3);
      agendarBigBen(false);
    }, primeira ? 5000 : 45000 + Math.random() * 35000));
  }

  App.aoEntrar.abertura = () => {
    ativo = true; timers.forEach(clearTimeout); timers = [];
    sombra.style.opacity = 1;
    requestAnimationFrame(() => { tamanhoCanvas(); if (!manchas.length) criarManchas(); cancelAnimationFrame(raf); raf = requestAnimationFrame(desenhar); });
    tremular(); timers.push(setTimeout(() => cicloSombra(false), 6000)); agendarBigBen(true);
    Som.musica("abertura");
  };
  // ao sair da abertura, pára tudo
  const obs = new MutationObserver(() => { if (!tela.classList.contains("ativa") && ativo) { ativo = false; timers.forEach(clearTimeout); timers = []; cancelAnimationFrame(raf); } });
  obs.observe(tela, { attributes: true, attributeFilter: ["class"] });
  window.addEventListener("resize", () => { if (ativo) tamanhoCanvas(); });
})();
