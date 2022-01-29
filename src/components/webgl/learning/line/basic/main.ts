import { CameraSettings, RendererSettings } from "../../../interfaces";
import WebGLCanvasBase from "../../../utils/template/template";


export default class WebGLLineBasic extends WebGLCanvasBase {

  constructor(canvas: HTMLCanvasElement, renderer: RendererSettings, camera: CameraSettings) {
    super(canvas, renderer, camera)
  }

  async _onInit(): Promise<void> {

    this.endLoading()
  }

  _onDeInit(): void {

  }

  _onResize(): void {

  }

  _onUpdate(): void {
  }

}