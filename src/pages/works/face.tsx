import { Component, ReactElement } from 'react'
import styles from '../../styles/layout/top/top.module.scss'
import Main from '../../components/next/main'
import WebGLFace from '../../components/webgl/work/face/face'

interface Props {

}

export default class Index extends Component<Props> {

	constructor(props: Props) {
		super(props)
	}

    	/**
	 * canvasセットアップ
	 */
	onReadyCanvas = (node: HTMLCanvasElement) => {
		if(node == null) return
		const canvas = new WebGLFace(node, null, null)
		canvas.init()
	}

	render (): ReactElement {
		return (
			<div className={styles.container}>
				<canvas className={styles.canvas} id="canvas" ref={this.onReadyCanvas} width="1920" height="1080"></canvas>
			</div>
		)
	}

}