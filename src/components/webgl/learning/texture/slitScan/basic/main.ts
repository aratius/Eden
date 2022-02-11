import { LinearFilter, Mesh, MeshBasicMaterial, PlaneBufferGeometry, RGBFormat, Vector2, VideoTexture } from "three";
import WebGLCanvasBase from "../../../../utils/template/template";
import FeedbackRT from "./feedbackTarget";
import CombinedMaterial from "./material/combinedMaterial";
import CopiedMaterial from "./material/copiedMaterial";
import SlitScanMaterial from "./material/slitScanMaterial";
import TimeMapMaterial from "./material/timeMapMaterial";

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
	private _video: HTMLVideoElement = null
	private _combinedTarget: FeedbackRT = null
	private _copiedTarget: FeedbackRT = null
	private _timeMapTarget: FeedbackRT = null

	async _onInit(): Promise<void> {
		await this._initVideo()
		this._initRenderTargets()
		this._initCombinedDisplay()
		this._initRealTimeDisplay()
		this._initTimeMapDisplay()
		this._initSlitScanResult()

		this.endLoading()
	}

	_onDeInit(): void {}

	_onResize(): void {}

	_onUpdate(): void {
		this._updateRenderTargets()
	}

	/**
	 * initialize web camera
	 * @returns {Promise<void>}
	 */
	 private async _initVideo(): Promise<void> {
		return new Promise<void>(async(res) => {
			try {
				const localMediaStream: MediaStream = await navigator.mediaDevices.getUserMedia({video: true, audio: false})
				this._video = document.createElement("video")
				this._video.srcObject = localMediaStream
				this._video.addEventListener("loadeddata", () => {
					this._video.play()
					res()
				})
			} catch(err) {
				console.error(err)
			}
		})
	}

	/**
	 * 現在のvideoを単に表示
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
		this._realTimeDisplay.position.set(400, 200, 0)
		this.scene.add(this._realTimeDisplay)
	}

	/**
	 * 全部をグリッド状に並べたtimeslicedを表示
	 * @return {Promise<void>}
	 */
	private async _initCombinedDisplay(): Promise<void> {
		const geo = new PlaneBufferGeometry(1000/2, 700/2, 10, 10)
		const mat = new MeshBasicMaterial({color: 0xffffff, map: this._combinedTarget.texture})

		const combinedDisplay = new Mesh(geo, mat)
		combinedDisplay.position.set(-400, -200, 10)
		this.scene.add(combinedDisplay)
	}

	/**
	 * 時間経過を表すmap
	 * @return {Promise<void>}
	 */
	 private async _initTimeMapDisplay(): Promise<void> {
		const geo = new PlaneBufferGeometry(1000/2, 700/2, 10, 10)
		const mat = new MeshBasicMaterial({color: 0xffffff, map: this._timeMapTarget.texture})

		const timeMapDisplay = new Mesh(geo, mat)
		timeMapDisplay.position.set(400, -200, 10)
		this.scene.add(timeMapDisplay)
	}

	/**
	 * レンダーターゲット系を初期化
	 */
	private _initRenderTargets(): void {
		this._combinedTarget = new FeedbackRT(new Vector2(1000*3, 700*3), new CombinedMaterial())
		this._combinedTarget.setTexture("u_current_texture", new VideoTexture(this._video))

		this._copiedTarget = new FeedbackRT(new Vector2(1000*3, 700*3), new CopiedMaterial())

		this._timeMapTarget = new FeedbackRT(new Vector2(1000, 700), new TimeMapMaterial())
	}

	/**
	 *
	 */
	private _updateRenderTargets(): void {
		if(this._combinedTarget != null && this._copiedTarget != null && this._timeMapTarget != null) {
			// TODO: oldを受ける
			this._combinedTarget.setTexture("u_old_texture", this._copiedTarget.texture)
			this._combinedTarget.render(this.renderer)

			// TODO: newを受ける
			this._copiedTarget.setTexture("u_copied_texture", this._combinedTarget.texture)
			this._copiedTarget.render(this.renderer)

			this._timeMapTarget.render(this.renderer)
			this._timeMapTarget.setTime(this.elapsedTime)
		}
	}

	/**
	 *
	 */
	private _initSlitScanResult(): void {
		const geo = new PlaneBufferGeometry(1000/2, 700/2, 10, 10)
		const mat = new SlitScanMaterial(this._combinedTarget.texture, this._timeMapTarget.texture)

		const result = new Mesh(geo, mat)
		result.position.set(-400, 200, 10)
		this.scene.add(result)
	}

}
