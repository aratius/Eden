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

    void main() {
      vec2 pos = v_uv;
      pos = pos * 2. - 1.;

      vec4 color = vec4(0., 0., 0., 1.);

      vec2 points[5];
      points[0] = vec2(sin(u_time), cos(u_time));
      points[1] = vec2(0., 0.2);
      points[2] = vec2(-0.4, 0.9);
      points[3] = vec2(0.9, -0.3);
      points[4] = vec2(0.9, -0.8);

      // 最短距離を記憶
      float min_dist = 1.;

      for(int i = 0; i < 5; i++) {
        // 各ピクセルから一番近いpositionをさがす
        float dist = distance(pos, points[i]);
        // 最短距離を更新
        min_dist = min(min_dist, dist);
      }

      color += min_dist;

      // color = vec4(vec3(pos.y), 1.);

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