varying vec2 v_uv;
uniform vec2 u_res;

float circle(vec2 p, float r) {
    return length(p) < r ? 1.0 : 0.0;
}

void main () {
    vec2 position = (gl_FragCoord.xy * 2.0 - u_res.xy) / min(u_res.x, u_res.y);
    vec3 color = vec3(circle(position, 0.5));

    gl_FragColor = vec4(color, 1.0);
}