varying vec3 v_normal;
varying vec4 v_world_pos;
// varying float v_alpha;

void main() {
    // カメラに対してリムライティング
    float glow = dot(v_normal, normalize(cameraPosition - v_world_pos.xyz));

    gl_FragColor = vec4(vec3(1.), pow(glow, 4.));
}