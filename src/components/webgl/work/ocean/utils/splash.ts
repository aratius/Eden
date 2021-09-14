import { BufferGeometry, Material, Mesh, PointsMaterial } from "three";
import { SplashMaterial } from "../../../utils/material/splashMat";

/**
 * 水しぶき
 */
export default class Splash extends Mesh {

    constructor (geo: BufferGeometry) {
        const mat: SplashMaterial = new SplashMaterial()
        super(geo, mat)
    }

}