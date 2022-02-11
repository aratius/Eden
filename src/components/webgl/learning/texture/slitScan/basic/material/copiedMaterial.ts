import { Texture } from "three";
import FeedbackMaterialBase from "./feedbackMaterialBase";
import fragmentShader from "./shader/copy.frag";
import vertexShader from "./shader/allVertex.vert";


/**
 * フレームを一度保持する
 */
export default class CopiedMaterial extends FeedbackMaterialBase {

  constructor() {
    super({
      fragmentShader,
      vertexShader,
      uniforms: {
        u_copied_texture: { value: new Texture() }
      }
    })
  }

}