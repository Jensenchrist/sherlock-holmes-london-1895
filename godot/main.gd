# Protótipo: o Holmes anda pelas ruas de Londres (toque para andar),
# toca nos círculos dourados para abrir um local ou ir para outra rua.
# As ruas têm vida: pedestres, carruagens, árvores ao vento, fumaça, lampiões e o anoitecer.
extends Node2D

const CEL := 12  # tamanho da célula da grade de caminhada, em pixels da arte
const NPC := preload("res://npc.gd")
const VEICULO := preload("res://veiculo.gd")

const CENAS := {
	"baker": {
		"nome": "Baker Street",
		"img": "res://arte/baker_vazia.jpg",
		"escala": 0.42, "vel": 150.0,
		"inicio": Vector2(520, 720),
		"bloqueios": [Rect2(0, 0, 330, 520), Rect2(800, 0, 272, 560), Rect2(0, 880, 300, 587),
			Rect2(830, 900, 242, 567), Rect2(715, 1060, 135, 250), Rect2(50, 480, 110, 100)],
		# postes, lampiões, barris e a lousa do pub: x, y, raio
		"obst": [Vector3(175, 635, 16), Vector3(265, 925, 16), Vector3(690, 490, 16), Vector3(738, 590, 16),
			Vector3(940, 640, 16), Vector3(980, 895, 16), Vector3(680, 1078, 16), Vector3(680, 1302, 16),
			Vector3(390, 440, 20), Vector3(693, 160, 20), Vector3(348, 1150, 20),
			Vector3(735, 430, 24), Vector3(775, 485, 24), Vector3(915, 575, 24), Vector3(955, 595, 22),
			Vector3(875, 560, 22)],
		"pontos": [
			{"pos": Vector2(262, 430), "aprox": Vector2(280, 560), "tipo": "cartao", "rotulo": "221B",
				"titulo": "221B Baker Street",
				"texto": "A sala do Holmes e do Dr. Watson: a lareira, o violino, o caderno de casos.\n\nNo jogo, é aqui que você relê as fichas e escreve suas conclusões."},
			{"pos": Vector2(865, 460), "aprox": Vector2(715, 540), "tipo": "cartao", "rotulo": "The Red Lion",
				"titulo": "Pub The Red Lion",
				"texto": "Fumaça de cachimbo e cerveja morna. O taberneiro baixa a voz: \"Dizem por aí que...\"\n\nUm local que pode ser pista ou só perda de tempo."},
			{"pos": Vector2(785, 1150), "aprox": Vector2(660, 1160), "tipo": "cartao", "rotulo": "The Times",
				"titulo": "Banca do The Times",
				"texto": "\"Relojoeiro some às nove em ponto!\", grita o jornaleiro.\n\nBoato de jornal: confiança baixa."},
			{"pos": Vector2(530, 1360), "aprox": Vector2(530, 1350), "tipo": "ir", "rotulo": "para Whitehall",
				"destino": "whitehall", "entrada": Vector2(460, 190)}
		],
		"rotas": [
			[Vector2(422, -40), Vector2(422, 585), Vector2(-40, 585)],
			[Vector2(422, -40), Vector2(422, 610), Vector2(395, 930), Vector2(375, 1510)],
			[Vector2(712, -40), Vector2(712, 560), Vector2(716, 618), Vector2(1110, 618)],
			[Vector2(-40, 600), Vector2(430, 612), Vector2(690, 630), Vector2(712, 560), Vector2(712, -40)],
			[Vector2(662, 1510), Vector2(662, 955), Vector2(1110, 935)],
			[Vector2(375, 1510), Vector2(388, 945), Vector2(650, 955), Vector2(662, 1510)],
			[Vector2(1110, 618), Vector2(705, 648), Vector2(662, 955), Vector2(662, 1510)],
		],
		"vel_ped": 50.0, "max_ped": 6,
		"faixas": [
			{"de": Vector2(-220, 775), "dir": Vector2(1, 0), "lado": true},
			{"de": Vector2(1292, 875), "dir": Vector2(-1, 0), "lado": true},
			{"de": Vector2(600, -260), "dir": Vector2(0, 1), "lado": false},
		],
		"esc_v": 0.85, "vel_v": 85.0, "max_v": 2,
		"cruz": Rect2(440, 660, 220, 240),
		"fixos": [["jornaleiro", Vector2(700, 1225), "esquerda"], ["cavalheiro", Vector2(800, 560), "esquerda"]],
		# luzes: posição, raio, tipo
		"luzes": [[Vector2(385, 205), 270, "lampiao"], [Vector2(693, 14), 230, "lampiao"], [Vector2(343, 955), 270, "lampiao"],
			[Vector2(200, 420), 120, "janela"], [Vector2(880, 270), 120, "janela"], [Vector2(930, 470), 130, "janela"],
			[Vector2(990, 500), 110, "janela"], [Vector2(830, 60), 90, "janela"], [Vector2(790, 1150), 120, "janela"]],
		"fumaca": [Vector2(28, 100), Vector2(238, 50), Vector2(45, 1150), Vector2(985, 1160), Vector2(1025, 1150)],
		"arvores": [Vector4(430, 60, 170, 0), Vector4(1030, 720, 100, 1.7), Vector4(650, 1400, 135, 3.1),
			Vector4(300, 1440, 85, 4.2), Vector4(105, 380, 60, 5.0)],
		"agua": 100000.0,
	},
	"whitehall": {
		"nome": "Whitehall",
		"img": "res://arte/whitehall_vazia.jpg",
		"escala": 0.32, "vel": 115.0,
		"inicio": Vector2(460, 600),
		"bloqueios": [Rect2(0, 0, 280, 420), Rect2(600, 0, 280, 460), Rect2(0, 700, 250, 468),
			Rect2(680, 780, 200, 388), Rect2(590, 830, 110, 250), Rect2(0, 400, 110, 75)],
		"obst": [Vector3(180, 520, 15), Vector3(560, 405, 15), Vector3(675, 520, 15), Vector3(232, 765, 15),
			Vector3(628, 795, 15), Vector3(330, 405, 18), Vector3(565, 135, 18), Vector3(285, 925, 18)],
		"pontos": [
			{"pos": Vector2(160, 330), "aprox": Vector2(200, 470), "tipo": "ir", "rotulo": "Scotland Yard",
				"destino": "scotland", "entrada": Vector2(80, 600)},
			{"pos": Vector2(690, 330), "aprox": Vector2(590, 480), "tipo": "cartao", "rotulo": "Ministério",
				"titulo": "Ministério do Interior",
				"texto": "Portas fechadas e um porteiro de luvas brancas. \"Só com hora marcada, senhor.\""},
			{"pos": Vector2(640, 960), "aprox": Vector2(548, 900), "tipo": "cartao", "rotulo": "Florista",
				"titulo": "A florista da esquina",
				"texto": "\"Violetas, senhor? Vi um homem de cachecol vermelho passar correndo agora há pouco...\""},
			{"pos": Vector2(460, 120), "aprox": Vector2(460, 140), "tipo": "ir", "rotulo": "para Baker Street",
				"destino": "baker", "entrada": Vector2(530, 1380)}
		],
		"rotas": [
			[Vector2(352, -40), Vector2(352, 478), Vector2(-40, 482)],
			[Vector2(588, -40), Vector2(588, 488), Vector2(920, 488)],
			[Vector2(-40, 482), Vector2(352, 490), Vector2(588, 500), Vector2(588, -40)],
			[Vector2(318, 1210), Vector2(318, 735), Vector2(565, 745), Vector2(920, 738)],
			[Vector2(552, 1210), Vector2(552, 745), Vector2(920, 738)],
			[Vector2(352, -40), Vector2(350, 500), Vector2(320, 735), Vector2(318, 1210)],
		],
		"vel_ped": 38.0, "max_ped": 5,
		"faixas": [
			{"de": Vector2(-200, 615), "dir": Vector2(1, 0), "lado": true},
			{"de": Vector2(1080, 680), "dir": Vector2(-1, 0), "lado": true},
			{"de": Vector2(495, -250), "dir": Vector2(0, 1), "lado": false},
		],
		"esc_v": 0.65, "vel_v": 65.0, "max_v": 2,
		"cruz": Rect2(370, 540, 170, 150),
		"fixos": [["senhora", Vector2(582, 968), "direita"], ["guarda", Vector2(235, 432), "baixo"]],
		"luzes": [[Vector2(330, 180), 230, "lampiao"], [Vector2(568, 8), 200, "lampiao"], [Vector2(283, 778), 230, "lampiao"],
			[Vector2(188, 262), 170, "azul"], [Vector2(50, 180), 90, "janela"], [Vector2(270, 250), 90, "janela"],
			[Vector2(650, 140), 100, "janela"], [Vector2(640, 960), 110, "janela"]],
		"fumaca": [Vector2(40, 915), Vector2(825, 930), Vector2(15, 690)],
		"arvores": [Vector4(380, 50, 115, 0), Vector4(840, 560, 100, 2), Vector4(585, 1120, 125, 3.3),
			Vector4(240, 1150, 65, 4.5)],
		"agua": 100000.0,
	},
	"scotland": {
		"nome": "Scotland Yard",
		"img": "res://arte/scotland_vazia.jpg",
		"escala": 0.32, "vel": 115.0,
		"inicio": Vector2(460, 600),
		"bloqueios": [Rect2(0, 0, 880, 400), Rect2(0, 850, 880, 318), Rect2(200, 790, 65, 60),
			Rect2(615, 790, 70, 60), Rect2(42, 798, 112, 52), Rect2(462, 795, 116, 55)],
		"obst": [Vector3(40, 410, 15), Vector3(190, 462, 15), Vector3(240, 462, 15), Vector3(660, 462, 15),
			Vector3(712, 462, 15), Vector3(12, 835, 15), Vector3(858, 440, 18), Vector3(872, 780, 16),
			Vector3(15, 770, 16)],
		"pontos": [
			{"pos": Vector2(460, 330), "aprox": Vector2(460, 440), "tipo": "cartao", "rotulo": "Lestrade",
				"titulo": "Inspetor Lestrade",
				"texto": "\"Então, Sr. Holmes? A Yard não tem o dia todo.\"\n\nNo jogo, é aqui que você apresenta suas conclusões e as fichas que as provam."},
			{"pos": Vector2(505, 815), "aprox": Vector2(480, 762), "tipo": "cartao", "rotulo": "Leitor",
				"titulo": "Um senhor lendo o jornal",
				"texto": "\"Leu isto? Dizem que o relojoeiro fugiu para a América!\"\n\nOuviu dizer: confiança baixa."},
			{"pos": Vector2(28, 600), "aprox": Vector2(45, 600), "tipo": "ir", "rotulo": "para Whitehall",
				"destino": "whitehall", "entrada": Vector2(200, 470)}
		],
		"rotas": [
			[Vector2(-40, 770), Vector2(920, 768)],
			[Vector2(-40, 430), Vector2(345, 432), Vector2(360, 500), Vector2(380, 768), Vector2(920, 768)],
			[Vector2(920, 430), Vector2(560, 432), Vector2(545, 500), Vector2(520, 768), Vector2(-40, 770)],
		],
		"vel_ped": 38.0, "max_ped": 4,
		"faixas": [
			{"de": Vector2(-200, 615), "dir": Vector2(1, 0), "lado": true},
			{"de": Vector2(1080, 715), "dir": Vector2(-1, 0), "lado": true},
		],
		"esc_v": 0.65, "vel_v": 65.0, "max_v": 2,
		"cruz": Rect2(),
		"fixos": [["guarda", Vector2(395, 440), "baixo"], ["cavalheiro", Vector2(520, 792), "baixo"]],
		"luzes": [[Vector2(233, 700), 300, "lampiao"], [Vector2(648, 700), 300, "lampiao"], [Vector2(592, 195), 170, "azul"],
			[Vector2(230, 195), 110, "janela"], [Vector2(450, 165), 130, "janela"], [Vector2(700, 200), 110, "janela"],
			[Vector2(320, 140), 100, "janela"], [Vector2(570, 140), 100, "janela"], [Vector2(620, 1050), 150, "janela"]],
		"fumaca": [Vector2(662, 982)],
		"arvores": [Vector4(25, 170, 115, 0), Vector4(850, 280, 100, 1.4), Vector4(25, 690, 70, 2.8),
			Vector4(865, 700, 60, 4)],
		"agua": 985.0,
	}
}

const TIPOS_PED := ["cavalheiro", "dama", "senhora", "jornaleiro", "carregador", "guarda", "cavalheiro", "dama"]
const VEICULOS := {"cab1": [9.0, 1.0], "cab2": [9.0, 1.0], "carga": [6.0, 0.7], "barris": [6.0, 0.65]}  # passos/s, velocidade

var cena_id := ""
var cena: Node2D           # tudo que é da rua atual (mapa, luzes, fumaça, marcadores)
var atores: Node2D         # Holmes, pedestres e veículos, ordenados pela altura na tela
var mapa: Sprite2D
var holmes: Sprite2D
var camera: Camera2D
var noturno: CanvasModulate
var astar := AStarGrid2D.new()
var tam := Vector2.ZERO
var caminho := PackedVector2Array()
var destino_final := Vector2.ZERO
var alvo_ponto = null
var direcao := "baixo"
var quadro := 0.0
var andando := false
var vel := 140.0
var travado := 0.0
var marcadores: Array = []
var ocupado := false

var pedestres: Array = []
var veiculos: Array = []
var cruz_dono = null
var prox_ped := 0.0
var prox_veic := 0.0
var luzes: Array = []      # [PointLight2D, energia base, tipo, fase]

var hora := 18.5           # relógio do jogo
var noite := 0.0           # 0 = entardecer, 1 = noite fechada
var hora_alvo := -1.0

var tex_ped := {}
var tex_veic := {}
var tex_luz: Texture2D
var tex_fumaca: Texture2D

var cartao: PanelContainer
var cartao_titulo: Label
var cartao_texto: Label
var lugar: Label
var relogio: Button
var veu: ColorRect
var dica: Label

func _ready() -> void:
	randomize()
	for t in ["cavalheiro", "dama", "senhora", "guarda", "jornaleiro", "carregador"]:
		tex_ped[t] = load("res://arte/pessoas/%s.png" % t)
	for v in VEICULOS:
		tex_veic[v] = [load("res://arte/veiculos/%s_lado.png" % v), load("res://arte/veiculos/%s_frente.png" % v)]
	tex_luz = _textura_radial(256, [0.0, 0.35, 1.0], [Color(1, 1, 1, 1), Color(1, 1, 1, 0.45), Color(1, 1, 1, 0)])
	tex_fumaca = _textura_radial(64, [0.0, 0.5, 1.0], [Color(1, 1, 1, 0.9), Color(1, 1, 1, 0.35), Color(1, 1, 1, 0)])

	noturno = CanvasModulate.new()
	add_child(noturno)
	_montar_ui()
	atores = Node2D.new()
	atores.y_sort_enabled = true
	atores.z_index = 2
	add_child(atores)
	holmes = Sprite2D.new()
	holmes.texture = load("res://arte/sherlock.png")
	holmes.hframes = 4
	holmes.vframes = 4
	holmes.offset = Vector2(0, -107)
	atores.add_child(holmes)
	camera = Camera2D.new()
	camera.position_smoothing_enabled = true
	camera.position_smoothing_speed = 6.0
	add_child(camera)
	camera.make_current()
	get_viewport().size_changed.connect(_ajustar_zoom)
	# atalhos pelo endereço, para testar: #whitehall, #scotland, #noite
	var inicio := "baker"
	if OS.has_feature("web"):
		var h := str(JavaScriptBridge.eval("location.hash", true))
		for id in CENAS:
			if h.contains(id):
				inicio = id
		if h.contains("noite"):
			hora = 21.0
	carregar(inicio, null)

func _textura_radial(lado: int, pos: Array, cores: Array) -> Texture2D:
	var g := Gradient.new()
	g.offsets = PackedFloat32Array(pos)
	g.colors = PackedColorArray(cores)
	var t := GradientTexture2D.new()
	t.gradient = g
	t.width = lado
	t.height = lado
	t.fill = GradientTexture2D.FILL_RADIAL
	t.fill_from = Vector2(0.5, 0.5)
	t.fill_to = Vector2(1.0, 0.5)
	return t

# ---------- cenas ----------
func carregar(id: String, entrada) -> void:
	var c: Dictionary = CENAS[id]
	cena_id = id
	if cena:
		cena.queue_free()
	for f in pedestres + veiculos:
		if is_instance_valid(f):
			f.queue_free()
	pedestres.clear()
	veiculos.clear()
	luzes.clear()
	marcadores.clear()
	cruz_dono = null
	caminho = PackedVector2Array()
	alvo_ponto = null

	cena = Node2D.new()
	add_child(cena)
	move_child(cena, 0)
	mapa = Sprite2D.new()
	mapa.texture = load(c["img"])
	mapa.centered = false
	cena.add_child(mapa)
	tam = mapa.texture.get_size()
	var mat := ShaderMaterial.new()
	mat.shader = load("res://mapa.gdshader")
	mat.set_shader_parameter("tam", tam)
	var arv := PackedVector4Array()
	for a in c["arvores"]:
		arv.append(a)
	while arv.size() < 8:
		arv.append(Vector4.ZERO)
	mat.set_shader_parameter("arvores", arv)
	mat.set_shader_parameter("n_arvores", c["arvores"].size())
	mat.set_shader_parameter("agua_y", c["agua"])
	mapa.material = mat

	_montar_grade(c)
	_montar_luzes(c)
	_montar_fumaca(c)

	for p in c["pontos"]:
		var m := Node2D.new()
		m.set_script(load("res://marcador.gd"))
		m.position = p["pos"]
		m.z_index = 1
		m.set_meta("ponto", p)
		var l := Label.new()
		l.text = p["rotulo"]
		l.z_index = 20
		l.add_theme_font_size_override("font_size", 26)
		l.add_theme_color_override("font_color", Color(1, 0.93, 0.75))
		l.add_theme_color_override("font_outline_color", Color(0.12, 0.07, 0.03))
		l.add_theme_constant_override("outline_size", 8)
		l.position = Vector2(-120, -58)
		l.size = Vector2(240, 30)
		l.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		l.mouse_filter = Control.MOUSE_FILTER_IGNORE
		m.add_child(l)
		cena.add_child(m)
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

	# a rua já começa movimentada
	for f in c["fixos"]:
		_novo_pedestre(f[0], null, f[1], f[2])
	for k in range(c["max_ped"] - 1):
		_novo_pedestre("", c["rotas"].pick_random(), null, "", true)
	_novo_veiculo(true)
	prox_ped = randf_range(1.0, 3.0)
	prox_veic = randf_range(3.0, 6.0)

func _montar_grade(c: Dictionary) -> void:
	astar = AStarGrid2D.new()
	astar.region = Rect2i(0, 0, int(tam.x / CEL) + 1, int(tam.y / CEL) + 1)
	astar.cell_size = Vector2(CEL, CEL)
	astar.offset = Vector2(CEL / 2.0, CEL / 2.0)
	astar.diagonal_mode = AStarGrid2D.DIAGONAL_MODE_ONLY_IF_NO_OBSTACLES
	astar.update()
	for r in c["bloqueios"]:
		_bloquear_rect(r, true)
	for o in c["obst"]:
		var a := _celula(Vector2(o.x - o.z, o.y - o.z))
		var b := _celula(Vector2(o.x + o.z, o.y + o.z))
		for x in range(a.x, b.x + 1):
			for y in range(a.y, b.y + 1):
				var centro := Vector2(x * CEL + CEL / 2.0, y * CEL + CEL / 2.0)
				if centro.distance_to(Vector2(o.x, o.y)) <= o.z + CEL * 0.5:
					astar.set_point_solid(Vector2i(x, y), true)

func _bloquear_rect(r: Rect2, solido: bool) -> Array:
	var mudou: Array = []
	var a := Vector2i(int(r.position.x / CEL), int(r.position.y / CEL))
	var b := Vector2i(int(r.end.x / CEL), int(r.end.y / CEL))
	for x in range(a.x, b.x + 1):
		for y in range(a.y, b.y + 1):
			var p := Vector2i(x, y)
			if astar.is_in_boundsv(p) and astar.is_point_solid(p) != solido:
				astar.set_point_solid(p, solido)
				mudou.append(p)
	return mudou

func _montar_luzes(c: Dictionary) -> void:
	for l in c["luzes"]:
		var luz := PointLight2D.new()
		luz.texture = tex_luz
		luz.position = l[0]
		luz.texture_scale = float(l[1]) * 2.0 / 256.0
		var base := 1.0
		match l[2]:
			"lampiao":
				luz.color = Color(1.0, 0.76, 0.42)
				base = 1.15
			"janela":
				luz.color = Color(1.0, 0.68, 0.32)
				base = 0.7
			"azul":
				luz.color = Color(0.45, 0.6, 1.0)
				base = 1.0
		luz.energy = 0.0
		cena.add_child(luz)
		luzes.append([luz, base, l[2], randf() * 10.0])

func _montar_fumaca(c: Dictionary) -> void:
	var s: float = float(c["escala"]) / 0.42
	for f in c["fumaca"]:
		var p := CPUParticles2D.new()
		p.position = f
		p.z_index = 4
		p.texture = tex_fumaca
		p.amount = 10
		p.lifetime = 6.0
		p.preprocess = 6.0
		p.local_coords = false
		p.emission_shape = CPUParticles2D.EMISSION_SHAPE_SPHERE
		p.emission_sphere_radius = 4.0 * s
		p.direction = Vector2(0.35, -1)
		p.spread = 12.0
		p.initial_velocity_min = 12.0 * s
		p.initial_velocity_max = 20.0 * s
		p.gravity = Vector2(6, -3) * s
		p.damping_min = 1.0
		p.damping_max = 2.0
		p.scale_amount_min = 0.45 * s
		p.scale_amount_max = 0.7 * s
		var curva := Curve.new()
		curva.add_point(Vector2(0, 0.35))
		curva.add_point(Vector2(1, 1.8))
		p.scale_amount_curve = curva
		var g := Gradient.new()
		g.offsets = PackedFloat32Array([0.0, 0.12, 0.6, 1.0])
		g.colors = PackedColorArray([Color(0.96, 0.94, 0.9, 0), Color(0.96, 0.94, 0.9, 0.38),
			Color(0.9, 0.88, 0.86, 0.18), Color(0.85, 0.85, 0.85, 0)])
		p.color_ramp = g
		cena.add_child(p)

func _ajustar_zoom() -> void:
	if tam == Vector2.ZERO:
		return
	var vp := get_viewport_rect().size
	var z: float = max(vp.x / tam.x, vp.y / tam.y) * 1.2
	camera.zoom = Vector2(z, z)

# ---------- figurantes ----------
func _novo_pedestre(tipo: String, rota, pos, olhar: String, no_meio := false) -> void:
	var c: Dictionary = CENAS[cena_id]
	if tipo == "":
		tipo = TIPOS_PED.pick_random()
	var n := Sprite2D.new()
	n.set_script(NPC)
	n.main = self
	var esc: float = float(c["escala"]) * (0.82 if tipo == "jornaleiro" else 1.0) * randf_range(0.96, 1.04)
	n.iniciar(tex_ped[tipo], esc)
	if rota == null:
		n.parado_em(pos, olhar)
	else:
		var r := PackedVector2Array(rota)
		if randf() < 0.5:
			r.reverse()
		var seg := 0
		var t := 0.0
		if no_meio:
			seg = randi() % (r.size() - 1)
			t = randf_range(0.1, 0.9)
		n.na_rota(r, float(c["vel_ped"]) * randf_range(0.85, 1.15), seg, t)
		n.saiu.connect(func(): pedestres.erase(n))
	if tipo == "guarda":
		var l := PointLight2D.new()
		l.texture = tex_luz
		l.texture_scale = 0.9
		l.color = Color(1.0, 0.8, 0.5)
		l.energy = 0.0
		n.add_child(l)
		n.luz = l
	atores.add_child(n)
	pedestres.append(n)

func _novo_veiculo(no_meio := false) -> void:
	var c: Dictionary = CENAS[cena_id]
	var f: Dictionary = c["faixas"].pick_random()
	var tipo: String = VEICULOS.keys().pick_random()
	var esc: float = c["esc_v"]
	var inicio: Vector2 = f["de"]
	if no_meio:
		# começa já dentro da rua, antes do cruzamento
		inicio += f["dir"] * randf_range(120.0, 280.0)
	for w in veiculos:
		if is_instance_valid(w) and w.position.distance_to(inicio) < 330.0 * esc:
			return
	var v := Sprite2D.new()
	v.set_script(VEICULO)
	v.main = self
	var tex: Texture2D = tex_veic[tipo][0 if f["lado"] else 1]
	v.iniciar(tex, f["lado"], f["dir"], esc, float(c["vel_v"]) * VEICULOS[tipo][1], VEICULOS[tipo][0])
	v.position = inicio
	var d: Vector2 = f["dir"]
	v.fim = (tam.x + 260.0 if d.x > 0 else 260.0) if f["lado"] else tam.y + 320.0
	if tipo.begins_with("cab"):
		var l := PointLight2D.new()
		l.texture = tex_luz
		l.texture_scale = 0.8
		l.color = Color(1.0, 0.75, 0.4)
		l.energy = 0.0
		l.position = Vector2(-10, -70) if f["lado"] else Vector2(0, -60)
		v.add_child(l)
		v.luz = l
	v.saiu.connect(func():
		veiculos.erase(v)
		if cruz_dono == v:
			cruz_dono = null)
	atores.add_child(v)
	veiculos.append(v)

func veiculo_em(p: Vector2, margem := 0.0) -> bool:
	for w in veiculos:
		if is_instance_valid(w) and w.corpo().grow(margem).has_point(p):
			return true
	return false

func deve_parar(v) -> bool:
	var f: Rect2 = v.frente()
	if f.has_point(holmes.position):
		return true
	for n in pedestres:
		if is_instance_valid(n) and f.has_point(n.position):
			return true
	for w in veiculos:
		if w != v and is_instance_valid(w) and f.intersects(w.corpo()):
			return true
	var cruz: Rect2 = CENAS[cena_id]["cruz"]
	if cruz.size != Vector2.ZERO:
		var dentro: bool = v.corpo().intersects(cruz)
		if cruz_dono == v and not dentro and not f.intersects(cruz):
			cruz_dono = null
		elif dentro or f.intersects(cruz):
			if cruz_dono == null or not is_instance_valid(cruz_dono):
				cruz_dono = v
			elif cruz_dono != v and not dentro:
				return true
	return false

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
	destino_final = p
	caminho = astar.get_point_path(de, ate)
	if caminho.size() > 1:
		caminho.remove_at(0)
	alvo_ponto = ponto
	travado = 0.0
	if caminho.is_empty() and ponto != null:
		_ativar(ponto)

# refaz o caminho contornando as carruagens paradas
func _contornar_veiculos() -> void:
	var mudou: Array = []
	for w in veiculos:
		if is_instance_valid(w):
			mudou += _bloquear_rect(w.corpo().grow(14.0), true)
	var ponto = alvo_ponto
	ir_para(destino_final if ponto == null else ponto["aprox"], ponto)
	for p in mudou:
		astar.set_point_solid(p, false)

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
	_mover_holmes(dt)
	_animar(dt)
	camera.position = holmes.position
	_tempo(dt)
	# gente e veículos entrando na rua
	var c: Dictionary = CENAS[cena_id]
	prox_ped -= dt
	if prox_ped <= 0.0:
		prox_ped = randf_range(1.5, 4.5)
		if pedestres.size() < int(c["max_ped"]) + c["fixos"].size():
			_novo_pedestre("", c["rotas"].pick_random(), null, "")
	prox_veic -= dt
	if prox_veic <= 0.0:
		prox_veic = randf_range(4.0, 9.0)
		if veiculos.size() < int(c["max_v"]):
			_novo_veiculo()

func _mover_holmes(dt: float) -> void:
	andando = false
	if ocupado or caminho.size() == 0:
		return
	var alvo: Vector2 = caminho[0]
	var d := alvo - holmes.position
	var passo := vel * dt
	var nova: Vector2 = holmes.position + d.normalized() * minf(passo, d.length())
	if veiculo_em(nova, 6.0) and not veiculo_em(holmes.position, 6.0):
		travado += dt
		if travado > 0.35:
			_contornar_veiculos()
		return
	travado = 0.0
	if d.length() <= passo:
		holmes.position = alvo
		caminho.remove_at(0)
		if caminho.is_empty() and alvo_ponto != null:
			var p = alvo_ponto
			alvo_ponto = null
			_ativar(p)
	else:
		holmes.position = nova
		if abs(d.x) > abs(d.y) * 1.2:
			direcao = "direita" if d.x > 0 else "esquerda"
		elif abs(d.y) > abs(d.x) * 1.2:
			direcao = "baixo" if d.y > 0 else "cima"
	andando = true

func _animar(dt: float) -> void:
	if andando:
		quadro = fmod(quadro + dt * 7.0, 4.0)
		var lin: int = {"baixo": 0, "cima": 1, "direita": 2, "esquerda": 2}[direcao]
		holmes.frame = lin * 4 + int(quadro)
		holmes.flip_h = direcao == "esquerda"
	else:
		holmes.flip_h = false
		holmes.frame = {"baixo": 12, "cima": 13, "direita": 14, "esquerda": 15}[direcao]

# ---------- relógio, anoitecer e luzes ----------
func _tempo(dt: float) -> void:
	if hora_alvo >= 0.0:
		hora = move_toward(hora, hora_alvo, dt * 1.2)
		if is_equal_approx(hora, hora_alvo):
			hora_alvo = -1.0
	else:
		hora = min(hora + dt / 60.0, 22.0)  # um minuto do jogo por segundo
	noite = smoothstep(18.75, 20.25, hora)
	noturno.color = Color(1, 1, 1).lerp(Color(0.3, 0.34, 0.52), noite)
	var t := Time.get_ticks_msec() / 1000.0
	for l in luzes:
		var luz: PointLight2D = l[0]
		var tremor: float = 1.0
		var e: float
		match l[2]:
			"lampiao":
				tremor = 0.9 + 0.06 * sin(t * 7.3 + l[3]) + 0.04 * sin(t * 17.0 + l[3] * 2.0)
				e = smoothstep(0.08, 0.5, noite)
			"azul":
				e = smoothstep(0.08, 0.5, noite)
			_:
				tremor = 0.95 + 0.05 * sin(t * 2.1 + l[3])
				e = 0.2 + 0.8 * noite
		luz.energy = l[1] * e * tremor
	var hh := int(hora)
	var mm := int((hora - hh) * 60.0)
	relogio.text = "%02d:%02d · %s" % [hh, mm, "noite" if noite > 0.5 else "entardecer"]

func _alternar_hora() -> void:
	hora_alvo = 18.5 if noite > 0.5 else 21.0

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

	relogio = Button.new()
	relogio.flat = true
	relogio.anchor_left = 0.5
	relogio.anchor_right = 0.5
	relogio.offset_left = -170
	relogio.offset_right = 170
	relogio.offset_top = 98
	relogio.offset_bottom = 142
	relogio.focus_mode = Control.FOCUS_NONE
	relogio.add_theme_font_size_override("font_size", 26)
	for k in ["font_color", "font_hover_color", "font_pressed_color", "font_focus_color"]:
		relogio.add_theme_color_override(k, Color(1, 0.88, 0.62))
	relogio.add_theme_color_override("font_outline_color", Color(0.1, 0.06, 0.03))
	relogio.add_theme_constant_override("outline_size", 8)
	relogio.pressed.connect(_alternar_hora)
	raiz.add_child(relogio)

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
