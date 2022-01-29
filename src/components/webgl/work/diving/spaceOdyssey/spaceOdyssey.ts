import { CameraSettings, RendererSettings } from "../../../interfaces";
import WebGLCanvasBase from "../../../utils/template/template";

/**
 * three.jsの残像表示
 */
export default class SpaceOdyssey extends WebGLCanvasBase {

	constructor(canvas: HTMLCanvasElement, renderer: RendererSettings, camera: CameraSettings) {
		super(canvas, renderer, camera)
	}

	_onInit(): void {
		this.endLoading()
	}

	_onDeInit(): void {

	}

	_onResize(): void {

	}

	_onUpdate(): void {
	}

}