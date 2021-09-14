import { BufferGeometry, Material, Mesh } from "three";


export default class Splash extends Mesh {

    constructor (geo: BufferGeometry, mat: Material) {
        super(geo, mat)
    }

}