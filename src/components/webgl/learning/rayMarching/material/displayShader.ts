import fragShader from "./shader/rayMarching.frag"
import vertShader from "./shader/display.vert"

interface DisplayShader {
	uniforms: {
		[key: string]: {
			value: any
		}
	},
	vertexShader: string,
	fragmentShader: string
}

/**
 * レンダリング前にスクリーンに直接かけるシェーダー
 */
export const rayMarchingShader: DisplayShader = {
	uniforms: {
		// tDiffuseという名前はShaderPass組み込み
		'tDiffuse': { value: null },
		'u_time': {value: 0},
	},

	vertexShader: vertShader,
	fragmentShader: fragShader

};