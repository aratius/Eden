import { DoubleSide, MeshBasicMaterial, PlaneBufferGeometry, Texture, Vector2 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { CameraSettings, RendererSettings } from "../../../interfaces";
import { loadTexture } from "../../../utils";
import Plane2D_ish from "../../../utils/object/2DPlane_ish";
import WebGLCanvasBase from "../../../utils/template/template";

export default class WebGLFluid extends WebGLCanvasBase {

  private plane: Plane2D_ish = null

  constructor(canvas: HTMLCanvasElement, renderer: RendererSettings, camera: CameraSettings) {
    super(canvas, renderer, camera)
  }

  async _onInit(): Promise<void> {
    this.renderer.setClearColor(0x000000)

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

}