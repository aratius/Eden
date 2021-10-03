import { BackSide, ShaderMaterial, Vector2 } from "three";
import vertShader from "./shader/bigSphere.vert"
import fragShader from "./shader/bigSphere.frag"
import fragShader1 from "./shader/bigSphere1.frag"
import fragShader2 from "./shader/bigSphere2.frag"
import fragShader3 from "./shader/bigSphere3.frag"
import fragShader4 from "./shader/bigSphere4.frag"
import fragShader5 from "./shader/bigSphere5.frag"
import fragShader6 from "./shader/bigSphere6.frag"
import fragShader7 from "./shader/bigSphere7.frag"
import fragShader8 from "./shader/bigSphere8.frag"
import fragShader9 from "./shader/bigSphere9.frag"
import fragShader10 from "./shader/bigSphere10.frag"
import fragShader11 from "./shader/bigSphere11.frag"

export const fragShaders = [
	fragShader,
	fragShader1,
	fragShader2,
	fragShader3,
	fragShader4,
	fragShader5,
	fragShader6,
	fragShader7,
	fragShader8,
	fragShader9,
	fragShader10,
	fragShader11,
]

export default class BigSphereMaterial extends ShaderMaterial {


	constructor(i: number, segments: Vector2) {
		super({
			uniforms: {
				u_time: {value: 0},
				u_segments: {value: segments}
			},
			vertexShader: vertShader,
			fragmentShader: fragShaders[i],
			side: BackSide
		})
		this.uniformsNeedUpdate = true
	}

}