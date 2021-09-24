varying vec2 v_uv;
varying vec3 v_normal;
varying vec4 v_world_pos;

void main() {

    // カメラに対してリムライティング
    float intensity = 1.05 - dot(v_normal, normalize(cameraPosition - v_world_pos.xyz));
    vec3 glow = vec3(0.5, 0.5, 0.5) * pow(intensity, 1.5);

    gl_FragColor = vec4(glow + vec3(0.8), 1.);
}