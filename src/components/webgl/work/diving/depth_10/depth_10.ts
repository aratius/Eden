import { BackSide, BoxBufferGeometry, Mesh, MeshBasicMaterial, SphereBufferGeometry } from "three";
import { CameraSettings, RendererSettings } from "../../../interfaces";
import WebGLCanvasBase from "../../../utils/template/template";
import SeaBoxMaterial from "./utils/seaBoxMat";

export default class WebGLDepth_10 extends WebGLCanvasBase {

	private seaBox: Mesh = null

	constructor(canvas: HTMLCanvasElement, renderer: RendererSettings, camera: CameraSettings) {
		super(canvas, renderer, camera)
	}

	_onInit(): void {
		this.initSeaBox()
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
	}

	private initSeaBox(): void {

		const geo: SphereBufferGeometry = new SphereBufferGeometry(1000)
		const mat: SeaBoxMaterial = new SeaBoxMaterial()

		this.seaBox = new Mesh(geo, mat)
		this.scene.add(this.seaBox)

	}

}