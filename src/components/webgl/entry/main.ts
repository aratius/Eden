import { CameraSettings, RendererSettings } from "../interfaces";
import WebGLCanvasBase from "../utils/template/template";

export default class WebGLMain extends WebGLCanvasBase {

	constructor(canvas: HTMLCanvasElement, renderer: RendererSettings, camera: CameraSettings) {
		super(canvas)

	}

	_onInit(): void {}

	_onDeInit(): void {}
	_onResize(): void {}
	_onUpdate(): void {}

}