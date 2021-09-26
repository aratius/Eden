import { Mesh, MeshBasicMaterial, MeshPhongMaterial, SphereBufferGeometry } from "three";

export default class Human extends Mesh {

	constructor() {
		const geo: SphereBufferGeometry = new SphereBufferGeometry(1, 40, 25)
		const mat: MeshPhongMaterial = new MeshPhongMaterial({color: 0xff0000})

		super(geo, mat)
	}

}