"""Acha os pontos de luz desenhados no mapa-mestre (lampiões e janelas acesas)
e grava data/lampioes.js, usado na animação de noite do mapa."""
from PIL import Image
import numpy as np, cv2, json
Image.MAX_IMAGE_PIXELS = None
im = np.asarray(Image.open('assets/master/mapa_v6.jpg').convert('RGB'))
lum = cv2.cvtColor(im, cv2.COLOR_RGB2GRAY)
r, g, b = [im[..., i].astype(int) for i in range(3)]
th = cv2.morphologyEx(lum, cv2.MORPH_TOPHAT, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (31, 31)))
bg = cv2.blur(lum, (41, 41))
core = ((r > 245) & (g > 222) & (b > 110) & (b < 225) & (th > 85) & (bg < 150)).astype(np.uint8)
# exclui as placas com nomes (posições na vista geral 1800 px de largura: x, y, meia-largura, meia-altura)
K = 6620 / 1800
PLACAS = [(550,62,70,22),(900,68,62,22),(1075,160,62,36),(1400,158,62,22),(1680,168,52,22),(415,200,48,36),(435,265,40,22),
          (540,275,70,22),(1540,265,66,22),(1075,355,70,22),(265,400,75,22),(615,408,48,36),(1615,425,60,40),(890,477,48,22),
          (665,530,62,22),(835,555,70,22),(870,645,66,22),(125,662,70,22),(1540,705,66,22),(725,800,80,24),(1205,818,62,22),
          (230,855,55,22),(925,908,55,22),(180,100,180,100),(1720,65,80,65),(905,985,90,30)]
for x, y, w, h in PLACAS:
    core[int((y - h) * K):int((y + h) * K), max(0, int((x - w) * K)):int((x + w) * K)] = 0
n, lab, st, cent = cv2.connectedComponentsWithStats(core, 8)
pts = [(int(c[0]), int(c[1]), int(s[4])) for c, s in zip(cent[1:], st[1:]) if 3 <= s[4] <= 160 and s[2] <= 16 and s[3] <= 16]
pts.sort(key=lambda p: -p[2]); keep = []
grid = {}
for p in pts:
    gx, gy = p[0] // 24, p[1] // 24
    if any((p[0]-q[0])**2 + (p[1]-q[1])**2 <= 24**2 for dx in (-1, 0, 1) for dy in (-1, 0, 1) for q in grid.get((gx+dx, gy+dy), [])): continue
    keep.append(p); grid.setdefault((gx, gy), []).append(p)
keep.sort(key=lambda p: (p[1], p[0]))
flat = []
for x, y, a in keep: flat += [x, y, min(9, max(1, a // 12))]
open('data/lampioes.js', 'w').write('/* gerado por tools/achar_lampioes.py: x, y, tamanho (1-9) de cada luz do mapa */\nwindow.LAMPIOES=' + json.dumps(flat, separators=(',', ':')) + ';\n')
print(len(keep), 'luzes')
