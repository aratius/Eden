import { Vector2 } from "three";
import { CanvasSize } from "../../config/config";

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
	public get basedCenterPosition(): Vector2 {
		// y軸反転（上方向正）
		return new Vector2(this.x - window.innerWidth/2, -(this.y - window.innerHeight/2))
	}

	/**
	 * CSSでレスポンシブなCanvasのうえでも正常なCanvasMousePositionを
	 */
	public get positionOnCanvas(): Vector2 {
		const mouseCanvasPos: Vector2 = new Vector2()
		const winAsp: number = window.innerWidth / window.innerHeight
		const canAsp: number = CanvasSize.size.x / CanvasSize.size.y
		// height fix で横隠れながら広がっていくとき
		if(winAsp < canAsp) {
			const canScl: number = CanvasSize.size.y / window.innerHeight
			const hideX: number = (CanvasSize.size.x - (canScl * window.innerWidth)) / 2
			const x: number = hideX + canScl * this.x
			mouseCanvasPos.x = x
			mouseCanvasPos.y = canScl * this.y
		} else {
			const canScl: number = CanvasSize.size.x / window.innerWidth
			const hideY: number = (CanvasSize.size.y - (canScl * window.innerHeight)) / 2
			const y: number = hideY + canScl * this.y
			mouseCanvasPos.y = y
			mouseCanvasPos.x = canScl * this.x
		}
		return mouseCanvasPos
	}

	public get positionForRaycast(): Vector2 {
		return new Vector2((this.positionOnCanvas.x / CanvasSize.size.x)*2-1, -(this.positionOnCanvas.y / CanvasSize.size.y)*2+1)
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