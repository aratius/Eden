varying vec2 v_uv;
varying vec3 v_normal;
varying vec4 v_world_pos;

void main() {

    // カメラに対してリムライティング
    float intensity = 1.05 - dot(v_normal, normalize(cameraPosition - v_world_pos.xyz));
    vec3 glowness = vec3(0.3, 0.3, 0.3) * pow(intensity, 1.5);

    gl_FragColor = vec4(glowness + vec3(0.7), 1.);
}