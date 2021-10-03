varying vec2 v_uv;

const float x_segment = 100.;
const float y_segment = 50.;

void main() {

    vec2 p = v_uv * vec2(x_segment, y_segment);
    vec2 mod_p = vec2(mod(p.x, 1.), mod(p.y, 1.));

    vec4 color = vec4(vec3(0.), 1.);
    color.rgb += vec3(step(mod_p.x, 0.03));
    color.rgb += vec3(step(mod_p.y, 0.03));

    gl_FragColor = color;
}