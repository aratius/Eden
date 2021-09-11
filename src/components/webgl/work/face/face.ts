import { AmbientLight, BufferGeometry, Group, Mesh, MeshBasicMaterial, MeshLambertMaterial, Object3D, Ray, Raycaster, SphereBufferGeometry, SphereGeometry, Texture, Vector2, Vector3 } from "three";
import { CameraSettings, RendererSettings } from "../../interfaces";
import { loadGLTF, loadTexture } from "../../utils";
import WebGLCanvasBase from "../../utils/template/template";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { FaceMaterial } from "../../utils/material/faceMat";
import { CanvasSize } from "../../config/config";
import gsap from "gsap";
const noise = require('simplenoise')
const isBrowser = typeof window !== 'undefined';
const dat = isBrowser ? require("dat.gui") : undefined

class Parameters {
	emotion: number = 0
}

export default class WebGLFace extends WebGLCanvasBase {

	private gui: any = null
	private params: Parameters = null
	private faceGroup: Group = null
	private faceMesh: Mesh = null
	private eyeMesh: Mesh = null
	private isReadyFace: boolean = false
	private raycaster: Raycaster = new Raycaster()
	private lastMousePos: Vector2 = new Vector2()
	private mouseSpeed: Vector2 = new Vector2(0, 0)
	private lastMouseSpeed: Vector2 = new Vector2(0, 0)
	private mouseAcceleration: Vector2 = new Vector2(0, 0)
	private mouseAmount: Vector2 = new Vector2(0, 0)
	private isIncreasedMouseSpeed: boolean = false
	private _emotion: number = 0
	private abandonedTimer: NodeJS.Timer = null
	private sulkTween: GSAPTween = null
	private isSulKing: boolean = false
	private faceRotationY: number = 0

	constructor(canvas: HTMLCanvasElement, renderer: RendererSettings, camera: CameraSettings) {
		super(canvas)

		const alreadyExists = document.getElementsByClassName("dg")
		for(let i = 0; i < alreadyExists.length; i++) {
			alreadyExists[i].remove()
		}
		this.gui = new dat.GUI()
		this.params = new Parameters()
		this.gui.add(this.params, "emotion", -1, 1).onChange(() => {
			if(this.faceMesh != null) (<FaceMaterial>this.faceMesh.material).uniforms.u_emotion.value = this.params.emotion
		})
	}

	_onInit(): void {
		this.initFace()

		this.renderer.setClearColor(0x000000)

		// const controls: OrbitControls = new OrbitControls(this.camera, this.renderer.domElement)
		// controls.update()

		const ambient: AmbientLight = new AmbientLight()
		this.scene.add(ambient)

	}

	_onDeInit(): void {}
	_onResize(): void {}

	_onUpdate(): void {
		this.checkRaycast()
		this.updateMouse()
		if(this.isReadyFace) (<FaceMaterial>this.faceMesh.material).uniforms.u_time.value = this.elapsedTime
		if(this.isReadyFace) (<FaceMaterial>this.faceMesh.material).uniforms.u_mouse_amount.value = this.mouseAmount.clone().multiply(new Vector2(1, -1))
		if(!this.isSulKing) {
			this.emotion += this.mouseAmount.length()*0.003
			this.emotion *= 0.9
		}
		if(this.faceGroup != null) {
			// パーリンノイズでランダムに揺らして生きてる感じ
			this.faceGroup.rotation.x = noise.simplex2((this.elapsedTime)/3, 1) * 0.02
			this.faceGroup.rotation.y = noise.simplex2((this.elapsedTime+1)/3, 1) * 0.02
			this.faceGroup.rotation.z = noise.simplex2((this.elapsedTime+2)/3, 1) * 0.01
			this.faceRotationY += this.mouseSpeed.x * 0.0001
			this.faceRotationY *= 0.9
			this.faceGroup.rotation.y += this.faceRotationY
		}
	}

	private set emotion(val: number) {
		this._emotion = val
		if(this.faceMesh != null) (<FaceMaterial>this.faceMesh.material).uniforms.u_emotion.value = this._emotion
	}

	private get emotion(): number {
		return this._emotion
	}

	private checkRaycast(): void {
		if(!this.isReadyFace) return
		// レスポンシブcanvasとの位置合わせ （めんどい...

		// raycastように-1 ~ 1に変換
		this.raycaster.setFromCamera(this.mouse.positionForRaycast, this.camera)
		const intersects = this.raycaster.intersectObject(this.faceMesh)
		if(intersects.length > 0) {
			const point = intersects[0].point;
			this.onTouchFace(point)
		} else {
			this.onDidNotTouchFace()
		}
	}

	private onTouchFace(point: Vector3): void {
		this.careAbout()
		// スピードが上がっている時の位置を記憶して、その後は更新しない （前回の情報記憶もどき
		if(this.isIncreasedMouseSpeed) (<FaceMaterial>this.faceMesh.material).uniforms.u_intersect_pos.value = point
	}

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
		this.isSulKing = false
		if(this.sulkTween != null) this.sulkTween.kill()
	}

	/**
	 * 拗ねる
	 */
	private sulk = (): void => {
		if(this.sulkTween != null) this.sulkTween.kill()
		this.sulkTween = gsap.to(this, {emotion: -1, duration: 1, ease: "sine.inOut(2)"})
		this.isSulKing = true
	}

	private updateMouse(): void {
		this.mouseSpeed = this.mouse.positionOnCanvas.clone().sub(this.lastMousePos.clone())

		const elastically: number = 0.2
		const friction: number = 0.9
		this.mouseAcceleration.add(this.mouseSpeed.clone().divideScalar(30))
		this.mouseAcceleration.sub(this.mouseAmount.clone().multiplyScalar(elastically))
		this.mouseAmount.add(this.mouseAcceleration.clone())
		this.mouseAmount.multiplyScalar(friction)

		this.isIncreasedMouseSpeed = Math.abs(this.mouseSpeed.length()) > Math.abs(this.lastMouseSpeed.length())
		this.lastMouseSpeed = this.mouseSpeed
		this.lastMousePos = this.mouse.positionOnCanvas
	}

	private async initFace(): Promise<void> {
		// 顔のテクスチャ
		let faceTexture: Texture = null
		// 無表情
		let none: Group = null
		// ハッピー
		let happy: Group = null
		// 悲しい
		let sad: Group = null

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

		await Promise.all([loadTex, loadNone, loadHappy, loadSad])

		this.faceGroup = none
		this.scene.add(this.faceGroup)

		const meshes: Mesh[] = this.getMeshFromGroup(none)

		this.faceMesh = meshes.filter((mesh) => mesh.name == "Mesh_0")[0]
		this.eyeMesh = meshes.filter((mesh) => mesh.name == "Mesh_1")[0]

		const faceMaterial: FaceMaterial = new FaceMaterial(faceTexture)
		this.faceMesh.material = faceMaterial

		const happyGeo: BufferGeometry = this.getMeshFromGroup(happy).filter((mesh) => mesh.name == "Mesh_0")[0].geometry
		const sadGeo: BufferGeometry = this.getMeshFromGroup(sad).filter((mesh) => mesh.name == "Mesh_0")[0].geometry
		this.faceMesh.geometry.setAttribute("happy_position", happyGeo.attributes.position)
		this.faceMesh.geometry.setAttribute("sad_position", sadGeo.attributes.position)

		this.isReadyFace = true

	}

	/**
	 * 再帰的に検索してMeshインスタンスのみを返却
	 * @param group
	 * @returns
	 */
	private getMeshFromGroup(group: Group | Object3D): Mesh[] {
		const meshes: Mesh[] = []
		for(const i in group.children) {
			if(group.children[i] instanceof Mesh) {
				meshes.push(group.children[i] as Mesh)
			} else if ((group.children[i] instanceof Group) || (group.children[i] instanceof Object3D)) {
				meshes.push(...this.getMeshFromGroup(group.children[i] as Mesh) as Mesh[])
			}

		}
		return meshes
	}

}