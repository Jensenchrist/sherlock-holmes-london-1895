/* Mapa: vista geral de longe, tiles da v6 de perto (crossfade na pinça), locais do caso,
   viagens animadas, cartão-postal de cada local, caderno, 221B e Scotland Yard. */
(() => {
  const MW = 6620, MH = 3726, T = 512, ZOOM_PONTOS = 0.7, ZOOM_LOCAL = 0.9;
  const NIVEIS = [{ esc: 1, cols: 13, lins: 8 }, { esc: 0.5, cols: 7, lins: 4 }];
  const $ = id => document.getElementById(id);
  const vp = $("mapa-viewport"), mundo = $("mapa-mundo"), camadaTiles = $("mapa-tiles"), camadaPontos = $("mapa-pontos"), camadaFixos = $("mapa-fixos");
  const dica = $("mapa-dica"), painel = $("painel"), rota = $("rota-linha"), cartao = $("cartao"), caderno = $("caderno");
  let s = 0.2, tx = 0, ty = 0, minS = 0.2, maxS = 1.25, viajando = false;
  const tiles = new Map();
  let caso = null, prog = null, marcadores = [], sherlock = null;

  // casos já resolvidos aparecem assim na gaveta
  (window.CASOS || []).forEach(c => { const p = Jogo.estado().casos[c.id]; if (p && p.resolvido) c.situacao = "RESOLVIDO"; });

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
    const mostrar = s >= ZOOM_PONTOS;
    camadaPontos.style.opacity = mostrar ? 1 : 0;
    camadaPontos.style.pointerEvents = mostrar ? "auto" : "none";
    dica.style.opacity = mostrar || viajando ? 0 : 1;
    marcadores.forEach(p => p.el.style.transform = `translate(${p.x}px,${p.y}px) scale(${1 / s})`);
    rota.style.strokeWidth = 7 / s;
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
  // leva a câmera até um ponto do mundo (centro da tela) numa escala
  function voarPara(wx, wy, alvoS, ms = 700) {
    return new Promise(ok => {
      const vw = vp.clientWidth, vh = vp.clientHeight, s0 = s, cx0 = (vw / 2 - tx) / s, cy0 = (vh / 2 - ty) / s, t0 = performance.now();
      (function passo(t) {
        const p = Math.min(1, (t - t0) / ms), e = p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
        s = s0 + (alvoS - s0) * e; const cx = cx0 + (wx - cx0) * e, cy = cy0 + (wy - cy0) * e;
        tx = vw / 2 - cx * s; ty = vh / 2 - cy * s; aplicar();
        if (p < 1) requestAnimationFrame(passo); else ok();
      })(t0);
    });
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
    tiles.forEach((img, k) => {
      if (vivos.has(k)) return;
      if (!k.startsWith(n + "_")) { if (!img._tchau) img._tchau = setTimeout(() => { img.remove(); tiles.delete(k); }, 800); }
      else { img.remove(); tiles.delete(k); }
    });
  }

  // ---------- gestos ----------
  const dedos = new Map(); let ultimaDist = 0, ultimoMeio = null, ultimoToque = 0, moveu = false;
  vp.addEventListener("pointerdown", e => {
    if (viajando || e.target.closest(".ponto")) return;
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
    if (dedos.size === 1) ultimoMeio = null;
    if (dedos.size === 0 && !moveu) {
      const agora = Date.now();
      if (agora - ultimoToque < 320) animarPara(e.clientX, e.clientY, s * 2);
      ultimoToque = agora;
    }
  }
  vp.addEventListener("pointerup", soltar); vp.addEventListener("pointercancel", soltar);
  vp.addEventListener("wheel", e => { e.preventDefault(); if (!viajando) zoomEm(e.clientX, e.clientY, s * Math.exp(-e.deltaY * 0.0015)); }, { passive: false });
  window.addEventListener("resize", () => { if (App.estado.tela === "mapa") aplicar(); });
  vp.addEventListener("scroll", () => { vp.scrollLeft = 0; vp.scrollTop = 0; });

  // ---------- locais e marcadores ----------
  const todos = () => [Jogo.BASE, Jogo.YARD, ...caso.locais];
  const achar = id => todos().find(l => l.id === id);
  function marcador(camada, classe, x, y, html, aoTocar) {
    const el = document.createElement("div"); el.className = "ponto " + classe; el.innerHTML = html;
    if (aoTocar) el.querySelector("button").onclick = aoTocar;
    camada.appendChild(el); const m = { el, x, y }; marcadores.push(m); return m;
  }
  function montar() {
    camadaPontos.innerHTML = ""; camadaFixos.innerHTML = ""; marcadores = [];
    caso.locais.forEach((loc, k) => {
      const st = prog.resolvidos.includes(loc.id) ? " feito" : prog.visitados.includes(loc.id) ? " visitado" : "";
      marcador(camadaPontos, "local" + st, loc.x, loc.y, `<button aria-label="${loc.nome}">${k + 1}</button><span class="rotulo">${loc.nome}</span>`, () => tocar(loc));
    });
    marcador(camadaFixos, "fixo", Jogo.BASE.x, Jogo.BASE.y, `<button aria-label="221B Baker Street">221B</button><span class="rotulo">Baker Street</span>`, () => tocar(Jogo.BASE));
    marcador(camadaFixos, "fixo yard", Jogo.YARD.x, Jogo.YARD.y, `<button aria-label="Scotland Yard">SY</button><span class="rotulo">Scotland Yard</span>`, () => tocar(Jogo.YARD));
    const aqui = achar(prog.pos) || Jogo.BASE;
    sherlock = marcador(camadaFixos, "sherlock", aqui.x, aqui.y, `<div class="sherlock-icone">🎩</div>`);
    atualizarHud(); aplicar();
  }
  function atualizarHud() {
    const e = Jogo.estado();
    $("hud-libras").textContent = "£ " + e.libras; $("hud-hora").textContent = Jogo.hora(); $("hud-rep").textContent = "Reputação " + e.reputacao;
  }

  // ---------- painel inferior ----------
  function abrirPainel(titulo, texto, opcoes, rapido) {
    $("painel-local").textContent = titulo;
    const t = $("painel-texto"); if (rapido) t.textContent = texto; else App.datilografar(t, texto, 12);
    const box = $("painel-opcoes"); box.innerHTML = "";
    (opcoes || []).forEach(o => { const b = document.createElement("button"); b.innerHTML = o.texto; b.disabled = !!o.desabilitado; b.onclick = o.acao; box.appendChild(b); });
    painel.classList.add("aberto");
  }
  const fecharPainel = () => painel.classList.remove("aberto");
  $("painel-fechar").onclick = fecharPainel;

  // ---------- viagem ----------
  function tocar(destino) {
    if (viajando) return;
    if (prog.pos === destino.id) { abrirLocal(destino); return; }
    const origem = achar(prog.pos) || Jogo.BASE, ops = Jogo.opcoesViagem(origem, destino);
    abrirPainel(destino.nome, `${destino.bairro} · ${ops[0].km.toFixed(1).replace(".", ",")} km de ${origem.nome}.\nComo Holmes vai até lá?`, ops.map(o => ({
      texto: `<span class="op-icone">${o.icone}</span><span class="op-nome">${o.nome}</span><span class="op-info">${Jogo.duracao(o.tempo)} · ${o.custo ? "£ " + o.custo : "grátis"}</span>`,
      desabilitado: !o.podePagar,
      acao: () => { fecharPainel(); viajar(origem, destino, o); }
    })), true);
  }
  async function viajar(origem, destino, op) {
    viajando = true; dica.style.opacity = 0;
    const pts = Jogo.trajeto(origem, destino, op.modo);
    rota.setAttribute("d", "M" + pts.map(p => p.map(Math.round).join(" ")).join(" L"));
    rota.setAttribute("class", op.modo);
    const total = rota.getTotalLength(); rota.style.strokeDasharray = total; rota.style.strokeDashoffset = total;
    sherlock.el.querySelector(".sherlock-icone").textContent = op.icone;
    // enquadra o trajeto inteiro
    const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]), vw = vp.clientWidth, vh = vp.clientHeight;
    const bw = Math.max(...xs) - Math.min(...xs) + 900, bh = Math.max(...ys) - Math.min(...ys) + 900;
    const esc = Math.min(Math.max(Math.min(vw / bw, vh / bh), minS), 0.6);
    await voarPara((Math.max(...xs) + Math.min(...xs)) / 2, (Math.max(...ys) + Math.min(...ys)) / 2, esc, 650);
    // Holmes percorre o caminho
    const dur = Math.min(4200, 1600 + op.km * 260), t0 = performance.now();
    await new Promise(ok => (function passo(t) {
      const p = Math.min(1, (t - t0) / dur), e = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      const pt = rota.getPointAtLength(total * e);
      rota.style.strokeDashoffset = total * (1 - e);
      sherlock.x = pt.x; sherlock.y = pt.y; aplicar();
      if (p < 1) requestAnimationFrame(passo); else ok();
    })(t0));
    Jogo.viajar(caso, destino, op); atualizarHud();
    await voarPara(destino.x, destino.y, ZOOM_LOCAL, 650);
    sherlock.el.querySelector(".sherlock-icone").textContent = "🎩";
    rota.setAttribute("d", ""); viajando = false;
    abrirLocal(destino);
  }

  // ---------- cartão-postal do local ----------
  function abrirCartao(local, texto, desafioHtml) {
    $("cartao-bairro").textContent = local.bairro.toUpperCase();
    $("cartao-nome").textContent = local.nome.toUpperCase();
    const foto = $("cartao-foto"); foto.src = local.foto; foto.alt = local.nome;
    $("cartao-texto").textContent = texto;
    $("cartao-desafio").innerHTML = desafioHtml || "";
    cartao.classList.add("aberto"); cartao.scrollTop = 0;
  }
  $("cartao-fechar").onclick = () => { cartao.classList.remove("aberto"); montar(); };

  function abrirLocal(local) {
    if (local.id === "221b") return abrirBase();
    if (local.id === "yard") return abrirYard();
    if (!prog.visitados.includes(local.id)) { prog.visitados.push(local.id); Jogo.gastar(20); atualizarHud(); }
    abrirCartao(local, local.descricao, "");
    desenharDesafio(local);
  }
  function desenharDesafio(local) {
    const box = $("cartao-desafio"), d = local.desafio, feito = prog.resolvidos.includes(local.id);
    if (feito) {
      box.innerHTML = `<div class="pista-anotada"><b>PISTA ANOTADA NO CADERNO</b><p></p></div>`;
      box.querySelector("p").textContent = local.pista.texto; return;
    }
    const temDica = prog.dicas.includes(local.id);
    box.innerHTML = `<div class="desafio-tipo">${d.tipo}</div><p class="desafio-enunciado"></p>
      <div class="desafio-linha"><input id="desafio-resp" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="sua resposta"><button id="desafio-ok">OK</button></div>
      <div class="desafio-msg" id="desafio-msg"></div>
      <button class="desafio-dica" id="desafio-dica">${temDica ? "" : "pedir uma dica ao Watson (30 min)"}</button>
      <p class="desafio-dica-texto" id="desafio-dica-texto"></p>`;
    box.querySelector(".desafio-enunciado").textContent = d.enunciado;
    if (temDica) $("desafio-dica-texto").textContent = "Watson: " + d.dica;
    const ok = () => {
      const r = $("desafio-resp").value; if (!r.trim()) return;
      if (Jogo.confereDesafio(d, r)) {
        prog.resolvidos.push(local.id); Jogo.salvar();
        desenharDesafio(local); box.querySelector(".pista-anotada").classList.add("nova");
      } else {
        Jogo.gastar(10); atualizarHud();
        const m = $("desafio-msg"); m.textContent = "Não é isso. Holmes reflete mais um pouco (10 min)."; box.classList.remove("errou"); void box.offsetWidth; box.classList.add("errou");
      }
    };
    $("desafio-ok").onclick = ok;
    $("desafio-resp").onkeydown = e => { if (e.key === "Enter") ok(); };
    if (!temDica) $("desafio-dica").onclick = () => { prog.dicas.push(local.id); Jogo.gastar(30); atualizarHud(); desenharDesafio(local); };
  }

  // ---------- 221B ----------
  function abrirBase() {
    abrirCartao(Jogo.BASE, "A lareira estala na sala do 221B. Watson serve o chá; Holmes acende o cachimbo. Aqui você relê as pistas com calma e escreve suas conclusões no caderno.",
      `<button class="cartao-acao" id="base-caderno">ABRIR O CADERNO</button>`);
    $("base-caderno").onclick = () => { cartao.classList.remove("aberto"); abrirCaderno(); };
  }

  // ---------- Scotland Yard ----------
  function recompensaAtual() {
    const atrasado = Jogo.estado().minutos > prog.inicio + caso.prazoHoras * 60;
    return { valor: Math.round(caso.recompensa * prog.cliente / 100 * (atrasado ? 0.75 : 1)), atrasado };
  }
  function abrirYard() {
    if (prog.resolvido) { abrirCartao(Jogo.YARD, "O inspetor Lestrade ergue a xícara: \"Caso encerrado, Holmes. A Yard agradece.\"", ""); return; }
    const faltam = caso.perguntas.filter(q => !(prog.conclusoes[q.id] || "").trim());
    let html = `<div class="yard-lista">` + caso.perguntas.map(q => `<div class="yard-item"><b></b><p></p></div>`).join("") + `</div>`;
    html += faltam.length ? `<p class="yard-aviso">Escreva todas as conclusões no caderno antes de procurar Lestrade.</p><button class="cartao-acao" id="yard-caderno">ABRIR O CADERNO</button>`
                          : `<button class="cartao-acao" id="yard-apresentar">APRESENTAR AO INSPETOR LESTRADE</button>`;
    abrirCartao(Jogo.YARD, "O inspetor Lestrade tamborila os dedos na mesa. \"Então, Sr. Holmes? A Yard não tem o dia todo. O que o senhor descobriu?\"", html);
    $("cartao-desafio").querySelectorAll(".yard-item").forEach((el, k) => {
      const q = caso.perguntas[k]; el.querySelector("b").textContent = q.titulo; el.querySelector("p").textContent = prog.conclusoes[q.id] || "— sem conclusão —";
    });
    if (faltam.length) $("yard-caderno").onclick = () => { cartao.classList.remove("aberto"); abrirCaderno(); };
    else $("yard-apresentar").onclick = apresentar;
  }
  function apresentar() {
    const erradas = caso.perguntas.filter(q => !Jogo.confereConclusao(q, prog.conclusoes[q.id]));
    const box = $("cartao-desafio");
    if (!erradas.length) {
      const r = recompensaAtual();
      prog.resolvido = true; caso.situacao = "RESOLVIDO"; Jogo.ganhar(r.valor); Jogo.reputar(10); atualizarHud();
      box.innerHTML = `<div class="yard-resultado certo"><b>CASO RESOLVIDO</b><p class="r1"></p><p class="r2"></p></div><button class="cartao-acao" id="yard-fim">VOLTAR AO ARQUIVO</button>`;
      box.querySelector(".r1").textContent = `Lestrade aperta sua mão: "Brilhante, Holmes!"\nRecompensa: £ ${r.valor}${r.atrasado ? " (fora do prazo)" : ""} · Reputação +10`;
      box.querySelector(".r2").textContent = caso.epilogo;
      $("yard-fim").onclick = () => { cartao.classList.remove("aberto"); App.ir("casos"); };
    } else {
      prog.tentativas++; prog.cliente = Math.max(25, prog.cliente - 25); Jogo.reputar(-8); atualizarHud();
      const r = recompensaAtual();
      box.innerHTML = `<div class="yard-resultado errado"><b>LESTRADE NÃO SE CONVENCEU</b><p class="r1"></p></div><button class="cartao-acao" id="yard-voltar">VOLTAR A INVESTIGAR</button>`;
      box.querySelector(".r1").textContent = `"Isso não se sustenta, Holmes." Ele não aceitou:\n` + erradas.map(q => "• " + q.titulo).join("\n") +
        `\n\nReputação −8. O cliente ficou desconfiado: a recompensa caiu para £ ${r.valor}.`;
      $("yard-voltar").onclick = () => { cartao.classList.remove("aberto"); abrirCaderno(); };
    }
    Jogo.salvar();
    box.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // ---------- caderno ----------
  function abrirCaderno(idCaso) {
    const sel = $("caderno-caso"), lista = (window.CASOS || []).filter(c => c.perguntas && (Jogo.estado().casos[c.id] || c === caso));
    sel.innerHTML = lista.map(c => `<option value="${c.id}">Caso ${c.id} · ${c.titulo}</option>`).join("");
    sel.value = idCaso || caso.id;
    sel.onchange = () => desenharCaderno(lista.find(c => c.id === sel.value));
    desenharCaderno(lista.find(c => c.id === sel.value));
    caderno.classList.add("aberto");
  }
  function desenharCaderno(c) {
    const p = Jogo.caso(c), corpo = $("caderno-corpo"), ativo = c === caso;
    const prazo = Jogo.hora(p.inicio + c.prazoHoras * 60);
    const valor = Math.round(c.recompensa * p.cliente / 100);
    corpo.innerHTML = `<div class="cad-cab"><span>${p.resolvido ? "RESOLVIDO" : "Recompensa £ " + valor}</span><span>Prazo: ${prazo}</span><span>Agora: ${Jogo.hora()}</span></div>`;
    c.perguntas.forEach(q => {
      const sec = document.createElement("section"); sec.className = "cad-pergunta";
      const pistas = c.locais.filter(l => p.resolvidos.includes(l.id) && l.pista.pergunta === q.id);
      sec.innerHTML = `<h3></h3><ul></ul><label>Sua conclusão</label><textarea rows="2" placeholder="escreva aqui o que você deduziu"></textarea>`;
      sec.querySelector("h3").textContent = q.titulo;
      const ul = sec.querySelector("ul");
      if (!pistas.length) ul.innerHTML = `<li class="vazia">nenhuma pista ainda</li>`;
      pistas.forEach(l => { const li = document.createElement("li"); li.innerHTML = "<i></i> "; li.querySelector("i").textContent = l.nome + ":"; li.append(l.pista.texto); ul.appendChild(li); });
      const ta = sec.querySelector("textarea"); ta.value = p.conclusoes[q.id] || ""; ta.readOnly = p.resolvido;
      ta.oninput = () => { p.conclusoes[q.id] = ta.value; Jogo.salvar(); };
      corpo.appendChild(sec);
    });
    if (!ativo) return;
    const locais = document.createElement("section"); locais.className = "cad-locais";
    locais.innerHTML = `<h3>Locais</h3>`;
    todos().forEach(l => {
      const st = l.id === "221b" || l.id === "yard" ? "" : p.resolvidos.includes(l.id) ? "✓ pista" : p.visitados.includes(l.id) ? "visitado" : "";
      const linha = document.createElement("div"); linha.className = "cad-local" + (p.pos === l.id ? " aqui" : "");
      linha.innerHTML = `<span class="n"></span><span class="b"></span><span class="st">${p.pos === l.id ? "você está aqui" : st}</span><button>ver no mapa</button>`;
      linha.querySelector(".n").textContent = l.nome; linha.querySelector(".b").textContent = l.bairro;
      linha.querySelector("button").onclick = async () => { caderno.classList.remove("aberto"); await voarPara(l.x, l.y, ZOOM_LOCAL, 800); destacar(l); };
      locais.appendChild(linha);
    });
    corpo.appendChild(locais);
  }
  function destacar(l) {
    const m = marcadores.find(k => k.x === l.x && k.y === l.y && !k.el.classList.contains("sherlock"));
    if (m) { m.el.classList.remove("destaque"); void m.el.offsetWidth; m.el.classList.add("destaque"); }
  }
  $("btn-caderno").onclick = () => abrirCaderno();
  $("caderno-fechar").onclick = () => caderno.classList.remove("aberto");

  // ---------- entrada no mapa ----------
  App.aoEntrar.mapa = (c) => {
    caso = c || App.estado.caso; if (!caso) return;
    prog = Jogo.caso(caso); Jogo.salvar();
    $("mapa-caso").textContent = `Caso ${caso.id} · ${caso.titulo}`;
    fecharPainel(); cartao.classList.remove("aberto"); caderno.classList.remove("aberto");
    requestAnimationFrame(() => {
      limites(); s = minS; montar();
      const aqui = achar(prog.pos) || Jogo.BASE;
      tx = vp.clientWidth / 2 - aqui.x * s; ty = vp.clientHeight / 2 - aqui.y * s; aplicar();
    });
    Som.musica("partida");
  };
})();
