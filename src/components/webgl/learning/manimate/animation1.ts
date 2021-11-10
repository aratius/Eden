import gsap from "gsap";
import { Color, Group, MeshBasicMaterial, PlaneGeometry, Vector2, Vector3 } from "three";
import Plane2D_ish from "../../utils/object/2DPlane_ish";
import AnimationBase from "./animation";
import MyMat from "./mat";

export default class Animation1 extends AnimationBase {

    animation: GSAPTimeline[] = []

    constructor() {
        super()
    }

    async animate1() {
        const target = this.planes[0]
        target.position.set(0,0,0)
        target.scale.multiplyScalar(2);
        (<MyMat>this.planes[0].material).alpha = 1;
        (<MyMat>this.planes[0].material).uniforms.u_anim_type.value = 3;
        this.animation[0] = gsap.timeline().delay(0.5)
        this.animation[0].to((<MyMat>target.material).uniforms.u_appear, {value: 1, duration: 1, ease: "back.in"}, 0)
    }

    async animate2() {
        // 言われてたやつ
        for(let i = 0; i < this.planes.length; i++) {
            (<MyMat>this.planes[i].material).alpha = 0
            const targetPos: Vector3 = this.planes[i].position.clone()
            const targetScale: Vector3 = this.planes[i].scale.clone()
            if(this.animation[i] != null) this.animation[i].kill()
            this.animation[i] = gsap.timeline().delay(0.8*i)
            this.animation[i].to(this.planes[i].material, {alpha: 1, duration: 0.4}, 0)
            this.animation[i].fromTo(this.planes[i].scale, {x: targetScale.x * 2, y: targetScale.y * 2}, {x: targetScale.x, y: targetScale.y, duration: 0.4, ease: "bounce.out"}, 0)
            this.animation[i].fromTo(this.planes[i].position, {x: 0, y: 0}, {x: targetPos.x, y: targetPos.y, duration: 0.5, delay: 0.5}, 0)
        }
    }

    async animate3() {
        // カードシャッフル
        for(let i = 0; i < this.planes.length; i++) {
            (<MyMat>this.planes[i].material).alpha = 0
            if(this.animation[i] != null) this.animation[i].kill()
            this.animation[i] = gsap.timeline().delay(0.1*i)
            const fromPos: Vector3 = this.planes[i].position.clone().sub(this.planes[i].position.clone().multiplyScalar(0.9))
            this.animation[i].to(this.planes[i].material, {alpha: 1, duration: 0.4}, 0)
            this.animation[i].from(this.planes[i].position, {x: fromPos.x, y: fromPos.y, duration: 0.5}, 0)
        }
    }

    async animate4() {
        for(let i = 0; i < this.planes.length; i++) {
            const xFrom: number = i % 2 == 0 ? 30 : -30;
            const yFrom: number = i % 2 == 0 ? 30 : -30;
            (<MyMat>this.planes[i].material).alpha = 0
            if(this.animation[i] != null) this.animation[i].kill()
            this.animation[i] = gsap.timeline().delay(0.1*i)
            this.animation[i].to(this.planes[i].material, {alpha: 1, duration: 0.4}, 0)
            this.animation[i].from(this.planes[i].position, {x: `+=${xFrom}`, y: `+=${yFrom}`, duration: 0.5}, 0)
        }
    }

    async animate5() {
        const target = this.planes[0]
        target.position.set(0,0,0)
        target.scale.multiplyScalar(2);
        (<MyMat>this.planes[0].material).alpha = 1;
        (<MyMat>this.planes[0].material).uniforms.u_anim_type.value = 1;
        this.animation[0] = gsap.timeline()
        this.animation[0].to((<MyMat>target.material).uniforms.u_appear, {value: 1, duration: 0.4}, 0)
    }

    async animate6() {
        const target = this.planes[0]
        target.position.set(0,0,0)
        target.scale.multiplyScalar(2);
        (<MyMat>this.planes[0].material).alpha = 1;
        (<MyMat>this.planes[0].material).uniforms.u_anim_type.value = 2;
        this.animation[0] = gsap.timeline()
        this.animation[0].to((<MyMat>target.material).uniforms.u_appear, {value: 1, duration: 2, ease: "linear"}, 0)
    }

}