import gsap from "gsap";
import { AmbientLight, BufferAttribute, BufferGeometry, DirectionalLight, Float32BufferAttribute, GridHelper, Group, LineBasicMaterial, Mesh, MeshBasicMaterial, MeshStandardMaterial, Scene, SphereGeometry } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { CameraSettings, RendererSettings } from "../../../interfaces";
import { loadGLTF } from "../../../utils";
import Group2D_ish from "../../../utils/template/2DGroup_ish";
import MainScene from "../../../utils/template/scene";
import WebGLCanvasBase from "../../../utils/template/template";
import MorphSphereMaterial from "./material/morphSphereMat";

/**
 *
 */
export default class WebGLMorphBasic extends WebGLCanvasBase {

	private sphere: Mesh = null

	constructor(canvas: HTMLCanvasElement, renderer: RendererSettings, camera: CameraSettings) {
		super(canvas, renderer, camera)

		this.renderer.autoClear = false
	}

	async _onInit(): Promise<void> {

		this.renderer.setClearColor(0x000000)

		const controls: OrbitControls = new OrbitControls(this.camera, this.renderer.domElement)
		controls.update()

		const dirLight: DirectionalLight = new DirectionalLight()
		this.scene.add(dirLight)

		const ambLight: AmbientLight = new AmbientLight(0xffffff, 0.2)
		this.scene.add(ambLight)

		await this.initSphere()

		this.endLoading()

		this.morphingLoop()
	}

	_onDeInit(): void {

	}

	_onResize(): void {

	}

	_onUpdate(): void {
	}

	private morphingLoop(): void {
		const tl: GSAPTimeline = gsap.timeline({repeat: -1})
		tl.to((<MorphSphereMaterial>this.sphere.material).uniforms.u_morph_amount, {value: 0, duration: 1})
		tl.to((<MorphSphereMaterial>this.sphere.material).uniforms.u_morph_amount, {value: 1, duration: 1})
		tl.to((<MorphSphereMaterial>this.sphere.material).uniforms.u_morph_amount, {value: 0, duration: 1})
	}

	private async initSphere(): Promise<void> {
		const modelBeforeSrc: string = "/assets/models/morph/sphere.glb"
		const modelAfterSrc: string = "/assets/models/morph/sphere2.glb"

		const models: Group[] = await Promise.all([
			loadGLTF(modelBeforeSrc),
			loadGLTF(modelAfterSrc)
		])
		console.log(models);

		// 空のGeometryの箱
		const geo: BufferGeometry = new BufferGeometry()
		// GLBから頂点情報だけを抜き出してBufferGeometryのattributeにセット vert shader内で attributeとして使える
		console.log((<Mesh>models[0].children[0]).geometry.attributes.position.array);

		geo.setAttribute("position_before", new BufferAttribute((<Mesh>models[0].children[0]).geometry.attributes.position.array, 3))
		geo.setAttribute("position_after", new BufferAttribute((<Mesh>models[1].children[0]).geometry.attributes.position.array, 3))
		geo.setIndex((<Mesh>models[0].children[0]).geometry.index)

		const mat: MorphSphereMaterial = new MorphSphereMaterial()

		this.sphere = new Mesh(geo, mat)
		const scl: number = 100
		this.sphere.scale.set(scl,scl,scl)
		this.scene.add(this.sphere)

	}

}