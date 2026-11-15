# Carruagem ou carroça: segue reto por uma faixa, para diante do Holmes, de pedestres
# e de outro veículo, e respeita a vez no cruzamento.
extends Sprite2D

signal saiu

var main: Node
var dir := Vector2.RIGHT
var vel_max := 80.0
var v := 0.0
var esc := 0.8
var h := 180.0          # altura do quadro, em pixels da arte
var de_lado := true
var fps := 8.0
var quadro := 0.0
var fim := 0.0
var luz: PointLight2D = null

func iniciar(tex: Texture2D, lado: bool, d: Vector2, escala: float, vel: float, passo_fps: float) -> void:
	texture = tex
	de_lado = lado
	dir = d
	esc = escala
	vel_max = vel
	v = vel
	fps = passo_fps
	hframes = 4
	vframes = 1
	h = tex.get_height()
	scale = Vector2.ONE * esc
	if lado:
		offset = Vector2(0, -h / 2.0 + 8.0)
		flip_h = d.x < 0
	else:
		offset = Vector2(0, -h * 0.2)
	quadro = randf() * 4.0

func corpo() -> Rect2:
	if de_lado:
		var l := 112.0 * esc
		return Rect2(position.x - l, position.y - 45.0 * esc, 2.0 * l, 55.0 * esc)
	var topo := position.y - h * 0.7 * esc + 40.0 * esc
	return Rect2(position.x - 60.0 * esc, topo, 120.0 * esc, h * esc - 40.0 * esc)

func frente() -> Rect2:
	var c := corpo()
	var a := 90.0 * esc
	if de_lado:
		var x := c.end.x if dir.x > 0 else c.position.x - a
		return Rect2(x, position.y - 75.0 * esc, a, 105.0 * esc)
	if dir.y < 0:
		return Rect2(position.x - 70.0 * esc, c.position.y - a, 140.0 * esc, a)
	return Rect2(position.x - 70.0 * esc, c.end.y, 140.0 * esc, a)

func _process(dt: float) -> void:
	if main == null:
		return
	var parar: bool = main.deve_parar(self)
	var alvo := 0.0 if parar else vel_max
	v = move_toward(v, alvo, (vel_max * 2.5 if parar else vel_max * 0.9) * dt)
	position += dir * v * dt
	if v > 2.0:
		quadro = fmod(quadro + dt * fps * (v / vel_max), 4.0)
		frame = int(quadro)
	var ate := position.dot(dir)
	if ate > fim:
		saiu.emit()
		queue_free()
	if luz:
		luz.energy = 0.8 * main.noite
