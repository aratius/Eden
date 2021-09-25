import { AmbientLight, GridHelper, Vector2, Vector3 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { CameraSettings, RendererSettings } from "../../interfaces";
import WebGLCanvasBase from "../../utils/template/template"
import GlowBall from "./utils/glowBall";
import Human from "./utils/human";

export default class WebGLTeresa extends WebGLCanvasBase {

   private glowBalls: GlowBall[] = []
   private human: Human = null
   private humanSpeed: Vector3 = new Vector3(1.5, 0, 2)

	constructor(canvas: HTMLCanvasElement, renderer: RendererSettings, camera: CameraSettings) {
		super(canvas, renderer, camera)

	}

	async _onInit(): Promise<void> {

		await Promise.all([this.initGlowBalls(), this.initHuman(), this.initGridHelper()])

		this.camera.position.set(0, 300, 1000)
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
		this.updateHuman()
		this.updateGlowBalls()
	}

	private updateHuman(): void {
		this.human.position.add(this.humanSpeed)

		if(this.human.position.x > 500 || this.human.position.x < -500) this.humanSpeed.x*=-1
		if(this.human.position.z > 500 || this.human.position.z < -500) this.humanSpeed.z*=-1
	}

	private updateGlowBalls(): void {
		const hp: Vector3 = this.human.position
		const maxY: number = 300  // . 最高地点
		const minY: number = 100  // . 最低地点
		const far: number = 300  // .. 影響範囲
		for(const i in this.glowBalls) {
			const p: Vector3 = this.glowBalls[i].position
			const distToHuman: number = new Vector2(p.x, p.z).distanceTo(new Vector2(hp.x, hp.z))
			const y: number = - (maxY/far) * distToHuman + maxY
			this.glowBalls[i].position.setY(y < minY ? minY : y)
		}
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

	private initHuman(): void {
		this.human = new Human()
		this.human.scale.set(10, 10, 10)
		this.scene.add(this.human)
	}

	private initGridHelper(): void {
		const gridHelper: GridHelper = new GridHelper(100, 15)
		gridHelper.scale.set(10, 10, 10)
		this.scene.add(gridHelper)
	}

}