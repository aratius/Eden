import { Texture } from "three";
import FeedbackMaterialBase from "./feedbackMaterialBase";
import fragmentShader from "./shader/timeMap.frag";
import vertexShader from "./shader/allVertex.vert";


/**
 * フレームを一度保持する
 */
export default class TimeMapMaterial extends FeedbackMaterialBase {

  constructor() {
    super({
      fragmentShader,
      vertexShader,
    })
  }

}