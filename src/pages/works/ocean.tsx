import { Component, ReactElement } from 'react'
import styles from '../../styles/layout/top/top.module.scss'
import _Head from '../../components/next/common/head'
import WebGLOcean from '../../components/webgl/work/sea/ocean'

interface Props {

}

export default class Index extends Component<Props> {

	constructor(props: Props) {
		super(props)
		process.browser && window.addEventListener("wheel", (e) => e.preventDefault(), {passive: false})
	}

    	/**
	 * canvasセットアップ
	 */
	private onReadyCanvas = (node: HTMLCanvasElement) => {
		if(node == null) return
		const canvas = new WebGLOcean(node, null, null)
		canvas.init()
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