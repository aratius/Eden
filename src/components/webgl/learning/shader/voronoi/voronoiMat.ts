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
      // 各セルごと一様な値
      vec2 i_pos = floor(pos);
      // 各セル内の0-1座標
      vec2 f_pos = fract(pos);

      vec4 color = vec4(0., 0., 0., 1.);

      // 最短距離を記憶
      float min_dist = 1.;

      // 近接セルを考える 0 = 自分？
      for(int y = -1; y <= 1; y++) {
        for(int x = -1; x <= 1; x++) {
          // 自身(i_pos)の近隣 自分のときもある
          vec2 neighbor = vec2(float(x), float(y));

          vec2 point = random2(i_pos + neighbor);

          // animate
          point = 0.5 + 0.5*sin(u_time + 6.2831*point);

          // ここがよくわからん
          // neighbor = 最短を探す際のハンデ（なので正） いっこ隣にずれたとしても最短なら最短にしてあげるイメージ
          // point = 点の位置
          // f_pos = セル内の座標 point - f_posが基本の距離
          vec2 diff = neighbor + (point - f_pos);  // ハンデ + 距離
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
    uniform float u_time;

    const vec2 r = vec2(500., 500.);

    vec2 random2( vec2 p ) {
      return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
    }

    float easeInOutQuad(float x) {
      if(x < 0.5) {
        return 2. * x * x;
      } else {
        return 1. - pow(-2. * x + 2., 2.) / 2.;
      }
    }

    float easeInOutElastic(float x) {
      float c5 = (2. * 3.1415) / 4.5;
      if(x == 0.) return 0.;
      else if (x == 1.) return 1.;
      else if (x < 0.5) {
        return -(pow(2., 20. * x - 10.) * sin((20. * x - 11.125) * c5)) / 2.;
      } else {
        return (pow(2., -20. * x + 10.) * sin((20. * x - 11.125) * c5)) / 2. + 1.;
      }
    }

    void main() {
      v_uv = uv;

      vec2 coord = uv;
      coord = coord * 2. - 1.;
      coord *= 3.;

      // タイルスペース
      // 各セルごと一様な値
      vec2 i_pos = floor(coord);
      // 各セル内の0-1座標
      vec2 f_pos = fract(coord);

      vec4 color = vec4(0., 0., 0., 1.);

      // 最短距離を記憶
      float min_dist = 1.;

      // 近接セルを考える 0 = 自分？
      for(int y = -1; y <= 1; y++) {
        for(int x = -1; x <= 1; x++) {
          // 自身(i_pos)の近隣 自分のときもある
          vec2 neighbor = vec2(float(x), float(y));

          vec2 point = random2(i_pos + neighbor);

          // animate
          point = 0.5 + 0.5*sin(u_time + 6.2831*point);

          // ここがよくわからん
          // neighbor = 最短を探す際のハンデ（なので正） いっこ隣にずれたとしても最短なら最短にしてあげるイメージ
          // point = 点の位置
          // f_pos = セル内の座標 point - f_posが基本の距離
          vec2 diff = neighbor + (point - f_pos);  // ハンデ + 距離
          float dist = length(diff);

          min_dist = min(min_dist, dist);
        }
      }

      vec3 pos = position;

      // pos.z += easeInOutQuad(min_dist)*100.;

      // かける順番大事
      gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1.);
    }

  `

}