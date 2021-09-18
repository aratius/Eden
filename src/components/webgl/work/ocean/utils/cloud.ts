import { BufferGeometry, Material, Mesh, Points, PointsMaterial } from "three";
import { loadTexture } from "../../../utils";
import { CloudMaterial } from "../../../utils/material/cloudMat";

/**
 * 水しぶき
 */
export default class Cloud extends Points {

    constructor (geo: BufferGeometry) {
        const mat: CloudMaterial = new CloudMaterial()
        super(geo, mat)
        this.loadTexture()
    }

    private async loadTexture(): Promise<void> {
        (<CloudMaterial>this.material).uniforms.u_texture.value = await loadTexture("/assets/images/ocean/fog.png")
    }

}