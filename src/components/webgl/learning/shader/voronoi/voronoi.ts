import gsap from "gsap";
import { DoubleSide, Mesh, MeshBasicMaterial, PlaneBufferGeometry } from "three";
import WebGLCanvasBase from "../../../utils/template/template";
import VoronoiMaterial from "./voronoiMat";

export default class Voronoi extends WebGLCanvasBase {

  private mat: VoronoiMaterial = null

  _onInit(): void {

    const geo: PlaneBufferGeometry = new PlaneBufferGeometry(500, 500, 1000, 1000)
    const mat: VoronoiMaterial = new VoronoiMaterial()
    this.mat = mat
    const mesh: Mesh = new Mesh(geo, mat)
    mesh.scale.set(10, 10, 1.5)
    mesh.rotateX(Math.PI/2)
    mesh.position.setY(-100)
    mesh.position.setZ(0)
    this.scene.add(mesh)

    const mesh2: Mesh = new Mesh(geo, mat)
    mesh2.scale.set(10, 10, 1.5)
    mesh2.rotateX(-Math.PI/2)
    mesh2.position.setY(100)
    mesh2.position.setZ(0)
    this.scene.add(mesh2)

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