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
# exclui as placas de pergaminho (nomes dos bairros)
perg = ((r > 205) & (g > 175) & (b > 110) & (b < 205) & (r - b > 30)).astype(np.uint8)
perg = cv2.morphologyEx(perg, cv2.MORPH_OPEN, np.ones((25, 25), np.uint8))
perg = cv2.dilate(perg, np.ones((31, 31), np.uint8))
core[perg > 0] = 0
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
