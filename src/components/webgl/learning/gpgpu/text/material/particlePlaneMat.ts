import { ShaderMaterial, Texture, Vector2 } from "three";
import fragShader from "./shader/particlePlane.frag"
import vertShader from "./shader/particlePlane.vert"

export default class ParticlePlaneMaterial extends ShaderMaterial {

  constructor(tex: Texture) {
    super({
      uniforms: {
        u_resolution: {value: new Vector2(1,1)},
        u_texture_position: {value: new Texture()},
        u_texture_face: {value: tex},
        u_time: {value: 0},
      },
      fragmentShader: fragShader,
      vertexShader: vertShader,
      transparent: true
    })
  }

}