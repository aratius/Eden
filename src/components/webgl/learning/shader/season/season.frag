#pragma glslify: snoise3 = require(glsl-noise/simplex/3d);
#pragma glslify: cnoise3 = require(glsl-noise/classic/3d);
#pragma glslify: pnoise3 = require(glsl-noise/periodic/3d);

varying vec2 v_uv;
uniform float u_time;
uniform float u_index;

const vec3 WIN_DEEP = vec3(100./255., 120./255., 150./255.);
const vec3 WIN_SHALLOW = vec3(230./255., 240./255., 255./255.);

const vec3 SUM_DEEP = vec3(2./255., 89./255., 49./255.);
const vec3 SUM_SHALLOW = vec3(4./255., 170./255., 40./255.);

#define OCTAVES 6
float fbm (in vec2 st) {
    // Initial values
    float value = 0.0;
    float amplitude = .5;
    float frequency = 0.;
    //
    // Loop of octaves
    for (int i = 0; i < OCTAVES; i++) {
        value += amplitude * snoise3(vec3(st, u_time/30.));
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
        value += amplitude * abs(snoise3(vec3(st, u_time/100.)));
        st *= 2.;
        amplitude *= .5;
    }
    return value;
}

void main() {

    vec2 p = v_uv;

    // float time = u_time/(-u_index + 3.);
    float time = u_time / u_index;

    //   p += vec2(cos(time), sin(time))/2.;
    // p.x += time / 100.;
    p *= 2.;

    vec2 q = vec2(0.);
    q.x = _fbm(p);
    q.y = _fbm(p + 1.);

    vec2 r = vec2(0.);
    // r.x = _fbm(q + u_time * 0.05);
    // r.y = _fbm(q - u_time * 0.1);

    float c = _fbm(p + r);

    // float c = _fbm(p*5.);
    c = (c-0.5) * 1.2 + (0.5) * 1.2;
    c*=c*3.;
    float d = length(vec2(0.5) - v_uv);
    if(d > 0.5) discard;

    vec3 col = mix(SUM_DEEP, SUM_SHALLOW, pow(c, 1.)-0.6);

    col.r += _fbm(q*100.) * 0.05;
    col.g += _fbm(q*100. + vec2(1.)) * 0.05;
    col.b += _fbm(q*100. + vec2(2.)) * 0.05;

  gl_FragColor = vec4(col, 1.);
}