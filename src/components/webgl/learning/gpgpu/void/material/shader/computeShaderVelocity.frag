uniform float u_time;
// 移動方向についていろいろ計算できるシェーダー。
// 今回はなにもしてない。
// ここでVelのx y zについて情報を上書きすると、それに応じて移動方向が変わる
// NOTE: こっちで速度計算されると舞い計算ごとにテクスチャが更新されるので擬似的に前フレームの状態を抜き出すことができる
#include <common>

void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    float idParticle = uv.y * resolution.x + uv.x;
    vec4 tmpVel = texture2D( textureVelocity, uv );
    vec3 vel = tmpVel.xyz;
    // 現在位置
    vec4 tmpPos = texture2D( texturePosition, uv );
    vec3 pos = tmpPos.xyz;

    vec3 other_pos = vec3(0.);
    vec3 dir = vec3(0.);
    vec3 reflect_sum = vec3(0.);
    float dist = 0.;
    vec3 dir_sum = vec3(0.);
    float dir_cnt = 0.001;
    vec3 pos_sum = vec3(0.);
    float pos_cnt = 0.001;
    for(float x = 0.; x < 100.; x++) {
        for(float y = 0.; y < 100.; y++) {
            vec2 ref = vec2(x + 0.5, y + 0.5) / resolution.xy;
            other_pos = texture2D(texturePosition, ref).xyz;

            dir = other_pos - pos;
            dist = length(dir);

            if(dist < 0.0001) continue;
            if(dist > 100.) continue;
            // 近いと離れる
            if(dist < 100.) {
                reflect_sum += - normalize(dir) * (100. - dist)/100.;
            }
            // 周りと同じ方向に
            if(dist < 150.) {
                dir_sum += normalize(dir);
                dir_cnt += 1.;
            }
            // 周りの真ん中に
            if(dist < 150.) {
                pos_sum += other_pos;
                pos_cnt += 1.;
            }

        }
    }

    vel += reflect_sum * 0.3;
    if(length(dir_sum) != 0.)vel += (dir_sum/dir_cnt - pos) * 0.05;
    if(length(pos_sum) != 0.) vel += (pos_sum/pos_cnt - pos) * 0.07;

    vel.xyz *= 0.98;

    gl_FragColor = vec4( vel.xyz, 1.0 );
}