import { AdditiveBlending, BackSide, ShaderMaterial, Vector3 } from "three";
import fragShader from "./shader/glow.frag"
import vertShader from "./shader/glow.vert"

export default class GlowMaterial extends ShaderMaterial {

    constructor() {
        super({
            uniforms: {
                u_cam_pos: {value: new Vector3()}
            },
            fragmentShader: fragShader,
            vertexShader: vertShader,
            transparent: true,
            blending: AdditiveBlending,
            side: BackSide
        })
    }

}