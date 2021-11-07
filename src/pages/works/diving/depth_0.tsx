import { Component, ReactElement } from 'react'
import styles from '../../../styles/layout/top/top.module.scss'
import _Head from '../../../components/next/common/head'
import Info from '../../../components/next/common/info'
import WebGLDepth_0 from '../../../components/webgl/work/diving/depth_0/depth_0'

interface Props {

}

export default class Index extends Component<Props> {

	private canvas: WebGLDepth_0 = null
	private info: Info = null


	constructor(props: Props) {
		super(props)
		process.browser && window.addEventListener("wheel", (e) => e.preventDefault(), {passive: false})
	}

    	/**
	 * canvasセットアップ
	 */
	private onReadyCanvas = (node: HTMLCanvasElement) => {
		if(node == null) return
		this.canvas = new WebGLDepth_0(node, null, null)
		this.canvas.init()
	}

	private onReadyInfo = (node: Info): void => {
		if(!node) return
		this.info = node
		this.info.events.on(Info.events.appear, () => {
			this.canvas.onDeInitUpdate()
		})
		this.info.events.on(Info.events.disappear, () => {
			this.canvas.onInitUpdate()
		})
	}

	render (): ReactElement {
		return (
			<>
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
						ref={this.onReadyInfo}
						title="diving | depth_0"
						details={[]}
						shareText="author @aualrxse"
						shareUrl="https://eden.aualrxse.com/works/cell"
					/>
				</div>
			</>
		)
	}

}