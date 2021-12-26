uniform float u_time;
uniform float u_appear_pos;  // -1 ~ 0 ~ 1
uniform vec2 u_mouse_position;  // -1 ~ 0 ~ 1
uniform vec2 u_mouse_speed;  // -1 ~ 0 ~ 1
// 移動方向についていろいろ計算できるシェーダー。
// 今回はなにもしてない。
// ここでVelのx y zについて情報を上書きすると、それに応じて移動方向が変わる
// NOTE: こっちで速度計算されると舞い計算ごとにテクスチャが更新されるので擬似的に前フレームの状態を抜き出すことができる
#include <common>

vec2 r = vec2(600., 600.);

float rand(vec3 co) {
	return fract(sin(dot(co.xyz, vec3(12.9898, 78.233, 56.787))) * 43758.5453);
}

void main() {
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	float idParticle = uv.y * resolution.x + uv.x;
	vec4 tmpVel = texture2D( textureVelocity, uv );
	vec3 vel = tmpVel.xyz;
	vec4 tmpPos = texture2D( texturePosition, uv );
	vec3 pos = tmpPos.xyz;

	// デフォルトの位置を記憶
	vec3 defalt_pos = vec3((uv.x-0.5) * r.x, (uv.y-0.5) * r.y, 0.);

	vel += normalize(defalt_pos - pos) * 0.05 * length(defalt_pos - pos);
	// vel += normalize(defalt_pos - pos) * 0.05 * length(defalt_pos - pos);
	// vel += normalize(defalt_pos - pos);

	vec2 mouse_speed = u_mouse_speed;
	if(length(mouse_speed) < 0.01) mouse_speed = vec2(0.01);

	// マウスに追随
	float len = length(vec3(u_mouse_position, 0.) - pos)+0.5;
	vel += vec3(mouse_speed + vec2(0.01, 0.01), 0.) * 30./ max(len, 5.);  // 分母がちっちゃくなりすぎるとぶっ飛ぶので

	vel *= vec3(0.97);

	gl_FragColor = vec4( vel.xyz, 1.0 );
}