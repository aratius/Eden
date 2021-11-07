import { PlaneBufferGeometry, RepeatWrapping, Texture, Vector2, Vector3 } from "three";
import { CameraSettings, RendererSettings } from "../../../interfaces";
import { loadTexture } from "../../../utils";
import WebGLCanvasBase from "../../../utils/template/template";
import Water from "./utils/water"

export default class WebGLDepth_0 extends WebGLCanvasBase {

  private water: Water = null
	private readonly surfaceSize: Vector2 = new Vector2(1000, 1000)

  constructor(canvas: HTMLCanvasElement, renderer: RendererSettings, camera: CameraSettings) {
    super(canvas, renderer, camera)
  }

  _onInit(): void {
		this.camera.position.set(0, 3, 0)

    this.initWater()
    this.endLoading()
  }
  _onDeInit(): void {}
  _onResize(): void {}
  _onUpdate(): void {
    if(this.water != null) {
      (<any>this.water.material).uniforms.time.value = this.elapsedTime;
    }

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