import { ShaderMaterial, Texture, Vector2 } from "three";
import fragShader from "./shader/fluid.frag"
import vertShader from "./shader/fluid.vert"

export default class FluidMaterial extends ShaderMaterial {

  constructor(initialTexture: Texture) {
    super({
      uniforms: {
        u_texture_last_frame: {value: initialTexture},
        u_mouse_pos: {value: new Vector2(0,0)},
        u_mouse_speed: {value: new Vector2(0,0)},
      },
      vertexShader: vertShader,
      fragmentShader: fragShader,
      transparent: true
    })
  }

}