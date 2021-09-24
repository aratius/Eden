import { Mesh, SphereBufferGeometry } from "three";
import GlowBallMaterial from "./material/glowBallMat";

export default class GlowBall extends Mesh {

	constructor() {
		const geo: SphereBufferGeometry = new SphereBufferGeometry(1, 20, 10)
		const mat: GlowBallMaterial = new GlowBallMaterial()

		super(geo, mat)
	}



}