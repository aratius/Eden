import { BackSide, Color, DoubleSide, ShaderMaterial } from "three";
import ShaderUtils, { frag, fragType, vert, vertType } from "../../../../utils/material/shaderUtils";

export default class GodRayMaterial extends ShaderMaterial {

	constructor() {
		super({
			vertexShader: Shader.vert,
			fragmentShader: Shader.frag,
			transparent: true,
			side: DoubleSide,
			uniforms: {
				u_time: {value: 0},
			}
		})
	}

}

class Shader {

	static vert: vertType = vert`
		varying vec2 v_uv;

		void main () {
			v_uv = uv;

			vec4 worldPosition = modelMatrix * vec4(position, 1.);
			gl_Position = projectionMatrix * viewMatrix * worldPosition;
		}
	`

	static frag: fragType = frag`
		varying vec2 v_uv;
		uniform vec3 u_base_color;
		uniform float u_time;

		${ShaderUtils.func.noise}

		void main() {
			vec4 color = vec4(0.);

			color.rgb += noise(vec2(v_uv.x, u_time/10.)*10.) * 5.;
			color.a += noise(vec2(v_uv.x, u_time/10.)*10.) * 0.05;

			// uv座標がバチッと変わる0, 1付近のみちょっと消す
			color.a *= min(v_uv.x*50., 1.);
			color.a *= min((1.-v_uv.x)*50., 1.);

			gl_FragColor = color;
		}
	`

}