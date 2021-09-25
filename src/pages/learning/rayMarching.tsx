import { Component, ReactElement } from 'react'
import styles from '../../styles/layout/top/top.module.scss'
import _Head from '../../components/next/common/head'
import WebGLOcean from '../../components/webgl/work/ocean/ocean'
import Info from '../../components/next/common/info'
import RayMarching from '../../components/webgl/learning/rayMarching/rayMarching'

interface Props {

}

export default class Index extends Component<Props> {

	private info: Info = null
	private canvas: RayMarching = null

	constructor(props: Props) {
		super(props)
		process.browser && window.addEventListener("wheel", (e) => e.preventDefault(), {passive: false})
	}

    	/**
	 * canvasセットアップ
	 */
	private onReadyCanvas = (node: HTMLCanvasElement): void => {
		if(!node) return
		this.canvas = new RayMarching(node, null, null)
		this.canvas.init()
	}

	render (): ReactElement {
		return (
			<>
                <_Head
                    title="ray marching"
                    ogUrl="https://eden.aualrxse.com/learning/raymarching"
                    ogImgPath="https://eden.aualrxse.com/og/ocean/og.png"
                    description=""
                ></_Head>
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