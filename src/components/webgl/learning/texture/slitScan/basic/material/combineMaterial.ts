import { Texture } from "three";
import FeedbackMaterialBase from "./feedbackMaterialBase";

/**
 * 古いものと新しいものを結合してTime machineを作成
 */
export default class CombineMaterial extends FeedbackMaterialBase {

  constructor(fragmentShader: string, vertexShader: string) {
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