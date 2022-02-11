import { ShaderMaterial } from "three";

export default class FeedbackMaterialBase extends ShaderMaterial {

  constructor(config: any) {
    super({
      ...config,
      uniforms: {
        ...config.uniforms,
        u_time: {value: 0}
      }
    })
  }

  public setTime(time: number) {
    this.uniforms.u_time.value = time
  }

}