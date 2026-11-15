# Pedestre: segue uma rota pelas calçadas, dá passagem ao Holmes e espera as carruagens.
# Figurantes fixos (florista, guarda, jornaleiro) ficam parados e só se afastam se o Holmes chegar perto.
extends Sprite2D

signal saiu

var main: Node
var rota := PackedVector2Array()
var i := 1
var vel := 50.0
var base := Vector2.ZERO      # ponto na rota, sem o desvio
var desvio := Vector2.ZERO
var fixo := false
var olhar := "baixo"
var quadro := 0.0
var espera := 0.0
var andando := false
var direcao := "baixo"
var luz: PointLight2D = null   # lanterna do guarda à noite

func iniciar(tex: Texture2D, esc: float) -> void:
	texture = tex
	hframes = 4
	vframes = 4
	offset = Vector2(0, -107)
	scale = Vector2.ONE * esc
	quadro = randf() * 4.0

func na_rota(r: PackedVector2Array, v: float, seg := 0, t := 0.0) -> void:
	rota = r
	vel = v
	i = seg + 1
	base = r[seg].lerp(r[seg + 1], t)
	position = base

func parado_em(p: Vector2, para: String) -> void:
	fixo = true
	base = p
	position = p
	olhar = para
	direcao = para

func pe() -> Vector2:
	return position

func _process(dt: float) -> void:
	if main == null:
		return
	var esc_rel: float = scale.x / 0.42
	# --- dá passagem ao Holmes ---
	var h: Vector2 = main.holmes.position
	var rel := base - h
	var raio := 70.0 * esc_rel
	var alvo_desvio := Vector2.ZERO
	var mov := Vector2.ZERO
	if not fixo and i < rota.size():
		mov = (rota[i] - base).normalized()
	if rel.length() < raio:
		var lado := Vector2(-mov.y, mov.x) if mov != Vector2.ZERO else rel.normalized()
		if lado.dot(rel) < 0:
			lado = -lado
		alvo_desvio = lado * (raio - rel.length() + 12.0 * esc_rel)
	desvio = desvio.lerp(alvo_desvio, min(1.0, dt * 3.5))

	# --- caminhar pela rota ---
	andando = false
	if not fixo and i < rota.size():
		var passo := vel * dt
		var prox := base + mov * passo
		var travado: bool = main.veiculo_em(prox + desvio, 10.0 * esc_rel)
		if travado and espera < 4.0:
			espera += dt
		else:
			if not travado:
				espera = 0.0
			var d := rota[i] - base
			if d.length() <= passo:
				base = rota[i]
				i += 1
				if i >= rota.size():
					saiu.emit()
					queue_free()
					return
			else:
				base += d.normalized() * passo
			andando = true
			if abs(d.x) > abs(d.y) * 1.1:
				direcao = "direita" if d.x > 0 else "esquerda"
			else:
				direcao = "baixo" if d.y > 0 else "cima"
	position = base + desvio

	# --- animação ---
	if andando:
		quadro = fmod(quadro + dt * 6.0, 4.0)
		var lin: int = {"baixo": 0, "cima": 1, "direita": 2, "esquerda": 2}[direcao]
		frame = lin * 4 + int(quadro)
		flip_h = direcao == "esquerda"
		offset = Vector2(0, -107 - abs(sin(quadro / 4.0 * TAU * 2.0)) * 5.0)
	else:
		offset = Vector2(0, -107)
		flip_h = false
		var para := olhar if fixo else direcao
		if fixo and desvio.length() >= 4.0:
			para = "esquerda" if rel.x > 0 else "direita"  # vira para o Holmes
		frame = {"baixo": 12, "cima": 13, "direita": 14, "esquerda": 15}[para]

	if luz:
		luz.energy = 0.9 * main.noite
		luz.position = Vector2(-45 if flip_h else 45, -55)
