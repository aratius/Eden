import { Color, Euler, Mesh, Points, Vector2, Vector3 } from "three";

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

export interface VertData {
	vertex: boolean,
	index: number
}

// イージング関数の型
export type EasingFn = {
	(x: number): number
}

export interface TweenDict {
	[key: string]: GSAPTween
}