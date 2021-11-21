uniform float u_size;
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

    if(pos.z > 300.) {
        vel.z *= -1.;
    }
    if(pos.z < -300.) {
		vel.z *= -1.;
    }

	vec3 other_pos = vec3(0.);
	vec3 dir = vec3(0.);
	vec3 other_vel = vec3(0.);
	vec3 reflect_sum = vec3(0.);
	float dist = 0.;
	vec3 dir_sum = vec3(0.);
	float dir_cnt = 0.001;
	vec3 pos_sum = vec3(0.);
	float pos_cnt = 0.001;
	for(float x = 0.; x < 30.; x++) {
		for(float y = 0.; y < 30.; y++) {
			vec2 ref = vec2(x + 0.5, y + 0.5) / resolution.xy;
			other_pos = texture2D(texturePosition, ref).xyz;

			dir = other_pos - pos;
			dist = length(dir);

			if(dist < 0.0001) continue;  // 自分自身

			// 近いと離れる
			if(dist < 70.) {
				float dist_effect = (70. - dist)/(70. + 1e-4);
				reflect_sum += - normalize(dir) * dist_effect;
			}
			// 周りと同じ方向（速度）に
			if(dist < 60.) {
				float dist_effect = (60. - dist)/(60. + 1e-4);
				other_vel = texture2D(textureVelocity, ref).xyz;
				if(length(other_vel) != 0.) {
					dir_sum += normalize(other_vel) * dist_effect;
					dir_cnt += 1.;
				}
			}
			// 周りの位置の平均に
			if(dist < 60.) {
				float dist_effect = (60. - dist)/(60. + 1e-4);
				pos_sum += other_pos * dist_effect;
				pos_cnt += 1.;
			}

		}
	}

	vel += reflect_sum * 1.0;
	if(dir_cnt >= 1.) vel += normalize(dir_sum/dir_cnt) * 1.5;
	if(pos_cnt >= 1.) vel += normalize(pos_sum/pos_cnt - pos) * 1.5;

	vel.xyz *= 0.99;

	gl_FragColor = vec4( vel.xyz, 1.0 );
}