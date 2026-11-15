// Pintura da rua com vida: copas das árvores balançando no vento e o Tâmisa ondulando.
shader_type canvas_item;

uniform vec2 origem = vec2(0.0);           // canto do recorte dentro da pintura
uniform vec2 recorte = vec2(880.0, 1168.0); // tamanho da imagem (a pintura inteira ou um recorte)
uniform vec4 arvores[8];          // x, y, raio, fase (em pixels da arte)
uniform int n_arvores = 0;
uniform float agua_y = 100000.0;  // abaixo desta linha é água

void fragment() {
	vec2 p = origem + UV * recorte;
	vec2 d = vec2(0.0);
	float rajada = 0.65 + 0.35 * sin(TIME * 0.35) + 0.15 * sin(TIME * 1.1);
	for (int i = 0; i < 8; i++) {
		if (i >= n_arvores) { break; }
		vec4 a = arvores[i];
		float dist = distance(p, a.xy);
		float f = 1.0 - smoothstep(a.z * 0.55, a.z, dist);
		float t = TIME * 1.4 + a.w;
		d += f * rajada * vec2(
			sin(t + p.y * 0.035) * 2.4 + sin(t * 2.7 + p.x * 0.12 + p.y * 0.07) * 0.9,
			cos(t * 1.2 + p.x * 0.04) * 1.1 + sin(t * 3.1 + p.y * 0.13) * 0.5);
	}
	if (p.y > agua_y) {
		float k = smoothstep(agua_y, agua_y + 24.0, p.y);
		d += k * vec2(sin(TIME * 1.6 + p.y * 0.11) * 1.8 + sin(TIME * 0.7 + p.x * 0.02) * 0.8,
			sin(TIME * 2.1 + p.x * 0.05) * 0.7);
	}
	COLOR = texture(TEXTURE, (p - d - origem) / recorte);
}
