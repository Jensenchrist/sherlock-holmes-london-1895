# Recorta da pintura os objetos que ficam na frente das pessoas (postes, lampiões, árvores, bancos)
import numpy as np, json, sys
from PIL import Image, ImageFilter
import scipy.ndimage as nd
A = sys.argv[1]
R = {
 "baker": ("baker_vazia.jpg", [
   ("poste", (352,170,70,282), 447), ("poste", (668,0,52,168), 165), ("poste", (312,925,64,240), 1162),
   ("pino", (672,440,36,58), 497), ("pino", (720,535,36,62), 596), ("pino", (922,592,36,56), 646),
   ("pino", (962,840,36,62), 902), ("pino", (662,1024,36,60), 1083), ("pino", (662,1246,36,62), 1307),
   ("pino", (157,588,36,56), 642), ("pino", (247,846,36,88), 933),
   ("arvore", (270,0,320,175), 165), ("arvore", (950,550,122,320), 860),
   ("arvore", (500,1320,300,147), 1467), ("arvore", (190,1380,180,87), 1467)]),
 "whitehall": ("whitehall_vazia.jpg", [
   ("poste", (310,140,46,274), 412), ("poste", (543,0,48,144), 140), ("poste", (258,742,58,190), 930),
   ("pino", (162,466,36,58), 523), ("pino", (542,362,36,50), 411), ("pino", (657,466,36,58), 523),
   ("pino", (214,708,36,62), 769), ("pino", (610,736,36,62), 797),
   ("arvore", (285,0,190,125), 130), ("arvore", (770,410,110,290), 690),
   ("arvore", (420,1040,310,128), 1168), ("arvore", (175,1100,130,68), 1168)]),
 "scotland": ("scotland_vazia.jpg", [
   ("poste", (188,655,92,188), 840), ("poste", (603,655,92,188), 840),
   ("pino", (22,366,36,52), 416), ("pino", (172,418,36,52), 470), ("pino", (222,418,36,52), 470),
   ("pino", (642,418,36,52), 470), ("pino", (694,418,36,52), 470), ("pino", (0,796,30,52), 848),
   ("banco", (38,795,120,58), 852), ("banco", (444,790,136,64), 852),
   ("arvore", (0,50,115,345), 392), ("arvore", (785,185,95,270), 452),
   ("arvore", (0,595,70,190), 790), ("arvore", (825,630,55,160), 790)]),
}
saida = {}
for cena, (img, itens) in R.items():
    im = np.asarray(Image.open(f"{A}/{img}").convert("RGB")).astype(np.float32)
    lista = []
    for k, (tipo, (x, y, w, h), base) in enumerate(itens):
        c = im[y:y+h, x:x+w]
        lum = c.mean(2); sat = c.max(2) - c.min(2)
        r, g, b = c[...,0], c[...,1], c[...,2]
        if tipo == "arvore":
            verde = (g > b + 25) & (g > r * 0.75) & (lum > 40)      # folhas verdes e amareladas
            m = verde | ((lum < 70) & nd.binary_dilation(verde, iterations=4))  # sombra entre as folhas
            m = nd.binary_opening(m, iterations=1)
            m = nd.binary_closing(m, iterations=2)
            lab, n = nd.label(m)
            if n:
                tam = nd.sum(m, lab, range(1, n + 1))
                m = np.isin(lab, 1 + np.where(tam > 400)[0])
        else:
            lim = 110 if tipo == "banco" else 92
            m = (lum < lim)                                           # ferro escuro, madeira do banco
            if tipo == "poste":
                vidro = (sat > 80) & (lum > 140) & (r > b + 60)       # vidro aceso do lampião
                topo = np.zeros_like(m); topo[: int(h * (0.45 if h < 200 else 0.35))] = True
                perto = nd.binary_dilation(m, iterations=5)
                m |= vidro & topo & perto
            m = nd.binary_closing(m, iterations=2)
            m = nd.binary_fill_holes(m)
            lab, n = nd.label(m)
            if n:
                tam = nd.sum(m, lab, range(1, n + 1))
                m = np.isin(lab, 1 + np.where(tam > 60)[0])
        # só a parte acima da base cobre quem está atrás
        a = Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.8))
        rgba = np.dstack([c.astype(np.uint8), np.asarray(a)])
        nome = f"{cena}_{k:02d}.png"
        Image.fromarray(rgba, "RGBA").save(f"{A}/recortes/{nome}", optimize=True)
        lista.append([tipo, x, y, w, h, base, nome])
    saida[cena] = lista
json.dump(saida, open(f"{A}/recortes/recortes.json", "w"), indent=0)
print("ok")
