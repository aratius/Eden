import { LinearFilter, Material, Mesh, MeshBasicMaterial, NearestFilter, OrthographicCamera, PlaneBufferGeometry, Renderer, RGBFormat, Scene, ShaderMaterial, SphereBufferGeometry, Texture, Vector2, WebGLRenderer, WebGLRenderTarget } from "three";
import FeedbackMaterialBase from "./material/feedbackMaterialBase";

/**
 * 毎フレームテクスチャを受け取り自身のテクスチャを更新するRenderTarget
 */
export default class FeedbackRT {

	private _renderTarget: WebGLRenderTarget = null
	private _rtCamera: OrthographicCamera = null
	private _rtScene: Scene = new Scene()
	private _planeMaterial: FeedbackMaterialBase = null
	private _plane: Mesh = null

	constructor(size: Vector2, material: FeedbackMaterialBase) {

		this._renderTarget = new WebGLRenderTarget(size.x, size.y, {
			minFilter: LinearFilter,
			magFilter: NearestFilter,
			format: RGBFormat
		})
		this._rtScene = new Scene()
		this._rtCamera = new OrthographicCamera(-size.x/2, size.x/2, size.y/2, -size.y/2)
		this._rtCamera.position.setZ(10)

		// テクスチャ保存のためのPlane
		const geo = new PlaneBufferGeometry(1, 1, 1, 1)
		this._planeMaterial = material
		this._planeMaterial.needsUpdate = true
		this._plane = new Mesh(geo, this._planeMaterial)
		this._plane.scale.set(size.x, size.y, 1)
		this._rtScene.add(this._plane)
	}

	/**
	 * テクスチャ
	 */
	public get texture(): Texture {
		return this._renderTarget.texture
	}

	public deInit(): void {
		this._renderTarget.dispose();
		(this._plane.material as Material).dispose();
		this._rtScene.remove(this._plane)
	}

	/**
	 * レンダリング
	 * @param renderer
	 */
	public render(renderer: WebGLRenderer): void {
		renderer.setRenderTarget(this._renderTarget)
		renderer.render(this._rtScene, this._rtCamera)
		renderer.setRenderTarget(null)
	}

	/**
	 * uniformでわたすテクスチャを更新
	 * @param uniformName
	 * @param val
	 */
	public setUniform<T>(uniformName: string, val: T): void {
		if(!(uniformName in this._planeMaterial.uniforms)) console.error("uniform does not exist in this._planeMaterial");
		this._planeMaterial.uniforms[uniformName].value = val
	}

	public resize(size: Vector2): void {
		this._rtCamera.left = -size.x/2
		this._rtCamera.right = size.x/2
		this._rtCamera.top = size.x/2
		this._rtCamera.bottom = -size.x/2
		this._rtCamera.updateProjectionMatrix()

		this._renderTarget.setSize(size.x, size.y)

		this._plane.scale.set(size.x, size.y, 1)
	}

	public setTime(time: number): void {
		this._planeMaterial.setTime(time)
	}

}