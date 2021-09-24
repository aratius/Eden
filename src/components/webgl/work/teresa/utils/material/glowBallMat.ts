import { ShaderMaterial, Vector3 } from "three";
import fragShader from "./shader/glowBall.frag"
import vertShader from "./shader/glowBall.vert"

export default class GlowBallMaterial extends ShaderMaterial {

    constructor() {
        super({
            uniforms: {
                u_cam_pos: {value: new Vector3()}
            },
            fragmentShader: fragShader,
            vertexShader: vertShader
        })
    }

}