import { AmbientLight, BufferGeometry, Euler, Float32BufferAttribute, Fog, Group, MathUtils, Mesh, MeshBasicMaterial, Object3D, PlaneBufferGeometry, PlaneGeometry, PMREMGenerator, Points, Quaternion, Ray, Raycaster, RepeatWrapping, ShaderMaterial, SphereBufferGeometry, Texture, Vector2, Vector3 } from "three";
import { CameraSettings, RendererSettings } from "../../interfaces";
import WebGLCanvasBase from "../../utils/template/template";
import Water from "./utils/water";
import { Sky } from "three/examples/jsm/objects/Sky"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { exportJSON, getEulerFromAtoB, getRandomPositions, loadGLTF, loadTexture } from "../../utils";
import Splash from "./utils/splash";
import splashAttr from "../../../../../public/assets/json/splash.json"
import cloudPosition from "../../../../../public/assets/json/cloudPosition.json"
import fogPosition from "../../../../../public/assets/json/fogPos.json"
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { displayShader } from "../../utils/material/displayShader";
import gsap from "gsap";

const noise = require('simplenoise')

export default class WebGLOcean extends WebGLCanvasBase {

	private water: Water = null
	private sky: Sky = null
	private sun: Vector3 = new Vector3()
	private pmremGenerator: PMREMGenerator = null
	private woodenBoats: Group[] = []
	private speedBoat: Group = null
	private lastMousePos: Vector2 = new Vector2(0, 0)
	private mouseSpeed: Vector2 = new Vector2(0, 0)
	private cameraAmount: Vector2 = new Vector2(0, 0)
	private speedBoatSplash: Splash = null
	private statue: Group = null
	private displayShaderPass: ShaderPass = null
	private isLoadedRequirements: boolean = false
	private readonly surfaceSize: Vector2 = new Vector2(1000, 1000)

	constructor(canvas: HTMLCanvasElement, renderer: RendererSettings, camera: CameraSettings) {
		super(canvas, renderer, camera)
	}

	async _onInit(): Promise<void> {
		const ambient: AmbientLight = new AmbientLight()
		this.scene.add(ambient)

		this.camera.position.set(0, 3, 0)
		// this.camera.position.set(0, 20, 50)
		// this.camera.rotation.set(0, 0, 0)

		this.pmremGenerator = new PMREMGenerator(this.renderer)

		// const controls: OrbitControls = new OrbitControls(this.camera, this.renderer.domElement)
		// controls.update()

		await Promise.all([this.initWater(),this.initSky(), this.initBoats(), this.initBoatSplash(), this.initStatue(), this.initDisplayShader()])
		this.isLoadedRequirements = true
		this.updateSun()

		setTimeout(this.loopSplash, 3000)

	}

	_onDeInit(): void {

	}

	_onResize(): void {

	}

	_onUpdate(): void {
		if(!this.isLoadedRequirements) return

		this.mouseSpeed = this.mouse.basedCenterPosition.clone().sub(this.lastMousePos)

		// update view rendered from camera
		this.cameraAmount.add(this.mouseSpeed.clone().multiplyScalar(-0.0002))
		this.cameraAmount.add(this.mouse.basedCenterPosition.clone().multiplyScalar(-0.000002))
		this.cameraAmount.addScalar(noise.simplex2(this.elapsedTime, 1)*0.0005)
		this.cameraAmount.multiplyScalar(0.9)
		this.camera.rotation.y += this.cameraAmount.x

		// update me (camera & speed boat)
		this.camera.position.y = noise.simplex2(this.elapsedTime/3, 1)/3 + 3
		this.speedBoat.position.y = noise.simplex2(this.elapsedTime/2, 1)/2
		this.speedBoat.rotation.z = noise.simplex2(this.elapsedTime/4, 1)/5

		// update wooden boat
		for(let i = 0; i< this.woodenBoats.length; i++) {
			this.woodenBoats[i].position.setY(Math.sin(this.elapsedTime*3+i)*0.4 + Math.sin(this.elapsedTime*3*0.7+i)*0.2)
			this.woodenBoats[i].rotation.y += 0.005
			this.woodenBoats[i].rotation.x = noise.simplex2(this.elapsedTime/2+i, 1)/4
			this.woodenBoats[i].position.x -= 0.4
			if(this.woodenBoats[i].position.x < -this.surfaceSize.x/2) {
				this.woodenBoats[i].position.setX(this.surfaceSize.x/2)
				this.woodenBoats[i].position.setZ(Math.random()*this.surfaceSize.y-this.surfaceSize.y/2)
			}
		}

		// update water uniforms
		(<any>this.water.material).uniforms.time.value = this.elapsedTime;
		(<any>this.speedBoatSplash.material).uniforms.u_time.value = this.elapsedTime;
		(<any>this.speedBoatSplash.material).uniforms.u_camera_pos.value = this.camera.position;

		this.statue.position.x -= 0.5
		this.statue.position.setY(-(Math.abs(this.statue.position.x)) * 0.2 - 3 + noise.simplex2(this.elapsedTime/2, 1)*2)
		if(this.statue.position.x < -this.surfaceSize.x) {
			this.statue.position.setX(this.surfaceSize.x)
			this.statue.position.setZ(Math.random()*400+50)
		}

		// display shader pass
		this.displayShaderPass.uniforms.u_time.value = this.elapsedTime

		// screen noise when status is close
		let distVal: number = (this.surfaceSize.x/2*Math.sqrt(2) - this.camera.position.distanceTo(this.statue.position))/this.surfaceSize.x/2*Math.sqrt(2)
		distVal = distVal > 0 ? distVal : 0
		let val: number = distVal * ((noise.simplex2(this.elapsedTime/2, 1)+1)*1+1)
		val = val > 0 ? val : 0
		this.displayShaderPass.uniforms.u_noise_amount.value = val

		this.camera.position.setY(3 + Math.random()*0.2 * distVal)

		this.lastMousePos = this.mouse.basedCenterPosition
	}

	private loopSplash = ():void => {
		const outDur: number = Math.random()*2+2
		const waitDur: number = Math.random()*2+1
		const tl = gsap.timeline({onComplete: () => {
			setTimeout(this.loopSplash, Math.random() * 3000)
			this.displayShaderPass.uniforms.u_splash_rot.value = Math.random()*Math.PI*2
		}})
		tl.to(this.displayShaderPass.uniforms.u_splash_alpha, {value: 1, duration: 0.6, ease: "sine.out"})
		tl.to(this.displayShaderPass.uniforms.u_splash_alpha, {value: 0, duration: outDur, delay: waitDur})
	}

	private async initDisplayShader(): Promise<void> {
		this.displayShaderPass = new ShaderPass(displayShader)
		this.composer.addPass(this.displayShaderPass)
		const splashTex: Texture = await loadTexture("/assets/images/ocean/screenSplash.png")
		this.displayShaderPass.uniforms.u_splash.value = splashTex
		this.displayShaderPass.uniforms.u_noise_amount.value = 0
		this.displayShaderPass.uniforms.u_splash_alpha.value = 1
		this.displayShaderPass.uniforms.u_splash_pos.value = new Vector2(0,0.5)
		this.displayShaderPass.uniforms.u_splash_rot.value = Math.random()*Math.PI*2
	}

	private async initStatue(): Promise<void> {
		this.statue = await loadGLTF("/assets/models/boat_man/scene.gltf")
		this.statue.rotation.y = -Math.PI/2
		this.statue.position.setZ(Math.random()*700-350)
		this.scene.add(this.statue)
	}

	private initBoatSplash(): void {
		const geo: BufferGeometry = new BufferGeometry()
		geo.setAttribute("position", new Float32BufferAttribute(splashAttr.position.array, 3))

		this.speedBoatSplash = new Splash(geo)
		this.speedBoatSplash.position.setY(0.1)
		this.speedBoatSplash.position.setX(-18)
		this.speedBoatSplash.position.setZ(1)
		this.speedBoatSplash.rotation.y = Math.PI/2
		this.speedBoatSplash.scale.multiplyScalar(1.2)
		this.scene.add(this.speedBoatSplash)
	}

	private async initBoats(): Promise<void> {
		const woodenBoat = await loadGLTF("/assets/models/ocean/wooden_boat/scene.gltf")
		woodenBoat.scale.set(0.03, 0.03, 0.03)
		for(let i = 0; i < 10; i++) {
			const boat = woodenBoat.clone()
			boat.position.setZ(Math.random()*this.surfaceSize.x-this.surfaceSize.x/2)
			boat.position.setX(Math.random()*this.surfaceSize.y-this.surfaceSize.y/2)
			this.woodenBoats.push(boat)
			this.scene.add(boat)
		}

		this.speedBoat = await loadGLTF("/assets/models/ocean/wooden_boat/scene.gltf")
		this.speedBoat.scale.set(0.05, 0.05, 0.05)
		this.speedBoat.rotation.y = Math.PI/2
		this.scene.add(this.speedBoat)

	}

	private updateSun(): void {
		const elevation: number = 3
		const azimuth: number = -180
		const phi: number = MathUtils.degToRad(90 - elevation)
		const theta: number = MathUtils.degToRad(azimuth)

		this.sun.setFromSphericalCoords(1, phi, theta)

		this.sky.material.uniforms.sunPosition.value.copy(this.sun)
		const sunDir: Vector3 = (<ShaderMaterial>this.water.material).uniforms.sunDirection.value
		sunDir.copy(this.sun)

		this.scene.environment = this.pmremGenerator.fromScene(this.sky as any).texture;
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

	private initSky(): void {
		this.sky = new Sky()
		this.sky.scale.setScalar(1000)
		this.scene.add(this.sky)

		const skyUniforms = this.sky.material.uniforms;

		// 濁度
		skyUniforms[ 'turbidity' ].value = 10;
		// 錯乱
		skyUniforms[ 'rayleigh' ].value = 6;
		skyUniforms[ 'mieCoefficient' ].value = 0.005;
		skyUniforms[ 'mieDirectionalG' ].value = 0.5;
	}

}