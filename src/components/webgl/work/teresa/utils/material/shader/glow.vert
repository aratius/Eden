varying vec3 v_normal;
varying vec4 v_world_pos;

void main() {
    v_normal = normal;
    v_world_pos = modelMatrix * vec4( position, 1.0 );

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
}