#pragma glslify: snoise3 = require(glsl-noise/simplex/3d);
#pragma glslify: cnoise3 = require(glsl-noise/classic/3d);
#pragma glslify: pnoise3 = require(glsl-noise/periodic/3d);

varying vec2 v_uv;
uniform float u_time;
uniform float u_index;

#define OCTAVES 6
float fbm(in vec2 st) {
    // Initial values
    float value = 0.0;
    float amplitude = .5;
    float frequency = 0.;
    //
    // Loop of octaves
    for(int i = 0; i < OCTAVES; i++) {
        value += amplitude * snoise3(vec3(st, u_time / 30.));
        st *= 2.;
        amplitude *= .5;
    }
    return value;
}
float _fbm(in vec2 st) {
    // Initial values
    float value = 0.0;
    float amplitude = .5;
    float frequency = 0.;
    //
    // Loop of octaves
    for(int i = 0; i < OCTAVES; i++) {
        value += amplitude * abs(snoise3(vec3(st, u_time / 100.)));
        st *= 2.;
        amplitude *= .5;
    }
    return value;
}

void main() {

    v_uv = uv;
    vec2 p = uv;

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
    // c = -c;
    c = pow(c, 1.2);

    vec3 pos = position;
    float d = distance(vec2(0.5), uv);
    pos.z -= c * 500. * max(0.5 - d, 0.);

    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1.);
}