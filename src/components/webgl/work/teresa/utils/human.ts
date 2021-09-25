import { Mesh, MeshBasicMaterial, SphereBufferGeometry } from "three";

export default class Human extends Mesh {

	constructor() {
		const geo: SphereBufferGeometry = new SphereBufferGeometry(1, 40, 25)
		const mat: MeshBasicMaterial = new MeshBasicMaterial({color: 0xffffff})

		super(geo, mat)
	}

}