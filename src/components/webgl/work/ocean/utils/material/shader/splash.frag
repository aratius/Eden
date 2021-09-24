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

float rand(float co) {
	return fract(sin(dot(vec3(co), vec3(12.9898, 78.233, 56.787))) * 43758.5453);
}

// 0-1に収める
float fit_0_1(float val) {
	return max(min(val, 1.), 0.);
}

void main() {

	vec2 pos = gl_PointCoord;

	vec4 color = texture2D(u_texture, getRotatedPos(pos, vec2(0.5, 0.5), u_time*(rand(v_random_val) * 10. - 5.)));

	// 水面より高いものだけ描画
	float alpha = fit_0_1(1./0.3 * v_worldPosition.y);
	color.a *= alpha * 0.3;

	gl_FragColor = color;
}