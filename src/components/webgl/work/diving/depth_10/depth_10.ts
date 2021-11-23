import { BackSide, BoxBufferGeometry, ConeBufferGeometry, Mesh, MeshBasicMaterial, SphereBufferGeometry } from "three";
import { CameraSettings, RendererSettings } from "../../../interfaces";
import WebGLCanvasBase from "../../../utils/template/template";
import GodRayMaterial from "./utils/godRayMat";
import SeaBoxMaterial from "./utils/seaBoxMat";

export default class WebGLDepth_10 extends WebGLCanvasBase {

	private seaBox: Mesh = null
	private godRay: Mesh = null

	constructor(canvas: HTMLCanvasElement, renderer: RendererSettings, camera: CameraSettings) {
		super(canvas, renderer, camera)
	}

	_onInit(): void {
		this.initSeaBox()
		this.initGodRay()

		this.endLoading()
	}

	_onDeInit(): void {

	}

	_onResize(): void {

	}

	_onUpdate(): void {
		if(this.seaBox != null) {
			(<SeaBoxMaterial>this.seaBox.material).uniforms.u_time.value = this.elapsedTime
		}
		if(this.godRay != null) {
			(<GodRayMaterial>this.godRay.material).uniforms.u_time.value = this.elapsedTime
		}
	}

	private initSeaBox(): void {

		const geo: SphereBufferGeometry = new SphereBufferGeometry(1000)
		const mat: SeaBoxMaterial = new SeaBoxMaterial()

		this.seaBox = new Mesh(geo, mat)
		this.scene.add(this.seaBox)

	}

	private initGodRay(): void {

		const geo: ConeBufferGeometry = new ConeBufferGeometry(500, 1500, 300)
		const mat: GodRayMaterial = new GodRayMaterial()

		this.godRay = new Mesh(geo, mat)
		this.scene.add(this.godRay)
	}

}