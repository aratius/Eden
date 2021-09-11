import { Component, ReactElement } from 'react'
import styles from '../../styles/layout/top/top.module.scss'
import Main from '../../components/next/main'
import WebGLFace from '../../components/webgl/work/face/face'

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
			<div className={styles.container}>
				<canvas className={styles.canvas} id="canvas" ref={this.onReadyCanvas} width="1920" height="1080"></canvas>
				<p
					style={{
						position: "absolute",
						bottom: "10px",
						right: "10px",
						color: "white"
					}}
				>
					{/* https://sketchfab.com/3d-models/face-e2b2143b03714b97afc9c87f8d75acb3 */}
					Model by&nbsp;
					<a
						style={{
							color: "white",
							borderBottom: "1px solid white"
						}}
					 	href="https://sketchfab.com/3d-models/face-e2b2143b03714b97afc9c87f8d75acb3" target="_blank">Suharman Putra - Face</a>
					&nbsp;/ Adapted.
				</p>
			</div>
		)
	}

}