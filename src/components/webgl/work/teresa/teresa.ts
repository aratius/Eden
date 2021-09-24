import { AmbientLight, GridHelper, Vector3 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { CameraSettings, RendererSettings } from "../../interfaces";
import WebGLCanvasBase from "../../utils/template/template"
import GlowBall from "./utils/glowBall";

export default class WebGLTeresa extends WebGLCanvasBase {

   private glowBalls: GlowBall[] = []

	constructor(canvas: HTMLCanvasElement, renderer: RendererSettings, camera: CameraSettings) {
		super(canvas, renderer, camera)

	}

	async _onInit(): Promise<void> {

		await Promise.all([this.initGlowBalls(), this.initGridHelper()])

		this.camera.lookAt(new Vector3(0,0,0))
		this.renderer.setClearColor(0x000000)

		const ambient: AmbientLight = new AmbientLight()
		this.scene.add(ambient)

		const controls: OrbitControls = new OrbitControls(this.camera, this.renderer.domElement)
		controls.update()

		this.endLoading()
	}

	_onDeInit(): void {

	}

	_onResize(): void {

	}

	_onUpdate(): void {

	}

	private initGlowBalls(): void {
		const segment: number = 15
		const between: number = 1000/segment
		for(let x = 0; x < segment; x++) {
			for(let z = 0; z < segment; z++) {
				const posX: number = (x-(segment-1)/2) * between
				const posZ: number = (z-(segment-1)/2) * between
				const glowBall: GlowBall = new GlowBall()
				glowBall.position.set(posX, 100, posZ)
				glowBall.scale.set(10, 10, 10)
				this.scene.add(glowBall)
				this.glowBalls.push(glowBall)
			}
		}
	}

	private initGridHelper(): void {
		const gridHelper: GridHelper = new GridHelper(100, 15)
		gridHelper.scale.set(10, 10, 10)
		this.scene.add(gridHelper)
	}

}