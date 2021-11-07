import { MathUtils, PlaneBufferGeometry, RepeatWrapping, Texture, Vector2, Vector3 } from "three";
import { CameraSettings, RendererSettings } from "../../../interfaces";
import { loadTexture } from "../../../utils";
import WebGLCanvasBase from "../../../utils/template/template";
import Water from "./utils/water"
import { Sky } from "three/examples/jsm/objects/Sky"
import EffectController from "./utils/effectController";
const isBrowser = typeof window !== 'undefined';
const dat = isBrowser ? require("dat.gui") : undefined

export default class WebGLDepth_0 extends WebGLCanvasBase {

	private water: Water = null
	private sky: Sky = null
	private sun: Vector3 = null
	private readonly surfaceSize: Vector2 = new Vector2(1000, 1000)

	constructor(canvas: HTMLCanvasElement, renderer: RendererSettings, camera: CameraSettings) {
		super(canvas, renderer, camera)
	}

	_onInit(): void {
		this.camera.position.set(0, 3, 0)

		this.initWater()
		this.initSky()
		this.endLoading()
	}
	_onDeInit(): void {}
	_onResize(): void {}
	_onUpdate(): void {
		if(this.water != null) {
			(<any>this.water.material).uniforms.time.value = this.elapsedTime;
		}

	}

	private initSky() {

		// Add Sky
		this.sky = new Sky();
		this.sky.scale.setScalar( 450000 );
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
				fog: this.scene.fog !== undefined
			}
		)
		this.water.rotation.x = - Math.PI / 2
		this.scene.add(this.water)

		const waterUniforms = (<any>this.water.material).uniforms
		waterUniforms.size.value = 10
	}

}