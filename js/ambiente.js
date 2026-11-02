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
  const nevoas = Array.from({ length: 9 }, () => ({ x: Math.random() * 6620, y: Math.random() * 3726, r: 700 + Math.random() * 900, v: 6 + Math.random() * 10 }));

  // 0 = dia claro, 1 = noite fechada (amanhecer 5h–7h, entardecer 17h–19h30)
  function escuridao(min) {
    const h = (min % 1440) / 60;
    if (h >= 7 && h < 17) return 0;
    if (h >= 17 && h < 19.5) return (h - 17) / 2.5;
    if (h >= 5 && h < 7) return 1 - (h - 5) / 2;
    return 1;
  }
  function relogio(min) { alvoEscuro = previa ? 1 : escuridao(min); if (!ativo) escuro = alvoEscuro; }
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
      const x0 = -tx / s, y0 = -ty / s, x1 = x0 + vw / s, y1 = y0 + vh / s;
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
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
  }
  function ligar() { if (ativo) return; ativo = true; ultimo = performance.now(); raf = requestAnimationFrame(quadro); }
  function desligar() { ativo = false; cancelAnimationFrame(raf); }
  function alternarPrevia() { previa = !previa; return previa; }

  return { camera, relogio, ligar, desligar, escuridao, alternarPrevia };
})();
