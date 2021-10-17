import { Component, ReactElement } from 'react'
import styles from '../../styles/layout/top/top.module.scss'
import _Head from '../../components/next/common/head'
import Info from '../../components/next/common/info'
import WebGLTextureMapping from '../../components/webgl/learning/textureMapping/textureMapping'

interface Props {

}

export default class Index extends Component<Props> {

	private canvas: WebGLTextureMapping = null

	constructor(props: Props) {
		super(props)
		process.browser && window.addEventListener("wheel", (e) => e.preventDefault(), {passive: false})
	}

    	/**
	 * canvasセットアップ
	 */
	private onReadyCanvas = (node: HTMLCanvasElement) => {
		if(node == null) return
		this.canvas = new WebGLTextureMapping(node, null, null)
		this.canvas.init()
	}

	render (): ReactElement {
		return (
			<>
				<_Head
					title="texture mapping"
					ogUrl="https://eden.aualrxse.com/learning/textureMapping"
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