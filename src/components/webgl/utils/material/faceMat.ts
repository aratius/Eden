import { ShaderMaterial, Texture } from "three";
import vertShader from "./shader/face.vert"
import fragShader from "./shader/face.frag"

// サンプルマテリアル　シェーダー記述
export class FaceMaterial extends ShaderMaterial{

	constructor(texture: Texture) {
		super(
			{
				uniforms: {
					u_texture: {value: texture},
					u_time: {value: 0},
				},
				vertexShader: vertShader,
				fragmentShader: fragShader
			}
		)
	}
}