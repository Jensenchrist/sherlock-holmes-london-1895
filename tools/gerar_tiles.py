"""Corta o mapa-mestre v6 em tiles de 512 px para o jogo.

Uso: python3 tools/gerar_tiles.py
Lê assets/master/mapa_v6.jpg e escreve assets/tiles/<nivel>/<col>_<lin>.jpg
  nível 0 = resolução nativa (6620 x 3726)
  nível 1 = metade (3310 x 1863)
Sempre corte os tiles a partir do mestre; nunca edite um tile solto.
"""
from pathlib import Path
from PIL import Image
import json

RAIZ = Path(__file__).resolve().parent.parent
MESTRE = RAIZ / "assets/master/mapa_v6.jpg"
SAIDA = RAIZ / "assets/tiles"
TAM = 512
NIVEIS = [1.0, 0.5]

Image.MAX_IMAGE_PIXELS = None
img = Image.open(MESTRE).convert("RGB")
W, H = img.size
info = {"largura": W, "altura": H, "tile": TAM, "niveis": []}
for n, esc in enumerate(NIVEIS):
    lv = img if esc == 1 else img.resize((round(W * esc), round(H * esc)), Image.LANCZOS)
    lw, lh = lv.size
    pasta = SAIDA / str(n)
    pasta.mkdir(parents=True, exist_ok=True)
    cols, lins = -(-lw // TAM), -(-lh // TAM)
    for c in range(cols):
        for l in range(lins):
            caixa = (c * TAM, l * TAM, min((c + 1) * TAM, lw), min((l + 1) * TAM, lh))
            lv.crop(caixa).save(pasta / f"{c}_{l}.jpg", quality=80, optimize=True, progressive=True)
    info["niveis"].append({"escala": esc, "colunas": cols, "linhas": lins})
    print(f"nível {n}: {cols} x {lins} tiles")
(SAIDA / "info.json").write_text(json.dumps(info, indent=2))
