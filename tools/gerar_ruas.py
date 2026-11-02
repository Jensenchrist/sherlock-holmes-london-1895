"""Gera assets/ruas.png: grade de custo para o caminho de Holmes pelas ruas do mapa-mestre v6.
Cada pixel = 6x6 px do mapa. Preto = rua, cinza = prédios/parques, branco = água (pontes contam como rua)."""
from PIL import Image
import numpy as np, cv2
Image.MAX_IMAGE_PIXELS = None
F = 6
src = Image.open('assets/master/mapa_v6.jpg').convert('RGB')
sm = np.asarray(src.resize((6620 // F, 3726 // F), Image.BOX))
hsv = cv2.cvtColor(sm, cv2.COLOR_RGB2HSV).astype(int)
H, S, V = hsv[..., 0], hsv[..., 1], hsv[..., 2]
rua = ((V > 165) & (S > 35) & (S < 140) & (H >= 8) & (H <= 28)).astype(np.uint8)
rua = cv2.morphologyEx(rua, cv2.MORPH_OPEN, np.ones((2, 2), np.uint8))
rua = cv2.morphologyEx(rua, cv2.MORPH_CLOSE, np.ones((3, 3), np.uint8))
agua = ((H >= 85) & (H <= 115) & (S > 40) & (V > 60)).astype(np.uint8)
agua = cv2.morphologyEx(agua, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
agua = cv2.morphologyEx(agua, cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8))
g = np.full(rua.shape, 128, np.uint8)
g[agua > 0] = 255
g[rua > 0] = 0
Image.fromarray(g).save('assets/ruas.png', optimize=True)
print(g.shape)
