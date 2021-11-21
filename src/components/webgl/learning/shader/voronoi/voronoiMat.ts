import { DoubleSide, ShaderMaterial } from "three";
import { frag, vert } from "../../../utils/material/shaderUtils";

export default class VoronoiMaterial extends ShaderMaterial {

  constructor() {
    super({
      fragmentShader: Shader.frag,
      vertexShader: Shader.vert,
      transparent: true,
      side: DoubleSide,
      uniforms: {
        u_time: {value: 0}
      }
    })
  }

}

class Shader {

  static frag: string = frag`
    uniform float u_time;
    varying vec2 v_uv;

    const vec2 r = vec2(500., 500.);

    vec2 random2( vec2 p ) {
      return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
  }

    void main() {
      vec2 pos = v_uv;
      pos = pos * 2. - 1.;
      pos *= 3.;

      // タイルスペース
      vec2 i_pos = floor(pos);
      vec2 f_pos = fract(pos);

      vec4 color = vec4(0., 0., 0., 1.);

      // 最短距離を記憶
      float min_dist = 1.;

      // 近接セルを考える
      for(int y = -1; y <= 1; y++) {
        for(int x = -1; x <= 1; x++) {
          vec2 neighbor = vec2(float(x), float(y));

          vec2 point = random2(i_pos + neighbor);

          // animate
          point = 0.5 + 0.5*sin(u_time + 6.2831*point);

          vec2 diff = neighbor + point - f_pos;

          float dist = length(diff);

          min_dist = min(min_dist, dist);
        }
      }

      color += min_dist;

      // color = vec4(vec3(f_pos, 1.), 1.);

      gl_FragColor = color;
    }
  `

  static vert: string = vert`
    varying vec2 v_uv;

    void main() {
      v_uv = uv;
      // かける順番大事
      gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.);
    }

  `

}