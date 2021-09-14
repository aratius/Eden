import { ShaderMaterial } from "three";
import vertShader from "./shader/splash.vert"
import fragShader from "./shader/splash.frag"

// サンプルマテリアル　シェーダー記述
export class SplashMaterial extends ShaderMaterial{

	constructor() {
		super(
			{
				uniforms: {
				},
				vertexShader: vertShader,
				fragmentShader: fragShader
			}
		)
	}
}