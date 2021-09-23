import { Component, ReactElement } from 'react'
import styles from '../../styles/layout/top/top.module.scss'
import _Head from '../../components/next/common/head'
import Info from '../../components/next/common/info'
import WebGLTeresa from '../../components/webgl/work/teresa/teresa'

interface Props {

}

export default class Index extends Component<Props> {

	private canvas: WebGLTeresa = null

	constructor(props: Props) {
		super(props)
		process.browser && window.addEventListener("wheel", (e) => e.preventDefault(), {passive: false})
	}

    	/**
	 * canvasセットアップ
	 */
	private onReadyCanvas = (node: HTMLCanvasElement) => {
		if(node == null) return
		this.canvas = new WebGLTeresa(node, null, null)
		this.canvas.init()
	}

	render (): ReactElement {
		return (
			<>
				<_Head
					title="teresa"
					ogUrl="https://eden.aualrxse.com/works/teresa"
					ogImgPath="https://eden.aualrxse.com/og/face/og.png"
					description="Teresa installation."
				></_Head>
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