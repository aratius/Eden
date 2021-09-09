import MainScene from "./scene"
import MainRenderer from "./renderer"
import MainCamera from "./camera"
import { RendererSettings } from '../../interfaces'
import { CameraSettings } from '../../interfaces'
import Mouse from '../model/mouse'
import Group2D_ish from "./2DGroup_ish"
import { Group, Vector2 } from "three"
import { CanvasSize } from "../../config/config"
import Stats from "stats.js"

/**
 * Three.jsテンプレート
 * これを継承してそれぞれのWebGLシーンをつくる
 * 汎用性を考えて作ったつもり
 */
export default abstract class WebGLCanvasBase extends Group {
	// シーン
	protected scene: MainScene = null
	// レンダラ
	protected renderer: MainRenderer = null
	// カメラ
	protected camera: MainCamera = null
	// 2D風に座標配置するためのGroup
	protected group2d: Group2D_ish = null
	// マウス座標 中心基準にこのテンプレートの中で整形される
	protected mouse: Mouse
	// Updateのためのフラグ
	private shouldUpdate: boolean = false
	// リサイズ処理が走りすぎないようにするためのタイマー
	private resizeTimer: any = null
	// initした時間
	private startTime: number = 0
	// requestAnimationFrameのID
	private updateId: number = null
	// stats
	private stats: Stats = new Stats()

	/**
	 * コンストラクタ
	 * 抽象クラスです
	 * @param container
	 * @param renderer
	 * @param camera
	 */
	constructor(canvas: HTMLCanvasElement = null, renderer: RendererSettings = null, camera: CameraSettings = null) {
		super()
		this.scene = new MainScene()
		this.renderer = new MainRenderer(canvas, renderer)
		this.camera = new MainCamera(camera)
		this.group2d = new Group2D_ish(this.camera)
		this.scene.add(this.group2d)

		this.mouse = new Mouse(CanvasSize.size.x, CanvasSize.size.y)
		this.shouldUpdate = false;

	}

	/**
	 * initからの経過時間
	 */
	protected get elapsedTime(): number {
		return new Date().getTime()/1000 - this.startTime
	}

	/**
	 * window幅の半分
	 */
	protected get windowHalf() {
		return new Vector2(CanvasSize.size.x/2, CanvasSize.size.y/2)
	}

	/**
	 * 共通の初期化処理あればここで
	 */
	public init(): void {
		if(location.hostname === "localhost") document.body.appendChild(this.stats.dom)

		this.startTime = new Date().getTime() / 1000

		this._onInit()
		this.onResize()
		this.onInitUpdate()

		// イベント登録
		window.addEventListener("resize", this.invokeResizeTimer)
		window.addEventListener("mousemove", this.onMousemove)
		window.addEventListener("focus", this.onFocus)
		window.addEventListener("blur", this.onBlur)
		window.addEventListener("beforeunload", this.deInit)
	}

	/**
	 * 共通の終了処理あればここで
	 * beforeunloadのタイミング、もしくは手動で呼び出す
	 */
	public deInit = (): void => {
		this._onDeInit()
		this.onDeInitUpdate()

		// イベント解除
		window.removeEventListener("resize", this.invokeResizeTimer)
		window.removeEventListener("mousemove", this.onMousemove)
		window.removeEventListener("focus", this.onFocus)
		window.removeEventListener("blur", this.onBlur)
		window.removeEventListener("beforeunload", this.deInit)
	}

	/**
	 * リサイズイベントを発火するタイマー
	 * [timerDelay]ms間リサイズイベントが途切れたらメインのリサイズ処理実行
	 */
	private invokeResizeTimer = (): void => {
		if(this.resizeTimer != null) clearTimeout(this.resizeTimer)

		const timerDelay = 100
		this.resizeTimer = setTimeout(this.onResize, timerDelay)
	}

	/**
	 * 共通のリサイズ処理あればここで
	 * レンダラのリサイズは各自でやってください
	 * 毎フレームリサイズは汁の重いので[timerDelay]ms後に一度実行にしている
	 */
	private onResize = (): void => {
		this.renderer.setFullScreen()
		this.camera.resizeAuto()

		this._onResize()
	}

	/**
	 * マウスが動いた時
	 * 中心基準の座標に変換
	 * @param e
	 */
	private onMousemove = (e: MouseEvent): void => {
		this.mouse.setPosition(e.clientX, e.clientY)
	}

	/**
	 * Update処理開始
	 */
	private onInitUpdate(): void {
		this.shouldUpdate = true;
		this.onUpdate()
	}

	/**
	 * Update処理終了
	 */
	private onDeInitUpdate(): void {
		this.shouldUpdate = false;

		// requestAnimationFrame止める
		if(this.updateId) window.cancelAnimationFrame(this.updateId)
	}

	/**
	 * update処理
	 */
	private onUpdate = ():void => {
		if (!this.shouldUpdate) return
		this.update()
		// 再帰的にupdate関数呼び出し
		this.updateId = window.requestAnimationFrame(this.onUpdate)
	}

	/**
	 * 一回のUpdate
	 */
	public update(): void {
		this.stats.begin()
		this._onUpdate()
		this.group2d.update()
		this.renderer.render(this.scene, this.camera)
		this.stats.end()
	}

	/**
	 * 画面にfocusされた時
	 * update開始する
	 */
	private onFocus = (): void => {
		if(this.shouldUpdate) return
		// this.onInitUpdate()
	}

	/**
	 * 画面からfocus外れた時
	 * updateやめる
	 */
	private onBlur = (): void => {
		if(!this.shouldUpdate) return
		// this.onDeInitUpdate()
	}

	/**
	 * -1, 1に正規化したスクリーン座標
	 */
	protected getNormalizedScreenPos(screenPos: Vector2): Vector2 {
		const x = ((screenPos.x/CanvasSize.size.x)-0.5)*2
		const y = ((screenPos.y/CanvasSize.size.y)-0.5)*2
		return new Vector2(x, y)
	}

	/**
	 * 抽象メソッドです
	 * 子クラスでオーバーライドしてください
	 */
	abstract _onInit(): void;
	abstract _onDeInit(): void;
	abstract _onUpdate():void;
	abstract _onResize(): void;

}