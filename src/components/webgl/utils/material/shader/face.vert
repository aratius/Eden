varying vec2 v_uv;
uniform float u_time;
uniform vec3 u_intersect_pos;

// 2D Random
void main() {
	v_uv = uv;

	vec3 pos = position;

	vec4 worldPosition = modelMatrix * vec4( pos, 1.0 );

	float noise = sin(worldPosition.y/30. + u_time) * 50.;

	float dist = distance(u_intersect_pos, worldPosition.xyz);
	float a = 1. /40.;
	float noise_amount = -a * dist + 1.;
	// noise_amountを0-1の範囲に丸めてnoiseと掛ける
	worldPosition.x += noise * max(min(noise_amount, 1.), 0.);

	vec4 mvPosition =  viewMatrix * worldPosition;
	gl_Position = projectionMatrix * mvPosition;
}
