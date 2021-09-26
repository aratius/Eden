import { AmbientLight, BackSide, Color, Fog, GridHelper, Mesh, MeshPhysicalMaterial, MeshStandardMaterial, PlaneBufferGeometry, PointLight, Points, PointsMaterial, Texture, Vector2, Vector3 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { CameraSettings, RendererSettings } from "../../interfaces";
import WebGLCanvasBase from "../../utils/template/template"
import GlowBall from "./utils/glowBall";
import Human from "./utils/human";
import { Reflector } from "three/examples/jsm/objects/Reflector"
import { CanvasSize } from "../../config/config";
import { loadTexture } from "../../utils";

export default class WebGLTeresa extends WebGLCanvasBase {

	private glowBallsPlane: Points = null
	private glowBalls: GlowBall[] = []
	private human: Human = null
	private humanSpeed: Vector3 = new Vector3(0.15, 0, 0.2)
	private floorMirror: Reflector = null
	private readonly segment: number = 10

	constructor(canvas: HTMLCanvasElement, renderer: RendererSettings, camera: CameraSettings) {
		super(canvas, renderer, camera)

	}

	async _onInit(): Promise<void> {

		await Promise.all([this.initGlowBalls(), this.initHuman(), this.initMirror(), this.initWalls(), this.initGridHelper()])

		this.camera.position.set(0, 30, 100)
		this.camera.lookAt(new Vector3(0,0,0))
		this.renderer.setClearColor(0x000000)

		const ambient: AmbientLight = new AmbientLight()
		this.scene.add(ambient)

		const pointLight: PointLight = new PointLight(0xffffff, 5, 100)
		pointLight.position.setY(50)
		this.scene.add(pointLight)

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

		if(this.human.position.x > 50 || this.human.position.x < -50) this.humanSpeed.x*=-1
		if(this.human.position.z > 50 || this.human.position.z < -50) this.humanSpeed.z*=-1
	}

	private updateGlowBalls(): void {
		const hp: Vector3 = this.human.position
		const maxY: number = 40  // . 最高地点
		const minY: number = 20  // . 最低地点
		const far: number = 30  // .. 影響範囲
		for(const i in this.glowBalls) {
			const p: Vector3 = this.glowBalls[i].position
			const distToHuman: number = new Vector2(p.x, p.z).distanceTo(new Vector2(hp.x, hp.z))
			const y: number = - (maxY/far) * distToHuman + maxY
			this.glowBalls[i].position.setY(y < minY ? minY : y)
		}
	}

	private async initGlowBallsPlane(): Promise<void> {
		const segment: number = 15
		const planeGeo: PlaneBufferGeometry = new PlaneBufferGeometry(1, 1, segment, segment)
		const glowBallTexture: Texture = await loadTexture("/assets/images/glowBall/glowBall.png")
		const pointMat: PointsMaterial = new PointsMaterial({size: 100, color: 0xffffff, map: glowBallTexture, transparent: true, depthTest: false})
		this.glowBallsPlane = new Points(planeGeo, pointMat)
		this.glowBallsPlane.scale.set(1000, 1000, 1000)
		this.glowBallsPlane.rotateX(-Math.PI/2)
		this.glowBallsPlane.position.setY(100)
		this.scene.add(this.glowBallsPlane)
	}

	private initGlowBalls(): void {
		const segment: number = this.segment
		const between: number = 100/segment
		for(let x = 0; x < segment; x++) {
			for(let z = 0; z < segment; z++) {
				const posX: number = (x-(segment-1)/2) * between
				const posZ: number = (z-(segment-1)/2) * between
				const glowBall: GlowBall = new GlowBall()
				glowBall.position.set(posX, 20, posZ)
				glowBall.scale.set(1, 1, 1)
				this.scene.add(glowBall)
				this.glowBalls.push(glowBall)
			}
		}
	}

	private initHuman(): void {
		this.human = new Human()
		this.human.position.setY(1)
		this.scene.add(this.human)
	}

	private initGridHelper(): void {
		const gridHelper: GridHelper = new GridHelper(100, this.segment)
		gridHelper.scale.set(1, 1, 1)
		this.scene.add(gridHelper)
	}

	private initMirror(): void {
		const planeGeo: PlaneBufferGeometry = new PlaneBufferGeometry(100, 100, 1, 1)
		const textureSize: number = 512 * 2

		this.floorMirror = new Reflector(planeGeo, {
			clipBias: 0.003,
			textureWidth: textureSize,
			textureHeight: textureSize,
			color: new Color(0x889999)
		})
		this.floorMirror.rotateX(-Math.PI/2)
		this.scene.add(this.floorMirror)

		// const leftMirror: Reflector = new Reflector(planeGeo, {
		// 	clipBias: 0.003,
		// 	textureWidth: textureSize,
		// 	textureHeight: textureSize,
		// 	color: new Color(0xff0000)
		// })
		// leftMirror.rotateY(Math.PI/2)
		// leftMirror.position.set(-50, 50, 0)
		// this.scene.add(leftMirror)

		// const rightMirror: Reflector = new Reflector(planeGeo, {
		// 	clipBias: 0.003,
		// 	textureWidth: textureSize,
		// 	textureHeight: textureSize,
		// 	color: new Color(0xff0000)
		// })
		// rightMirror.rotateY(-Math.PI/2)
		// rightMirror.position.set(50, 50, 0)
		// this.scene.add(rightMirror)

		// const backMirror: Reflector = new Reflector(planeGeo, {
		// 	clipBias: 0.003,
		// 	textureWidth: textureSize,
		// 	textureHeight: textureSize,
		// 	color: new Color(0xff0000)
		// })
		// backMirror.position.set(0, 50, -50)
		// this.scene.add(backMirror)

	}

	private initWalls(): void {
		const wallGeo: PlaneBufferGeometry = new PlaneBufferGeometry(100, 100, 1, 1)
		const wallMat: MeshPhysicalMaterial = new MeshPhysicalMaterial({color: 0x111111})

		const frontWall: Mesh = new Mesh(wallGeo, wallMat)
		frontWall.rotateY(Math.PI)
		frontWall.position.set(0, 50, 50)
		this.scene.add(frontWall)

		const backWall: Mesh = new Mesh(wallGeo, wallMat)
		backWall.position.set(0, 50, -50)
		this.scene.add(backWall)

		const leftWall: Mesh = new Mesh(wallGeo, wallMat)
		leftWall.rotateY(Math.PI/2)
		leftWall.position.set(-50, 50, 0)
		this.scene.add(leftWall)

		const rightWall: Mesh = new Mesh(wallGeo, wallMat)
		rightWall.rotateY(-Math.PI/2)
		rightWall.position.set(50, 50, 0)
		this.scene.add(rightWall)

		const topWall: Mesh = new Mesh(wallGeo, wallMat)
		topWall.rotateX(Math.PI/2)
		topWall.position.setY(100)
		this.scene.add(topWall)
	}

}