attribute vec3 happy_position;
attribute vec3 sad_position;
attribute vec3 blind_position;
varying vec2 v_uv;
uniform float u_time;
uniform vec3 u_intersect_pos;
uniform float u_emotion;
uniform float u_blink_amount;
uniform vec2 u_mouse_amount;
uniform vec3[2] u_eye_position;

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

	vec4 worldPosition = modelMatrix * vec4( pos, 1.0 );

	// マウスに撫でられたことによって揺れる量を計算
	float dist_to_intersect_point = distance(u_intersect_pos, worldPosition.xyz);
	float max_dist1 = 100.;
	float tilt1 = 1. / max_dist1;
	float amount_touched_by_mouse = -tilt1 * dist_to_intersect_point + 1.;

	// 目の周りの皮膚はnoiseによる影響を受けにくくする
	// 両目からの距離（近い方を採用）
	float dist_to_eye = min(distance(u_eye_position[0], worldPosition.xyz), distance(u_eye_position[1], worldPosition.xyz));
	float max_dist2 = 100.;
	float tilt2 = 1. / max_dist2;
	float amount_fix_around_eye = tilt2 * dist_to_eye;

	// noise_amountを0-1の範囲に丸めてnoiseと掛ける
	// fit_0_1で0-1に収めているということはそのままイージング関数に突っ込める
	worldPosition.xy += u_mouse_amount.xy * ease_in_out_quad(fit_0_1(amount_touched_by_mouse)) * ease_in_out_quad(fit_0_1(amount_fix_around_eye));

	vec4 mvPosition =  viewMatrix * worldPosition;
	gl_Position = projectionMatrix * mvPosition;
}
