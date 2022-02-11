import { ShaderMaterial, Texture } from "three";
import vertexShader from "./shader/allVertex.vert"
import fragmentShader from "./shader/slitScan.frag"

export default class SlitScanMaterial extends ShaderMaterial {

  constructor(texture: Texture, map: Texture) {
    super({
      fragmentShader,
      vertexShader,
      depthTest: true,
      uniforms: {
        u_timemachine: { value: texture },
        u_map: {value: map}
      }
    })
  }

}