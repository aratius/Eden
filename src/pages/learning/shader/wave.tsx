import { Component, ReactElement } from 'react'
import _Head from '../../../components/next/common/head'
import Info from '../../../components/next/common/info'
import Wave from '../../../components/webgl/learning/shader/wave/wave'
import styles from '../../../styles/layout/top/top.module.scss'

interface Props {

}

export default class Index extends Component<Props> {

	private canvas: Wave = null

	constructor(props: Props) {
		super(props)
		process.browser && window.addEventListener("wheel", (e) => e.preventDefault(), {passive: false})
	}

    	/**
	 * canvasセットアップ
	 */
	private onReadyCanvas = (node: HTMLCanvasElement): void => {
		if(!node) return
		this.canvas = new Wave(node, null, null)
		this.canvas.init()
	}

	render (): ReactElement {
		return (
			<>

				<_Head
					title="Wave Simulation"
					ogUrl="https://eden.aualrxse.com/learning/shader/wave"
					ogImgPath="https://eden.aualrxse.com/og/wave/og.png"
					description="Wave Simulation"
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
				<Info
					// ref={this.onReadyInfo}
					title="Wave Simulation"
					details={[
					]}
					shareText="author @aualrxse"
					shareUrl="https://eden.aualrxse.com/learning/shader/wave"
				/>
			</>
		)
	}

}