import fragShader from "./shader/rayMarching.frag"
import vertShader from "./shader/display.vert"
import { Vector2 } from "three";
import { CanvasSize } from "../../../config/config";

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
        'u_res': {value: new Vector2(CanvasSize.size.x, CanvasSize.size.y)}
	},

	vertexShader: vertShader,
	fragmentShader: fragShader

};