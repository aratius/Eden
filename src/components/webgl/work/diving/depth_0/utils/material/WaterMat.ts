import { Color, Matrix4, ShaderMaterial, UniformsLib, UniformsUtils, Vector3 } from "three";
import vertShader from "./shader/water.vert"
import fragShader from "./shader/water.frag"

export default class WaterMaterial extends ShaderMaterial {

    constructor(lights: boolean, side: any, fog: any) {
        super({
            uniforms: UniformsUtils.merge( [
				UniformsLib[ 'fog' ],
				UniformsLib[ 'lights' ],
				{
					'normalSampler': { value: null },
					'mirrorSampler': { value: null },
					'alpha': { value: 1.0 },
					'time': { value: 0.0 },
					'size': { value: 1.0 },
					'distortionScale': { value: 20.0 },
					'textureMatrix': { value: new Matrix4() },
					'sunColor': { value: new Color( 0x7F7F7F ) },
					'sunDirection': { value: new Vector3( 0.70707, 0.70707, 0 ) },
					'eye': { value: new Vector3() },
					'waterColor': { value: new Color( 0x555555 ) }
				}
			] ),

			vertexShader: vertShader,
			fragmentShader: fragShader,
			lights: true,
			side: side,
			fog: fog,
			transparent: true
        })
    }

}