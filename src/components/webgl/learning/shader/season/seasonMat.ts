import { DoubleSide, ShaderMaterial } from "three";
import fragmentShader from "./season.frag"
import vertexShader from "./season.vert"

export default class DomainWarpMaterial extends ShaderMaterial {

  constructor() {
    super({
      uniforms: {
        u_time: {value: 0},
        u_index: {value: 0}
      },
      fragmentShader,
      vertexShader,
      transparent: true,
      side: DoubleSide
    })
  }

}
