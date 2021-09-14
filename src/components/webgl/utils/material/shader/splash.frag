varying vec2 v_uv;
varying vec4 v_worldPosition;
uniform sampler2D u_texture;

void main() {
	vec4 color = texture2D(u_texture, gl_PointCoord);

	// 水面より高いものだけ描画
	float alpha = step(0., v_worldPosition.y);

	gl_FragColor = vec4(vec3(1.), alpha);
}