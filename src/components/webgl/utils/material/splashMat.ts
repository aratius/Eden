import { ShaderMaterial, Texture, Vector3 } from "three";
import vertShader from "./shader/splash.vert"
import fragShader from "./shader/splash.frag"

// サンプルマテリアル　シェーダー記述
export class SplashMaterial extends ShaderMaterial{

	constructor() {
		super(
			{
				uniforms: {
                    u_texture: {value: new Texture()},
                    u_time: {value: 0},
                    u_camera_pos: {value: new Vector3(0, 0, 0)}
				},
				vertexShader: vertShader,
				fragmentShader: fragShader,
                transparent: true,
                // depthWrite: false,
                // depthTest: false
			}
		)
	}
}