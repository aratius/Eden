import { Mesh, MeshBasicMaterial, SphereBufferGeometry } from "three";

export default class GlowBall extends Mesh {

	constructor() {
		const geo: SphereBufferGeometry = new SphereBufferGeometry(1, 20, 10)
		const mat: MeshBasicMaterial = new MeshBasicMaterial({color: 0xffffff})

		super(geo, mat)
	}



}