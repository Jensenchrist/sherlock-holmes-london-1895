# Folhas dos barcos do Tâmisa: 4 quadros empilhados viram uma tira de 4 quadros lado a lado.
import sys, numpy as np
from PIL import Image
S, A, F = sys.argv[1], sys.argv[2], sys.argv[3]
sys.argv = [sys.argv[0], S, A]
sys.path.insert(0, F)
import importlib.util
spec = importlib.util.spec_from_file_location('rs', F + '/recortar_sprites.py')
src = open(F + '/recortar_sprites.py').read().split("for n in ['cavalheiro'")[0]   # só as funções
rs = {}
exec(src, rs)
import os
os.makedirs(A + '/barcos', exist_ok=True)
for n in ['lancha', 'lancha2', 'barcaca', 'bote']:
    im = rs['chave'](f'{S}/b_{n}.jpg'); al = np.asarray(im)[:, :, 3]
    caixas = []
    for k in range(4):
        sub = al[k*256:(k+1)*256] > 40
        ys = np.where(sub.sum(1) > 2)[0]; xs = np.where(sub.sum(0) > 2)[0]
        caixas.append((xs.min(), ys.min(), xs.max(), ys.max()))
    x0 = min(c[0] for c in caixas) - 4; x1 = max(c[2] for c in caixas) + 4
    y0 = min(c[1] for c in caixas) - 4; y1 = max(c[3] for c in caixas) + 4
    w, h = x1 - x0, y1 - y0
    tira = Image.new('RGBA', (w * 4, h), (0, 0, 0, 0))
    for k in range(4):
        tira.paste(im.crop((x0, k*256 + y0, x1, k*256 + y1)), (k * w, 0))
    tira.save(f'{A}/barcos/{n}.png', optimize=True)
    print(n, w, h)
