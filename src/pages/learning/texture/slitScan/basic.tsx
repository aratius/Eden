import { Component, ReactElement } from 'react'
import styles from '../../../../styles/layout/top/top.module.scss'
import _Head from '../../../../components/next/common/head'
import WebGLSlitScanBasic from '../../../../components/webgl/learning/texture/slitScan/basic/main'
import Info from '../../../../components/next/common/info'

interface Props {

}

export default class Fluid extends Component<Props> {

	private canvas: WebGLSlitScanBasic = null

	constructor(props: Props) {
		super(props)
		process.browser && window.addEventListener("wheel", (e) => e.preventDefault(), {passive: false})
	}

    	/**
	 * canvasセットアップ
	 */
	private onReadyCanvas = (node: HTMLCanvasElement) => {
		if(node == null) return
		this.canvas = new WebGLSlitScanBasic(node, null, null)
		this.canvas.init()
	}

	render (): ReactElement {
		return (
			<>
				<_Head
					title="Slit scan"
					ogUrl="https://eden.aualrxse.com/learning/texture/slitScan/basic"
					ogImgPath="https://eden.aualrxse.com/og/face/og.png"
					description="Slit scan"
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
				<Info
						// ref={this.onReadyInfo}
						title="Basic slit scan"
						details={[
							[
								{
									type: "link",
									text: "slit-scan",
									link: "https://scrapbox.io/lookdev/slit-scan"
								},
							],
							[
								{
									type: "link",
									text: "スリットスキャンの応用",
									link: "https://baku89.com/tips/slit-scan"
								},
							]
						]}
						shareText="author @aualrxse"
						shareUrl="https://eden.aualrxse.com/learning/texture/slitScan/basic"
					/>
			</>
		)
	}

}