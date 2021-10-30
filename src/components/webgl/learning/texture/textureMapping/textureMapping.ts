import { DoubleSide, MeshBasicMaterial, PlaneBufferGeometry, Texture, Vector2 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { CameraSettings, RendererSettings } from "../../../interfaces";
import { loadTexture } from "../../../utils";
import Plane2D_ish from "../../../utils/object/2DPlane_ish";
import WebGLCanvasBase from "../../../utils/template/template";
import PlaneMaterial from "./material/planeMat";

export default class WebGLTextureMapping extends WebGLCanvasBase {

  private plane: Plane2D_ish = null

  constructor(canvas: HTMLCanvasElement, renderer: RendererSettings, camera: CameraSettings) {
    super(canvas, renderer, camera)
  }

  async _onInit(): Promise<void> {
    this.renderer.setClearColor(0x000000)

    const controls: OrbitControls = new OrbitControls(this.camera, this.renderer.domElement)
    controls.update()

    const texture: Texture = await loadTexture("/assets/images/textureMapping/face.png")
    const depthTexture: Texture = await loadTexture("/assets/images/textureMapping/faceDepth.png")
    const material: PlaneMaterial = new PlaneMaterial(texture, depthTexture)
    const geometry: PlaneBufferGeometry = new PlaneBufferGeometry(1, 1, 100, 100)
    this.plane = new Plane2D_ish(geometry, material, new Vector2(texture.image.width, texture.image.height))
    this.plane.scale.set(300, 300, 300)
    this.scene.add(this.plane)

    this.endLoading()
  }

  _onDeInit(): void {

  }

  _onResize(): void {

  }

  _onUpdate(): void {

  }

}