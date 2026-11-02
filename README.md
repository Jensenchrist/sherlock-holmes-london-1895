# Sherlock Holmes — Londres 1895

Jogo de investigação para iPhone, roda no navegador e instala como app (Compartilhar → Adicionar à Tela de Início).

**Versão 0.1 (protótipo):** abertura animada, gaveta de casos, ficha do caso, mapa com vista geral → v6 na pinça e bolinhas de missão.

## Estrutura
- `index.html`, `css/`, `js/` — o jogo
- `data/casos.js` — os casos (texto, locais no mapa, solução). Coordenadas = pixels do mapa-mestre v6 (6620 × 3726)
- `assets/img/` — capa, gaveta, ficha, vista geral, ícones
- `assets/master/mapa_v6.jpg` — mapa-mestre; `assets/tiles/` é gerado dele com `python3 tools/gerar_tiles.py`
- `assets/audio/` — `abertura.mp3` e `partida.mp3` (músicas do Suno; o jogo funciona sem elas)
- `legado/` — protótipos antigos do mapa A2
