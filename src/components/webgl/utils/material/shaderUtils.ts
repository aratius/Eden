import { Vector2, Vector3 } from "three";

export type ScaleVariable = (number|Vector2)

export interface Obj<T,> {[key: string]: T}

// イージング関数の型
export type EasingFn = {
	(x: number): number
}

export type Dir = (1|-1|0)

export interface RendererSettings {
	size: Vector2,
	antialias: boolean
}

export interface CameraSettings {
	fov: number,
	aspect: number,
	near: number,
	far: number,
	pos: Vector3
}

export type glslType = string
export type fragType = string
export type vertType = string
export type shaderType = glslType|fragType|vertType|glslifyType

// シェーダー形式のテンプレートリテラルをパースする関数
type glslifyType = (code: TemplateStringsArray, ...values: string[]) => string

/**
 * boyswan.glsl-literal （vscode拡張）
 * これをインストールすると(frag|vert|glsl|glslify)のテンプレートリテラルタグに対してシンタックスハイライトが効くようになります
 * https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Template_literals#tagged_templates
 */
const glslify: glslifyType = (code: TemplateStringsArray, ...values: string[]) => {
	return values.map((value: string, i: number) => {
		return code[i] + value
	}).concat(code.slice(values.length)).join("")
}

export {
	glslify as frag,
	glslify as vert,
	glslify as glsl,
	glslify
}

export default class ShaderUtils {

	static allVert: vertType = glslify`
		varying vec2 v_uv;
		void main() {
			v_uv = uv;
			vec4 world_position = modelMatrix * vec4(position, 1.);
			gl_Position = projectionMatrix * viewMatrix * world_position;
		}
	`

	static allFrag: fragType = glslify`
		varying vec2 v_uv;
		uniform sampler2D u_tex;
		void main() {
			gl_FragColor = texture2D(u_tex, v_uv);
		}
	`

	static func: Obj<shaderType> = {

		rand321: glslify`
			float rand(vec3 co) {
				return fract(sin(dot(co.xyz, vec3(12.9898, 78.233, 56.787))) * 43758.5453);
			}
		`,
		rand121: glslify`
			float rand(float co) {
				return fract(sin(dot(vec3(co), vec3(12.9898, 78.233, 56.787))) * 43758.5453);
			}
		`,
		rotate2d: glslify`
			mat2 rotate2d(float _angle){
				return mat2(cos(_angle),-sin(_angle),
							sin(_angle),cos(_angle));
			}
		`,
		noise: glslify`
			vec2 random2(vec2 st){
				st = vec2( dot(st,vec2(127.1,311.7)),
						dot(st,vec2(269.5,183.3)) );
				return -1.0 + 2.0*fract(sin(st)*43758.5453123);
			}
			// Gradient Noise by Inigo Quilez - iq/2013
			// https://www.shadertoy.com/view/XdXGW8
			float noise(vec2 st) {
				vec2 i = floor(st);
				vec2 f = fract(st);
				vec2 u = f*f*(3.0-2.0*f);
				return mix( mix( dot( random2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
								dot( random2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
							mix( dot( random2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
								dot( random2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
			}
		`
	}
}