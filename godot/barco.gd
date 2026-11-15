# Barco no Tâmisa: atravessa a tela balançando na água; a lancha solta fumaça pela chaminé.
extends Sprite2D

signal saiu

var main: Node
var dir := 1.0
var vel := 30.0
var fps := 5.0
var quadro := 0.0
var fim := 0.0
var fase := 0.0
var y_base := 0.0
var luz: PointLight2D = null
var fumaca: CPUParticles2D = null
var chamine := Vector2.ZERO   # posição da chaminé no quadro, olhando para a direita

func iniciar(tex: Texture2D, esc: float, d: float, v: float) -> void:
	texture = tex
	hframes = 4
	scale = Vector2.ONE * esc
	offset = Vector2(0, -tex.get_height() / 2.0)
	dir = d
	vel = v
	flip_h = d < 0
	fase = randf() * TAU
	quadro = randf() * 4.0

func _process(dt: float) -> void:
	if main == null:
		return
	position.x += dir * vel * dt
	fase += dt
	# balanço: sobe e desce devagar e inclina um pouco
	position.y = y_base + sin(fase * 1.3) * 1.6
	rotation_degrees = sin(fase * 0.9) * 0.8
	quadro = fmod(quadro + dt * fps, 4.0)
	frame = int(quadro)
	if fumaca:
		fumaca.position = Vector2(chamine.x * (-1.0 if flip_h else 1.0), chamine.y)
	if luz:
		luz.energy = (0.25 + 0.9 * main.noite)
	if position.x * dir > fim:
		saiu.emit()
		queue_free()
