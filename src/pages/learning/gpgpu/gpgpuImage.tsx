import { Component, ReactElement } from 'react'
import styles from '../../../styles/layout/top/top.module.scss'
import _Head from '../../../components/next/common/head'
import WebGLGPGPUImage from '../../../components/webgl/learning/gpgpu/image/basic'

interface Props {

}

export default class Index extends Component<Props> {

	private canvas: WebGLGPGPUImage = null

	constructor(props: Props) {
		super(props)
		process.browser && window.addEventListener("wheel", (e) => e.preventDefault(), {passive: false})
	}

    	/**
	 * canvasセットアップ
	 */
	private onReadyCanvas = (node: HTMLCanvasElement): void => {
		if(!node) return
		this.canvas = new WebGLGPGPUImage(node, null, null)
		this.canvas.init()
	}

	render (): ReactElement {
		return (
			<>
                {/* <_Head
                    title="gpgpu"
                    ogUrl="https://eden.aualrxse.com/learning/gpgpu/basic"
                    ogImgPath="https://eden.aualrxse.com/og/ocean/og.png"
                    description=""
                ></_Head> */}
				<div className={styles.container}>
					<canvas
						className={styles.canvas}
						id="canvas"
						ref={this.onReadyCanvas}
						width="1920"
						height="1080"
					></canvas>
				</div>
			</>
		)
	}

}