import { MeshBasicMaterial, PlaneBufferGeometry, Texture, Vector2 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { CameraSettings, RendererSettings } from "../../../interfaces";
import { loadTexture } from "../../../utils";
import Plane2D_ish from "../../../utils/object/2DPlane_ish";
import WebGLCanvasBase from "../../../utils/template/template";
import FluidMaterial from "./material/fluidMat";

export default class WebGLFluid extends WebGLCanvasBase {

  private plane: Plane2D_ish = null

  constructor(canvas: HTMLCanvasElement, renderer: RendererSettings, camera: CameraSettings) {
    super(canvas, renderer, camera)
  }

  async _onInit(): Promise<void> {
    this.renderer.setClearColor(0x000000)

    const controls: OrbitControls = new OrbitControls(this.camera, this.renderer.domElement)
    controls.update()

    this.createTexture()

    this.endLoading()
  }

  _onDeInit(): void {

  }

  _onResize(): void {

  }

  _onUpdate(): void {

  }

  private async createTexture(): Promise<void> {
    const geo: PlaneBufferGeometry = new PlaneBufferGeometry(1, 1, 10, 10)
    const initialTexture: Texture = await loadTexture("/assets/images/gpgpu/face.png")

    const mat: FluidMaterial = new FluidMaterial(initialTexture)

    this.plane = new Plane2D_ish(geo, mat, new Vector2(100,100))
    this.plane.scale.multiplyScalar(600)

    this.group2d.add(this.plane)
  }

}