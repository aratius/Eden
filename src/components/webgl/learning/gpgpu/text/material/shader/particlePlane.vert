#include <common>
uniform sampler2D u_texture_position;
uniform sampler2D u_texture_face;
varying vec2 v_uv;
varying vec4 v_color;
uniform float u_time;

const vec3  monochromeScale = vec3(0.298912, 0.586611, 0.114478);


float rand(vec3 co) {
	return fract(sin(dot(co.xyz, vec3(12.9898, 78.233, 56.787))) * 43758.5453);
}

void main() {
    vec4 pos_tmp = texture2D( u_texture_position, uv );
    vec3 pos = pos_tmp.xyz;

    // 前のランダムなポジション
    // vec3 rand_offset = vec3(rand(pos + vec3(1.)), rand(pos + vec3(2.)), rand(pos + vec3(3.))) * 100.;
    // pos += max(rand_offset * (-u_time * 1./2. + 1.), 0.);

    vec4 tex = texture2D(u_texture_face, uv);
    v_color = tex.rgba;

    // ポイントのサイズを決定
    vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );
    gl_PointSize = 8.;

    // uv情報の引き渡し
    v_uv = uv;

    // 変換して格納
    gl_Position = projectionMatrix * mvPosition;
}