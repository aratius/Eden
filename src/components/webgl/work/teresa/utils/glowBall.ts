import { Group, Mesh, SphereBufferGeometry } from "three";
import BallMaterial from "./material/ballMat";
import GlowMaterial from "./material/glowMat";
import GlowBallMaterial from "./material/glowMat";

/**
 * referred to https://www.youtube.com/watch?v=vM8M4QloVL0
 */
export default class GlowBall extends Group {

	private ball: Mesh
	private glow: Mesh

	constructor() {
		super()

		const geo: SphereBufferGeometry = new SphereBufferGeometry(1, 40, 25)

		const ballMat: BallMaterial = new BallMaterial()
		this.ball = new Mesh(geo, ballMat)
		this.add(this.ball)

		const glowMat: GlowMaterial = new GlowMaterial()
		this.glow = new Mesh(geo, glowMat)
		this.glow.scale.multiplyScalar(2)
		this.add(this.glow)

	}



}