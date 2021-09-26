import { BufferGeometry, Group, InstancedBufferGeometry, Line, LineBasicMaterial, Mesh, PointLight, SphereBufferGeometry, Vector3 } from "three";
import BallMaterial from "./material/ballMat";
import GlowMaterial from "./material/glowMat";

/**
 * referred to https://www.youtube.com/watch?v=vM8M4QloVL0
 */
export default class GlowBall extends Group {

	private ball: Mesh
	private glow: Mesh

	constructor(geo: InstancedBufferGeometry) {
		super()

		const ballMat: BallMaterial = new BallMaterial()
		this.ball = new Mesh(geo, ballMat)
		this.add(this.ball)

		const glowMat: GlowMaterial = new GlowMaterial()
		this.glow = new Mesh(geo, glowMat)
		// this.glow.scale.multiplyScalar(2)
		this.add(this.glow)

		const points: Vector3[] = [
			new Vector3(0, 0, 0),
			new Vector3(0, 100, 0)
		]
		const lineGeo: BufferGeometry = new BufferGeometry().setFromPoints(points)
		const lineMat: LineBasicMaterial = new LineBasicMaterial({color: 0x444444, transparent: true, opacity: 0.5})
		const line: Line = new Line(lineGeo, lineMat)
		this.add(line)
	}



}