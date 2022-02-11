import { LinearFilter, Mesh, NearestFilter, OrthographicCamera, PlaneBufferGeometry, Renderer, RGBFormat, Scene, ShaderMaterial, Texture, Vector2, WebGLRenderer, WebGLRenderTarget } from "three";
import FeedbackMaterialBase from "./material/feedbackMaterialBase";

/**
 * 毎フレームテクスチャを受け取り自身のテクスチャを更新するRenderTarget
 */
export default class FeedbackRT {

	private _renderTarget: WebGLRenderTarget = null
	private _rtCamera: OrthographicCamera = null
	private _rtScene: Scene = new Scene()
	private _planeMaterial: FeedbackMaterialBase = null

	constructor(size: Vector2, material: FeedbackMaterialBase) {
		this._planeMaterial = material

		this._renderTarget = new WebGLRenderTarget(size.x, size.y, {
			minFilter: LinearFilter,
			magFilter: NearestFilter,
			format: RGBFormat
		})
		this._rtScene = new Scene()
		this._rtCamera = new OrthographicCamera(-size.x/2, size.x/2, size.y/2, -size.y/2)

		// テクスチャ保存のためのPlane
		const geo = new PlaneBufferGeometry(size.x, size.y, 1, 1)
		const plane = new Mesh(geo, this._planeMaterial)
		this._rtScene.add(plane)
	}

	/**
	 * テクスチャ
	 */
	public get texture(): Texture {
		return this._renderTarget.texture
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
	 * @param texture
	 */
	public setTexture(uniformName: string, texture: Texture): void {
		if(!(uniformName in this._planeMaterial.uniforms)) console.error("uniform does not exist in this._planeMaterial");
		this._planeMaterial.uniforms[uniformName].value = texture
	}

}