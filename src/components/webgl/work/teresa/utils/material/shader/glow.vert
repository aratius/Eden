varying vec3 v_normal;
varying vec4 v_world_pos;
varying float v_alpha;

#include <fog_pars_vertex>
void main() {
    v_normal = normal;
    vec4 world_pos = modelMatrix * vec4( position, 1.0 );
    v_world_pos = world_pos;
    v_alpha = -(1./(3000. - 1800.)) * distance(world_pos.xyz, cameraPosition) + 1800. * (1./(3000. - 1800.));

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
    #include <fog_vertex>
}