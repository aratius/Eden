import { dir } from "console";
import { AmbientLight, BoxBufferGeometry, DirectionalLight, Mesh, MeshStandardMaterial, VSMShadowMap } from "three";
import WebGLCanvasBase from "../../utils/template/template";
const noise = require('simplenoise')

const BOX_ROW = 20
const BOX_COLUM = 20
const BOX_SIZE = 50

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
    this._boxes.forEach((box: Mesh, i: number) => {
      const x = i % BOX_ROW
      const y = Math.floor(i / BOX_COLUM)
      const h = noise.simplex3(x/10, y/10, this.elapsedTime / 7)
      box.position.setZ(h * 300)
    })
  }

  _initLights(): void {
    const dirL = new DirectionalLight(0xffffff, 0.4)
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
    dirL.shadow.radius = 10
    dirL.shadow.blurSamples = 10
    dirL.shadow.autoUpdate = true
    dirL.updateMatrix()
    const dirL2 = dirL.clone()
    dirL2.position.set(-300, -300, 300)
    this.scene.add(dirL, dirL2)

    const ambL = new AmbientLight(0xffffff, 0.5)
    this.scene.add(ambL)
  }

  _initBoxes(): void {
    const geo = new BoxBufferGeometry(BOX_SIZE, BOX_SIZE, BOX_SIZE, 10, 10, 10)
    const mat = new MeshStandardMaterial({color: 0xffffff})
    for(let x = 0; x < BOX_ROW; x++) {
      for(let y = 0; y < BOX_COLUM; y++) {
        const box = new Mesh(geo, mat)
        box.position.set((x-BOX_ROW/2)*BOX_SIZE + BOX_SIZE/2, (y-BOX_COLUM/2)*BOX_SIZE + BOX_SIZE/2, Math.random()*BOX_SIZE)
        // box.receiveShadow = true
        // box.castShadow = true
        box.scale.multiplyScalar(0.9)
        this.scene.add(box)
        this._boxes.push(box)
      }
    }
  }

}