varying vec2 v_uv;
attribute vec3 otherPos;
uniform float u_noiseAmount;
uniform float u_morphAmount;

float rand(vec3 co)
{
	return fract(sin(dot(co.xyz, vec3(12.9898, 78.233, 56.787))) * 43758.5453);
}

// 2D Random
void main() {
	v_uv = uv;

	float am = u_morphAmount;
	vec3 mPos = position;
	vec3 oPos = otherPos;
	vec3 pos = position * am + otherPos * (-am + 1.);

	// 頂点をランダムに揺らしてみる
	float offset = u_noiseAmount;
	pos.x += rand(pos)*offset - offset/2.;
	pos.y += rand(pos)*offset - offset/2.;
	pos.z += rand(pos)*offset - offset/2.;
	vec4 worldPosition = modelMatrix * vec4( pos, 1.0 );
	vec4 mvPosition =  viewMatrix * worldPosition;
	gl_Position = projectionMatrix * mvPosition;
}
