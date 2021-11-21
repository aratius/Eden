import { BackSide, BoxGeometry, Color, DoubleSide, MathUtils, Mesh, MeshBasicMaterial, PlaneBufferGeometry, RepeatWrapping, SphereGeometry, Texture, Vector2, Vector3 } from "three";
import { CameraSettings, RendererSettings } from "../../../interfaces";
import { loadTexture } from "../../../utils";
import WebGLCanvasBase from "../../../utils/template/template";
import Water from "./utils/water"
import { Sky } from "three/examples/jsm/objects/Sky"
import EffectController from "./utils/effectController";
import gsap from "gsap"
import Bubbles from "./utils/bubbles";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { displayShader } from "./utils/material/displayShader";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";

export default class WebGLDepth_0 extends WebGLCanvasBase {

	private water: Water = null
	private sky: Sky = null
	private sun: Vector3 = null
	private readonly surfaceSize: Vector2 = new Vector2(1000, 1000)
	private cameraTween: GSAPTimeline = null

	constructor(canvas: HTMLCanvasElement, renderer: RendererSettings, camera: CameraSettings) {
		super(canvas, renderer, camera)

		new OrbitControls(this.camera, this.renderer.domElement)
	}

	_onInit(): void {
		this.camera.position.set(0, 3, 10)

		this.initWater()
		this.initSky()
		this.initUnderWater()
		this.endLoading()

		this.composer.addPass(new ShaderPass(displayShader))

		// setTimeout(() => this.fall(), 2000)
	}
	_onDeInit(): void {}
	_onResize(): void {}
	_onUpdate(): void {
		if(this.water != null) {
			(<any>this.water.material).uniforms.time.value = this.elapsedTime;
		}
	}

	private fall(): void {
		if(this.cameraTween != null) this.cameraTween.kill()
		this.cameraTween = gsap.timeline()
		this.cameraTween.to(this.camera.position, {y: -3, duration: 2, ease: "circ.in"}, 0)
		this.cameraTween.to(this.camera.position, {z: 0, duration: 2, ease: "circ.in"}, 0)
		this.cameraTween.to(this.camera.rotation, {x: -Math.PI/2, duration: 2, ease: "circ.in"}, 0)
	}

	private initSky() {

		// Add Sky
		this.sky = new Sky();
		this.sky.scale.setScalar( 45000 );
		this.scene.add( this.sky );

		this.sun = new Vector3();

		new EffectController(this.sky, this.sun, this.renderer, {
			turbidity: 1.5,
			rayleigh: 0.339,
			mieCoefficient: 0.004,
			mieDirectionalG: 0.128,
			elevation: 3.7,
			azimuth: 180,
			exposure: this.renderer.toneMappingExposure
		})

	}

	private async initWater(): Promise<void> {
		const waterGeometry: PlaneBufferGeometry = new PlaneBufferGeometry(this.surfaceSize.x, this.surfaceSize.y, 500, 500)
		const waterNormals: Texture = await loadTexture("/assets/images/ocean/Water_1_M_Normal.jpg")

		waterNormals.wrapS = waterNormals.wrapT = RepeatWrapping

		this.water = new Water(
			waterGeometry,
			{
				textureWidth: 512*1,
				textureHeight: 512*1,
				waterNormals: waterNormals,
				sunDirection: new Vector3(),
				sunColor: 0xffffff,
				waterColor: 0x001e0f,
				distortionScale: 3.7,
				fog: this.scene.fog !== undefined,
				side: DoubleSide
			},
		)
		this.water.rotation.x = - Math.PI / 2
		this.scene.add(this.water)

		const waterUniforms = (<any>this.water.material).uniforms
		waterUniforms.size.value = 10
	}

	private initUnderWater(): void {
		const geo: SphereGeometry = new SphereGeometry(1, 10, 5, 0, Math.PI)
		const mat: MeshBasicMaterial = new MeshBasicMaterial({color: new Color(0,0, 0.1), transparent: true, opacity: 0.9, side: BackSide})
		const mesh: Mesh = new Mesh(geo, mat)
		mesh.position.setY(-4)
		mesh.scale.set(1000, 1000, 1000)
		mesh.rotateX(Math.PI/2)
		this.scene.add(mesh)
	}

}