/* Estado da partida: libras, reputação, relógio, progresso de cada caso; viagens; conferência de respostas. */
window.Jogo = (() => {
  // Locais fixos (coordenadas do mapa-mestre v6)
  const BASE = { id: "221b", nome: "221B Baker Street", bairro: "Marylebone", x: 1610, y: 1140, foto: "assets/locais/221b.jpg" };
  const YARD = { id: "yard", nome: "Scotland Yard", bairro: "Whitehall", x: 3330, y: 2250, foto: "assets/locais/yard.jpg" };
  // linha central do Tâmisa, de leste a oeste
  const TAMISA = [[6580, 2115], [5885, 2170], [5150, 2262], [4598, 2391], [4046, 2464], [3678, 2575], [3531, 2795], [3420, 3053], [3237, 3274], [2942, 3421], [2391, 3494], [1655, 3512], [1103, 3550], [552, 3586]];
  const PX_POR_KM = 550, INICIO_DIA = 8 * 60; // o relógio começa às 8h do dia 1

  const PADRAO = { libras: 10, reputacao: 50, minutos: INICIO_DIA, casos: {} };
  let e;
  try { e = Object.assign({}, PADRAO, JSON.parse(localStorage.getItem("sh_jogo") || "{}")); } catch (x) { e = Object.assign({}, PADRAO); }
  function salvar() { try { localStorage.setItem("sh_jogo", JSON.stringify(e)); } catch (x) {} }

  function caso(c) { // progresso de um caso, criado na primeira vez
    if (!e.casos[c.id]) e.casos[c.id] = { pos: "221b", inicio: e.minutos, visitados: [], resolvidos: [], dicas: [], conclusoes: {}, tentativas: 0, cliente: 100, resolvido: false, notas: "" };
    return e.casos[c.id];
  }

  // ---------- relógio ----------
  function gastar(min) { e.minutos += Math.round(min); salvar(); }
  function hora(m = e.minutos) {
    const dia = Math.floor(m / 1440) + 1, r = m % 1440;
    return `Dia ${dia} · ${String(Math.floor(r / 60)).padStart(2, "0")}:${String(r % 60).padStart(2, "0")}`;
  }
  function duracao(min) { min = Math.round(min); const h = Math.floor(min / 60), m = min % 60; return h ? `${h}h${m ? String(m).padStart(2, "0") : ""}` : `${m} min`; }

  // ---------- viagens ----------
  function distRio(x, y) {
    let melhor = { d: Infinity, i: 0, t: 0, x: 0, y: 0 };
    for (let i = 0; i < TAMISA.length - 1; i++) {
      const [ax, ay] = TAMISA[i], [bx, by] = TAMISA[i + 1], dx = bx - ax, dy = by - ay;
      const t = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy)));
      const px = ax + t * dx, py = ay + t * dy, d = Math.hypot(x - px, y - py);
      if (d < melhor.d) melhor = { d, i, t, x: px, y: py };
    }
    return melhor;
  }
  function opcoesViagem(a, b) {
    const km = Math.hypot(b.x - a.x, b.y - a.y) / PX_POR_KM, ops = [];
    ops.push({ modo: "pe", nome: "A pé", icone: "🚶", tempo: 5 + km * 12, custo: 0 });
    ops.push({ modo: "carruagem", nome: "Carruagem", icone: "🐎", tempo: 10 + km * 4, custo: Math.max(1, Math.round(1 + km * 0.6)) });
    const ra = distRio(a.x, a.y), rb = distRio(b.x, b.y);
    if (ra.d < 480 && rb.d < 480 && km > 1.2) {
      const kmRio = (ra.d + rb.d) / PX_POR_KM;
      ops.push({ modo: "barco", nome: "Barco no Tâmisa", icone: "⛵", tempo: 8 + km * 3 + kmRio * 10, custo: 1 });
    }
    return ops.map(o => Object.assign(o, { km, podePagar: o.custo <= e.libras }));
  }
  // pontos do trajeto (barco segue o rio)
  function trajeto(a, b, modo) {
    if (modo !== "barco") {
      const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2, dx = b.x - a.x, dy = b.y - a.y, k = 0.12;
      const cx = mx - dy * k, cy = my + dx * k, pts = [];
      for (let i = 0; i <= 40; i++) { const t = i / 40; pts.push([(1 - t) * (1 - t) * a.x + 2 * (1 - t) * t * cx + t * t * b.x, (1 - t) * (1 - t) * a.y + 2 * (1 - t) * t * cy + t * t * b.y]); }
      return pts;
    }
    const ra = distRio(a.x, a.y), rb = distRio(b.x, b.y), pts = [[a.x, a.y], [ra.x, ra.y]];
    if (ra.i + ra.t < rb.i + rb.t) for (let i = ra.i + 1; i <= rb.i; i++) pts.push(TAMISA[i]);
    else for (let i = ra.i; i > rb.i; i--) pts.push(TAMISA[i]);
    pts.push([rb.x, rb.y], [b.x, b.y]);
    return pts;
  }
  function viajar(c, destino, op) {
    const p = caso(c); e.libras -= op.custo; p.pos = destino.id; gastar(op.tempo);
  }

  // ---------- respostas ----------
  function normal(t) { return (t || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim(); }
  function lev(a, b) {
    const m = a.length, n = b.length, d = Array.from({ length: m + 1 }, (_, i) => [i]);
    for (let j = 1; j <= n; j++) d[0][j] = j;
    for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[m][n];
  }
  function contem(texto, termo) { // trecho presente, tolerando um erro de digitação em palavras longas
    const t = normal(texto), k = normal(termo); if (!k) return false;
    if (t.includes(k)) return true;
    if (k.length < 5 || k.includes(" ")) return false;
    return t.split(" ").some(w => w.length >= k.length - 1 && (lev(w, k) <= 1 || lev(w.slice(0, k.length), k) <= 1));
  }
  function confereDesafio(desafio, resposta) {
    const r = normal(resposta).replace(/ /g, "");
    return desafio.respostas.some(x => { const k = normal(x).replace(/ /g, ""); return r === k || (k.length >= 5 && lev(r, k) <= 1); });
  }
  function confereConclusao(pergunta, texto) {
    return pergunta.aceitas.some(a => contem(texto, a)) && !(pergunta.erradas || []).some(a => contem(texto, a));
  }

  return { BASE, YARD, estado: () => e, salvar, caso, gastar, hora, duracao, opcoesViagem, trajeto, viajar, confereDesafio, confereConclusao,
    ganhar(l) { e.libras += l; salvar(); }, reputar(r) { e.reputacao = Math.max(0, Math.min(100, e.reputacao + r)); salvar(); } };
})();
