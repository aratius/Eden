import { WebGLRenderer, Vector2, Camera } from "three";
import { CanvasSize } from "../../config/config";
import { RendererSettings } from "../../interfaces";

export default class MainRenderer extends WebGLRenderer {

	static get defaultSettings(): RendererSettings {
		return {
			size: new Vector2(CanvasSize.size.x, CanvasSize.size.y),
			antialias: true
		}
	}

	constructor(canvas: HTMLCanvasElement, _settings: RendererSettings) {
		const settings = _settings != null ? _settings : MainRenderer.defaultSettings
		super({canvas: canvas, antialias: settings.antialias})
		this.setPixelRatio(1);

		this.setSize(settings.size.x, settings.size.y)
		this.setClearColor(0xffffff)
	}

	public setFullScreen(): void {
		this.setPixelRatio(1);
		this.setSize(CanvasSize.size.x, CanvasSize.size.y)
	}


}