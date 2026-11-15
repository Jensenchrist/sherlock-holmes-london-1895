# Círculo dourado pulsando sobre um ponto de interesse (porta, saída, pessoa).
extends Node2D

var t := 0.0
var cor := Color(1.0, 0.84, 0.45)

func _process(dt: float) -> void:
	t += dt
	queue_redraw()

func _draw() -> void:
	var r := 15.0 + sin(t * 3.0) * 3.0
	draw_circle(Vector2.ZERO, r + 7.0, Color(cor, 0.22))
	draw_arc(Vector2.ZERO, r, 0.0, TAU, 40, cor, 3.0, true)
	draw_circle(Vector2.ZERO, 4.5, cor)
