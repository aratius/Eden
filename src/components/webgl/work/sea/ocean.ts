import { AmbientLight, Group, MathUtils, Mesh, MeshBasicMaterial, PlaneBufferGeometry, PlaneGeometry, PMREMGenerator, RepeatWrapping, ShaderMaterial, SphereBufferGeometry, Texture, Vector3 } from "three";
import { CameraSettings, RendererSettings } from "../../interfaces";
import WebGLCanvasBase from "../../utils/template/template";
import Water from "./water";
import { Sky } from "three/examples/jsm/objects/Sky"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { loadGLTF, loadTexture } from "../../utils";

export default class WebGLOcean extends WebGLCanvasBase {

	private water: Water = null
	private sky: Sky = null
	private sun: Vector3 = new Vector3()
	private pmremGenerator: PMREMGenerator = null
	private woodenBoat: Group = null

	constructor(canvas: HTMLCanvasElement, renderer: RendererSettings, camera: CameraSettings) {
		super(canvas, renderer, camera)
	}

	async _onInit(): Promise<void> {

		const ambient: AmbientLight = new AmbientLight()
		this.scene.add(ambient)

		this.camera.position.set(0, 20, 50)
		this.camera.rotation.set(0, 0, 0)

		this.pmremGenerator = new PMREMGenerator(this.renderer)

		const controls: OrbitControls = new OrbitControls(this.camera, this.renderer.domElement)
		controls.update()

		await Promise.all([this.initWater(),this.initSky(), this.initBoats()])
		this.updateSun()

	}

	_onDeInit(): void {

	}

	_onResize(): void {

	}

	_onUpdate(): void {

		if(this.water != null) (<any>this.water.material).uniforms.time.value = this.elapsedTime
		if(this.woodenBoat != null) {
			this.woodenBoat.position.setY(Math.sin(this.elapsedTime*3)*0.4 + Math.sin(this.elapsedTime*3*0.7)*0.2)
			this.woodenBoat.rotation.y += 0.001
			this.woodenBoat.position.x -= 0.2
			if(this.woodenBoat.position.x < -50) this.woodenBoat.position.setX(50)
		}

	}

	private async initBoats(): Promise<void> {
		this.woodenBoat = await loadGLTF("/assets/models/ocean/wooden_boat/scene.gltf")
		this.woodenBoat.scale.set(0.03, 0.03, 0.03)
		this.scene.add(this.woodenBoat)

	}

	private updateSun(): void {
		const elevation: number = 2
		const azimuth: number = 180
		const phi: number = MathUtils.degToRad(90 - elevation)
		const theta: number = MathUtils.degToRad(azimuth)

		this.sun.setFromSphericalCoords(1, phi, theta)

		this.sky.material.uniforms.sunPosition.value.copy(this.sun)
		const sunDir: Vector3 = (<ShaderMaterial>this.water.material).uniforms.sunDirection.value
		sunDir.copy(this.sun)

		this.scene.environment = this.pmremGenerator.fromScene(this.sky as any).texture;
	}

	private async initWater(): Promise<void> {
		const waterGeometry: PlaneBufferGeometry = new PlaneBufferGeometry(100, 100, 100, 100)

		const waterNormals: Texture = await loadTexture("/assets/images/ocean/Water_1_M_Normal.jpg")

		waterNormals.wrapS = waterNormals.wrapT = RepeatWrapping

		this.water = new Water(
			waterGeometry,
			{
				textureWidth: 512/10,
				textureHeight: 512/10,
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
		this.sky.scale.setScalar(10000)
		this.scene.add(this.sky)

		const skyUniforms = this.sky.material.uniforms;
		skyUniforms[ 'turbidity' ].value = 10;
		skyUniforms[ 'rayleigh' ].value = 6;
		skyUniforms[ 'mieCoefficient' ].value = 0.005;
		skyUniforms[ 'mieDirectionalG' ].value = 0.8;
	}

}