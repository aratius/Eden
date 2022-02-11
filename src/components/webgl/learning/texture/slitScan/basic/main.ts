import { LinearFilter, Mesh, MeshBasicMaterial, PlaneBufferGeometry, RGBFormat, Texture, Vector2, VideoTexture } from "three";
import WebGLCanvasBase from "../../../../utils/template/template";
import FeedbackRT from "./feedbackTarget";
import CombinedMaterial from "./material/combinedMaterial";
import CopiedMaterial from "./material/copiedMaterial";


/**
 * 必要になりそうなシェーダー & テクスチャ
 * 毎回planeに描画して、それをrtCameraから取得して、というフローになる
 *
 * 必要になりそうなシェーダー
 * - historyを更新するシェーダー
 * - 古いテクスチャと新しいフレームを受けて更新する
 * -
 *
 * 必要になりそうなテクスチャ（Planeに描画）
 * - 毎フレーム一番最初に差し込む一番最新のテクスチャ（video）
 * - 履歴を記録するテクスチャ
 * -
 */
export default class WebGLSlitScanBasic extends WebGLCanvasBase {

	private _realTimeDisplay: Mesh = null
	private _combinedDisplay: Mesh = null
	private _video: HTMLVideoElement = null
	private _combinedTarget: FeedbackRT = null
	private _copiedTarget: FeedbackRT = null

	async _onInit(): Promise<void> {
		await this._initVideo()
		this._initRenderTargets()

		this._initCombinedDisplay()
		this._initRealTimeDisplay()

		this.endLoading()
	}

	_onDeInit(): void {

	}

	_onResize(): void {

	}

	_onUpdate(): void {
		this._updateRenderTargets()
	}

	/**
	 *
	 * @returns {Promise<void>}
	 */
	 private async _initVideo(): Promise<void> {
		return new Promise<void>((res) => {
			navigator.getUserMedia(
				{video: true, audio: false},
				(localMediaStream: MediaStream) => {
					this._video = document.createElement("video")
					this._video.srcObject = localMediaStream
					this._video.addEventListener("loadeddata", () => {
						this._video.play()
						res()
					})
				},
				(err: any) => {
					console.error(err)
				}
			)
		})
	}

	/**
	 * @return {Promise<void>}
	 */
	private async _initRealTimeDisplay(): Promise<void> {
		const tex = new VideoTexture(this._video)
		tex.magFilter = LinearFilter
		tex.minFilter = LinearFilter
		tex.format = RGBFormat
		const geo = new PlaneBufferGeometry(1000/2, 700/2, 10, 10)
		const mat = new MeshBasicMaterial({color: 0xffffff, map: tex})

		this._realTimeDisplay = new Mesh(geo, mat)
		this._realTimeDisplay.position.set(200, 150, 0)
		this.scene.add(this._realTimeDisplay)
	}

	/**
	 * @return {Promise<void>}
	 */
	private async _initCombinedDisplay(): Promise<void> {
		const geo = new PlaneBufferGeometry(1000/2, 700/2, 10, 10)
		const mat = new MeshBasicMaterial({color: 0xffffff, map: this._combinedTarget.texture})

		this._combinedDisplay = new Mesh(geo, mat)
		this._combinedDisplay.position.set(-200, -150, 10)
		this.scene.add(this._combinedDisplay)
	}

	private _initRenderTargets(): void {
		this._combinedTarget = new FeedbackRT(new Vector2(1000, 700), new CombinedMaterial())
		this._combinedTarget.setTexture("u_current_texture", new VideoTexture(this._video))

		this._copiedTarget = new FeedbackRT(new Vector2(1000, 700), new CopiedMaterial())
	}

	private _updateRenderTargets(): void {
		if(this._combinedTarget != null && this._copiedTarget != null) {

			// TODO: oldを受ける
			this._combinedTarget.render(this.renderer)

			// TODO: newを受ける
			this._copiedTarget.render(this.renderer)
		}
	}

}
