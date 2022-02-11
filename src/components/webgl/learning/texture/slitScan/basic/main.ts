import gsap from "gsap";
import { LinearFilter, Material, Mesh, MeshBasicMaterial, PlaneBufferGeometry, RGBFormat, Texture, Vector2, Vector3, VideoTexture } from "three";
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

	private _displays: Mesh[] = []
	private _videoTexture: Texture = null
	private _combinedTarget: FeedbackRT = null
	private _copiedTarget: FeedbackRT = null
	private _timeMapTarget: FeedbackRT = null
	private _slideTimeline: GSAPTimeline = null

	/**
	 * ディスプレイを作る
	 * @param mat
	 * @param size
	 * @param pos
	 * @returns
	 */
	private static _createDisplay(mat: Material, size: Vector2, pos: Vector3): Mesh {
		const geo = new PlaneBufferGeometry(1, 1, 1, 1)

		const display = new Mesh(geo, mat)
		display.position.set(pos.x, pos.y, pos.z)
		display.scale.set(size.x, size.y, 1)
		return display
	}

	async _onInit(): Promise<void> {
		this._videoTexture = await this._initVideo()
		this._initRenderTargets()
		this._initDisplays()

		this.renderer.setClearColor(0x000)

		this.endLoading()
	}

	_onDeInit(): void {}

	_onResize(): void {}

	_onUpdate(): void {
		this._updateRenderTargets()
	}

	/**
	 * ディスプレイをスライド
	 */
	private _slideUI(): void {
		const positoins = this._displays.map(d => d.position)
		const scales = this._displays.map(d => d.scale)

		if(this._slideTimeline.isActive()) return
		if(this._slideTimeline != null) this._slideTimeline.kill()
		this._slideTimeline = gsap.timeline()

		this._displays.forEach((display: Mesh, i: number, arr: Mesh[]) => {
			const nextIndex = i+1 > arr.length-1 ? 0 : i+1
			const p = positoins[nextIndex]
			const s = scales[nextIndex]
			this._slideTimeline.to(display.position, {x: p.x, y: p.y}, 0)
			this._slideTimeline.to(display.scale, {x: s.x, y: s.y}, 0)
		})
	}

	/**
	 * initialize web camera
	 * @returns {Promise<void>}
	 */
	 private async _initVideo(): Promise<Texture> {
		try {
			const localMediaStream: MediaStream = await navigator.mediaDevices.getUserMedia({video: true, audio: false})
			const video = document.createElement("video")
			video.srcObject = localMediaStream

			video.addEventListener("loadeddata", () => {
				video.play()
			})
			return new VideoTexture(video)
		} catch(err) {
			console.error(err)
		}
	}

	/**
	 * 各種裏側の処理の確認用のディスプレイを初期化
	 */
	private _initDisplays(): void {
		const basicMat = (map: Texture) => new MeshBasicMaterial({map})

		const realTimeDisplay = WebGLSlitScanBasic._createDisplay(
			basicMat(this._videoTexture),
			new Vector2(500/3.1, 360/3.1),
			new Vector3(280, 122, 0)
		)

		const timeslicedDisplay = WebGLSlitScanBasic._createDisplay(
			basicMat(this._combinedTarget.texture),
			new Vector2(500/3.1, 360/3.1),
			new Vector3(280, 0, 0)
		)

		const timeMapDisplay = WebGLSlitScanBasic._createDisplay(
			basicMat(this._timeMapTarget.texture),
			new Vector2(500/3.1, 360/3.1),
			new Vector3(280, -122, 0)
		)

		const slitScanResult = WebGLSlitScanBasic._createDisplay(
			new SlitScanMaterial(this._combinedTarget.texture, this._timeMapTarget.texture),
			new Vector2(500, 360),
			new Vector3(-100, 0, 0)
		)

		this.scene.add(realTimeDisplay, timeslicedDisplay, timeMapDisplay, slitScanResult)
		this._displays.push(realTimeDisplay, timeslicedDisplay, timeMapDisplay, slitScanResult)
	}

	/**
	 * レンダーターゲット系を初期化
	 */
	private _initRenderTargets(): void {
		this._combinedTarget = new FeedbackRT(new Vector2(1000*3, 720*3), new CombinedMaterial())
		this._combinedTarget.setTexture("u_current_texture", this._videoTexture)
		this._copiedTarget = new FeedbackRT(new Vector2(1000*3, 720*3), new CopiedMaterial())
		this._timeMapTarget = new FeedbackRT(new Vector2(1000, 720), new TimeMapMaterial())
	}

	/**
	 * レンダーターゲットを更新
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


}
