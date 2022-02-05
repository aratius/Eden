import { ShaderMaterial } from "three";
import { frag, glsl, vert } from "../../../utils/material/shaderUtils";
import fragmentShader from "./domainWarp.frag"

export default class DomainWarpMaterial extends ShaderMaterial {

  constructor() {
    super({
      uniforms: {
        u_time: {value: 0}
      },
      fragmentShader,
      vertexShader
    })
  }

}


const vertexShader = vert`
  varying vec2 v_uv;
  void main () {
    v_uv = uv;
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.);
  }
`