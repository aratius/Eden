import { BufferAttribute, BufferGeometry, DataTexture, PlaneBufferGeometry, Points, PointsMaterial, Texture, Vector2 } from "three";
import { CameraSettings, RendererSettings } from "../../../interfaces";
import WebGLCanvasBase from "../../../utils/template/template";
import ParticlePlaneMaterial from "./material/particlePlaneMat";
import { GPUComputationRenderer, Variable } from "three/examples/jsm/misc/GPUComputationRenderer"
import computeShaderPosition from "./material/shader/computeShaderPosition.frag"
import computeShaderVelocity from "./material/shader/computeShaderVelocity.frag"
import { loadTexture } from "../../../utils";

export default class WebGLGPGPUImage extends WebGLCanvasBase {

	private readonly size: Vector2 = new Vector2(500, 500)
	private readonly particleNum: number = this.size.x * this.size.y
	private particlePlane: Points = null
	private gpuCompute: GPUComputationRenderer = new GPUComputationRenderer(this.size.x, this.size.y, this.renderer)
	private positionVariable: Variable = null
	private velocityVariable: Variable = null

	constructor(canvas: HTMLCanvasElement, renderer: RendererSettings, camera: CameraSettings) {
		super(canvas, renderer, camera)

	}

	_onInit(): void {
		this.renderer.setClearColor(0x000000)

		this.initComputationRenderer()
		this.initParticle()

		this.endLoading()
	}

	_onDeInit(): void {

	}

	_onResize(): void {

	}

	_onUpdate(): void {
		this.velocityVariable.material.uniforms.u_time = {value: this.elapsedTime}
		this.velocityVariable.material.uniforms.u_mouse_position = {value: this.mouse.basedCenterPosition}

		// 計算
		this.gpuCompute.compute();

		// pointsの頂点シェーダーに頂点位置計算テクスチャを渡す (速度テクスチャは位置計算テクスチャの中で消費されているのでここでは使用する必要なし)
		if(this.particlePlane != null) (<ParticlePlaneMaterial>this.particlePlane.material).uniforms.u_texture_position.value = (<any>this.gpuCompute.getCurrentRenderTarget(this.positionVariable)).texture
		if(this.particlePlane != null) (<ParticlePlaneMaterial>this.particlePlane.material).uniforms.u_time.value = this.elapsedTime
	}

	/**
	 * テクスチャをfillする
	 * NOTE: 最初の一回だけ？
	 * @param texturePosition
	 */
	private fillTexture(texturePosition: DataTexture, textureVelocity: DataTexture): void {
		// テクスチャのイメージデータを一旦取り出す
		const posArray: Uint8ClampedArray = texturePosition.image.data
		const velArray: Uint8ClampedArray = textureVelocity.image.data

		for(let k = 0, kl = posArray.length; k < kl; k+=4) {
			let x, y, z
			let i: number = k/4
			x = i % 500 - 250
			// x = (Math.random()-0.5) * 500
			y = Math.floor(i/500) - 250
			// z = Math.sin(Math.random() * 10) * 300

			// posArrayの形式=一次元配列に変換
			posArray[k+0] = x
			posArray[k+1] = y
			posArray[k+2] = 0
			posArray[k+3] = 0

			// 移動する方向はとりあえずランダムに決めてみる。
			// これでランダムな方向にとぶパーティクルが出来上がるはず。
			velArray[ k + 0 ] = 0;
			velArray[ k + 1 ] = 0;
			velArray[ k + 2 ] = 0;
			velArray[ k + 3 ] = 0;
		}
	}

	/**
	 * GPUCompute用のテクスチャを初期化
	 */
	private async initComputationRenderer(): Promise<void> {

		// 移動方向を保存するテクスチャ
		const dtPosition: DataTexture = this.gpuCompute.createTexture()
		const dtVelocity: DataTexture = this.gpuCompute.createTexture()

		this.fillTexture(dtPosition, dtVelocity)

		// shaderプログラムのアタッチ
		this.positionVariable = this.gpuCompute.addVariable("texturePosition", computeShaderPosition, dtPosition)
		this.velocityVariable = this.gpuCompute.addVariable("textureVelocity", computeShaderVelocity, dtVelocity)

		// 依存関係を構築する 依存し指定した変数はシェーダー内から参照可能
		this.gpuCompute.setVariableDependencies(this.positionVariable, [this.positionVariable, this.velocityVariable])
		this.gpuCompute.setVariableDependencies(this.velocityVariable, [this.positionVariable, this.velocityVariable])

		this.gpuCompute.init()

	}

	/**
	 * パーティクル初期化
	 */
	private async initParticle(): Promise<void> {
		const geometry: BufferGeometry = new BufferGeometry()
		const positions: Float32Array = new Float32Array(this.particleNum*3)
		let p: number = 0
		// 位置情報はShader側で決定するので、とりあえず適当に値を埋める
		for(let i = 0; i < this.particleNum; i++) {
			positions[p++] = 0
			positions[p++] = 0
			positions[p++] = 0
		}

	// uv情報 テクスチャから情報を取り出すときに必要
		const uvs: Float32Array = new Float32Array(this.particleNum * 2)
		p = 0
		for(let i = 0; i < this.size.x; i++) {
			for(let j = 0; j < this.size.x; j++) {
				uvs[p++] = j / (this.size.x - 1)
				uvs[p++] = i / (this.size.x - 1)
			}
		}

		// attribute登録
		geometry.setAttribute("position", new BufferAttribute(positions, 3))
		geometry.setAttribute("uv", new BufferAttribute(uvs, 2))

		const tex: Texture = await loadTexture("/assets/images/gpgpu/hello.png")

		const material: ParticlePlaneMaterial = new ParticlePlaneMaterial(tex)
		material.extensions.drawBuffers = true
		this.particlePlane = new Points(geometry, material)
		this.particlePlane.matrixAutoUpdate = false
		this.particlePlane.updateMatrix()

		this.group2d.add(this.particlePlane)
	}

}