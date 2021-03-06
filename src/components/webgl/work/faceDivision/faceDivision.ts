import { AmbientLight, BufferGeometry, Group, Mesh, MeshBasicMaterial, MeshStandardMaterial, SphereGeometry, Texture, Vector3 } from "three";
import { CameraSettings, RendererSettings } from "../../interfaces";
import { getMeshFromGroup, loadGLTF, loadTexture, powerVector2 } from "../../utils";
import WebGLCanvasBase from "../../utils/template/template";
import { FaceMaterial } from "./utils/material/faceMat";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
const noise = require('simplenoise')
const isBrowser = typeof window !== 'undefined';
const dat = isBrowser ? require("dat.gui") : undefined

class Parameters {
	faceX: number = 0
}

export default class WebGLFaceDivision extends WebGLCanvasBase {

	private gui: any = null  // .............................. GUI
	private params: Parameters = null  // .................... params
	private faceGroups: Group[] = []  // ...................... 顔メッシュのグループそのもの 回転などはこれに対して行う
	private faceMesh: Mesh = null  // ........................ グループから顔メッシュを抽出して、シェーダーマテリアルを適用したりする
	private faceMaterials: FaceMaterial[] = []
	private jointPoints: number[] = []
	private jointSizes: number[] = []

	constructor(canvas: HTMLCanvasElement, renderer: RendererSettings, camera: CameraSettings) {
		super(canvas)

		const alreadyExists = document.getElementsByClassName("dg")
		for(let i = 0; i < alreadyExists.length; i++) {
			alreadyExists[i].remove()
		}
		this.gui = new dat.GUI()
		this.params = new Parameters()
		this.gui.add(this.params, "faceX", -300, 0).onChange(() => {
			for(let i = 0; i < this.faceGroups.length; i++) {
				const sign: number = i % 2 == 0 ? 1 : -1
				this.faceGroups[i].position.setX(this.params.faceX * sign)
			}

		})

	}

	async _onInit(): Promise<void> {
		this.renderer.setClearColor(0x000000)

		const controls: OrbitControls = new OrbitControls(this.camera, this.renderer.domElement)
		controls.update()

		const ambient: AmbientLight = new AmbientLight()
		this.scene.add(ambient)

		await this.initJoint()

		for(let i = 0; i < 2; i++) {
			const face: Group = await this.initFace()
			this.faceGroups.push(face)
			this.scene.add(face)
		}

		for(let i = 0; i < this.faceMaterials.length; i++) {
			this.faceMaterials[i].uniforms.u_joint_positions.value = this.jointPoints
			this.faceMaterials[i].uniforms.u_joint_sizes.value = this.jointSizes
			this.faceMaterials[i].uniforms.u_joint_length.value = this.jointPoints.length
			this.faceMaterials[i].uniforms.u_dir.value = i % 2 == 0 ? 1 : -1

		}

		this.endLoading()
	}

	_onDeInit(): void {}
	_onResize(): void {}
	_onUpdate(): void {
	}

	/**
	 * 顔モデル初期化
	 */
	private async initFace(): Promise<Group> {
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


		const meshes: Mesh[] = getMeshFromGroup(none)

		const faceMesh: Mesh = meshes.filter((mesh) => mesh.name == "Mesh_0")[0]

		const faceMaterial: FaceMaterial = new FaceMaterial(faceTexture)
		this.faceMaterials.push(faceMaterial)

		faceMesh.material = faceMaterial

		const happyGeo: BufferGeometry = getMeshFromGroup(happy).filter((mesh) => mesh.name == "Mesh_0")[0].geometry
		const sadGeo: BufferGeometry = getMeshFromGroup(sad).filter((mesh) => mesh.name == "Mesh_0")[0].geometry
		const blindGeo: BufferGeometry = getMeshFromGroup(blind).filter((mesh) => mesh.name == "Mesh_0")[0].geometry
		faceMesh.geometry.setAttribute("happy_position", happyGeo.attributes.position)
		faceMesh.geometry.setAttribute("sad_position", sadGeo.attributes.position)
		faceMesh.geometry.setAttribute("blind_position", blindGeo.attributes.position)

		const faceGroup = none
		return faceGroup
	}

	/**
	 * ２つの顔の繋ぎ目部分のめやすになるデータを準備
	 */
	private initJoint(): void {
		let pointNum: number = 20
		for(let i = 0; i < pointNum; i++) {
			const size: number = Math.random() * 50 + 20
			const position: Vector3 = new Vector3(
				(Math.random()-0.5) * 100,
				(Math.random()-0.5) * 400,
				(Math.random()-0.5) * 100
			)
			const geometry: SphereGeometry = new SphereGeometry(size, 20, 10)
			const material: MeshStandardMaterial = new MeshStandardMaterial({color: 0xff0000})
			const mesh: Mesh = new Mesh(geometry, material)
			mesh.position.add(position)
			// this.scene.add(mesh)
			this.jointPoints.push(position.x, position.y, position.z)
			this.jointSizes.push(size)
		}

	}

}