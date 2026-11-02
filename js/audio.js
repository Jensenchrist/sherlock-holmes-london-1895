/* Som do jogo: músicas (MP3 do Suno, opcionais) e o Big Ben sintetizado. */
window.Som = (() => {
  const MUSICAS = { abertura: "assets/audio/abertura.mp3", partida: "assets/audio/partida.mp3" };
  let ctx = null, saida = null, eco = null, mudo = false, faixaAtual = null, nomeAtual = null;
  try { mudo = localStorage.getItem("sh_mudo") === "1"; } catch (e) {}

  function iniciar() {
    if (ctx) { ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    saida = ctx.createGain(); saida.gain.value = mudo ? 0 : 1; saida.connect(ctx.destination);
    // eco longo de rua: impulso de ruído com decaimento
    eco = ctx.createConvolver();
    const len = ctx.sampleRate * 4, buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) { const d = buf.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3); }
    eco.buffer = buf;
    const ecoGanho = ctx.createGain(); ecoGanho.gain.value = 0.55; eco.connect(ecoGanho).connect(saida);
  }

  /* um toque de sino: parciais inarmônicas com decaimento, filtradas como se viessem de longe */
  function sino(freq, quando, vol) {
    const t = ctx.currentTime + quando;
    const filtro = ctx.createBiquadFilter(); filtro.type = "lowpass"; filtro.frequency.value = 2200;
    const g = ctx.createGain(); g.gain.value = vol;
    filtro.connect(g); g.connect(saida); g.connect(eco);
    [[0.5, 0.5, 6], [1, 1, 4.5], [1.19, 0.45, 3], [1.5, 0.35, 2.5], [2, 0.3, 2], [2.74, 0.18, 1.4], [3.0, 0.12, 1.1]].forEach(([r, a, dur]) => {
      const o = ctx.createOscillator(), e = ctx.createGain();
      o.frequency.value = freq * r; o.type = "sine";
      e.gain.setValueAtTime(0.0001, t); e.gain.exponentialRampToValueAtTime(a, t + 0.01); e.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(e).connect(filtro); o.start(t); o.stop(t + dur + 0.1);
    });
  }

  /* carrilhão de Westminster (um quarto de hora) + badaladas da hora */
  const N = { gs: 415.3, fs: 369.99, e: 329.63, b: 246.94 };
  const QUARTOS = [["gs","fs","e","b"],["e","gs","fs","b"],["e","fs","gs","e"],["gs","e","fs","b"],["b","fs","gs","e"]];
  function bigBen(completo) {
    if (!ctx || mudo) return;
    const seq = completo ? [QUARTOS[1], QUARTOS[2], QUARTOS[3], QUARTOS[4]] : [QUARTOS[Math.floor(Math.random() * 5)]];
    let t = 0.2;
    seq.forEach(q => { q.forEach((n, i) => { sino(N[n], t, 0.09); t += i === 3 ? 1.9 : 0.85; }); t += 0.6; });
    if (completo) { const horas = 1 + Math.floor(Math.random() * 3); for (let h = 0; h < horas; h++) { sino(82.4, t, 0.16); t += 2.6; } }
  }

  function musica(nome) {
    if (nomeAtual === nome) return;
    const antiga = faixaAtual;
    if (antiga) fade(antiga, 0, 1500, () => antiga.pause());
    nomeAtual = nome; faixaAtual = null;
    if (!nome || !MUSICAS[nome]) return;
    const a = new Audio(MUSICAS[nome]); a.loop = true; a.volume = 0;
    a.addEventListener("error", () => { if (faixaAtual === a) faixaAtual = null; });
    faixaAtual = a;
    a.play().then(() => fade(a, mudo ? 0 : 0.55, 2500)).catch(() => {});
  }
  function fade(el, alvo, ms, fim) {
    const ini = el.volume, t0 = performance.now();
    (function passo(t) { const p = Math.min(1, (t - t0) / ms); el.volume = Math.min(1, Math.max(0, ini + (alvo - ini) * p)); if (p < 1) requestAnimationFrame(passo); else if (fim) fim(); })(t0);
  }
  function alternarMudo() {
    mudo = !mudo;
    try { localStorage.setItem("sh_mudo", mudo ? "1" : "0"); } catch (e) {}
    if (saida) saida.gain.value = mudo ? 0 : 1;
    if (faixaAtual) faixaAtual.volume = mudo ? 0 : 0.55;
    return mudo;
  }
  /* máquina de escrever: estalo curto da tecla (ruído filtrado) e o sininho do fim de linha */
  let ruido = null, ultimaTecla = 0;
  function tecla(fraco) {
    if (!ctx || mudo) return;
    const agora = ctx.currentTime; if (agora - ultimaTecla < 0.035) return; ultimaTecla = agora;
    if (!ruido) { ruido = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate); const d = ruido.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 6); }
    const src = ctx.createBufferSource(); src.buffer = ruido; src.playbackRate.value = 0.8 + Math.random() * 0.5;
    const f = ctx.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = 1800 + Math.random() * 1400; f.Q.value = 1.2;
    const g = ctx.createGain(); g.gain.value = fraco ? 0.18 : 0.45;
    src.connect(f).connect(g).connect(saida); src.start(agora);
    // batida grave do tipo no papel
    const o = ctx.createOscillator(), og = ctx.createGain(); o.frequency.value = 140 + Math.random() * 40;
    og.gain.setValueAtTime(fraco ? 0.05 : 0.12, agora); og.gain.exponentialRampToValueAtTime(0.0001, agora + 0.04);
    o.connect(og).connect(saida); o.start(agora); o.stop(agora + 0.05);
  }
  function campainha() {
    if (!ctx || mudo) return;
    const t = ctx.currentTime;
    [2637, 3520].forEach((fq, i) => { const o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.value = fq;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(i ? 0.03 : 0.08, t + 0.005); g.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);
      o.connect(g).connect(saida); o.start(t); o.stop(t + 1.3); });
  }
  return { iniciar, bigBen, musica, alternarMudo, tecla, campainha, get mudo() { return mudo; } };
})();
