import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { CameraSettings, RendererSettings } from "../../interfaces";
import WebGLCanvasBase from "../../utils/template/template";
import { rayMarchingShader } from "./material/displayShader";

export default class RayMarching extends WebGLCanvasBase {

    constructor(canvas: HTMLCanvasElement, renderer: RendererSettings, camera: CameraSettings) {
        super(canvas, renderer, camera)
    }

    _onInit(): void {
        const displayShader = rayMarchingShader
        this.composer.addPass(new ShaderPass(displayShader))

        this.endLoading()
    }

    _onDeInit(): void {

    }

    _onResize(): void {

    }

    _onUpdate(): void {

    }

}