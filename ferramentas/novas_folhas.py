# Veículos subindo a rua e nova passada do Holmes andando para a câmera.
import sys, numpy as np
from PIL import Image
sys.path.insert(0, sys.argv[3])
S, A = sys.argv[1], sys.argv[2]
from recortar_sprites import chave
import scipy.ndimage as nd

for n in ['cab1', 'cab2', 'carga', 'barris']:
    im = chave(f'{S}/v_{n}_sobe.jpg'); al = np.asarray(im)[:, :, 3]
    rows = np.where((al > 40).sum(1) > 3)[0]
    tira = im.crop((0, rows.min() - 6, 1024, rows.max() + 6))
    tira.save(f'{A}/veiculos/{n}_sobe.png', optimize=True)
    print(n, tira.size)

# --- Holmes: troca a linha "andando para baixo" da folha ---
folha = Image.open(f'{A}/sherlock.png').convert('RGBA')
orig = np.asarray(folha).astype(np.float32)
ref = orig[0:256, :, :]
m = ref[..., 3] > 200
# altura e linha dos pés na folha atual (média dos 4 quadros)
alts, pes = [], []
for k in range(4):
    a = orig[0:256, k*256:(k+1)*256, 3] > 100
    ys = np.where(a.sum(1) > 2)[0]; alts.append(ys.max() - ys.min()); pes.append(ys.max())
alt, pe = np.mean(alts), np.mean(pes)
nova = chave(f'{S}/sh_frente_b.jpg')
arr = np.asarray(nova).astype(np.float32)
# acerta as cores com a folha antiga (média e contraste por canal)
mn = arr[..., 3] > 200
for c in range(3):
    a, b = arr[..., c][mn], ref[..., c][m]
    arr[..., c] = np.clip((arr[..., c] - a.mean()) / a.std() * b.std() * 1.05 + b.mean(), 0, 255)
nova = Image.fromarray(arr.astype(np.uint8), 'RGBA')
saida = folha.copy()
saida.paste(Image.new('RGBA', (1024, 256), (0, 0, 0, 0)), (0, 0))
for k in range(4):
    cel = nova.crop(((k % 2) * 512, (k // 2) * 512, (k % 2) * 512 + 512, (k // 2) * 512 + 512))
    a = np.asarray(cel)[..., 3]
    # o corpo (sem a sombra clara) define altura
    corpo = a > 160
    ys = np.where(corpo.sum(1) > 2)[0]; xs = np.where(corpo.sum(0) > 2)[0]
    esc = alt / (ys.max() - ys.min())
    cel = cel.resize((round(512 * esc), round(512 * esc)), Image.LANCZOS)
    cx = (xs.min() + xs.max()) / 2 * esc; py = ys.max() * esc
    saida.alpha_composite(cel, (int(k * 256 + 128 - cx), int(pe - py)))
    # limpa o que vazou para a célula vizinha
lin = np.asarray(saida).copy()
for k in range(4):
    pass
saida.save(f'{A}/sherlock.png', optimize=True)
print('holmes ok', alt, pe)
