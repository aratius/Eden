
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d);
#pragma glslify: cnoise3 = require(glsl-noise/classic/3d);
#pragma glslify: pnoise3 = require(glsl-noise/periodic/3d);

varying vec2 v_uv;
uniform float u_time;
uniform float u_map_type;

void main() {
  vec2 pos = v_uv;
  float col = 0.;
  if(u_map_type == 1.) {
    // linear
    col = pos.y;
  } else if(u_map_type == 2.) {
    // linear
    col = pos.x;
  } else if (u_map_type == 3.) {
    // noise
    pos.xy += snoise3(vec3(pos, 1.));
    col = snoise3(vec3(pos*2., u_time/2.)) * 0.5 + 0.5;
  } else if (u_map_type == 4.) {
    // circular
    col = length(vec2(0.5) - pos);
  } else if (u_map_type == 5.) {
    // slit
    col += mod(pos.x * 10. * 2., 1.);
  } else if (u_map_type == 6.) {
    // circular slit
    col = abs(0.5 - mod(length(vec2(0.5) - pos) * 20., 1.))*2.;
  } else if (u_map_type == 7.) {
    // check
    pos *= 10.;
    col += abs(step(0.5, fract(pos.x)) - step(0.5, fract(pos.y)));
  }

  gl_FragColor = vec4(vec3(col), 1.);
}