import { Mesh, PlaneBufferGeometry } from "three";
import WebGLCanvasBase from "../../../utils/template/template";
import DomainWarpMaterial from "./domainWarpMat";

export default class DomainWarp extends WebGLCanvasBase {

  private _plane: Mesh = null

  _onInit(): void {
    this._initPlane()

    this.endLoading()
  }

  _onDeInit(): void {

  }

  _onResize(): void {

  }

  _onUpdate(): void {
    if(this._plane != null) {
      (<DomainWarpMaterial>this._plane.material).uniforms.u_time.value = this.elapsedTime
    }
  }

  private _initPlane(): void {
    const geo = new PlaneBufferGeometry(500, 500, 1, 1)
    const mat = new DomainWarpMaterial()
    this._plane = new Mesh(geo, mat)
    this.scene.add(this._plane)
  }

}