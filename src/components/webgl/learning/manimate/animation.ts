import { Color, Group, MeshBasicMaterial, PlaneGeometry, Vector2, Vector3 } from "three";
import Plane2D_ish from "../../utils/object/2DPlane_ish";

export default class AnimationBase extends Group {

    planes: Plane2D_ish[] = []

    constructor() {
        super()
    }

    init() {
        const geo: PlaneGeometry = new PlaneGeometry(1, 1)
        const getMat: () => MeshBasicMaterial = () => new MeshBasicMaterial({color: new Color(Math.random(), Math.random(), Math.random()), transparent: true, opacity: 0})

        for(let i = 0; i < 10; i++) {
            const plane = new Plane2D_ish(geo, getMat(), new Vector2(1, 1))
            plane.scale.set(50, 50, 50)
            this.planes.push(plane)
            this.add(plane)
        }
    }

    set(basePositions: Vector3[]) {
        for(const i in this.planes) {
            this.planes[i].position.set(basePositions[i].x, basePositions[i].y, basePositions[i].z)
        }
    }

    animate() {

    }

}