import { Component, ReactElement } from 'react'
import styles from '../styles/layout/top/top.module.scss'
import WebGLMAnimate from '../components/webgl/learning/manimate/manimate'

interface Props {

}

export default class Index extends Component<Props> {

	private canvas: WebGLMAnimate = null

	constructor(props: Props) {
		super(props)
		process.browser && window.addEventListener("wheel", (e) => e.preventDefault(), {passive: false})
	}

    	/**
	 * canvasセットアップ
	 */
	private onReadyCanvas = (node: HTMLCanvasElement) => {
		if(node == null) return
		this.canvas = new WebGLMAnimate(node, null, null)
		this.canvas.init()
	}

	render (): ReactElement {
		return (
			<>
				<div className={styles.container}>
					<canvas
						className={styles.canvas}
						style={{cursor: "grab"}}
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