import { AmbientLight, DirectionalLight, GridHelper, LineBasicMaterial, Mesh, MeshBasicMaterial, MeshStandardMaterial, SphereGeometry } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { CameraSettings, RendererSettings } from "../../interfaces";
import WebGLCanvasBase from "../../utils/template/template";

/**
 * [read here Gandhi (Sorry for my bad English)]
 * 3d objects can zoom in out, and 2d objects is fixed by the scene camera
 * group2d is extend a Group class and it updates to fix position facing to camera and hold distance decided at first
 * if u want to fix grid to foreground, i think u need to add Scene to add only grid, and do render process in order to 3d -> 2d(have grid)
 * code group2d is see here "src/components/webgl/utils/template/2DGroup_ish.ts"
 */
export default class WebGLGridFix extends WebGLCanvasBase {

  constructor(canvas: HTMLCanvasElement, renderer: RendererSettings, camera: CameraSettings) {
    super(canvas, renderer, camera)
  }

  _onInit(): void {

    this.renderer.setClearColor(0x000000)

    const controls: OrbitControls = new OrbitControls(this.camera, this.renderer.domElement)
    controls.update()

    const dirLight: DirectionalLight = new DirectionalLight()
    this.scene.add(dirLight)

    const ambLight: AmbientLight = new AmbientLight(0xffffff, 0.2)
    this.scene.add(ambLight)

    this.initGridHelper()
    this.initBall()

    this.endLoading()
  }

  _onDeInit(): void {

  }

  _onResize(): void {

  }

  _onUpdate(): void {

  }

  private initGridHelper(): void {

    const gridHelper: GridHelper = new GridHelper(2, 100);
    (<LineBasicMaterial>gridHelper.material).depthTest = false

		gridHelper.scale.set(Math.max(window.innerWidth, window.innerHeight), Math.max(window.innerWidth, window.innerHeight), Math.max(window.innerWidth, window.innerHeight))
    gridHelper.rotateX(Math.PI/2)
		this.group2d.add(gridHelper)

  }

  private initBall(): void {
    const ball: Mesh = new Mesh(new SphereGeometry(100), new MeshStandardMaterial({color: "red"}))
    // ball.position.setZ(-100)
    this.scene.add(ball)
  }

}