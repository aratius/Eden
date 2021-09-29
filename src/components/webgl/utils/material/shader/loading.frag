varying highp vec2 vUv;
uniform sampler2D tDiffuse;
uniform float u_time;
uniform vec2 u_res;
uniform float u_alpha;

const float size = 0.03;
const float radius = 0.3;
const int point_num = 5;

void main(){
	vec2 p = (gl_FragCoord.xy * 2.0 - u_res) / min(u_res.x, u_res.y);

	vec4 loading = vec4(0.);
	vec4 texture = texture2D(tDiffuse, vUv);

	for(int i = 0; i < point_num; i++) {
		float _i = float(i)+1.;
		vec2 point = vec2(sin(u_time*_i)*radius, cos(u_time*_i)*radius);
		float dist = length(p - point);
		float c = size / dist;
		loading += vec4(c);
	}

	loading.rgba *= u_alpha;
	texture.rgba *= (1.-u_alpha);

	vec4 color = loading + texture;

	color.rgb = vec3(step(sqrt(pow(p.x, 2.) + pow(p.y, 2.)), 0.4));

	gl_FragColor = color;
}