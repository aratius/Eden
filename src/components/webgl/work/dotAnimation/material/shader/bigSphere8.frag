varying vec2 v_uv;
uniform float u_time;

const float x_segment = 100.;
const float y_segment = 50.;

vec2 random2(vec2 st){
    st = vec2( dot(st,vec2(127.1,311.7)),
              dot(st,vec2(269.5,183.3)) );
    return -1.0 + 2.0*fract(sin(st)*43758.5453123);
}

// Gradient Noise by Inigo Quilez - iq/2013
// https://www.shadertoy.com/view/XdXGW8
float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    vec2 u = f*f*(3.0-2.0*f);

    return mix( mix( dot( random2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
                     dot( random2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                mix( dot( random2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
                     dot( random2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
}

void main() {

    vec2 p = v_uv * vec2(x_segment, y_segment);
    float dir_y = mod(floor(p.y), 2.) * 2. - 1.;
    float dir_x = mod(floor(p.x), 2.);
    p += vec2(sin(u_time * dir_y), cos(u_time * dir_x));
    vec2 mod_p = vec2(mod(p.x, 1.), mod(p.y, 1.));

    vec4 color = vec4(vec3(0.), 1.);

    // wire
    color.rgb += vec3(step(mod_p.x, 0.03));
    color.rgb += vec3(step(mod_p.y, 0.03));

    float radius_mul =
        (
            noise(
                vec2(p.x + u_time/1., p.y + u_time/1.)
            )
        )*4.+2.;  // 2 ~ 6
    color.rgb += vec3(length(mod_p-vec2(0.5, 0.5)) * radius_mul);

    gl_FragColor = color;
}