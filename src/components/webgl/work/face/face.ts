import { AmbientLight, BufferGeometry, Group, Mesh, MeshBasicMaterial, MeshLambertMaterial, Object3D, Ray, Raycaster, SphereBufferGeometry, SphereGeometry, Texture, Vector2, Vector3 } from "three";
import { CameraSettings, RendererSettings } from "../../interfaces";
import { getMeshFromGroup, loadGLTF, loadTexture, powerVector2 } from "../../utils";
import WebGLCanvasBase from "../../utils/template/template";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { FaceMaterial } from "./utils/material/faceMat";
import { CanvasSize } from "../../config/config";
import gsap from "gsap";
const noise = require('simplenoise')
const isBrowser = typeof window !== 'undefined';
const dat = isBrowser ? require("dat.gui") : undefined

class Parameters {
}

export default class WebGLFace extends WebGLCanvasBase {

	private gui: any = null  // .............................. GUI
	private params: Parameters = null  // .................... params
	private faceGroup: Group = null  // ...................... 顔メッシュのグループそのもの 回転などはこれに対して行う
	private faceMesh: Mesh = null  // ........................ グループから顔メッシュを抽出して、シェーダーマテリアルを適用したりする
	private eyeMesh: Mesh = null  // ......................... グループから抽出した目メッシュ
	private leftEyeMark: Mesh = null  // ..................... 左目付近の皮膚を動かさないために目安に置くメッシュ uniformで渡される
	private rightEyeMark: Mesh = null  // .................... 右目付近の皮膚を動かさないために目安に置くメッシュ uniformで渡される
	private isReadyFace: boolean = false  // ................. 顔が準備できているかどうか
	private raycaster: Raycaster = new Raycaster()  // ....... レイキャスター
	private lastMousePos: Vector2 = new Vector2()  // ........ 前回のマウスポジション
	private mouseSpeed: Vector2 = new Vector2(0, 0)  // ...... マウススピード
	private lastMouseSpeed: Vector2 = new Vector2(0, 0)  // .. 前回のマウススピード
	private mouseAcceleration: Vector2 = new Vector2(0, 0)  // マウスの加速度
	private mouseAmount: Vector2 = new Vector2(0, 0)  // ..... マウスの力
	private isIncreasedMouseSpeed: boolean = false  // ....... マウススピードが増加したかどうか
	private _emotion: number = 0  // ......................... 感情度合い sad - none - happy : -1 - 0 - 1
	private abandonedTimer: NodeJS.Timer = null  // .......... 放置経過時間タイマー
	private sulkTween: GSAPTween = null  // .................. 拗ねる(sad)表情になるTween
	private isSulking: boolean = false  // ................... 拗ねている中かどうか
	private faceRotationY: number = 0  // .................... faceGroupの顔のY角度
	private blinkTween: GSAPTimeline = null  // .............. まばたきのTween
	private isGrabbingFace: boolean = false  // .............. 顔を掴まれているかどうか
	private grabStartPos: Vector2 = new  Vector2()  // ....... grabを開始したスクリーン座標

	constructor(canvas: HTMLCanvasElement, renderer: RendererSettings, camera: CameraSettings) {
		super(canvas)

		const alreadyExists = document.getElementsByClassName("dg")
		for(let i = 0; i < alreadyExists.length; i++) {
			alreadyExists[i].remove()
		}
		this.gui = new dat.GUI()
		this.params = new Parameters()

		window.addEventListener("mousedown", this.onMouseDown)
		window.addEventListener("mousemove", this.onMouseMove)
		window.addEventListener("mouseup", this.onMouseUp)
		window.addEventListener("touchstart", this.onTouchStart)
		window.addEventListener("touchmove", this.onTouchMove)
		window.addEventListener("touchend", this.onTouchEnd)

	}

	async _onInit(): Promise<void> {
		this.renderer.setClearColor(0x000000)

		// const controls: OrbitControls = new OrbitControls(this.camera, this.renderer.domElement)
		// controls.update()

		const ambient: AmbientLight = new AmbientLight()
		this.scene.add(ambient)

		await this.initFace()
		this.endLoading()
		this.loopBlink()
	}

	_onDeInit(): void {}
	_onResize(): void {}

	_onUpdate(): void {
		this.updateMouse()
		this.processStrokingFace()
		if(this.isReadyFace) {
			(<FaceMaterial>this.faceMesh.material).uniforms.u_time.value = this.elapsedTime;
			(<FaceMaterial>this.faceMesh.material).uniforms.u_eye_position.value = [this.leftEyeMark.getWorldPosition(new Vector3()), this.rightEyeMark.getWorldPosition(new Vector3)];
			const peak: number = 50;
			const amount: Vector2 = this.mouseAmount.clone().multiply(new Vector2(1, -1));
			(<FaceMaterial>this.faceMesh.material).uniforms.u_mouse_amount.value = powerVector2(amount.multiplyScalar(peak), 0.5)

			// パーリンノイズでランダムに揺らして生きてる感じ
			this.faceGroup.rotation.x = noise.simplex2((this.elapsedTime)/3, 1) * 0.02
			this.faceGroup.rotation.y = noise.simplex2((this.elapsedTime+1)/3, 1) * 0.02
			this.faceGroup.rotation.z = noise.simplex2((this.elapsedTime+2)/3, 1) * 0.01
			this.faceRotationY += this.mouseSpeed.x * 0.0001
			this.faceRotationY *= 0.9
			this.faceGroup.rotation.y += this.faceRotationY
		}
		if(!this.isSulking) {
			this.emotion += this.mouseAmount.length()*0.003
			this.emotion *= 0.9
		}

	}

	/**
	 * 感情パラメータ シェーダーの更新を噛ます
	 */
	private set emotion(val: number) {
		this._emotion = val
		if(this.faceMesh != null) (<FaceMaterial>this.faceMesh.material).uniforms.u_emotion.value = this._emotion
	}

	private get emotion(): number {
		return this._emotion
	}

	/**
	 * 顔に触れているかどうか Raycastで判断
	 */
	private get touchingFaceMesh(): any[] {
		if(!this.isReadyFace) return []
		// raycastように-1 ~ 1に変換
		this.raycaster.setFromCamera(this.mouse.positionForRaycast, this.camera)
		return this.raycaster.intersectObject(this.faceMesh)
	}

	private onMouseDown = (e: any) => {
		if(!this.isReadyFace) return
		if(this.touchingFaceMesh.length > 0) this.onGrabFace()
	}

	private onMouseMove = (e: any) => {
		if(!this.isReadyFace) return
		if(this.isGrabbingFace) this.onPullFace()
	}

	private onMouseUp = (e: any) => {
		if(!this.isReadyFace) return
		if(this.isGrabbingFace) this.onReleaseFace()
	}
	private onTouchStart = (e: any) => {
		this.mouse.setPosition(e.touches[0].clientX, e.touches[0].clientY)
		this.onMouseDown(e)
	}

	private onTouchMove = (e: any) => {
		this.mouse.setPosition(e.touches[0].clientX, e.touches[0].clientY)
		this.onMouseMove(e)
	}

	private onTouchEnd = (e: any) => {
		this.onMouseUp(e)
	}

	/**
	 * 顔をつかんだとき
	 */
	private onGrabFace(): void {
		const point = this.touchingFaceMesh[0].point;
		(<FaceMaterial>this.faceMesh.material).uniforms.u_intersect_pos.value = point
		this.grabStartPos = this.mouse.positionOnCanvas
		this.isGrabbingFace = true
	}

	/**
	 * 顔を引っ張ったとき
	 */
	private onPullFace(): void {
		this.mouseAmount = this.mouse.positionOnCanvas.clone().sub(this.grabStartPos.clone()).divideScalar(10)

		// 撫で に戻ったときに急にmouseSpeedが上がらないように
		this.lastMousePos = this.mouse.positionOnCanvas
		this.lastMouseSpeed = this.mouseSpeed
	}

	/**
	 * 顔を離したとき
	 */
	private onReleaseFace(): void {
		this.grabStartPos = new Vector2()
		this.isGrabbingFace = false
	}

	/**
	 * 顔を撫でる
	 * @returns
	 */
	private processStrokingFace(): void {
		if(!this.isReadyFace) return
		if(this.isGrabbingFace) return

		if(this.touchingFaceMesh.length > 0) {
			const point = this.touchingFaceMesh[0].point;
			this.onTouchFace(point)
		} else {
			this.onDidNotTouchFace()
		}
	}

	/**
	 * マウスパラメータを更新
	 * @returns
	 */
	private updateMouse(): void {
		if(this.isGrabbingFace) return
		this.mouseSpeed = this.mouse.positionOnCanvas.clone().sub(this.lastMousePos.clone())

		const elastically: number = 0.2
		const friction: number = 0.9
		if(this.touchingFaceMesh.length > 0) this.mouseAcceleration.add(this.mouseSpeed.clone().divideScalar(30))
		this.mouseAcceleration.sub(this.mouseAmount.clone().multiplyScalar(elastically))
		this.mouseAmount.add(this.mouseAcceleration.clone())
		this.mouseAmount.multiplyScalar(friction)

		const threshold: number = 10
		this.isIncreasedMouseSpeed = Math.abs(this.mouseSpeed.length()) > Math.abs(this.lastMouseSpeed.length()) && Math.abs(this.mouseSpeed.length()) > threshold
		this.lastMouseSpeed = this.mouseSpeed
		this.lastMousePos = this.mouse.positionOnCanvas
	}

	/**
	 * 顔に触れているとき
	 * @param point
	 */
	private onTouchFace(point: Vector3): void {
		if(this.isSulking) this.careAbout()
		// スピードが上がっている時の位置を記憶して、その後は更新しない （前回の情報記憶もどき
		if(this.isIncreasedMouseSpeed) (<FaceMaterial>this.faceMesh.material).uniforms.u_intersect_pos.value = point
	}

	/**
	 * 顔に触れていないとき
	 */
	private onDidNotTouchFace(): void {
		if(this.mouseAmount.length() < 0.1) {
			// スピードが収まったら衝突位置をぶっ飛ばす
			(<FaceMaterial>this.faceMesh.material).uniforms.u_intersect_pos.value = new Vector3(-999, -999, -999)
			if(this.abandonedTimer == null) this.abandonedTimer = setTimeout(this.sulk, 2000)
		}
	}

	/**
	 * 相手してあげたとき
	 * 無視カウント秒数タイマーをクリアする
	 */
	private careAbout(): void {
		if(this.abandonedTimer != null) clearTimeout(this.abandonedTimer)
		this.abandonedTimer = null
		this.isSulking = false
		if(this.sulkTween != null) this.sulkTween.kill()
	}

	/**
	 * 拗ねる
	 */
	private sulk = (): void => {
		if(this.sulkTween != null) this.sulkTween.kill()
		this.sulkTween = gsap.to(this, {emotion: -1, duration: 1, ease: "sine.inOut(2)"})
		this.isSulking = true
	}

	/**
	 * 再帰的に瞬き処理
	 */
	private loopBlink = (): void => {
		const blinkSpeed: number = Math.random()*0.05 + 0.05

		if(this.blinkTween != null) this.blinkTween.kill()
		this.blinkTween = gsap.timeline()
			.to((<FaceMaterial>this.faceMesh.material).uniforms.u_blink_amount, {value: 1, duration: blinkSpeed, ease: "sine.inOut"})
			.to((<FaceMaterial>this.faceMesh.material).uniforms.u_blink_amount, {value: 0, duration: blinkSpeed, ease: "expo.out"})

		const minDelay: number = blinkSpeed*2*1000
		const delay: number = Math.random() < 0.5 ? Math.random()*50+minDelay : Math.random()*3000+2000

		setTimeout(this.loopBlink, delay)
	}

	/**
	 * 顔モデル初期化
	 */
	private async initFace(): Promise<void> {
		// 顔のテクスチャ
		let faceTexture: Texture = null
		// 無表情
		let none: Group = null
		// ハッピー
		let happy: Group = null
		// 悲しい
		let sad: Group = null
		// 目を閉じる
		let blind: Group = null

		const loadTex: Promise<void> = new Promise<void>(async (res) => {
			faceTexture = await loadTexture("/assets/models/face/textures/Texture4_baseColor.png")
			res(null)
		})
		const loadNone: Promise<void> = new Promise<void>(async (res) => {
			none = await loadGLTF("/assets/models/face/none.glb")
			res(null)
		})
		const loadHappy: Promise<void> = new Promise<void>(async (res) => {
			happy = await loadGLTF("/assets/models/face/happy.glb")
			res(null)
		})
		const loadSad: Promise<void> = new Promise<void>(async (res) => {
			sad = await loadGLTF("/assets/models/face/sad.glb")
			res(null)
		})
		const loadBlind: Promise<void> = new Promise<void>(async (res) => {
			blind = await loadGLTF("/assets/models/face/blind.glb")
			res(null)
		})

		await Promise.all([loadTex, loadNone, loadHappy, loadSad, loadBlind])

		this.faceGroup = none
		this.scene.add(this.faceGroup)

		const meshes: Mesh[] = getMeshFromGroup(none)

		this.faceMesh = meshes.filter((mesh) => mesh.name == "Mesh_0")[0]
		this.eyeMesh = meshes.filter((mesh) => mesh.name == "Mesh_1")[0]

		const faceMaterial: FaceMaterial = new FaceMaterial(faceTexture)
		this.faceMesh.material = faceMaterial

		const happyGeo: BufferGeometry = getMeshFromGroup(happy).filter((mesh) => mesh.name == "Mesh_0")[0].geometry
		const sadGeo: BufferGeometry = getMeshFromGroup(sad).filter((mesh) => mesh.name == "Mesh_0")[0].geometry
		const blindGeo: BufferGeometry = getMeshFromGroup(blind).filter((mesh) => mesh.name == "Mesh_0")[0].geometry
		this.faceMesh.geometry.setAttribute("happy_position", happyGeo.attributes.position)
		this.faceMesh.geometry.setAttribute("sad_position", sadGeo.attributes.position)
		this.faceMesh.geometry.setAttribute("blind_position", blindGeo.attributes.position)

		this.initEyesForFix()
		this.isReadyFace = true

	}

	/**
	 * 頂点シェーダーに渡すための目の位置の目印をセット
	 */
	private initEyesForFix(): void {
		const leftEyePosition: Vector3 = new Vector3(65, 65, 130)
		const rightEyePosition: Vector3 = new Vector3(-65, 65, 130)
		const eye: Mesh = new Mesh(
			new SphereGeometry(0),
			new MeshBasicMaterial({color: 0xff0000})
		)
		this.leftEyeMark = eye.clone()
		this.leftEyeMark.position.set(leftEyePosition.x, leftEyePosition.y, leftEyePosition.z)
		this.faceGroup.add(this.leftEyeMark)
		this.rightEyeMark = eye.clone()
		this.rightEyeMark.position.set(rightEyePosition.x, rightEyePosition.y, rightEyePosition.z)
		this.faceGroup.add(this.rightEyeMark)
	}

}