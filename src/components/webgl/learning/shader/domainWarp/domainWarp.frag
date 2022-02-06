#pragma glslify: snoise3 = require(glsl-noise/simplex/3d);
#pragma glslify: cnoise3 = require(glsl-noise/classic/3d);
#pragma glslify: pnoise3 = require(glsl-noise/periodic/3d);

varying vec2 v_uv;
uniform float u_time;
uniform float u_index;

const vec3 deep = vec3(60./255., 80./255., 110./255.);
const vec3 shallow = vec3(164./255., 181./255., 191./255.);

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

  // float time = u_time/(-u_index + 3.);
  float time = u_time/u_index;

//   p += vec2(cos(time), sin(time))/2.;
    p.x += time/100.;
    p *= 5.;

    vec2 q = vec2(0.);
    q.x = _fbm(p);
    q.y = _fbm(p + 1.);

    vec2 r = vec2(0.);
    r.x = _fbm(q + u_time*0.05);
    r.y = _fbm(q - u_time*0.1);

    float c = fbm(p + r);

    // float c = _fbm(p*5.);
    c = .9 - c;
    c*=c;
    float d = length(vec2(0.5) - v_uv);
    if(d > 0.5) discard;

    vec3 col = mix(deep, shallow, pow(c, 0.8)-0.4);

  gl_FragColor = vec4(col, 1.);
}