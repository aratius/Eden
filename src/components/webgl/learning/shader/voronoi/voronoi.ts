import gsap from "gsap";
import { DoubleSide, Mesh, MeshBasicMaterial, PlaneBufferGeometry } from "three";
import WebGLCanvasBase from "../../../utils/template/template";
import VoronoiMaterial from "./voronoiMat";

export default class Voronoi extends WebGLCanvasBase {

  private mat: VoronoiMaterial = null

  _onInit(): void {

    const geo: PlaneBufferGeometry = new PlaneBufferGeometry(500, 500, 100, 100)
    const mat: VoronoiMaterial = new VoronoiMaterial()
    this.mat = mat
    const mesh: Mesh = new Mesh(geo, mat)
    mesh.scale.set(1, 1, 0.2)
    // mesh.rotateX(Math.PI/2)
    mesh.position.setY(-50)
    mesh.position.setZ(0)
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