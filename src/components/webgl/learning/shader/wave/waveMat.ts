import { DoubleSide, ShaderMaterial } from "three";
import { frag, glsl, vert } from "../../../utils/material/shaderUtils";
import fragmentShader from "./wave.frag"
import vertexShader from "./wave.vert"

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