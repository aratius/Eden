import { ShaderMaterial, Vector3 } from "three";
import fragShader from "./shader/ball.frag"
import vertShader from "./shader/ball.vert"

export default class BallMaterial extends ShaderMaterial {

    constructor() {
        super({
            uniforms: {
            },
            fragmentShader: fragShader,
            vertexShader: vertShader,
            transparent: true,
            // fog: true
        })
    }

}