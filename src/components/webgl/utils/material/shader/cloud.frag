varying vec2 v_uv;
varying vec4 v_worldPosition;
uniform sampler2D u_texture;
uniform float u_time;
varying float v_random_val;

// テクスチャを回転させた上でposを返す
vec2 getRotatedPos(vec2 pos/*座標系*/, vec2 offset/*回転中心*/, float angle/*回転*/) {
	float cosX, sinX;
	float cosY, sinY;
	sinX = sin(angle);
	cosX = cos(angle);
	sinY = sin(angle);
	cosY = cos(angle);
	mat2 rotationMatrix = mat2(cosX, -sinX, sinY, cosX);
	vec2 newcoords = ((pos-offset) * (rotationMatrix));
	newcoords += offset;
	return newcoords;
}

float rand(vec3 co) {
	return fract(sin(dot(co, vec3(12.9898, 78.233, 56.787))) * 43758.5453);
}

void main() {

	vec2 pos = gl_PointCoord;

	float angle = u_time/30.*(rand(v_worldPosition.xyz)*3.+1.);

	vec4 color = texture2D(u_texture, getRotatedPos(pos, vec2(0.5, 0.5), angle));

	color.a*= 0.5;

	gl_FragColor = color;
}