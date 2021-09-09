import { Vector2 } from "three";

/**
 * マウスのモデルクラス
 */
export default class Mouse extends Vector2 {

	constructor(x: number, y: number) {
		super(x, y)
	}

	/**
	 * スクリーン座標を画面中心基準の座標に変換
	 * @param pos
	 * @returns
	 */
	get basedCenterPosition(): Vector2 {
		// y軸反転（上方向正）
		return new Vector2(this.x - window.innerWidth/2, -(this.y - window.innerHeight/2))
	}

	/**
	 * ポジションセット
	 * @param x
	 * @param y
	 */
	public setPosition(x: number, y: number) {
		this.x = x
		this.y = y
	}

}