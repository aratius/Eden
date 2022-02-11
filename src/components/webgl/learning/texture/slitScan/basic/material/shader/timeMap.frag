
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d);
#pragma glslify: cnoise3 = require(glsl-noise/classic/3d);
#pragma glslify: pnoise3 = require(glsl-noise/periodic/3d);

varying vec2 v_uv;
uniform float u_time;
uniform float u_type;

void main() {
  vec2 pos = v_uv;
  float col = snoise3(vec3(pos, u_time/10.)) * 0.5 + 0.5;

  gl_FragColor = vec4(vec3(col), 1.);
}