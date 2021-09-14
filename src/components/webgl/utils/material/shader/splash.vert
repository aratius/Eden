varying vec2 v_uv;
varying vec4 v_worldPosition;
uniform float u_time;
uniform vec3 u_camera_pos;

const float PI = 3.14159265;

float rand(vec3 co)
{
	return fract(sin(dot(co.xyz, vec3(12.9898, 78.233, 56.787))) * 43758.5453);
}

// 2D Random
void main() {
	v_uv = uv;
	vec3 pos = position;
	pos += rand(pos);

	vec4 worldPosition = modelMatrix * vec4( pos, 1.0 );
	worldPosition.y = sin(u_time*5. + rand(pos)*5.)*2.;
	worldPosition.x += sin(u_time*5. + PI/2. + rand(pos)*5.)*2.;
	v_worldPosition = worldPosition;
	vec4 mvPosition =  viewMatrix * worldPosition;
	gl_PointSize = 100. / distance(u_camera_pos, worldPosition.xyz);
	gl_Position = projectionMatrix * mvPosition;
}
