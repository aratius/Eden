uniform mat4 textureMatrix;
uniform float time;
varying vec4 mirrorCoord;
varying vec4 worldPosition;

// 0-1に収める
float fit_0_1(float val) {
	return max(min(val, 1.), 0.);
}

#include <common>
#include <fog_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
void main() {
    mirrorCoord = modelMatrix * vec4( position, 1.0 );
    worldPosition = mirrorCoord.xyzw;
    mirrorCoord = textureMatrix * mirrorCoord;
    float distFromCenter = length(worldPosition.xyz);
    vec3 pos = position;
    // 波打つ
    pos.z += sin(pos.x*0.3+time*1.)*0.15 +
        sin(pos.y*0.1+time*1.)*0.15 * fit_0_1(((100.-distFromCenter)/100.));
    vec4 mvPosition =  modelViewMatrix * vec4( pos, 1.0 );
    gl_Position = projectionMatrix * mvPosition;
#include <beginnormal_vertex>
#include <defaultnormal_vertex>
#include <logdepthbuf_vertex>
#include <fog_vertex>
#include <shadowmap_vertex>
}