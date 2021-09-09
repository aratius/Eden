import { AmbientLight, Group, Mesh, MeshBasicMaterial, MeshLambertMaterial, Object3D, Ray, Raycaster, SphereBufferGeometry, Texture, Vector2 } from "three";
import { CameraSettings, RendererSettings } from "../../interfaces";
import { loadGLTF, loadTexture } from "../../utils";
import WebGLCanvasBase from "../../utils/template/template";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { FaceMaterial } from "../../utils/material/faceMat";
import { CanvasSize } from "../../config/config";

export default class WebGLFace extends WebGLCanvasBase {

	private faceGroup: Group = null
	private faceMesh: Mesh = null
	private eyeMesh: Mesh = null
	private isReadyFace: boolean = false
	private raycaster: Raycaster = new Raycaster()

	constructor(canvas: HTMLCanvasElement, renderer: RendererSettings, camera: CameraSettings) {
		super(canvas)

	}

	_onInit(): void {
		this.initFace()

		const controls: OrbitControls = new OrbitControls(this.camera, this.renderer.domElement)
		controls.update()

		const ambient: AmbientLight = new AmbientLight()
		this.scene.add(ambient)

		// this.scene.add(
		// 	new Mesh(
		// 		new SphereBufferGeometry(30, 30, 15),
		// 		new MeshLambertMaterial({color: 0xff0000})
		// 	)
		// )
	}

	_onDeInit(): void {}
	_onResize(): void {}

	_onUpdate(): void {
		if(this.isReadyFace) (<FaceMaterial>this.faceMesh.material).uniforms.u_time.value = this.elapsedTime
		this.checkRaycast()
	}

	private checkRaycast(): void {
		if(this.faceGroup == null) return
		// レスポンシブcanvasとの位置合わせ （めんどい...

		// raycastように-1 ~ 1に変換
		this.raycaster.setFromCamera(this.mouse.positionForRaycast, this.camera)
		const intersects = this.raycaster.intersectObject(this.faceMesh)
		if(intersects.length > 0) console.log(intersects);
	}

	private async initFace(): Promise<void> {
		const gltf: Group = await loadGLTF("/assets/models/face/scene.gltf")
		this.faceGroup = gltf
		this.scene.add(this.faceGroup)

		const meshes: Mesh[] = this.getMeshFromGroup(gltf)
		this.faceMesh = meshes.filter((mesh) => mesh.name == "mesh_0")[0]
		this.eyeMesh = meshes.filter((mesh) => mesh.name == "mesh_1")[0]

		const faceTexture: Texture = await loadTexture("/assets/models/face/textures/Texture4_baseColor.png")
		const faceMaterial: FaceMaterial = new FaceMaterial(faceTexture)

		this.faceMesh.material = faceMaterial

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