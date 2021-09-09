varying vec2 v_uv;
uniform float u_time;

// 2D Random
void main() {
	v_uv = uv;

	vec3 pos = position;

	vec4 worldPosition = modelMatrix * vec4( pos, 1.0 );
	vec4 mvPosition =  viewMatrix * worldPosition;
	gl_Position = projectionMatrix * mvPosition;
}
