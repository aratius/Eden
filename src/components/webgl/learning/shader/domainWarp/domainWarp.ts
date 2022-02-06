import gsap from "gsap";
import { Mesh, PlaneBufferGeometry } from "three";
import WebGLCanvasBase from "../../../utils/template/template";
import DomainWarpMaterial from "./domainWarpMat";

export default class DomainWarp extends WebGLCanvasBase {

  private _planes: Mesh[] = []

  _onInit(): void {
    this._initPlane()

    this.endLoading()
  }

  _onDeInit(): void {

  }

  _onResize(): void {

  }

  _onUpdate(): void {
    this._planes.forEach((plane: Mesh, i: number) => {
      (<DomainWarpMaterial>plane.material).uniforms.u_time.value = this.elapsedTime*1.5
      // (<DomainWarpMaterial>plane.material).uniforms.u_time.value = this.elapsedTime/5.
      // plane.position.setY(Math.sin(this.elapsedTime/5./(i+1)) * 200)
      // plane.position.setX(Math.cos(this.elapsedTime/5./(i+1)) * 200)
      // plane.rotateZ(0.003)
    })
  }

  private _initPlane(): void {
    const geo = new PlaneBufferGeometry(400, 400, 300, 300)
    const mat = new DomainWarpMaterial()
    // this._plane = new Mesh(geo, mat)
    // this._plane.rotateX(Math.PI/2)
    // this._plane.position.set(0,-100,200)
    // this._plane.position.set(0,0,-200)
    // this.scene.add(this._plane)

    for(let i = 0; i < 1; i++) {
      const plane = new Mesh(geo, mat.clone())
      plane.rotateX(Math.PI/2)
      plane.position.set(0,-50,500)
      this._planes.push(plane)
      this.scene.add(plane);
      (<DomainWarpMaterial>plane.material).uniforms.u_index.value = i+1
    }
  }

}