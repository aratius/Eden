import { PerspectiveCamera, Vector3 } from "three";
import { CanvasSize } from "../../config/config";
import { CameraSettings, RendererSettings } from "../../interfaces";

export default class MainCamera extends PerspectiveCamera {

	settings: CameraSettings

	static perspective: number = 1000

	static get defaultSettings(): CameraSettings {
		// カメラの距離
		const perspective = MainCamera.perspective
		return {
			fov: (180 * (2 * Math.atan(CanvasSize.size.y / 2 / perspective))) / Math.PI,
			aspect: CanvasSize.size.x / CanvasSize.size.y,
			near: 0.001,
			far: 2000,
			pos: new Vector3(0, 0, perspective)
		}
	}

	constructor(_settings: CameraSettings) {
		const settings = _settings != null ? _settings : MainCamera.defaultSettings
		super(settings.fov, settings.aspect, settings.near, settings.far)

		this.settings = settings
		this.position.set(settings.pos.x, settings.pos.y, settings.pos.z)
	}

	resizeAuto(): void {
		const settings = MainCamera.defaultSettings
		this.aspect = settings.aspect
		this.fov = settings.fov
		this.updateProjectionMatrix();
	}

}
