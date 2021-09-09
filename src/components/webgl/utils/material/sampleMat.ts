import { ShaderMaterial } from "three";
import vertShader from "./shader/sample.vert"
import fragShader from "./shader/sample.frag"

// サンプルマテリアル　シェーダー記述
export class SampleMat extends ShaderMaterial{

	constructor() {
		super(
			{
				uniforms: {
					u_noiseAmount: {value: 0},
					u_morphAmount: {value: 0}
				},
				vertexShader: vertShader,
				fragmentShader: fragShader
			}
		)
	}
}