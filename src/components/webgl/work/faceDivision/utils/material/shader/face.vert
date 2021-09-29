attribute vec3 happy_position;
attribute vec3 sad_position;
attribute vec3 blind_position;
varying vec2 v_uv;
uniform float u_time;
uniform float u_emotion;
uniform float u_blink_amount;
uniform float u_tension;

float ease_in_out_quad(float x) {
	// x < 0.5
	float v00_05 = 2. * pow(x, 2.);
	// x > 0.5
	float v05_10 = 1. - pow(-2. * x + 2., 2.) / 2.;
	// (x < 0.5) ? 0 : 1
	float if_05 = step(0.5, x);
	// x < 0.5 ? v00_05 : v05_10
	return v00_05 * (1. - if_05) + v05_10 * if_05;
}

// 0-1に収める
float fit_0_1(float val) {
	return max(min(val, 1.), 0.);
}

// 2D Random
void main() {
	v_uv = uv;

	// 目を閉じる - 普通で まばたき分のみの差分を抽出
	vec3 blind_offset = blind_position-position;

	float happy = max(min(1. * u_emotion, 1.), 0.);
	float sad = max(min(-1. * u_emotion, 1.), 0.);
	float none = max(min(-sign(u_emotion)*u_emotion+1., 1.), 0.);
	float blind = max(min(1. * u_blink_amount, 1.), 0.);
	vec3 pos = happy * happy_position + sad * sad_position + none * position + blind * blind_offset;

	// pos.x += min(1., pos.x);

	vec4 worldPosition = modelMatrix * vec4( pos, 1.0 );

	vec4 mvPosition =  viewMatrix * worldPosition;
	gl_Position = projectionMatrix * mvPosition;
}
