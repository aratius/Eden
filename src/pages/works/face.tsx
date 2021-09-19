import { Component, ReactElement } from 'react'
import styles from '../../styles/layout/top/top.module.scss'
import Main from '../../components/next/main'
import WebGLFace from '../../components/webgl/work/face/face'
import _Head from '../../components/next/common/head'
import Info from '../../components/next/common/info'

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
		const canvas = new WebGLFace(node, null, null)
		canvas.init()
	}

	render (): ReactElement {
		return (
			<>
				<_Head title="face"></_Head>
				<div className={styles.container}>
					<canvas
						className={styles.canvas}
						style={{cursor: "grab"}}
						id="canvas"
						ref={this.onReadyCanvas}
						width="1920"
						height="1080"
					></canvas>
					<Info
						title="face"
						details={[
							[
								{
									type: "text",
									text: "model by"
								},
								{
									type: "link",
									text: "Suharman Putra - Face",
									link: "https://sketchfab.com/3d-models/face-e2b2143b03714b97afc9c87f8d75acb3"
								},
								{
									type: "text",
									text: "/ Adapted."
								},
							]
						]}
						shareText="https://eden.aualrxse.com/works/face"
					/>
				</div>
			</>
		)
	}

}