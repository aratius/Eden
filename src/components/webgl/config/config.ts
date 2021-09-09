import { Vector2 } from "three";
import platform from "platform";

export class CanvasSize {
	public static get size(): Vector2 {
		// NOTE: cpu architecture で分岐？
		// console.log(platform);
		const w = 1280
		const h = 720

		return new Vector2(w, h)
	}
}
