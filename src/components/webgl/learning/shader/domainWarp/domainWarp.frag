#pragma glslify: snoise3 = require(glsl-noise/simplex/3d);
#pragma glslify: cnoise3 = require(glsl-noise/classic/3d);
#pragma glslify: pnoise3 = require(glsl-noise/periodic/3d);

varying vec2 v_uv;
uniform float u_time;

#define OCTAVES 6
float fbm (in vec2 st) {
    // Initial values
    float value = 0.0;
    float amplitude = .5;
    float frequency = 0.;
    //
    // Loop of octaves
    for (int i = 0; i < OCTAVES; i++) {
        value += amplitude * snoise3(vec3(st, u_time/3.));
        st *= 2.;
        amplitude *= .5;
    }
    return value;
}
float _fbm (in vec2 st) {
    // Initial values
    float value = 0.0;
    float amplitude = .5;
    float frequency = 0.;
    //
    // Loop of octaves
    for (int i = 0; i < OCTAVES; i++) {
        value += amplitude * abs(snoise3(vec3(st, u_time/10.)));
        st *= 2.;
        amplitude *= .5;
    }
    return value;
}

void main() {

  vec2 p = v_uv;

  vec2 q = vec2(0.);
  q.x = _fbm(p);
  q.y = _fbm(p + 1.);

  vec2 r = vec2(0.);
  r.x = _fbm(q + u_time*0.05);
  r.y = _fbm(q - u_time*0.1);

  float c = fbm(p + r);

  // float c = _fbm(p*5.);
  c = 1. - c;
  c*=c;

  gl_FragColor = vec4(c, c, c, 1.);
}