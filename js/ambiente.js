/* Ambiente do mapa: dia e noite seguindo o relógio do jogo, luzes (lampiões e janelas)
   que acendem e tremulam ao anoitecer, e névoa que passa devagar.
   Desenha num único canvas do tamanho da tela (leve para o iPhone). */
window.Ambiente = (() => {
  const L = window.LAMPIOES || [];
  const N = L.length / 3;
  const cv = document.getElementById("mapa-luz"), ctx = cv.getContext("2d");
  const noite = document.getElementById("mapa-noite");
  let cam = { tx: 0, ty: 0, s: 1, vw: 1, vh: 1 }, escuro = 0, alvoEscuro = 0, ativo = false, raf = 0, ultimo = 0, previa = false;

  // índice espacial simples (células de 256 px do mapa) para desenhar só as luzes visíveis
  const CEL = 256, celulas = new Map();
  for (let i = 0; i < N; i++) { const k = (Math.floor(L[i * 3] / CEL) << 8) | Math.floor(L[i * 3 + 1] / CEL); (celulas.get(k) || celulas.set(k, []).get(k)).push(i); }
  const fase = new Float32Array(N), veloc = new Float32Array(N);
  for (let i = 0; i < N; i++) { fase[i] = Math.random() * 6.3; veloc[i] = 1.5 + Math.random() * 4; }

  // brilho pré-desenhado (chama quente com halo)
  const brilho = document.createElement("canvas"); brilho.width = brilho.height = 64;
  (() => { const g = brilho.getContext("2d"), r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    r.addColorStop(0, "rgba(255,246,210,1)"); r.addColorStop(0.12, "rgba(255,214,120,.95)"); r.addColorStop(0.35, "rgba(255,170,60,.38)"); r.addColorStop(1, "rgba(255,140,40,0)");
    g.fillStyle = r; g.fillRect(0, 0, 64, 64); })();
  // névoa: algumas manchas grandes e macias que atravessam o mapa
  const nuvem = document.createElement("canvas"); nuvem.width = nuvem.height = 128;
  (() => { const g = nuvem.getContext("2d"), r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    r.addColorStop(0, "rgba(225,228,235,.55)"); r.addColorStop(.6, "rgba(225,228,235,.18)"); r.addColorStop(1, "rgba(225,228,235,0)");
    g.fillStyle = r; g.fillRect(0, 0, 128, 128); })();
  const nuvemEscura = document.createElement("canvas"); nuvemEscura.width = nuvemEscura.height = 64;
  (() => { const g = nuvemEscura.getContext("2d"), r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    r.addColorStop(0, "rgba(110,104,98,.75)"); r.addColorStop(.55, "rgba(130,124,118,.35)"); r.addColorStop(1, "rgba(140,135,130,0)");
    g.fillStyle = r; g.fillRect(0, 0, 64, 64); })();
  const nevoas = Array.from({ length: 9 }, () => ({ x: Math.random() * 6620, y: Math.random() * 3726, r: 700 + Math.random() * 900, v: 6 + Math.random() * 10 }));

  // ---------- fumaça das chaminés e fábricas ----------
  const CHAMINES = [[4250, 370], [4655, 290], [5320, 200], [5440, 190], [5660, 250], [5860, 500], [6050, 820], [3720, 840], [6440, 1000],
    [6044, 2950], [6114, 2920], [6200, 2970], [6264, 3010]];
  const fumaca = []; // partículas {x, y, r, v, vida, max}
  const emissores = CHAMINES.map(([x, y]) => ({ x, y, prox: Math.random() * 2 }));

  // ---------- trens nos viadutos (Camden, Islington e o ramal das fábricas) ----------
  function linha(pts) { const seg = []; let tot = 0; for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(d); tot += d; } return { pts, seg, tot }; }
  function pontoEm(l, d) {
    d = Math.max(0, Math.min(l.tot, d));
    for (let i = 0; i < l.seg.length; i++) { if (d <= l.seg[i]) { const t = d / l.seg[i], a = l.pts[i], b = l.pts[i + 1]; return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, Math.atan2(b[1] - a[1], b[0] - a[0])]; } d -= l.seg[i]; }
    const n = l.pts.length; return [l.pts[n - 1][0], l.pts[n - 1][1], 0];
  }
  const TRENS = [
    { l: linha([[3550, 20], [3590, 120], [3700, 230], [3860, 320], [4040, 380], [4190, 430], [4280, 520], [4330, 620], [4300, 720], [4200, 840], [4040, 940], [3900, 1020], [3780, 1080]]), v: 70, d: 0, carros: 5, fumo: 0 },
    { l: linha([[5360, 144], [5140, 220], [5000, 260], [4840, 300], [4640, 340], [4460, 380], [4340, 430]]), v: 60, d: 400, carros: 6, fumo: 0 },
    { l: linha([[5300, 3390], [5500, 3280], [5700, 3170], [5880, 3065], [6000, 3000]]), v: 45, d: 100, carros: 4, fumo: 0 }
  ];

  // ---------- reflexos no Tâmisa ----------
  const RIO = Jogo.TAMISA, rioL = linha(RIO);
  const reflexos = Array.from({ length: 110 }, () => novoReflexo(Math.random()));
  function novoReflexo(idade) { const p = pontoEm(rioL, Math.random() * rioL.tot), off = (Math.random() * 2 - 1) * 150; return { x: p[0] - Math.sin(p[2]) * off, y: p[1] + Math.cos(p[2]) * off, a: p[2], vida: idade * 4, max: 2.5 + Math.random() * 3, w: 18 + Math.random() * 40 }; }

  // ---------- chuva (em algumas noites) ----------
  const gotas = Array.from({ length: 140 }, () => ({ x: Math.random(), y: Math.random(), v: 0.9 + Math.random() * 0.6 }));
  let chovendo = false, horaAnterior = null, ultimoSino = -1e9;

  // 0 = dia claro, 1 = noite fechada (amanhecer 5h–7h, entardecer 17h–19h30)
  function escuridao(min) {
    const h = (min % 1440) / 60;
    if (h >= 7 && h < 17) return 0;
    if (h >= 17 && h < 19.5) return (h - 17) / 2.5;
    if (h >= 5 && h < 7) return 1 - (h - 5) / 2;
    return 1;
  }
  function relogio(min) {
    alvoEscuro = previa ? 1 : escuridao(min); if (!ativo) escuro = alvoEscuro;
    const dia = Math.floor((min + 300) / 1440); // a "noite" vai das 19h às 5h
    chovendo = previa || ((dia * 7919) % 10) < 4; // chove em 4 de cada 10 noites
    const hora = Math.floor(min / 60);
    if (horaAnterior !== null && hora !== horaAnterior && ativo && App.estado.tela === "mapa" && performance.now() - ultimoSino > 25000) { ultimoSino = performance.now(); Som.bigBen(true); }
    horaAnterior = hora;
  }
  function camera(tx, ty, s, vw, vh) {
    cam = { tx, ty, s, vw, vh };
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    if (cv.width !== Math.round(vw * dpr) || cv.height !== Math.round(vh * dpr)) { cv.width = Math.round(vw * dpr); cv.height = Math.round(vh * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
  }

  function quadro(t) {
    raf = requestAnimationFrame(quadro);
    if (t - ultimo < 45 || App.estado.tela !== "mapa") return; // ~22 quadros por segundo bastam
    const dt = Math.min(0.2, (t - ultimo) / 1000); ultimo = t;
    escuro += (alvoEscuro - escuro) * Math.min(1, dt * 1.5);
    noite.style.opacity = (escuro * 0.72).toFixed(3);
    const { tx, ty, s, vw, vh } = cam, seg = t / 1000;
    ctx.clearRect(0, 0, vw, vh);
    const x0 = -tx / s, y0 = -ty / s, x1 = x0 + vw / s, y1 = y0 + vh / s, dentro = (x, y, m) => x > x0 - m && x < x1 + m && y > y0 - m && y < y1 + m;
    // reflexos na água
    ctx.globalCompositeOperation = escuro > 0.5 ? "lighter" : "source-over";
    reflexos.forEach((r, i) => {
      r.vida += dt; if (r.vida > r.max) reflexos[i] = r = novoReflexo(0);
      if (!dentro(r.x, r.y, 60)) return;
      const k = Math.sin(Math.PI * r.vida / r.max);
      ctx.globalAlpha = k * (escuro > 0.5 ? 0.35 : 0.28);
      ctx.strokeStyle = escuro > 0.5 ? "#ffcf7a" : "#f4f8ff"; ctx.lineWidth = Math.max(1, 3 * s);
      const w = r.w * s, sx = tx + (r.x + Math.cos(r.a) * r.vida * 6) * s, sy = ty + r.y * s;
      ctx.beginPath(); ctx.moveTo(sx - Math.cos(r.a) * w / 2, sy - Math.sin(r.a) * w / 2); ctx.lineTo(sx + Math.cos(r.a) * w / 2, sy + Math.sin(r.a) * w / 2); ctx.stroke();
    });
    // trens
    ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1;
    TRENS.forEach(tr => {
      tr.d += tr.v * dt; const comp = tr.carros * 62 + 40;
      if (tr.d > tr.l.tot + comp + 600) tr.d = -200; // some e volta depois
      const cab = pontoEm(tr.l, tr.d);
      tr.fumo -= dt; if (tr.fumo <= 0 && tr.d > 0 && tr.d < tr.l.tot) { tr.fumo = 0.22; fumaca.push({ x: cab[0], y: cab[1] - 30, r: 8, v: 1, vida: 0, max: 2.6, esc: 0 }); }
    });
    // fumaça
    emissores.forEach(em => { em.prox -= dt; if (em.prox <= 0) { em.prox = 1.1 + Math.random() * 0.8; fumaca.push({ x: em.x, y: em.y, r: 10, v: 1, vida: 0, max: 5, esc: 1 }); } });
    for (let i = fumaca.length - 1; i >= 0; i--) {
      const f = fumaca[i]; f.vida += dt; if (f.vida > f.max) { fumaca.splice(i, 1); continue; }
      const p = f.vida / f.max; f.y -= 20 * dt; f.x += 12 * dt; f.r += 11 * dt;
      if (!dentro(f.x, f.y, f.r + 20)) continue;
      ctx.globalAlpha = (1 - p) * (p < 0.1 ? p * 10 : 1) * (f.esc ? 0.32 : 0.5) * (1 - escuro * 0.4);
      const rr = f.r * s; ctx.drawImage(f.esc ? nuvemEscura : nuvem, tx + f.x * s - rr, ty + f.y * s - rr, rr * 2, rr * 2);
    }
    // névoa (mais densa à noite)
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 0.16 + escuro * 0.22;
    nevoas.forEach(n => {
      n.x += n.v * dt; if (n.x - n.r > 6620) n.x = -n.r;
      const sx = tx + n.x * s, sy = ty + n.y * s, rr = n.r * s;
      if (sx + rr < 0 || sx - rr > vw || sy + rr < 0 || sy - rr > vh) return;
      ctx.drawImage(nuvem, sx - rr, sy - rr * 0.6, rr * 2, rr * 1.2);
    });
    // luzes
    if (escuro > 0.25) {
      ctx.globalCompositeOperation = "lighter";
      const a0 = Math.min(1, (escuro - 0.25) / 0.5);
      const passo = s < 0.3 ? 3 : s < 0.45 ? 2 : 1; // de longe, menos luzes
      for (let cx = Math.max(0, Math.floor(x0 / CEL)); cx <= Math.floor(x1 / CEL); cx++)
        for (let cy = Math.max(0, Math.floor(y0 / CEL)); cy <= Math.floor(y1 / CEL); cy++) {
          const lista = celulas.get((cx << 8) | cy); if (!lista) continue;
          for (let j = 0; j < lista.length; j += passo) {
            const i = lista[j], tam = L[i * 3 + 2];
            let f = 0.78 + 0.16 * Math.sin(seg * veloc[i] + fase[i]) + 0.06 * Math.sin(seg * 13.7 + fase[i] * 3);
            if (((seg * 0.7 + fase[i]) % 9) < 0.12) f *= 0.35; // falha rápida do gás de vez em quando
            const rr = Math.max(4, (14 + tam * 3) * s * 1.6);
            ctx.globalAlpha = a0 * f;
            ctx.drawImage(brilho, tx + L[i * 3] * s - rr, ty + L[i * 3 + 1] * s - rr, rr * 2, rr * 2);
          }
        }
    }
    // chuva fina à noite
    if (chovendo && escuro > 0.45) {
      ctx.globalCompositeOperation = "source-over"; ctx.strokeStyle = "#c8d4e8"; ctx.lineWidth = 1;
      ctx.globalAlpha = 0.35 * Math.min(1, (escuro - 0.45) / 0.3); ctx.beginPath();
      gotas.forEach(g => { g.y += g.v * dt * 1.4; g.x += dt * 0.12; if (g.y > 1) { g.y = -0.05; g.x = Math.random(); } if (g.x > 1) g.x -= 1;
        const x = g.x * vw, y = g.y * vh; ctx.moveTo(x, y); ctx.lineTo(x - 4, y + 16); });
      ctx.stroke();
    }
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
  }
  function ligar() { if (ativo) return; ativo = true; ultimo = performance.now(); raf = requestAnimationFrame(quadro); }
  function desligar() { ativo = false; cancelAnimationFrame(raf); }
  function alternarPrevia() { previa = !previa; return previa; }

  return { camera, relogio, ligar, desligar, escuridao, alternarPrevia };
})();
