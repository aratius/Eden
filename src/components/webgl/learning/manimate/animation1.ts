import gsap from "gsap";
import { Color, Group, MeshBasicMaterial, PlaneGeometry, Vector2, Vector3 } from "three";
import Plane2D_ish from "../../utils/object/2DPlane_ish";
import AnimationBase from "./animation";

export default class Animation1 extends AnimationBase {

    constructor() {
        super()
    }

    animate() {
        for(let i = 0; i < this.planes.length; i++) {
            const posFrom: Vector3 = this.planes[i].position.clone().sub(this.planes[i].position.clone().normalize().multiplyScalar(10))
            gsap.from(this.planes[i].position, {x: posFrom.x, y: posFrom.y, duration: 0.6, ease: "expo.out", delay: i*0.03})
            gsap.to(this.planes[i].material, {opacity: 1, duration: 0.6, delay: i*0.03})
        }
    }

}