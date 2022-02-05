  #pragma glslify: snoise3 = require(glsl-noise/simplex/3d);

  varying vec2 v_uv;
  uniform float u_time;

  void main() {
    float c = snoise3(vec3(vec2(v_uv*10.), u_time));
    gl_FragColor = vec4(c, c, c, 1.);
  }