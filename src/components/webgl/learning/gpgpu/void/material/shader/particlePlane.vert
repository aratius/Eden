#include <common>
uniform sampler2D u_texture_position;
varying vec2 v_uv;
uniform float radius;

void main() {
    vec4 pos_tmp = texture2D(u_texture_position, uv);
    vec3 pos = pos_tmp.xyz;

    // ポイントのサイズを決定
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    vec4 world_pos = modelMatrix * vec4(pos, 1.);
    gl_PointSize = 10000. / distance(cameraPosition, world_pos.xyz);

    // uv情報の引き渡し
    v_uv = uv;

    // 変換して格納
    gl_Position = projectionMatrix * mvPosition;
}