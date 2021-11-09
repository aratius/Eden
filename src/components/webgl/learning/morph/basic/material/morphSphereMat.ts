import { DoubleSide, MultiplyOperation, ShaderMaterial } from "three";
import fragShader from "./shader/morph.frag"
import vertShader from "./shader/morph.vert"

export default class MorphSphereMaterial extends ShaderMaterial {

  constructor() {
    super({
      uniforms: {
        u_morph_amount: {value: 0}
      },
      fragmentShader: fragShader,
      vertexShader: vertShader,
      transparent: true,
      wireframe: false,
      side: DoubleSide,
    })


		this.map = null;

		this.lightMap = null;
		this.lightMapIntensity = 1.0;

		this.aoMap = null;
		this.aoMapIntensity = 1.0;

		this.specularMap = null;

		this.alphaMap = null;

		this.envMap = null;
		this.combine = MultiplyOperation;
		this.reflectivity = 1;
		this.refractionRatio = 0.98;

		this.wireframe = false;
		this.wireframeLinewidth = 1;
		this.wireframeLinecap = 'round';
		this.wireframeLinejoin = 'round';
  }

}