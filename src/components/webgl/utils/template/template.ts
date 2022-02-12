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
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass"
import { loadingShader } from "../material/loadingShader"
import gsap from "gsap"

/**
 * Three.jsテンプレート
 * これを継承してそれぞれのWebGLシーンをつくる
 * 汎用性を考えて作ったつもり
 */
export default abstract class WebGLCanvasBase extends Group {

	protected scene: MainScene = null  // ..... シーン
	protected renderer: MainRenderer = null  // レンダラ
	protected camera: MainCamera = null  // ... カメラ
	protected composer: EffectComposer  // .... エフェクトコンポーザー
	protected group2d: Group2D_ish = null  // . 2D風に座標配置するためのGroup
	protected mouse: Mouse  // ................ マウス座標 中心基準にこのテンプレートの中で整形される
	private shouldUpdate: boolean = false  // . Updateのためのフラグ
	private resizeTimer: any = null  // ....... リサイズ処理が走りすぎないようにするためのタイマー
	private startTime: number = 0  // ......... initした時間
	private updateId: number = null  // ....... requestAnimationFrameのID
	private stats: Stats = new Stats()  // .... stats
	protected loadingShaderPass: ShaderPass = null

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
		this.composer = new EffectComposer(this.renderer)
		this.composer.addPass(new RenderPass(this.scene, this.camera))
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
		// if(location.hostname === "localhost") document.body.appendChild(this.stats.dom)

		this.startTime = new Date().getTime() / 1000

		this.loadingShaderPass = new ShaderPass(loadingShader)
		this.composer.addPass(this.loadingShaderPass)

		this._onInit()
		this.onResize()
		this.onInitUpdate()

		// イベント登録
		window.addEventListener("resize", this.invokeResizeTimer)
		window.addEventListener("mousemove", this._onMouseMove, {passive: false})
		window.addEventListener("touchstart", this._onTouch, {passive: false})
		window.addEventListener("touchmove", this._onTouch, {passive: false})
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
		window.removeEventListener("mousemove", this._onMouseMove)
		window.removeEventListener("touchstart", this._onTouch)
		window.removeEventListener("touchmove", this._onTouch)
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
	private _onMouseMove = (e: MouseEvent): void => {
		if(e && e.cancelable) e.preventDefault()
		this.mouse.setPosition(e.clientX, e.clientY)
	}

	protected _onTouch = (e: TouchEvent): void => {
		// if(e && e.cancelable) e.preventDefault()
	}

	/**
	 * Update処理開始
	 */
	public onInitUpdate(): void {
		if(this.shouldUpdate) return

		this.shouldUpdate = true;
		this.onUpdate()
	}

	/**
	 * Update処理終了
	 */
	public onDeInitUpdate(): void {
		if(!this.shouldUpdate) return
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

		if(this.loadingShaderPass != null) this.loadingShaderPass.uniforms.u_time.value = this.elapsedTime
		this.group2d.update()
		this.composer.render()
		this._onUpdate()

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

	protected endLoading(): void {
		gsap.to(this.loadingShaderPass.uniforms.u_alpha, {value: 0, duration: 1, onComplete: () => {
			this.composer.removePass(this.loadingShaderPass)
		}})
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