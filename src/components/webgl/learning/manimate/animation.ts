import { Color, Group, MeshBasicMaterial, PlaneGeometry, Texture, Vector2, Vector3 } from "three";
import { loadTexture } from "../../utils";
import Plane2D_ish from "../../utils/object/2DPlane_ish";
import MyMat from "./mat";

export default class AnimationBase extends Group {

    planes: Plane2D_ish[] = []

    constructor() {
        super()
    }

    async init() {
        const geo: PlaneGeometry = new PlaneGeometry(1, 1)
        const tex: Texture = await loadTexture("/assets/images/m/combi.png")
        const getMat: () => MyMat = () => new MyMat(tex)

        for(let i = 0; i < 10; i++) {
            const plane = new Plane2D_ish(geo, getMat(), new Vector2(tex.image.width, tex.image.height))
            plane.scale.set(tex.image.width, tex.image.height, 1)
            plane.scale.divideScalar(8)
            this.planes.push(plane)
            this.add(plane)
        }
    }

    set(basePositions: Vector3[]) {
        for(const i in this.planes) {
            this.planes[i].position.set(basePositions[i].x, basePositions[i].y, basePositions[i].z)
        }
    }

}