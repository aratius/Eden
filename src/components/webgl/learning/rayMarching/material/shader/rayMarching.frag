varying vec2 v_uv;
uniform vec2 u_res;

const float sphere_size = 0.6;

//
float sphere_distance_function(vec3 position, float size) {
	return length(position) - size;
}

void main () {
	// 正規化
	vec2 position = (gl_FragCoord.xy * 2.0 - u_res.xy) / min(u_res.x, u_res.y);
	// カメラ位置定義
	vec3 camera_position = vec3(0., 0., 10.);

	// スクリーンの定義
	float screen_z = 4.0;
	vec3 screen = vec3(position, screen_z);

	// レイの方向
	vec3 ray_direction = normalize(screen - camera_position);

	// スクリーンカラー初期化
	vec3 color = vec3(0.);

	// rayがぶつかるまでちょっとずつ前進していく
	for(int i = 0; i < 99; i++) {
		vec3 ray_position = camera_position + ray_direction;
		float dist = sphere_distance_function(ray_position, sphere_size);

		if(dist < 0.0001) {
			color = vec3(1.);
			break;
		}

		camera_position += ray_direction * dist;
	}

	gl_FragColor = vec4(color, 1.0);
}