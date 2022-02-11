import { ShaderMaterial, Texture } from "three";
import vertexShader from "./shader/allVertex.vert"
import fragmentShader from "./shader/slitScan.frag"

export default class SlitScanMaterial extends ShaderMaterial {

  constructor(texture: Texture) {
    super({
      fragmentShader,
      vertexShader,
      uniforms: {
        u_timemachine: { value: texture }
      }
    })
  }

}