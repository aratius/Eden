import { CameraSettings, RendererSettings } from "../../../interfaces";
import WebGLCanvasBase from "../../../utils/template/template";

export default class WebGLDepth_0 extends WebGLCanvasBase {

  constructor(canvas: HTMLCanvasElement, renderer: RendererSettings, camera: CameraSettings) {
    super(canvas, renderer, camera)
  }

  _onInit(): void {
    this.endLoading()
  }
  _onDeInit(): void {}
  _onResize(): void {}
  _onUpdate(): void {}

}