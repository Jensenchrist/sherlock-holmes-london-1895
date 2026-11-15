import sys, numpy as np
from PIL import Image, ImageFilter
S, A = sys.argv[1], sys.argv[2]   # pasta das fontes, pasta arte do godot
import os
os.makedirs(A+'/pessoas', exist_ok=True); os.makedirs(A+'/veiculos', exist_ok=True)

def fundo_local(rgb):
    # estima o cinza do fundo em cada ponto, ignorando o que for figura
    g = rgb.astype(np.float32)
    med = np.median(np.concatenate([g[:8].reshape(-1,3), g[-8:].reshape(-1,3), g[:,:8].reshape(-1,3), g[:,-8:].reshape(-1,3)]), axis=0)
    bg = np.broadcast_to(med, g.shape).copy()
    for _ in range(3):
        d = np.abs(g - bg).sum(2)
        m = d < 30
        fill = np.where(m[...,None], g, bg)
        im = Image.fromarray(fill.clip(0,255).astype(np.uint8)).resize((32,32), Image.BOX).resize(g.shape[1::-1], Image.BILINEAR)
        bg = np.asarray(im).astype(np.float32)
    return bg

def chave(path):
    rgb = np.asarray(Image.open(path).convert('RGB')).astype(np.float32)
    bg = fundo_local(rgb)
    d = np.sqrt(((rgb - bg)**2).sum(2))
    # sombra: mais escura que o fundo, sem cor -> vira preto translúcido
    lum = rgb.mean(2); lbg = bg.mean(2)
    sat = rgb.max(2) - rgb.min(2)
    a = np.clip((d - 10) / 45, 0, 1)
    # recupera a cor sem o fundo
    aa = np.maximum(a, 1e-3)[...,None]
    col = (rgb - (1 - a[...,None]) * bg) / aa
    # sombra: cinza sem cor, mais escuro que o fundo e ligada ao fundo
    import scipy.ndimage as nd
    cand = (sat < 18) & (lum < lbg - 5) & (lum > 85)
    fundo = nd.binary_dilation(d < 10, iterations=2)
    lab, n = nd.label(cand)
    toca = np.unique(lab[fundo & cand])
    sombra = np.isin(lab, toca[toca > 0])
    a = np.where(sombra, np.clip((lbg - lum) / 150, 0, 0.5), a)
    col = np.where(sombra[...,None], 0, col)
    # suaviza a borda
    al = Image.fromarray((a*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.6))
    out = np.dstack([col.clip(0,255).astype(np.uint8), np.asarray(al)])
    return Image.fromarray(out, 'RGBA')

for n in ['cavalheiro','dama','senhora','guarda','jornaleiro','carregador']:
    chave(f'{S}/p_{n}.jpg').save(f'{A}/pessoas/{n}.png', optimize=True)
    print('pessoa', n)

for n in ['cab1','cab2','carga','barris']:
    im = chave(f'{S}/v_{n}.jpg'); al = np.asarray(im)[:,:,3]
    for parte, (y0, y1) in {'lado': (0, 512), 'frente': (512, 1024)}.items():
        rows = np.where((al[y0:y1] > 40).sum(1) > 3)[0]
        t, b = y0 + rows.min() - 6, y0 + rows.max() + 6
        tira = im.crop((0, t, 1024, b))
        tira.save(f'{A}/veiculos/{n}_{parte}.png', optimize=True)
        print('veiculo', n, parte, tira.size)
