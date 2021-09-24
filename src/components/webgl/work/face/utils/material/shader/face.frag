varying vec2 v_uv;
uniform sampler2D u_texture;

void main() {
	vec2 pos = v_uv;
	// なぜかtexture反転するので無理やり調整
	pos.y = 1. - pos.y;

	vec4 color = texture2D(u_texture, pos);

	gl_FragColor = color;
}