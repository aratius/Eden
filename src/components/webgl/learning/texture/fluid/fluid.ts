import gsap from "gsap";
import { LinearFilter, MeshBasicMaterial, NearestFilter, OrthographicCamera, PlaneBufferGeometry, RGBFormat, Texture, Vector2, WebGLRenderTarget } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { CameraSettings, RendererSettings } from "../../../interfaces";
import { loadTexture } from "../../../utils";
import Plane2D_ish from "../../../utils/object/2DPlane_ish";
import MainScene from "../../../utils/template/scene";
import WebGLCanvasBase from "../../../utils/template/template";
import FluidMaterial from "./material/fluidMat";

export default class WebGLFluid extends WebGLCanvasBase {

  private plane: Plane2D_ish = null
  private lastMousePos: Vector2 = new Vector2(0, 0)
  private lastTexture: Texture = new Texture()

  private rtTarget1: WebGLRenderTarget = new WebGLRenderTarget(600, 600, {
    minFilter: LinearFilter,
    magFilter: NearestFilter,
    format: RGBFormat
  })
  private rtTarget2: WebGLRenderTarget = new WebGLRenderTarget(600, 600, {
    minFilter: LinearFilter,
    magFilter: NearestFilter,
    format: RGBFormat
  })
  private rtPlane1: Plane2D_ish = null
  private rtScene1: MainScene = new MainScene()
  private rtCamera1: OrthographicCamera = new OrthographicCamera(-300, 300, 300, -300)
  private rtPlane2: Plane2D_ish = null
  private rtScene2: MainScene = new MainScene()
  private rtCamera2: OrthographicCamera = new OrthographicCamera(-300, 300, 300, -300)

  private mousePos: Vector2 = new Vector2(0, 0)
  private mouseSpeed: Vector2 = new Vector2(0, 0)
  private mousePosTween: GSAPTween = null
  private mouseSpeedTween: GSAPTween = null

  constructor(canvas: HTMLCanvasElement, renderer: RendererSettings, camera: CameraSettings) {
    super(canvas, renderer, camera)
  }

  async _onInit(): Promise<void> {
    this.renderer.setClearColor(0x000000)

    const controls: OrbitControls = new OrbitControls(this.camera, this.renderer.domElement)
    controls.update()

    this.initRtUtils()
    this.createRtPlane()

    this.createTexture()

    this.endLoading()

  }

  _onDeInit(): void {

  }

  _onResize(): void {

  }

  _onUpdate(): void {

    // uniform?????????
    if(this.rtPlane1 != null && this.rtPlane2 != null) {
      // plane?????????0-1??????????????????
      const normalizedMousePositionBasedCenter: Vector2 = this.mouse.basedCenterPosition.clone().divideScalar(this.rtPlane1.scale.x).addScalar(0.5);
      if(this.mousePosTween != null) this.mousePosTween.kill()
      this.mousePosTween = gsap.to(this.mousePos, {x: normalizedMousePositionBasedCenter.x, y: normalizedMousePositionBasedCenter.y, duration: 0.1, onUpdate: () => {
        (<FluidMaterial>this.rtPlane1.material).uniforms.u_mouse_pos.value = this.mousePos;
      }});
      const mouseSpeed: Vector2 = this.mouse.clone().sub(this.lastMousePos).multiply(new Vector2(-1, 1));
      if(this.mouseSpeedTween != null) this.mouseSpeedTween.kill()
      this.mouseSpeedTween = gsap.to(this.mouseSpeed, {x: mouseSpeed.x, y: mouseSpeed.y, duration: 0.1, onUpdate: () => {
        (<FluidMaterial>this.rtPlane1.material).uniforms.u_mouse_speed.value = this.mouseSpeed
      }})
    }

    const tex: Texture = new Texture()

    // ??????rt1?????????????????????rt2?????????
    if(this.rtPlane1 != null && this.rtPlane2 != null) {
      (<MeshBasicMaterial>this.rtPlane2.material).map = this.rtTarget1.texture;
    }

    this.renderer.setRenderTarget(this.rtTarget1)
    this.renderer.render(this.rtScene1, this.rtCamera1)
    this.renderer.setRenderTarget(this.rtTarget2)
    this.renderer.render(this.rtScene2, this.rtCamera2)
    this.renderer.setRenderTarget(null)

    // ????????????????????????rt2?????????????????????rt1?????????
    if(this.rtPlane1 != null && this.rtPlane2 != null) {
      (<FluidMaterial>this.rtPlane1.material).uniforms.u_texture_last_frame.value = this.rtTarget2.texture;
    }

    this.lastMousePos = this.mouse.clone()
  }

  /**
   * RenderTarget??????????????????
   */
  private initRtUtils(): void {
    this.rtCamera1.position.set(0, 0, 1)
    this.rtTarget1.texture.needsUpdate = true

    this.rtCamera2.position.set(0, 0, 1)
    this.rtTarget2.texture.needsUpdate = true
  }

  /**
   *
   */
  private async createRtPlane(): Promise<void> {
    const geo: PlaneBufferGeometry = new PlaneBufferGeometry(1, 1, 10, 10)
    const initialTexture: Texture = await loadTexture("/assets/images/gpgpu/face.png")
    initialTexture.needsUpdate = true

    const mat1: FluidMaterial = new FluidMaterial(initialTexture)

    this.rtPlane1 = new Plane2D_ish(geo, mat1, new Vector2(100,100))
    this.rtPlane1.scale.multiplyScalar(600)
    this.rtScene1.add(this.rtPlane1)

    const mat2: MeshBasicMaterial = new MeshBasicMaterial({})
    this.rtPlane2 = new Plane2D_ish(geo, mat2, new Vector2(100,100))
    this.rtPlane2.scale.multiplyScalar(600)
    this.rtScene2.add(this.rtPlane2)
  }

  private async createTexture(): Promise<void> {
    const geo: PlaneBufferGeometry = new PlaneBufferGeometry(1, 1, 10, 10)

    const mat: MeshBasicMaterial = new MeshBasicMaterial({map: this.rtTarget1.texture.copy(new Texture())})

    this.plane = new Plane2D_ish(geo, mat, new Vector2(100,100))
    this.plane.scale.multiplyScalar(600)

    this.group2d.add(this.plane)
  }

}