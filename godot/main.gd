# Protótipo: o Holmes anda pelas ruas de Londres (toque para andar),
# toca nos círculos dourados para abrir um local ou ir para outra rua.
extends Node2D

const CEL := 12  # tamanho da célula da grade de caminhada, em pixels da arte

const CENAS := {
	"baker": {
		"nome": "Baker Street",
		"img": "res://arte/baker_street.jpg",
		"escala": 0.42, "vel": 150.0,
		"inicio": Vector2(520, 720),
		"bloqueios": [Rect2(0, 0, 330, 520), Rect2(800, 0, 272, 560), Rect2(0, 880, 300, 587),
			Rect2(830, 900, 242, 567), Rect2(715, 1060, 135, 250)],
		"pontos": [
			{"pos": Vector2(262, 430), "aprox": Vector2(280, 560), "tipo": "cartao", "rotulo": "221B",
				"titulo": "221B Baker Street",
				"texto": "A sala do Holmes e do Dr. Watson: a lareira, o violino, o caderno de casos.\n\nNo jogo, é aqui que você relê as fichas e escreve suas conclusões."},
			{"pos": Vector2(865, 460), "aprox": Vector2(760, 480), "tipo": "cartao", "rotulo": "The Red Lion",
				"titulo": "Pub The Red Lion",
				"texto": "Fumaça de cachimbo e cerveja morna. O taberneiro baixa a voz: \"Dizem por aí que...\"\n\nUm local que pode ser pista ou só perda de tempo."},
			{"pos": Vector2(785, 1150), "aprox": Vector2(690, 1180), "tipo": "cartao", "rotulo": "The Times",
				"titulo": "Banca do The Times",
				"texto": "\"Relojoeiro some às nove em ponto!\", grita o jornaleiro.\n\nBoato de jornal: confiança baixa."},
			{"pos": Vector2(530, 1360), "aprox": Vector2(530, 1350), "tipo": "ir", "rotulo": "para Whitehall",
				"destino": "whitehall", "entrada": Vector2(460, 190)}
		]
	},
	"whitehall": {
		"nome": "Whitehall",
		"img": "res://arte/whitehall.jpg",
		"escala": 0.32, "vel": 115.0,
		"inicio": Vector2(460, 600),
		"bloqueios": [Rect2(0, 0, 280, 420), Rect2(600, 0, 280, 460), Rect2(0, 700, 250, 468),
			Rect2(680, 780, 200, 388), Rect2(590, 830, 110, 250)],
		"pontos": [
			{"pos": Vector2(160, 330), "aprox": Vector2(200, 470), "tipo": "ir", "rotulo": "Scotland Yard",
				"destino": "scotland", "entrada": Vector2(80, 600)},
			{"pos": Vector2(690, 330), "aprox": Vector2(590, 480), "tipo": "cartao", "rotulo": "Ministério",
				"titulo": "Ministério do Interior",
				"texto": "Portas fechadas e um porteiro de luvas brancas. \"Só com hora marcada, senhor.\""},
			{"pos": Vector2(640, 960), "aprox": Vector2(560, 900), "tipo": "cartao", "rotulo": "Florista",
				"titulo": "A florista da esquina",
				"texto": "\"Violetas, senhor? Vi um homem de cachecol vermelho passar correndo agora há pouco...\""},
			{"pos": Vector2(460, 120), "aprox": Vector2(460, 140), "tipo": "ir", "rotulo": "para Baker Street",
				"destino": "baker", "entrada": Vector2(530, 1380)}
		]
	},
	"scotland": {
		"nome": "Scotland Yard",
		"img": "res://arte/scotland_yard.jpg",
		"escala": 0.32, "vel": 115.0,
		"inicio": Vector2(460, 600),
		"bloqueios": [Rect2(0, 0, 880, 400), Rect2(0, 850, 880, 318), Rect2(170, 520, 210, 140),
			Rect2(200, 790, 65, 60), Rect2(615, 790, 70, 60)],
		"pontos": [
			{"pos": Vector2(460, 330), "aprox": Vector2(460, 440), "tipo": "cartao", "rotulo": "Lestrade",
				"titulo": "Inspetor Lestrade",
				"texto": "\"Então, Sr. Holmes? A Yard não tem o dia todo.\"\n\nNo jogo, é aqui que você apresenta suas conclusões e as fichas que as provam."},
			{"pos": Vector2(505, 815), "aprox": Vector2(505, 760), "tipo": "cartao", "rotulo": "Leitor",
				"titulo": "Um senhor lendo o jornal",
				"texto": "\"Leu isto? Dizem que o relojoeiro fugiu para a América!\"\n\nOuviu dizer: confiança baixa."},
			{"pos": Vector2(28, 600), "aprox": Vector2(45, 600), "tipo": "ir", "rotulo": "para Whitehall",
				"destino": "whitehall", "entrada": Vector2(200, 470)}
		]
	}
}

var mapa: Sprite2D
var holmes: Sprite2D
var camera: Camera2D
var astar := AStarGrid2D.new()
var tam := Vector2.ZERO
var caminho := PackedVector2Array()
var alvo_ponto = null
var direcao := "baixo"
var quadro := 0.0
var andando := false
var vel := 140.0
var marcadores: Array = []
var ocupado := false

var cartao: PanelContainer
var cartao_titulo: Label
var cartao_texto: Label
var lugar: Label
var veu: ColorRect
var dica: Label

func _ready() -> void:
	_montar_ui()
	holmes = Sprite2D.new()
	holmes.texture = load("res://arte/sherlock.png")
	holmes.hframes = 4
	holmes.vframes = 4
	holmes.offset = Vector2(0, -107)
	holmes.z_index = 2
	add_child(holmes)
	camera = Camera2D.new()
	camera.position_smoothing_enabled = true
	camera.position_smoothing_speed = 6.0
	add_child(camera)
	camera.make_current()
	get_viewport().size_changed.connect(_ajustar_zoom)
	carregar("baker", null)

# ---------- cenas ----------
func carregar(id: String, entrada) -> void:
	var c: Dictionary = CENAS[id]
	if mapa:
		mapa.queue_free()
	for m in marcadores:
		m.queue_free()
	marcadores.clear()
	caminho = PackedVector2Array()
	alvo_ponto = null

	mapa = Sprite2D.new()
	mapa.texture = load(c["img"])
	mapa.centered = false
	add_child(mapa)
	move_child(mapa, 0)
	tam = mapa.texture.get_size()

	astar = AStarGrid2D.new()
	astar.region = Rect2i(0, 0, int(tam.x / CEL) + 1, int(tam.y / CEL) + 1)
	astar.cell_size = Vector2(CEL, CEL)
	astar.offset = Vector2(CEL / 2.0, CEL / 2.0)
	astar.diagonal_mode = AStarGrid2D.DIAGONAL_MODE_ONLY_IF_NO_OBSTACLES
	astar.update()
	for r in c["bloqueios"]:
		var a := Vector2i(int(r.position.x / CEL), int(r.position.y / CEL))
		var b := Vector2i(int(r.end.x / CEL), int(r.end.y / CEL))
		for x in range(a.x, b.x + 1):
			for y in range(a.y, b.y + 1):
				var p := Vector2i(x, y)
				if astar.is_in_boundsv(p):
					astar.set_point_solid(p, true)

	for p in c["pontos"]:
		var m := Node2D.new()
		m.set_script(load("res://marcador.gd"))
		m.position = p["pos"]
		m.z_index = 1
		m.set_meta("ponto", p)
		var l := Label.new()
		l.text = p["rotulo"]
		l.add_theme_font_size_override("font_size", 26)
		l.add_theme_color_override("font_color", Color(1, 0.93, 0.75))
		l.add_theme_color_override("font_outline_color", Color(0.12, 0.07, 0.03))
		l.add_theme_constant_override("outline_size", 8)
		l.position = Vector2(-120, -58)
		l.size = Vector2(240, 30)
		l.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		l.mouse_filter = Control.MOUSE_FILTER_IGNORE
		m.add_child(l)
		add_child(m)
		marcadores.append(m)

	holmes.scale = Vector2.ONE * float(c["escala"])
	vel = float(c["vel"])
	holmes.position = entrada if entrada != null else c["inicio"]
	camera.limit_left = 0
	camera.limit_top = 0
	camera.limit_right = int(tam.x)
	camera.limit_bottom = int(tam.y)
	camera.position = holmes.position
	camera.reset_smoothing()
	_ajustar_zoom()
	lugar.text = c["nome"]

func _ajustar_zoom() -> void:
	if tam == Vector2.ZERO:
		return
	var vp := get_viewport_rect().size
	var z: float = max(vp.x / tam.x, vp.y / tam.y) * 1.2
	camera.zoom = Vector2(z, z)

# ---------- caminhar ----------
func _celula(p: Vector2) -> Vector2i:
	var c := Vector2i(int(p.x / CEL), int(p.y / CEL))
	c.x = clamp(c.x, 0, astar.region.size.x - 1)
	c.y = clamp(c.y, 0, astar.region.size.y - 1)
	return c

func _livre_perto(c: Vector2i) -> Vector2i:
	if not astar.is_point_solid(c):
		return c
	for r in range(1, 14):
		for dy in range(-r, r + 1):
			for dx in range(-r, r + 1):
				if max(abs(dx), abs(dy)) != r:
					continue
				var p := c + Vector2i(dx, dy)
				if astar.is_in_boundsv(p) and not astar.is_point_solid(p):
					return p
	return Vector2i(-1, -1)

func ir_para(p: Vector2, ponto) -> void:
	var de := _livre_perto(_celula(holmes.position))
	var ate := _livre_perto(_celula(p))
	if de.x < 0 or ate.x < 0:
		return
	caminho = astar.get_point_path(de, ate)
	if caminho.size() > 1:
		caminho.remove_at(0)
	alvo_ponto = ponto
	if caminho.is_empty() and ponto != null:
		_ativar(ponto)

func _unhandled_input(e: InputEvent) -> void:
	if ocupado or cartao.visible:
		return
	if e is InputEventMouseButton and e.pressed and e.button_index == MOUSE_BUTTON_LEFT:
		var p := get_global_mouse_position()
		for m in marcadores:
			if m.position.distance_to(p) < 48.0:
				var ponto: Dictionary = m.get_meta("ponto")
				ir_para(ponto["aprox"], ponto)
				return
		ir_para(p, null)
		if dica.visible:
			create_tween().tween_property(dica, "modulate:a", 0.0, 0.6)

func _process(dt: float) -> void:
	if not ocupado and caminho.size() > 0:
		var alvo: Vector2 = caminho[0]
		var d := alvo - holmes.position
		var passo := vel * dt
		if d.length() <= passo:
			holmes.position = alvo
			caminho.remove_at(0)
			if caminho.is_empty() and alvo_ponto != null:
				var p = alvo_ponto
				alvo_ponto = null
				_ativar(p)
		else:
			holmes.position += d.normalized() * passo
			if abs(d.x) > abs(d.y) * 1.2:
				direcao = "direita" if d.x > 0 else "esquerda"
			elif abs(d.y) > abs(d.x) * 1.2:
				direcao = "baixo" if d.y > 0 else "cima"
		andando = true
	else:
		andando = false
	_animar(dt)
	camera.position = holmes.position

func _animar(dt: float) -> void:
	if andando:
		quadro = fmod(quadro + dt * 7.0, 4.0)
		var lin: int = {"baixo": 0, "cima": 1, "direita": 2, "esquerda": 2}[direcao]
		holmes.frame = lin * 4 + int(quadro)
		holmes.flip_h = direcao == "esquerda"
	else:
		holmes.flip_h = false
		holmes.frame = {"baixo": 12, "cima": 13, "direita": 14, "esquerda": 15}[direcao]

# ---------- interações ----------
func _ativar(p: Dictionary) -> void:
	if p["tipo"] == "ir":
		transicao(p["destino"], p["entrada"])
	else:
		cartao_titulo.text = p["titulo"]
		cartao_texto.text = p["texto"]
		cartao.visible = true

func transicao(destino: String, entrada) -> void:
	ocupado = true
	var tw := create_tween()
	tw.tween_property(veu, "color:a", 1.0, 0.45)
	await tw.finished
	carregar(destino, entrada)
	var tw2 := create_tween()
	tw2.tween_property(veu, "color:a", 0.0, 0.45)
	await tw2.finished
	ocupado = false

# ---------- interface ----------
func _montar_ui() -> void:
	var ui := CanvasLayer.new()
	add_child(ui)
	var raiz := Control.new()
	raiz.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	raiz.mouse_filter = Control.MOUSE_FILTER_IGNORE
	ui.add_child(raiz)

	lugar = Label.new()
	lugar.set_anchors_and_offsets_preset(Control.PRESET_TOP_WIDE)
	lugar.offset_top = 40
	lugar.offset_bottom = 100
	lugar.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	lugar.mouse_filter = Control.MOUSE_FILTER_IGNORE
	lugar.add_theme_font_size_override("font_size", 40)
	lugar.add_theme_color_override("font_color", Color(1, 0.93, 0.75))
	lugar.add_theme_color_override("font_outline_color", Color(0.1, 0.06, 0.03))
	lugar.add_theme_constant_override("outline_size", 12)
	raiz.add_child(lugar)

	dica = Label.new()
	dica.text = "toque para andar · toque nos círculos dourados"
	dica.set_anchors_and_offsets_preset(Control.PRESET_BOTTOM_WIDE)
	dica.offset_top = -80
	dica.offset_bottom = -36
	dica.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	dica.mouse_filter = Control.MOUSE_FILTER_IGNORE
	dica.add_theme_font_size_override("font_size", 24)
	dica.add_theme_color_override("font_color", Color(1, 0.93, 0.75))
	dica.add_theme_color_override("font_outline_color", Color(0.1, 0.06, 0.03))
	dica.add_theme_constant_override("outline_size", 8)
	raiz.add_child(dica)

	cartao = PanelContainer.new()
	cartao.anchor_left = 0.06
	cartao.anchor_right = 0.94
	cartao.anchor_top = 0.56
	cartao.anchor_bottom = 0.94
	var estilo := StyleBoxFlat.new()
	estilo.bg_color = Color(0.93, 0.87, 0.74)
	estilo.border_color = Color(0.35, 0.22, 0.1)
	estilo.set_border_width_all(4)
	estilo.set_corner_radius_all(14)
	estilo.set_content_margin_all(28)
	estilo.shadow_size = 18
	estilo.shadow_color = Color(0, 0, 0, 0.5)
	cartao.add_theme_stylebox_override("panel", estilo)
	var vb := VBoxContainer.new()
	vb.add_theme_constant_override("separation", 16)
	cartao.add_child(vb)
	cartao_titulo = Label.new()
	cartao_titulo.add_theme_font_size_override("font_size", 38)
	cartao_titulo.add_theme_color_override("font_color", Color(0.45, 0.12, 0.08))
	cartao_titulo.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	vb.add_child(cartao_titulo)
	cartao_texto = Label.new()
	cartao_texto.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	cartao_texto.size_flags_vertical = Control.SIZE_EXPAND_FILL
	cartao_texto.add_theme_font_size_override("font_size", 28)
	cartao_texto.add_theme_color_override("font_color", Color(0.17, 0.11, 0.06))
	vb.add_child(cartao_texto)
	var fechar := Button.new()
	fechar.text = "voltar à rua"
	fechar.add_theme_font_size_override("font_size", 28)
	fechar.custom_minimum_size = Vector2(0, 64)
	fechar.pressed.connect(func(): cartao.visible = false)
	vb.add_child(fechar)
	cartao.visible = false
	raiz.add_child(cartao)

	veu = ColorRect.new()
	veu.color = Color(0, 0, 0, 0)
	veu.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	veu.mouse_filter = Control.MOUSE_FILTER_IGNORE
	raiz.add_child(veu)
