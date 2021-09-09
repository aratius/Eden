import { Component } from "react";
import WebGLMain from "../webgl/entry/main";
import styles from "../../styles/layout/top/top.module.scss"

export default class Main extends Component {

	/**
	 * canvasセットアップ
	 */
	onReadyCanvas = (node: HTMLCanvasElement) => {
		if(node == null) return
		const canvas = new WebGLMain(node, null, null)
		canvas.init()
	}

	render() {
		return(
			<div className={styles.container}>
				<canvas className={styles.canvas} id="canvas" ref={this.onReadyCanvas} width="1920" height="1080"></canvas>
			</div>
		)
	}

}