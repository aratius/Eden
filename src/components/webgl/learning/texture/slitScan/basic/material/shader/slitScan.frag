#pragma glslify: snoise3 = require(glsl-noise/simplex/3d);
#pragma glslify: cnoise3 = require(glsl-noise/classic/3d);
#pragma glslify: pnoise3 = require(glsl-noise/periodic/3d);

varying vec2 v_uv;
uniform sampler2D u_timemachine;
uniform sampler2D u_map;
uniform float u_time;

// time slice count => 100

void main() {
  vec2 pos = v_uv;

  float map = texture2D(u_map, pos).r;

  float time = map;
  time = floor(time * 99.);
  pos /= 10.;
  pos.x += mod(time, 10.)/10.;
  pos.y += floor(time/10.)/10.;

  // max
  // pos.x += .9;
  // pos.y += .9;

  vec4 col = texture2D(u_timemachine, pos);
  gl_FragColor = col;
}