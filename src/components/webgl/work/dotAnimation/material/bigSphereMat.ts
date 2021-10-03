import { BackSide, ShaderMaterial } from "three";
import vertShader from "./shader/bigSphere.vert"
import fragShader from "./shader/bigSphere.frag"

export default class BigSphereMaterial extends ShaderMaterial {

	constructor() {
		super({
			uniforms: {

			},
			vertexShader: vertShader,
			fragmentShader: fragShader,
			side: BackSide
		})
	}

}