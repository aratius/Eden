import vertShader from "./shader/loading.vert"
import fragShader from "./shader/loading.frag"
import { Vector2 } from "three";
import { CanvasSize } from "../../config/config";

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
export const loadingShader: DisplayShader = {
	uniforms: {
		// tDiffuseという名前はShaderPass組み込み
		'tDiffuse': { value: null },
		'u_time': {value: 0},
		'u_alpha': {value: 1},
		'u_res': {value: new Vector2(CanvasSize.size.x, CanvasSize.size.y)}
	},
	vertexShader: vertShader,
	fragmentShader: fragShader
};