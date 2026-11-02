/* Caminho pelas ruas do mapa: A* sobre a grade de custo assets/ruas.png
   (preto = rua, cinza = prédios/parques, branco = água). Cada célula = 6x6 px do mapa-mestre. */
window.Ruas = (() => {
  const F = 6; let W = 0, H = 0, custo = null;
  const img = new Image();
  img.onload = () => {
    const cv = document.createElement("canvas"); cv.width = W = img.width; cv.height = H = img.height;
    const ctx = cv.getContext("2d"); ctx.drawImage(img, 0, 0);
    const d = ctx.getImageData(0, 0, W, H).data; custo = new Uint8Array(W * H);
    for (let i = 0; i < W * H; i++) { const v = d[i * 4]; custo[i] = v < 64 ? 1 : v > 192 ? 80 : 9; }
  };
  img.src = "assets/ruas.png?v=1";

  // fila de prioridade (heap binário)
  function Heap() { const a = [], p = []; return {
    get n() { return a.length; },
    push(v, pr) { a.push(v); p.push(pr); let i = a.length - 1; while (i > 0) { const j = (i - 1) >> 1; if (p[j] <= p[i]) break; [a[i], a[j]] = [a[j], a[i]]; [p[i], p[j]] = [p[j], p[i]]; i = j; } },
    pop() { const top = a[0], la = a.pop(), lp = p.pop(); if (a.length) { a[0] = la; p[0] = lp; let i = 0; for (;;) { const l = 2 * i + 1, r = l + 1; let m = i;
      if (l < a.length && p[l] < p[m]) m = l; if (r < a.length && p[r] < p[m]) m = r; if (m === i) break; [a[i], a[m]] = [a[m], a[i]]; [p[i], p[m]] = [p[m], p[i]]; i = m; } } return top; } }; }

  // encontra a rua mais próxima de uma célula (para começar e terminar na calçada)
  function naRua(cx, cy) {
    for (let r = 0; r < 25; r++) for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
      const x = cx + dx, y = cy + dy; if (x >= 0 && y >= 0 && x < W && y < H && custo[y * W + x] === 1) return [x, y];
    }
    return [cx, cy];
  }
  function caminho(a, b) {
    if (!custo) return null;
    const [sx, sy] = naRua(Math.round(a.x / F), Math.round(a.y / F)), [ex, ey] = naRua(Math.round(b.x / F), Math.round(b.y / F));
    const N = W * H, g = new Float32Array(N).fill(Infinity), de = new Int32Array(N).fill(-1), fechado = new Uint8Array(N);
    const s = sy * W + sx, alvo = ey * W + ex, h = (x, y) => Math.hypot(x - ex, y - ey);
    const q = Heap(); g[s] = 0; q.push(s, h(sx, sy));
    const DX = [1, -1, 0, 0, 1, 1, -1, -1], DY = [0, 0, 1, -1, 1, -1, 1, -1], DC = [1, 1, 1, 1, 1.414, 1.414, 1.414, 1.414];
    let passos = 0;
    while (q.n) {
      const u = q.pop(); if (u === alvo) break; if (fechado[u]) continue; fechado[u] = 1;
      if (++passos > 700000) return null;
      const ux = u % W, uy = (u / W) | 0;
      for (let k = 0; k < 8; k++) {
        const x = ux + DX[k], y = uy + DY[k]; if (x < 0 || y < 0 || x >= W || y >= H) continue;
        const v = y * W + x; if (fechado[v]) continue;
        const ng = g[u] + DC[k] * custo[v];
        if (ng < g[v]) { g[v] = ng; de[v] = u; q.push(v, ng + 1.6 * h(x, y)); }
      }
    }
    if (de[alvo] < 0 && alvo !== s) return null;
    let pts = []; for (let u = alvo; u >= 0; u = de[u]) { pts.push([(u % W) * F + F / 2, ((u / W) | 0) * F + F / 2]); if (u === s) break; }
    pts.reverse();
    pts = simplificar(pts, 7); pts = suavizar(suavizar(pts));
    return [[a.x, a.y], ...pts, [b.x, b.y]];
  }
  // Ramer–Douglas–Peucker e Chaikin para tirar o serrilhado da grade
  function simplificar(p, eps) {
    if (p.length < 3) return p;
    const [ax, ay] = p[0], [bx, by] = p[p.length - 1], L = Math.hypot(bx - ax, by - ay) || 1;
    let dm = 0, im = 0;
    for (let i = 1; i < p.length - 1; i++) { const d = Math.abs((by - ay) * p[i][0] - (bx - ax) * p[i][1] + bx * ay - by * ax) / L; if (d > dm) { dm = d; im = i; } }
    if (dm <= eps) return [p[0], p[p.length - 1]];
    return simplificar(p.slice(0, im + 1), eps).slice(0, -1).concat(simplificar(p.slice(im), eps));
  }
  function suavizar(p) {
    if (p.length < 3) return p; const o = [p[0]];
    for (let i = 0; i < p.length - 1; i++) { const [x0, y0] = p[i], [x1, y1] = p[i + 1]; o.push([x0 * .75 + x1 * .25, y0 * .75 + y1 * .25], [x0 * .25 + x1 * .75, y0 * .25 + y1 * .75]); }
    o.push(p[p.length - 1]); return o;
  }
  return { caminho, get pronto() { return !!custo; } };
})();
