import { Mesh, MeshBasicMaterial, Quaternion, SphereBufferGeometry, Vector3 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { CameraSettings, RendererSettings } from "../../interfaces";
import WebGLCanvasBase from "../../utils/template/template";
import BigSphereMaterial from "./material/bigSphereMat";

export default class WebGLDotAnimation extends WebGLCanvasBase {

	private sphere: Mesh = null

	constructor(canvas: HTMLCanvasElement, renderer: RendererSettings, camera: CameraSettings) {
		super(canvas, renderer, camera)
	}

	async _onInit(): Promise<void> {

		this.renderer.setClearColor(0x000000)
		this.camera.position.set(0,0,0)

		// const controls: OrbitControls = new OrbitControls(this.camera, this.renderer.domElement)
		// controls.update()

		await Promise.all([this.initSphere()])

		this.endLoading()
	}

	_onDeInit(): void {

	}

	_onResize(): void {

	}

	_onUpdate(): void {
		this.camera.rotation.y += 0.002
	}

	private initSphere(): void {
		const geo: SphereBufferGeometry = new SphereBufferGeometry(10, 100, 50)
		const mat: BigSphereMaterial = new BigSphereMaterial()
		this.sphere = new Mesh(geo, mat)
		this.scene.add(this.sphere)
	}

}