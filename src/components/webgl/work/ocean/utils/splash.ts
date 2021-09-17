import { BufferGeometry, Material, Mesh, Points, PointsMaterial } from "three";
import { loadTexture } from "../../../utils";
import { SplashMaterial } from "../../../utils/material/splashMat";

/**
 * 水しぶき
 */
export default class Splash extends Points {

    constructor (geo: BufferGeometry) {
        const mat: SplashMaterial = new SplashMaterial()
        super(geo, mat)
        this.loadTexture()
    }

    private async loadTexture(): Promise<void> {
        (<SplashMaterial>this.material).uniforms.u_texture.value = await loadTexture("/assets/images/ocean/splash.png")
    }

}