/* Mapa: vista geral de longe, tiles da v6 de perto (crossfade na pinça) e bolinhas das missões. */
(() => {
  const MW = 6620, MH = 3726, T = 512;
  const NIVEIS = [{ esc: 1, cols: 13, lins: 8 }, { esc: 0.5, cols: 7, lins: 4 }];
  const vp = document.getElementById("mapa-viewport"), mundo = document.getElementById("mapa-mundo");
  const camadaTiles = document.getElementById("mapa-tiles"), camadaPontos = document.getElementById("mapa-pontos");
  const areaCaso = document.getElementById("mapa-area"), dica = document.getElementById("mapa-dica"), painel = document.getElementById("painel");
  let s = 0.2, tx = 0, ty = 0, minS = 0.2, maxS = 1.25;
  const tiles = new Map();
  let caso = null, pontosEls = [], btnResolver = null;

  // ---------- progresso salvo no aparelho ----------
  function lerProg() { try { return JSON.parse(localStorage.getItem("sh_prog") || "{}"); } catch (e) { return {}; } }
  function salvarProg(p) { try { localStorage.setItem("sh_prog", JSON.stringify(p)); } catch (e) {} }
  const prog = lerProg();
  (window.CASOS || []).forEach(c => { if (prog[c.id] && prog[c.id].resolvido) c.situacao = "RESOLVIDO"; });

  // ---------- câmera ----------
  function limites() {
    const vw = vp.clientWidth, vh = vp.clientHeight;
    minS = Math.max(vw / MW, vh / MH); s = Math.min(Math.max(s, minS), maxS);
    tx = Math.min(0, Math.max(vw - MW * s, tx)); ty = Math.min(0, Math.max(vh - MH * s, ty));
  }
  function suave(a, b, x) { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); }
  function aplicar() {
    limites();
    mundo.style.transform = `translate(${tx}px,${ty}px) scale(${s})`;
    const op = suave(minS * 1.5, minS * 2.6, s);
    camadaTiles.style.opacity = op;
    const mostrarPontos = op > 0.6;
    camadaPontos.style.opacity = mostrarPontos ? 1 : 0;
    areaCaso.style.opacity = 1 - op;
    camadaPontos.style.pointerEvents = mostrarPontos ? "auto" : "none";
    dica.style.opacity = mostrarPontos ? 0 : 1;
    pontosEls.forEach(p => p.el.style.transform = `translate(${p.x}px,${p.y}px) scale(${1 / s})`);
    if (op > 0) atualizarTiles();
  }
  function zoomEm(px, py, novoS) {
    novoS = Math.min(Math.max(novoS, minS), maxS);
    const wx = (px - tx) / s, wy = (py - ty) / s;
    s = novoS; tx = px - wx * s; ty = py - wy * s; aplicar();
  }
  function animarPara(px, py, alvoS, ms = 450) {
    const s0 = s, t0 = performance.now();
    (function passo(t) {
      const p = Math.min(1, (t - t0) / ms), e = 1 - Math.pow(1 - p, 3);
      zoomEm(px, py, s0 + (alvoS - s0) * e);
      if (p < 1) requestAnimationFrame(passo);
    })(t0);
  }

  // ---------- tiles ----------
  function atualizarTiles() {
    const n = s >= 0.5 ? 0 : 1, nv = NIVEIS[n], tw = T / nv.esc;
    const vw = vp.clientWidth, vh = vp.clientHeight;
    const x0 = -tx / s, y0 = -ty / s, x1 = x0 + vw / s, y1 = y0 + vh / s;
    const c0 = Math.max(0, Math.floor(x0 / tw) - 1), c1 = Math.min(nv.cols - 1, Math.floor(x1 / tw) + 1);
    const l0 = Math.max(0, Math.floor(y0 / tw) - 1), l1 = Math.min(nv.lins - 1, Math.floor(y1 / tw) + 1);
    const vivos = new Set();
    for (let c = c0; c <= c1; c++) for (let l = l0; l <= l1; l++) {
      const k = `${n}_${c}_${l}`; vivos.add(k);
      if (tiles.has(k)) continue;
      const img = new Image(); img.decoding = "async"; img.draggable = false;
      img.style.left = c * tw + "px"; img.style.top = l * tw + "px";
      img.style.width = Math.min(tw, MW - c * tw) + 0.5 + "px"; img.style.height = Math.min(tw, MH - l * tw) + 0.5 + "px";
      img.style.zIndex = n === 0 ? 2 : 1;
      img.src = `assets/tiles/${n}/${c}_${l}.jpg`;
      camadaTiles.appendChild(img); tiles.set(k, img);
    }
    // descarta tiles fora da vista (o nível anterior espera um pouco para não piscar)
    tiles.forEach((img, k) => {
      if (vivos.has(k)) return;
      const outroNivel = !k.startsWith(n + "_");
      if (outroNivel) { if (!img._tchau) img._tchau = setTimeout(() => { img.remove(); tiles.delete(k); }, 800); }
      else { img.remove(); tiles.delete(k); }
    });
  }

  // ---------- gestos ----------
  const dedos = new Map(); let ultimaDist = 0, ultimoMeio = null, ultimoToque = 0, moveu = false;
  vp.addEventListener("pointerdown", e => {
    if (e.target.closest(".ponto")) return;
    vp.setPointerCapture(e.pointerId); dedos.set(e.pointerId, { x: e.clientX, y: e.clientY }); moveu = false;
    if (dedos.size === 2) { const [a, b] = [...dedos.values()]; ultimaDist = Math.hypot(a.x - b.x, a.y - b.y); ultimoMeio = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }; }
  });
  vp.addEventListener("pointermove", e => {
    if (!dedos.has(e.pointerId)) return;
    const ant = dedos.get(e.pointerId), atual = { x: e.clientX, y: e.clientY };
    dedos.set(e.pointerId, atual);
    if (dedos.size === 1) { tx += atual.x - ant.x; ty += atual.y - ant.y; if (Math.abs(atual.x - ant.x) + Math.abs(atual.y - ant.y) > 2) moveu = true; aplicar(); }
    else if (dedos.size === 2) {
      const [a, b] = [...dedos.values()], d = Math.hypot(a.x - b.x, a.y - b.y), m = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      tx += m.x - ultimoMeio.x; ty += m.y - ultimoMeio.y;
      zoomEm(m.x, m.y, s * d / ultimaDist); ultimaDist = d; ultimoMeio = m; moveu = true;
    }
  });
  function soltar(e) {
    if (!dedos.has(e.pointerId)) return;
    dedos.delete(e.pointerId);
    if (dedos.size === 1) { ultimoMeio = null; }
    if (dedos.size === 0 && !moveu) { // toque duplo aproxima
      const agora = Date.now();
      if (agora - ultimoToque < 320) animarPara(e.clientX, e.clientY, s * 2);
      ultimoToque = agora;
    }
  }
  vp.addEventListener("pointerup", soltar); vp.addEventListener("pointercancel", soltar);
  vp.addEventListener("wheel", e => { e.preventDefault(); zoomEm(e.clientX, e.clientY, s * Math.exp(-e.deltaY * 0.0015)); }, { passive: false });
  window.addEventListener("resize", () => { if (App.estado.tela === "mapa") aplicar(); });
  vp.addEventListener("scroll", () => { vp.scrollLeft = 0; vp.scrollTop = 0; });

  // ---------- pontos do caso ----------
  function montarPontos() {
    camadaPontos.innerHTML = ""; pontosEls = [];
    const p = prog[caso.id] || { visitados: [] };
    caso.locais.forEach((loc, k) => {
      const el = document.createElement("div"); el.className = "ponto" + (p.visitados.includes(loc.id) ? " visitado" : "");
      el.innerHTML = `<button aria-label="${loc.nome}">${k + 1}</button><span class="rotulo">${loc.nome}</span>`;
      el.querySelector("button").onclick = () => abrirLocal(loc, el);
      camadaPontos.appendChild(el); pontosEls.push({ el, x: loc.x, y: loc.y });
    });
    if (btnResolver) btnResolver.remove();
    btnResolver = document.createElement("button"); btnResolver.className = "btn-caso"; btnResolver.textContent = "RESOLVER O CASO";
    Object.assign(btnResolver.style, { position: "absolute", left: "50%", top: "auto", bottom: "calc(env(safe-area-inset-bottom) + 64px)", transform: "translateX(-50%)", width: "auto", height: "auto", padding: "12px 22px", fontSize: "17px", whiteSpace: "nowrap", zIndex: 4, display: "none" });
    btnResolver.onclick = () => resolver(0);
    document.getElementById("mapa").appendChild(btnResolver);
    checarResolver();
  }
  function checarResolver() {
    const p = prog[caso.id] || { visitados: [] };
    const tudo = caso.locais.every(l => p.visitados.includes(l.id));
    btnResolver.style.display = tudo && !p.resolvido ? "block" : "none";
  }
  function abrirPainel(titulo, texto, opcoes) {
    document.getElementById("painel-local").textContent = titulo;
    App.datilografar(document.getElementById("painel-texto"), texto, 14);
    const box = document.getElementById("painel-opcoes"); box.innerHTML = "";
    (opcoes || []).forEach(o => { const b = document.createElement("button"); b.textContent = o.texto; b.onclick = o.acao; box.appendChild(b); });
    painel.classList.add("aberto");
  }
  document.getElementById("painel-fechar").onclick = () => painel.classList.remove("aberto");
  function abrirLocal(loc, el) {
    const p = prog[caso.id] = prog[caso.id] || { visitados: [] };
    if (!p.visitados.includes(loc.id)) { p.visitados.push(loc.id); salvarProg(prog); }
    el.classList.add("visitado");
    abrirPainel(loc.nome, loc.texto);
    checarResolver();
  }
  /* resolução: uma ou mais perguntas em sequência; errar só pede para pensar de novo */
  function resolver(n = 0) {
    const sol = caso.solucao, perguntas = sol.perguntas || [sol];
    const q = perguntas[n], titulo = perguntas.length > 1 ? `DEDUÇÃO ${n + 1} DE ${perguntas.length}` : "RESOLVER O CASO";
    abrirPainel(titulo, q.pergunta, q.opcoes.map(o => ({
      texto: o.texto, acao: () => {
        if (!o.correta) { abrirPainel("NÃO É ISSO, WATSON", o.resposta, [{ texto: "Pensar de novo", acao: () => resolver(n) }]); return; }
        if (n + 1 < perguntas.length) { abrirPainel("CORRETO", o.resposta, [{ texto: "Próxima dedução", acao: () => resolver(n + 1) }]); return; }
        prog[caso.id].resolvido = true; salvarProg(prog); caso.situacao = "RESOLVIDO"; checarResolver();
        abrirPainel("CASO RESOLVIDO", o.resposta + (sol.epilogo ? "\n\n" + sol.epilogo : ""), [{ texto: "Voltar ao arquivo", acao: () => { painel.classList.remove("aberto"); App.ir("casos"); } }]);
      }
    })));
  }

  App.aoEntrar.mapa = (c) => {
    caso = c || App.estado.caso; if (!caso) return;
    document.getElementById("mapa-caso").textContent = `Caso ${caso.id} · ${caso.titulo}`;
    painel.classList.remove("aberto");
    montarPontos();
    // começa na vista geral, centrada nos locais do caso
    requestAnimationFrame(() => {
      const vw = vp.clientWidth, vh = vp.clientHeight;
      limites(); s = minS;
      const cx = caso.locais.reduce((a, l) => a + l.x, 0) / caso.locais.length;
      const cy = caso.locais.reduce((a, l) => a + l.y, 0) / caso.locais.length;
      const a = areaCaso.firstElementChild; a.style.left = cx + "px"; a.style.top = cy + "px";
      tx = vw / 2 - cx * s; ty = vh / 2 - cy * s; aplicar();
    });
    Som.musica("partida");
  };
})();
