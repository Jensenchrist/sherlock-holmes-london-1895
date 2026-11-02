/* Navegação entre telas, tamanho das artes e estado geral. */
window.App = (() => {
  const PROPORCAO = { inicio: [1179, 2556], abertura: [1179, 2556], casos: [1520, 2688], ficha: [1520, 2688] };
  const estado = { tela: "inicio", caso: null };
  const telas = {};
  const aoEntrar = {};

  function ajustarPalcos() {
    // No iPhone instalado (tela cheia), innerHeight às vezes vem menor que a tela real e a arte
    // fica cortada em cima com uma faixa preta embaixo. Usa a altura real da tela nesses casos.
    const app = navigator.standalone || matchMedia("(display-mode: standalone)").matches;
    const vw = window.innerWidth;
    let vh = Math.max(window.innerHeight, document.documentElement.clientHeight);

    document.documentElement.style.setProperty("--altura", vh + "px");
    document.querySelectorAll(".tela").forEach(t => {
      const p = t.querySelector(".palco"); if (!p) return;
      const [w, h] = PROPORCAO[t.id];
      // celular em pé: preenche a tela (cover); tela larga (computador): mostra a arte inteira
      const esc = vw / vh < 0.75 ? Math.max(vw / w, vh / h) : Math.min(vw / w, vh / h);
      p.style.width = (w * esc) + "px"; p.style.height = (h * esc) + "px";
    });
  }

  function ir(nome, dados) {
    if (!telas[nome]) return;
    Object.values(telas).forEach(t => t.classList.toggle("ativa", t.id === nome));
    estado.tela = nome;
    if (aoEntrar[nome]) aoEntrar[nome](dados);
  }

  function aviso(texto) {
    document.getElementById("aviso-texto").textContent = texto;
    document.getElementById("aviso").classList.add("aberto");
  }

  /* efeito máquina de escrever */
  function datilografar(el, texto, ms = 22) {
    if (el._timer) clearTimeout(el._timer);
    el.textContent = ""; el.classList.add("digitando");
    let i = 0;
    (function passo() {
      el.textContent = texto.slice(0, i++);
      if (i <= texto.length) el._timer = setTimeout(passo, texto[i - 2] === "." ? ms * 8 : ms);
      else el.classList.remove("digitando");
    })();
    el.onclick = () => { clearTimeout(el._timer); el.textContent = texto; el.classList.remove("digitando"); };
  }

  function iniciar() {
    document.querySelectorAll(".tela").forEach(t => telas[t.id] = t);
    ajustarPalcos();
    window.addEventListener("resize", ajustarPalcos);
    window.addEventListener("orientationchange", () => setTimeout(ajustarPalcos, 300));
    window.addEventListener("pageshow", () => setTimeout(ajustarPalcos, 100));
    setTimeout(ajustarPalcos, 400);
    document.addEventListener("click", e => {
      const b = e.target.closest("[data-ir]"); if (b) ir(b.dataset.ir);
      const s = e.target.closest(".som"); if (s) { const m = Som.alternarMudo(); document.querySelectorAll(".som").forEach(x => x.classList.toggle("mudo", m)); }
    });
    document.querySelectorAll(".som").forEach(x => x.classList.toggle("mudo", Som.mudo));
    document.getElementById("aviso-ok").onclick = () => document.getElementById("aviso").classList.remove("aberto");
    document.querySelector('[data-acao="manual"]').onclick = () => aviso("MANUAL\n\nEscolha um caso na gaveta e leia a ficha.\n\nNo mapa, aproxime com dois dedos: os locais do caso aparecem como bolinhas vermelhas.\n\nToque num local para viajar: a pé (grátis e lento), de carruagem (rápida, custa libras) ou de barco pelo Tâmisa.\n\nEm cada local há um desafio. Resolva e a pista vai para o caderno.\n\nNo 221B, releia as pistas e escreva suas conclusões. Na Scotland Yard, apresente-as a Lestrade. Errar custa reputação e diminui a recompensa");
    document.querySelector('[data-acao="info"]').onclick = () => aviso("SHERLOCK HOLMES — LONDRES 1895\n\nVersão 0.1 (protótipo)\nCriado por Jeferson Justen Christ.");
    document.getElementById("btn-iniciar").onclick = () => { Som.iniciar(); ir("abertura"); };
  }

  return { iniciar, ir, aviso, datilografar, estado, aoEntrar, ajustarPalcos };
})();
document.addEventListener("DOMContentLoaded", () => App.iniciar());
