import { Vector2 } from "three";
import platform from "platform";

export class CanvasSize {
	public static get size(): Vector2 {
		// NOTE: cpu architecture で分岐？
		// console.log(platform);
		if(process.browser) {
			const w = window.innerWidth
			const h = window.innerHeight
			return new Vector2(w, h)
		} else {
			return new Vector2(1280, 720)
		}

	}
}
