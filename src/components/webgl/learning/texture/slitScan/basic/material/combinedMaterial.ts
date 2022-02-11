import { Texture } from "three";
import FeedbackMaterialBase from "./feedbackMaterialBase";
import fragmentShader from "./shader/combine.frag"
import vertexShader from "./shader/allVertex.vert"

/**
 * 古いものと新しいものを結合してTime machineを作成
 */
export default class CombinedMaterial extends FeedbackMaterialBase {

  constructor() {
    super({
      fragmentShader,
      vertexShader,
      uniforms: {
        u_current_texture: { value: new Texture() },
        u_old_texture: { value: new Texture() }
      }
    })
  }

}