varying vec2 v_uv;
uniform vec2 u_res;

const float sphere_size = 0.6;

vec3 trans(vec3 p) {
	return mod(p, 6.) - 2.;
}

//
float sphere_distance_function(vec3 position, float size) {
	return length(trans(position)) - size;
}

vec3 normal(vec3 pos, float size) {
	float v = 0.001;
	return normalize(
		vec3(
			sphere_distance_function(pos, size) - sphere_distance_function(vec3(pos.x - v, pos.y, pos.z), size),
			sphere_distance_function(pos, size) - sphere_distance_function(vec3(pos.x, pos.y - v, pos.z), size),
			sphere_distance_function(pos, size) - sphere_distance_function(vec3(pos.x, pos.y, pos.z - v), size)
		)
	);
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
	// ライトの方向
	vec3 light_direction = normalize(vec3(0., 0., 1.));

	// スクリーンカラー初期化
	vec3 color = vec3(0.);
	const float depth = -0.;

	// rayがぶつかるまでカメラちょっとずつ前進していく
	// rayが制限回数ループ内でぶつかれば白を描画
	for(int i = 0; i < 99; i++) {
		vec3 ray_position = camera_position + ray_direction * depth;
		float dist = sphere_distance_function(ray_position, sphere_size);

		if(dist < 0.0001) {
			vec3 normal = normal(camera_position, sphere_size);
			float differ = dot(normal, light_direction);

			color = vec3(differ) + vec3(0.4, 0.2, 0.);
			break;
		}

		camera_position += ray_direction * dist;
	}

	gl_FragColor = vec4(color, 1.0);
}