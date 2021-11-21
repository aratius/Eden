import gsap from "gsap";
import { DoubleSide, Mesh, MeshBasicMaterial, PlaneBufferGeometry } from "three";
import WebGLCanvasBase from "../../../utils/template/template";
import VoronoiMaterial from "./voronoiMat";

export default class Voronoi extends WebGLCanvasBase {

  private mat: VoronoiMaterial = null

  _onInit(): void {

    const geo: PlaneBufferGeometry = new PlaneBufferGeometry(500, 500, 1, 1)
    const mat: VoronoiMaterial = new VoronoiMaterial()
    this.mat = mat
    const mesh: Mesh = new Mesh(geo, mat)
    mesh.scale.set(1, 1, 1)
    mesh.rotateX(Math.PI)
    this.scene.add(mesh)

    this.endLoading()
  }

  _onDeInit(): void {

  }

  _onResize(): void {

  }

  _onUpdate(): void {
    if(this.mat != null) {
      this.mat.uniforms.u_time.value = this.elapsedTime
    }
  }

}