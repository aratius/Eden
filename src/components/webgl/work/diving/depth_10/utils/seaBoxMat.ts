import { BackSide, Color, ShaderMaterial } from "three";
import ShaderUtils, { frag, fragType, vert, vertType } from "../../../../utils/material/shaderUtils";

export default class SeaBoxMaterial extends ShaderMaterial {

	constructor() {
		super({
			vertexShader: Shader.vert,
			fragmentShader: Shader.frag,
			transparent: true,
			side: BackSide,
			uniforms: {
				u_time: {value: 0},
				u_base_color: {value: new Color(0x002744)},
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
			vec4 color = vec4(u_base_color, 1.);

			color.r -= noise(v_uv*5. + vec2(u_time*0.2)) * 0.1;
			color.g -= noise(v_uv*5. + vec2(-u_time*0.2)) * 0.1;

			gl_FragColor = color;
		}

	`

}