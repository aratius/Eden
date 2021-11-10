import { Vector3 } from "three";
import { CameraSettings, RendererSettings } from "../../interfaces";
import WebGLCanvasBase from "../../utils/template/template";
import Animation1 from "./animation1";
import queryString from "query-string"

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
		this.renderer.setClearColor("black")

		this.group2d.add(this.animation1)
	}

  async _onInit() {

	await this.animation1.init()
	this.animation1.set(basePositions)

	setTimeout(() => {
		this.doAnimation()
	}, 1000)

	this.endLoading()
}

	doAnimation() {

		const parsed = queryString.parse(location.search)
		if("animation" in parsed) {
			if(parsed.animation == "1") {
				this.animation1.animate1()
				this.renderer.setClearColor("black")
			} else if(parsed.animation == "2") {
				this.animation1.animate2()
			} else if(parsed.animation == "3") {
				this.animation1.animate3()
			} else if(parsed.animation == "4") {
				this.animation1.animate4()
			} else if(parsed.animation == "5") {
				this.animation1.animate5()
			} else if(parsed.animation == "6") {
				this.animation1.animate6()
			}
		}
	}

  _onDeInit(): void {

  }

  _onResize(): void {

  }

  _onUpdate(): void {

  }

}