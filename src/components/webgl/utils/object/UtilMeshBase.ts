import { BufferGeometry, Euler, Material, Mesh, Quaternion, ShaderMaterial, Vector3 } from "three";

/**
 * meshの参照を持ち、かつ[Classname].mesh.positionと書くのはだるいのでthis.positionにthis.mesh.positionの参照を渡し、meshを対象にするのと変わらず使えるようなクラス
 * それプラス継承先で個々のモデルを設計する
 */
export default abstract class UtilMeshBase extends Mesh {

	constructor(geo: BufferGeometry, mat: Material) {
		super(geo, mat)
	}

	/**
	 * 継承先クラスでオーバーライド必須
	 */
	static meshType = "hoge"

}