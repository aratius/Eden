import { DoubleSide, ShaderMaterial, Texture } from "three";
import fragShader from "./shader/plane.frag"
import vertShader from "./shader/plane.vert"

export default class PlaneMaterial extends ShaderMaterial {

  constructor(texture: Texture, depthTex: Texture) {
    super({
      uniforms: {
        u_texture: {value: texture},
        u_depth_texture: {value: depthTex}
      },
      fragmentShader: fragShader,
      vertexShader: vertShader,
      side: DoubleSide,
      transparent: true,
      wireframe: false
    })
  }

}