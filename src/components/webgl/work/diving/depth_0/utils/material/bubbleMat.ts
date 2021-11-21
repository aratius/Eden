import { ShaderMaterial } from "three";

export default class BubbelMaterial extends ShaderMaterial {

	private startTime: number = 0

	constructor() {
		super({
			vertexShader: Shader.vert,
			fragmentShader: Shader.frag,
			transparent: true,
			uniforms: {
				u_time: {value: 0}
			}
		})
		this.startTime = new Date().getTime()/1000
		this.updateTime()
	}

	updateTime = (): void => {
		this.uniforms.u_time.value = this.startTime - new Date().getTime()/1000
		requestAnimationFrame(this.updateTime)
	}

}

class Shader {

	static noise: string = `
		vec2 random2(vec2 st){
			st = vec2( dot(st,vec2(127.1,311.7)),
								dot(st,vec2(269.5,183.3)) );
			return -1.0 + 2.0*fract(sin(st)*43758.5453123);
		}

		// Gradient Noise by Inigo Quilez - iq/2013
		// https://www.shadertoy.com/view/XdXGW8
		float noise(vec2 st) {
				vec2 i = floor(st);
				vec2 f = fract(st);

				vec2 u = f*f*(3.0-2.0*f);

				return mix( mix( dot( random2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
												dot( random2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
										mix( dot( random2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
												dot( random2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
		}
	`

	static vert: string = `
		// ジオメトリインスタンシングで複製されたそれぞれのモデルに適用される頂点シェーダ
		attribute vec3 offsetPos;
		attribute float index;
		varying vec2 v_uv;
		varying float v_alpha;
		uniform float u_time;

		${Shader.noise}

		const float near = .2;
		const float far = 1.;

		void main() {
			v_uv = uv;

			// モデル座標
			vec3 modelPos = position;
			vec3 p = position;  // 参照用

			// modelPos.xyz += normalize(position) * -(sin(index+u_time) * 0.05 + 0.05);
			// ノイズでモニョモニョさせる
			float freq = .6;
			modelPos.xyz += normalize(position) * noise(vec2(p.x*10. + u_time, p.z*10.+index/10.) * vec2(freq)) * 0.5;
			float floating_pow = mod(u_time + index/100., 1.);
			modelPos.y -= floating_pow * 5.;

			// ワールド座標
			vec4 world_pos = modelMatrix * vec4( modelPos + offsetPos , 1.0 );

			// vertで計算する透明度
			float a = 1.05 - dot(normal, normalize(cameraPosition - world_pos.xyz));
			a *= min(1., length(cameraPosition - world_pos.xyz) * near);

			// カメラとの内積をalphaに反映
			v_alpha = a;
			gl_Position = projectionMatrix * viewMatrix * world_pos;
		}
	`

	static frag: string = `
		// ジオメトリインスタンシングで複製されたそれぞれのモデルに適用されるフラグメントシェーダ
		varying vec2 v_uv;
		varying float v_alpha;
		uniform float u_time;

		void main() {
			vec4 color = vec4(1.);
			color.a *= v_alpha;

			gl_FragColor = color;
		}
	`

}