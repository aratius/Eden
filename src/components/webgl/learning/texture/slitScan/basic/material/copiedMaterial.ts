import { Texture } from "three";
import FeedbackMaterialBase from "./feedbackMaterialBase";

/**
 * フレームを一度保持する
 */
export default class CopiedMaterial extends FeedbackMaterialBase {

  constructor(fragmentShader: string, vertexShader: string) {
    super({
      fragmentShader,
      vertexShader,
      uniforms: {
        u_copied_texture: { value: new Texture() }
      }
    })
  }

}