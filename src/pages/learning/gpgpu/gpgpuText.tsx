import { Component, ReactElement } from 'react'
import styles from '../../../styles/layout/top/top.module.scss'
import _Head from '../../../components/next/common/head'
import GPGPUText from '../../../components/webgl/learning/gpgpu/text/text'

interface Props {

}

export default class Index extends Component<Props> {

	private canvas: GPGPUText = null

	constructor(props: Props) {
		super(props)
		process.browser && window.addEventListener("wheel", (e) => e.preventDefault(), {passive: false})
	}

    	/**
	 * canvasセットアップ
	 */
	private onReadyCanvas = (node: HTMLCanvasElement): void => {
		if(!node) return
		this.canvas = new GPGPUText(node, null, null)
		this.canvas.init()
	}

	render (): ReactElement {
		return (
			<>
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