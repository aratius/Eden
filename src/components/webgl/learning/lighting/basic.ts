import { dir } from "console";
import { AmbientLight, BoxBufferGeometry, DirectionalLight, Mesh, MeshStandardMaterial, VSMShadowMap } from "three";
import WebGLCanvasBase from "../../utils/template/template";

const BOX_ROW = 10
const BOX_COLUM = 10
const BOX_SIZE = 100

export default class LightingBasic extends WebGLCanvasBase {

  private _boxes: Mesh[] = []

  _onInit(): void {
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = VSMShadowMap

    this._initBoxes()
    this._initLights()

    this.endLoading()
  }

  _onDeInit(): void {

  }

  _onResize(): void {

  }

  _onUpdate(): void {

  }

  _initLights(): void {
    const dirL = new DirectionalLight(0xffffff, 1)
    dirL.position.set(300, 300, 300)
    dirL.lookAt(0,0,0)
    dirL.castShadow = true
    dirL.shadow.camera.right = window.innerWidth
    dirL.shadow.camera.left = -window.innerWidth
    dirL.shadow.camera.top = window.innerHeight
    dirL.shadow.camera.bottom = -window.innerHeight
    dirL.shadow.camera.near = 4
    dirL.shadow.camera.far = 1500
    dirL.shadow.camera.updateProjectionMatrix()
    dirL.shadow.mapSize.width = 2048
    dirL.shadow.mapSize.height = 2048
    dirL.shadow.radius = 20
    dirL.shadow.blurSamples = 32
    dirL.shadow.autoUpdate = true
    console.log(dirL);
    dirL.updateMatrix()
    this.scene.add(dirL)

    const ambL = new AmbientLight(0xffffff, 0.4)
    this.scene.add(ambL)
  }

  _initBoxes(): void {
    const geo = new BoxBufferGeometry(BOX_SIZE, BOX_SIZE, BOX_SIZE, 10, 10, 10)
    const mat = new MeshStandardMaterial({color: 0xffffff})
    for(let x = 0; x < BOX_ROW; x++) {
      for(let y = 0; y < BOX_COLUM; y++) {
        const box = new Mesh(geo, mat)
        box.position.set((x-BOX_ROW/2)*BOX_SIZE + BOX_SIZE/2, (y-BOX_COLUM/2)*BOX_SIZE + BOX_SIZE/2, Math.random()*BOX_SIZE)
        box.receiveShadow = true
        box.castShadow = true
        this.scene.add(box)
      }
    }
  }

}