uniform mat4 textureMatrix;
uniform float time;
varying vec4 mirrorCoord;
varying vec4 worldPosition;
#include <common>
#include <fog_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
void main() {
    mirrorCoord = modelMatrix * vec4( position, 1.0 );
    worldPosition = mirrorCoord.xyzw;
    mirrorCoord = textureMatrix * mirrorCoord;
    vec3 pos = position;
    // 波打つ
    pos.z += sin(pos.x*0.3+time*3.)*0.3 + sin(pos.y*0.1+time*3.)*0.5;
    vec4 mvPosition =  modelViewMatrix * vec4( pos, 1.0 );
    gl_Position = projectionMatrix * mvPosition;
#include <beginnormal_vertex>
#include <defaultnormal_vertex>
#include <logdepthbuf_vertex>
#include <fog_vertex>
#include <shadowmap_vertex>
}