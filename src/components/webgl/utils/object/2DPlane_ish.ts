import { BufferGeometry, Euler, Material, Mesh, PlaneGeometry, ShaderMaterial, Vector2, Vector3 } from "three";
import UtilMeshBase from "./UtilMeshBase";
import { CanvasSize } from "../../config/config";
import gsap from "gsap";

/**
 * 3D空間の中の2D風Plane
 * モデルクラス的な感じ
 */
export default class Plane2D_ish extends UtilMeshBase{

	static meshType = "plane2D"
	private textureSize: Vector2
	private fadeTween: GSAPTween = null

	constructor(geo: BufferGeometry, mat: Material, textureSize: Vector2) {
		super(geo, mat)
		this.textureSize = textureSize
	}

	/**
	 * Plane2Dのメッシュインスタンス返す
	 * @param position
	 * @param rotation
	 * @param scale
	 * @param material
	 * @returns
	 */
	public static create(
		position: Vector3,
		rotation: Euler,
		material: Material
	): Mesh
	{
		const geo: PlaneGeometry = new PlaneGeometry(1, 1)
		const mat: Material = material
		const mesh = new Mesh(geo, mat)
		mesh.position.set(position.x, position.y, position.z)
		mesh.rotation.set(rotation.x, rotation.y, rotation.z)
		const scl = mesh.scale
		mesh.scale.set(scl.x, scl.y, scl.z)
		mesh.type = this.meshType

		return mesh
	}

	/**
	 * 画面を覆うサイズ
	 */
	public get coveredScreenSize(): Vector2 {
		const tex: Vector2 = this.textureSize
		const win: Vector2 = new Vector2(CanvasSize.size.x, CanvasSize.size.y)
		const texAsp: number = tex.x / tex.y
		const winAsp: number = win.x / win.y

		// テクスチャのアスペクト比とウィンドウのアスペクト比を比べて、wかhどちらかで正規化
		const normalizedSize: Vector2 = tex.divideScalar(winAsp > texAsp ? tex.x : tex.y)
		const scale: number = winAsp > texAsp ? win.x : win.y

		return normalizedSize.multiplyScalar(scale)
	}

	/**
	 * 高さ指定で幅はテクスチャの比率から自動セット
	 * @param width
	 */
	public setWidth(width: number): void {
		const height: number = width * this.textureSize.y / this.textureSize.width
		this.scale.set(width, height, 1)
	}

	/**
	 * 高さ指定で幅はテクスチャの比率から自動セット
	 * @param height
	 */
	public setHeight(height: number): void {
		const width: number = height * this.textureSize.x / this.textureSize.height
		this.scale.set(width, height, 1)
	}

	/**
	 * 画面を覆うサイズに設定
	 */
	public extendFullScreen() {
		this.scale.set(this.coveredScreenSize.x, this.coveredScreenSize.y, 1)
	}

	/**
	 * alphaをセット
	 */
	public applyAlpha(alpha: number): void {
		(<ShaderMaterial>this.material).uniforms.u_alpha.value = alpha
	}

	/**
	 * 明るさを設定
	 */
	public applyBrightness(brightness: number): void {
		(<ShaderMaterial>this.material).uniforms.u_brightness.value = brightness
	}

	public doFadeTween(val: number, duration: number, delay: number, ease: string): GSAPTween {
		if(this.fadeTween != null) this.fadeTween.kill()
		this.fadeTween = gsap.to((<ShaderMaterial>this.material).uniforms.u_alpha, {value: val, duration: duration, delay: delay, ease: ease})
		return this.fadeTween
	}

	/**
	 * uniform値を初期化
	 */
	public initUniforms(): void {
		if(!(this.material instanceof ShaderMaterial)) return
		const crossFade: ShaderMaterial = (<ShaderMaterial>this.material)
		crossFade.uniforms.u_texture_alpha.value = 0
		crossFade.uniforms.u_cross_fade.value = 1
	}

}