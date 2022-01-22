import { BufferAttribute, BufferGeometry, DataTexture, PlaneBufferGeometry, Points, PointsMaterial, Texture, Vector2, Vector3 } from "three";
import { CameraSettings, RendererSettings } from "../../../interfaces";
import WebGLCanvasBase from "../../../utils/template/template";
import ParticlePlaneMaterial from "./material/particlePlaneMat";
import { GPUComputationRenderer, Variable } from "three/examples/jsm/misc/GPUComputationRenderer"
import computeShaderPosition from "./material/shader/computeShaderPosition.frag"
import computeShaderVelocity from "./material/shader/computeShaderVelocity.frag"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass"
import { AfterimagePass } from "three/examples/jsm/postprocessing/AfterimagePass"

export default class WebGLGPGPUBubble extends WebGLCanvasBase {

	private readonly size: Vector2 = new Vector2(20, 20)
	private readonly particleNum: number = this.size.x * this.size.y
	private particlePlane: Points = null
	private gpuCompute: GPUComputationRenderer = new GPUComputationRenderer(this.size.x, this.size.y, this.renderer)
	private positionVariable: Variable = null
	private velocityVariable: Variable = null
	private lastMousePosition: Vector2 = new Vector2(0, 0)

	constructor(canvas: HTMLCanvasElement, renderer: RendererSettings, camera: CameraSettings) {
		super(canvas, renderer, camera)
	}

	_onInit(): void {
		this.renderer.setClearColor(0x000000)

		this.initComputationRenderer()
		this.initParticle()

		this.lastMousePosition = this.mouse.basedCenterPosition.clone()

		const bloomPass: UnrealBloomPass = new UnrealBloomPass(new Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85)
		bloomPass.threshold = 0
		bloomPass.strength = 1.5
		bloomPass.radius == 0
		this.composer.addPass(bloomPass)

		this.composer.addPass(new AfterimagePass(0.9))

		this.endLoading()
	}

	_onDeInit(): void {

	}

	_onResize(): void {

	}

	_onUpdate(): void {
		this.velocityVariable.material.uniforms.u_time = {value: this.elapsedTime}
		this.velocityVariable.material.uniforms.u_mouse_position = {value: this.mouse.basedCenterPosition}

		const mouseSpeed: Vector2 = this.mouse.basedCenterPosition.clone().sub(this.lastMousePosition.clone())
		this.velocityVariable.material.uniforms.u_mouse_speed = {value: mouseSpeed}
		this.lastMousePosition = this.mouse.basedCenterPosition.clone()

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
			// 本来の座標
			// 初期位置バラすためにここでバラす
			x = (Math.random()-0.5) * 1000.
			y = (Math.random()-0.5) * 1000.
			z = (Math.random()-0.5) * 2000.

			// posArrayの形式=一次元配列に変換
			posArray[k+0] = x
			posArray[k+1] = y
			posArray[k+2] = z
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
			for(let j = 0; j < this.size.y; j++) {
				uvs[p++] = j / (this.size.y - 1)
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