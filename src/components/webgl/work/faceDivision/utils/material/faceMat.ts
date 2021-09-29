import { DoubleSide, ShaderMaterial, Texture, Vector2, Vector3 } from "three";
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
					u_emotion: {value: 0},
					u_blink_amount: {value: 0},
					u_tension: {value: 1},
					u_joint_positions: {value: [0]},
					u_joint_sizes: {value: [0]},
					u_joint_length: {value: 1},
					u_dir: {value: 1}
				},
				vertexShader: vertShader,
				fragmentShader: fragShader,
				side: DoubleSide,
				// wireframe: true
			}
		)
	}
}