import { AmbientLight, BufferGeometry, Group, Mesh, MeshBasicMaterial, MeshLambertMaterial, Object3D, Ray, Raycaster, SphereBufferGeometry, Texture, Vector2, Vector3 } from "three";
import { CameraSettings, RendererSettings } from "../../interfaces";
import { loadGLTF, loadTexture } from "../../utils";
import WebGLCanvasBase from "../../utils/template/template";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { FaceMaterial } from "../../utils/material/faceMat";
import { CanvasSize } from "../../config/config";
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

		const controls: OrbitControls = new OrbitControls(this.camera, this.renderer.domElement)
		controls.update()

		const ambient: AmbientLight = new AmbientLight()
		this.scene.add(ambient)

	}

	_onDeInit(): void {}
	_onResize(): void {}

	_onUpdate(): void {
		if(this.isReadyFace) (<FaceMaterial>this.faceMesh.material).uniforms.u_time.value = this.elapsedTime
		this.checkRaycast()
	}

	private checkRaycast(): void {
		if(!this.isReadyFace) return
		// レスポンシブcanvasとの位置合わせ （めんどい...

		// raycastように-1 ~ 1に変換
		this.raycaster.setFromCamera(this.mouse.positionForRaycast, this.camera)
		const intersects = this.raycaster.intersectObject(this.faceMesh)
		if(intersects.length > 0) {
			const point = intersects[0].point;
			(<FaceMaterial>this.faceMesh.material).uniforms.u_intersect_pos.value = point
		} else {
			(<FaceMaterial>this.faceMesh.material).uniforms.u_intersect_pos.value = new Vector3(-999, -999, -999)
		}
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