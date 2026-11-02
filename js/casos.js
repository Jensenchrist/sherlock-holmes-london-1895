/* Gaveta de casos e ficha do caso. */
(() => {
  const casos = window.CASOS;
  let i = 0;
  const ficha = document.getElementById("ficha-gaveta");
  const esq = document.querySelector("#casos .seta-esq"), dir = document.querySelector("#casos .seta-dir");
  document.getElementById("placa-gaveta").textContent = `CASOS ${casos[0].id} – ${casos[casos.length - 1].id}`;

  // cada caso só abre depois que o anterior for resolvido
  function lacrado(k) {
    const c = casos[k];
    if (c.bloqueado || c.reescrever) return true;
    if (k === 0) return false;
    const ant = Jogo.estado().casos[casos[k - 1].id];
    return !(ant && ant.resolvido);
  }
  function preencher() {
    const c = casos[i], tranc = lacrado(i);
    document.getElementById("fg-num").textContent = "Nº " + c.id;
    document.getElementById("fg-titulo").textContent = c.titulo;
    document.getElementById("fg-local").textContent = c.reescrever ? "em reescrita" : tranc ? "caso lacrado" : `${c.endereco} · ${c.ano}`;
    ficha.style.opacity = tranc ? 0.82 : 1;
    esq.disabled = i === 0; dir.disabled = i === casos.length - 1;
  }
  function trocar(novo) {
    if (novo < 0 || novo >= casos.length || novo === i) return;
    ficha.classList.add("escondida");
    setTimeout(() => { i = novo; preencher(); ficha.classList.remove("escondida"); }, 380);
  }
  esq.onclick = () => trocar(i - 1);
  dir.onclick = () => trocar(i + 1);
  ficha.onclick = () => {
    const c = casos[i];
    if (c.reescrever) { App.aviso(`CASO Nº ${c.id}\n\nEste caso está sendo reescrito para o novo jeito de investigar.`); return; }
    if (lacrado(i)) { App.aviso(`CASO Nº ${c.id}\n\nEste caso está lacrado.\nResolva o caso Nº ${casos[i - 1].id} para abri-lo.`); return; }
    App.estado.caso = c; App.ir("ficha", c);
  };
  // deslizar o dedo troca de ficha
  let x0 = null;
  const palco = document.getElementById("palco-casos");
  palco.addEventListener("touchstart", e => { x0 = e.touches[0].clientX; }, { passive: true });
  palco.addEventListener("touchend", e => {
    if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; x0 = null;
    if (Math.abs(dx) > 45) trocar(i + (dx < 0 ? 1 : -1));
  });

  App.aoEntrar.casos = () => {
    // volta a gaveta para o caso mais recente que já pode ser jogado
    if (!App.estado.caso) { let k = 0; while (k + 1 < casos.length && !lacrado(k + 1)) k++; i = k; }
    else { const k = casos.indexOf(App.estado.caso); if (k >= 0) { i = k; if (App.estado.caso.situacao === "RESOLVIDO" && k + 1 < casos.length && !lacrado(k + 1)) i = k + 1; } }
    preencher(); ficha.classList.add("escondida");
    setTimeout(() => ficha.classList.remove("escondida"), 450);
    Som.musica("abertura");
  };

  // ---------- ficha do caso ----------
  let ultimo = null;
  App.aoEntrar.ficha = (dado) => {
    const c = dado || App.estado.caso; if (!c) return;
    document.getElementById("f-num").textContent = c.id;
    document.getElementById("f-titulo").textContent = c.titulo;
    document.getElementById("f-local").textContent = "LOCAL: " + c.endereco;
    document.getElementById("f-data").textContent = "DATA: " + c.data;
    document.getElementById("f-objetivo").textContent = c.objetivo;
    document.getElementById("f-situacao").textContent = c.situacao;
    const relato = document.getElementById("f-relato");
    if (ultimo !== c.id) setTimeout(() => App.datilografar(relato, c.relato), 500);
    ultimo = c.id;
  };
  document.getElementById("btn-ir-caso").onclick = () => App.ir("mapa", App.estado.caso);
})();
