import { ShaderMaterial, Texture, Vector3 } from "three";
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
					u_intersect_pos: {value: new Vector3()},
					u_emotion: {value: 0}
				},
				vertexShader: vertShader,
				fragmentShader: fragShader
			}
		)
	}
}