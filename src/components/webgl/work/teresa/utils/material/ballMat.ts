import { ShaderMaterial, Vector3 } from "three";
import fragShader from "./shader/ball.frag"
import vertShader from "./shader/ball.vert"

export default class BallMaterial extends ShaderMaterial {

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