import { Mesh, MeshBasicMaterial, Quaternion, SphereBufferGeometry, Vector3, Vector2 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { CameraSettings, RendererSettings } from "../../interfaces";
import WebGLCanvasBase from "../../utils/template/template";
import BigSphereMaterial, { fragShaders } from "./material/bigSphereMat";

export default class WebGLDotAnimation extends WebGLCanvasBase {

	private sphere: Mesh = null
	private sphereMaterials: BigSphereMaterial[] = []
	private materialIndex: number = 6

	constructor(canvas: HTMLCanvasElement, renderer: RendererSettings, camera: CameraSettings) {
		super(canvas, renderer, camera)
	}

	async _onInit(): Promise<void> {

		this.renderer.setClearColor(0x000000)
		this.camera.position.set(0,0,0.1)

		const controls: OrbitControls = new OrbitControls(this.camera, this.renderer.domElement)
		controls.enableDamping = true
		controls.rotateSpeed = 0.2
		controls.enableZoom = false
		controls.update()

		await Promise.all([this.initSphere()])

		setInterval(() => {
			this.sphere.material = this.sphereMaterials[this.materialIndex]
			this.materialIndex ++
			if(this.materialIndex >= this.sphereMaterials.length) this.materialIndex = 0
		}, 3000)

		this.endLoading()
	}

	_onDeInit(): void {

	}

	_onResize(): void {

	}

	_onUpdate(): void {
		(<BigSphereMaterial>this.sphere.material).uniforms.u_time.value = this.elapsedTime
	}

	private initSphere(): void {
		const geo: SphereBufferGeometry = new SphereBufferGeometry(10, 100, 50)
		for(const i in fragShaders) {
				this.sphereMaterials.push(new BigSphereMaterial(i, new Vector2(100, 50)))
		}
		this.sphere = new Mesh(geo, this.sphereMaterials[this.materialIndex])
		this.scene.add(this.sphere)
	}

}