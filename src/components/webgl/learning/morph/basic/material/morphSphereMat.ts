import { ShaderMaterial } from "three";
import fragShader from "./shader/morph.frag"
import vertShader from "./shader/morph.vert"

export default class MorphSphereMaterial extends ShaderMaterial {

  constructor() {
    super({
      uniforms: {
        u_morph_amount: {value: 0}
      },
      fragmentShader: fragShader,
      vertexShader: vertShader,
      transparent: true,
      wireframe: false
    })
  }

}