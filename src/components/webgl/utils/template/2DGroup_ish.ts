import { Euler, Group, Raycaster, Vector2, Vector3 } from "three";
import MainCamera from "./camera";

/**
 * 2Dのように振る舞うGroup
 * UpdateごとにCameraに正対した角度、vec3(0)でスクリーン座標を一致する場所に移動する
 */
export default class Group2D_ish extends Group {

	private camera: MainCamera = null

	constructor(camera: MainCamera) {
		super()

		this.camera = camera
	}

	/**
	 * NOTE: Vec3 positions got from raycast at decided distance
	 */
	 private get getPositionBasedOnCamera(): Vector3 {
		// カメラの位置, 回転角, 基本のperspectiveをみて位置決定
		// デフォルトでセットしているポジションも変換してあげたい
		const raycaster = new Raycaster()

		// -1 ~ 1 に正規化されたスクリーン座標を渡さないといけないので中心は強制で0, 0になる
		const screenCenter: Vector2 = new Vector2(0, 0)

		// カメラ基準でrayを飛ばす
		raycaster.setFromCamera(screenCenter, this.camera)

		// dist1d離れた点を取得し、pにコピーする
		const p = new Vector3(0,0,0)
		raycaster.ray.at(MainCamera.perspective, p)

		return p
	}

	/**
	 * NOTE: Euler angles to face to face camera
	 * @returns
	 */
	private get getRotationBasedOnCamera(): Euler {
		return new Euler(this.camera.rotation.x, this.camera.rotation.y, this.camera.rotation.z)
	}

	/**
	 * NOTE: update group position to act like 2d screen
	 */
	public update(): void {
		const pos: Vector3 = this.getPositionBasedOnCamera
		this.position.set(pos.x, pos.y, pos.z)
		const rot: Euler = this.getRotationBasedOnCamera
		this.rotation.set(rot.x, rot.y, rot.z)
	}

}