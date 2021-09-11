attribute vec3 happy_position;
attribute vec3 sad_position;
varying vec2 v_uv;
uniform float u_time;
uniform vec3 u_intersect_pos;
uniform float u_emotion;

// 2D Random
void main() {
	v_uv = uv;

	float happy = max(min(1. * u_emotion, 1.), 0.);
	float sad = max(min(-1. * u_emotion, 1.), 0.);
	float none = max(min(-sign(u_emotion)*u_emotion+1., 1.), 0.);
	vec3 pos = happy * happy_position + sad * sad_position + none * position;

	vec4 worldPosition = modelMatrix * vec4( pos, 1.0 );

	float noise = sin(worldPosition.y/30. + u_time*2.) * 50.;

	float dist = distance(u_intersect_pos, worldPosition.xyz);
	float a = 1. /60.;
	float noise_amount = -a * dist + 1.;
	// noise_amountを0-1の範囲に丸めてnoiseと掛ける
	worldPosition.x += noise * max(min(noise_amount, 1.), 0.);

	vec4 mvPosition =  viewMatrix * worldPosition;
	gl_Position = projectionMatrix * mvPosition;
}
