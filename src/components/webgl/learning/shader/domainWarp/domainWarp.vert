#pragma glslify: snoise3 = require(glsl-noise/simplex/3d);
#pragma glslify: cnoise3 = require(glsl-noise/classic/3d);
#pragma glslify: pnoise3 = require(glsl-noise/periodic/3d);

varying vec2 v_uv;
uniform float u_time;

#define OCTAVES 6
float fbm(in vec2 st) {
    // Initial values
    float value = 0.0;
    float amplitude = .5;
    float frequency = 0.;
    //
    // Loop of octaves
    for(int i = 0; i < OCTAVES; i++) {
        value += amplitude * snoise3(vec3(st, u_time / 3.));
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
        value += amplitude * abs(snoise3(vec3(st, u_time / 10.)));
        st *= 2.;
        amplitude *= .5;
    }
    return value;
}

void main() {

    v_uv = uv;

    vec3 pos = position;

    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1.);
}