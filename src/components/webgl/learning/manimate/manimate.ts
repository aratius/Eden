import { Vector3 } from "three";
import { CameraSettings, RendererSettings } from "../../interfaces";
import WebGLCanvasBase from "../../utils/template/template";
import Animation1 from "./animation1";

export const basePositions: Vector3[] = [
	new Vector3(-30, 120, 0),
	new Vector3(30, 90, 0),
	new Vector3(-60, 60, 0),
	new Vector3(60, 30, 0),
	new Vector3(-70, 0, 0),
	new Vector3(50, -30, 0),
	new Vector3(-40, -60, 0),
	new Vector3(50, -90, 0),
	new Vector3(-30, -120, 0),
	new Vector3(30, -150, 0),
]

/**
 */
export default class WebGLMAnimate extends WebGLCanvasBase {

	animation1: Animation1 = new Animation1()

	constructor(canvas: HTMLCanvasElement, renderer: RendererSettings, camera: CameraSettings) {
		super(canvas, renderer, camera)

		this.group2d.add(this.animation1)
	}

  _onInit(): void {

	this.animation1.init()
	this.animation1.set(basePositions)


	setTimeout(() => {
		this.animation1.animate()
	}, 1000)

	this.endLoading()
  }

  _onDeInit(): void {

  }

  _onResize(): void {

  }

  _onUpdate(): void {

  }

}