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

	float random_val = rand(pos);
	v_random_val = random_val;

	vec4 worldPosition = modelMatrix * vec4( pos, 1.0 );
	v_worldPosition = worldPosition;
	vec4 mvPosition =  viewMatrix * worldPosition;
	gl_PointSize = 2000. + (rand(worldPosition.xyz)*2000.+1.);
	gl_Position = projectionMatrix * mvPosition;
}
