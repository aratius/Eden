varying vec2 v_uv;
uniform float u_time;
uniform vec2 u_segments;


float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                * 43758.5453123);
}

// Value noise by Inigo Quilez - iq/2013
// https://www.shadertoy.com/view/lsf3WH
float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    vec2 u = f*f*(3.0-2.0*f);
    return mix( mix( random( i + vec2(0.0,0.0) ),
                     random( i + vec2(1.0,0.0) ), u.x),
                mix( random( i + vec2(0.0,1.0) ),
                     random( i + vec2(1.0,1.0) ), u.x), u.y);
}

void main() {
    float x_segment = u_segments.x;
    float y_segment = u_segments.y;

    vec2 p = v_uv * vec2(x_segment, y_segment) +  + vec2(-u_time, 0.);
    vec2 mod_p = vec2(mod(p.x, 1.), mod(p.y, 1.));

    vec4 color = vec4(vec3(0.), 1.);

    // wire
    // color.rgb += vec3(step(mod_p.x, 0.03));
    // color.rgb += vec3(step(mod_p.y, 0.03));

    float radius_mul =
        (
            // sin(
                noise(
                    floor(p/1. + vec2(u_time, 0.))
                )*5.
            // )/2.+0.5
        )*4.+2.;  // 2 ~ 6
    color.rgb += vec3(length(mod_p-vec2(0.5, 0.5)) * radius_mul);

    gl_FragColor = color;
}