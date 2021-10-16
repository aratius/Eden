import { BufferAttribute, BufferGeometry, DataTexture, PlaneBufferGeometry, Points, PointsMaterial, Vector2 } from "three";
import { CameraSettings, RendererSettings } from "../../../interfaces";
import WebGLCanvasBase from "../../../utils/template/template";
import ParticlePlaneMaterial from "./material/particlePlaneMat";
import { GPUComputationRenderer, Variable } from "three/examples/jsm/misc/GPUComputationRenderer"
import computeShaderPosition from "./material/shader/computeShaderPosition.frag"

export default class WebGLGPGPUBasic extends WebGLCanvasBase {

	private readonly size: Vector2 = new Vector2(500, 500)
	private readonly particleNum: number = this.size.x * this.size.y
	private particlePlane: Points = null
	private gpuCompute: GPUComputationRenderer = new GPUComputationRenderer(this.size.x, this.size.y, this.renderer)
	private positionVariable: Variable = null

	constructor(canvas: HTMLCanvasElement, renderer: RendererSettings, camera: CameraSettings) {
		super(canvas, renderer, camera)

	}

	_onInit(): void {
		this.renderer.setClearColor(0x000000)

		// this.initParticle()
		this.initComputationRenderer()
		this.initParticle()

		this.endLoading()
	}

	_onDeInit(): void {

	}

	_onResize(): void {

	}

	_onUpdate(): void {
		// 計算
		this.gpuCompute.compute();

		(<ParticlePlaneMaterial>this.particlePlane.material).uniforms.u_texture_position.value = this.gpuCompute.getCurrentRenderTarget(this.positionVariable).texture

	}

	/**
	 * テクスチャをfillする
	 * NOTE: 最初の一回だけ？
	 * @param texturePosition
	 */
	private fillTexture(texturePosition: DataTexture): void {
		// テクスチャのイメージデータを一旦取り出す
		const posArray: Uint8ClampedArray = texturePosition.image.data

		for(let k = 0, kl = posArray.length; k < kl; k+=4) {
			let x, y, z
			x = Math.random() * 500 - 250
			y = 0
			z = Math.random() * 500 - 250

			// posArrayの形式=一次元配列に変換
			posArray[k+0] = x
			posArray[k+1] = y
			posArray[k+2] = z
			posArray[k+3] = 0

		}
	}

	/**
	 * GPUCompute用のテクスチャを初期化
	 */
	private initComputationRenderer(): void {

		// 移動方向を保存するテクスチャ
		const dtPosition: DataTexture = this.gpuCompute.createTexture()
		this.fillTexture(dtPosition)

		// shaderプログラムのアタッチ
		this.positionVariable = this.gpuCompute.addVariable("texturePosition", computeShaderPosition, dtPosition)

		// 関係性を構築する
		this.gpuCompute.setVariableDependencies(this.positionVariable, [this.positionVariable])

		this.gpuCompute.init()
	}

	/**
	 * パーティクル初期化
	 */
	private initParticle(): void {
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

		const material: ParticlePlaneMaterial = new ParticlePlaneMaterial()
		material.extensions.drawBuffers = true
		this.particlePlane = new Points(geometry, material)
		this.particlePlane.matrixAutoUpdate = false
		this.particlePlane.updateMatrix()

		this.group2d.add(this.particlePlane)
	}

}