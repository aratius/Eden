import { Group } from "three";

/**
 * シーンに属するMesh系のオブジェクトを一元管理し、好きなときに取り出せるようにするやつ
 * 初期化だけ行い、あとは
 */
export default abstract class ObjectManager extends Group {

	constructor() {
		super()

		// 相対位置を親と一致させる
		this.position.set(0, 0, 0)
		this.rotation.set(0, 0, 0)
		this.scale.set(1,1,1)
	}

	public async init(): Promise<void> {
		await this._onInit()
		return
	}

	abstract _onInit(): Promise<void>

}