varying vec2 v_uv;
varying vec4 v_worldPosition;
varying float v_random_val;
uniform float u_time;
uniform vec3 u_camera_pos;

const float PI = 3.14159265;

float rand(vec3 co) {
	return fract(sin(dot(co.xyz, vec3(12.9898, 78.233, 56.787))) * 43758.5453);
}

// 2D Random
void main() {
	v_uv = uv;
	vec3 pos = position;
	pos += rand(position);

	float random_val = rand(pos);
	v_random_val = random_val;

	vec4 worldPosition = modelMatrix * vec4( pos, 1.0 );
	worldPosition.y = sin(u_time*(random_val+5.) + random_val*5.) * random_val * 2.;
	worldPosition.x += sin(u_time*(random_val+5.) + PI/2. + random_val*5.) * random_val * 2.;
	v_worldPosition = worldPosition;
	vec4 mvPosition =  viewMatrix * worldPosition;
	gl_PointSize = 400. / distance(u_camera_pos, worldPosition.xyz) * (rand(position)*10.-5.);
	gl_Position = projectionMatrix * mvPosition;
}
