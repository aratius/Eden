import { Component, ReactElement } from 'react'
import styles from '../../styles/layout/top/top.module.scss'
import _Head from '../../components/next/common/head'
import WebGLOcean from '../../components/webgl/work/ocean/ocean'
import Info from '../../components/next/common/info'

interface Props {

}

export default class Index extends Component<Props> {

	private info: Info = null
	private canvas: WebGLOcean = null

	constructor(props: Props) {
		super(props)
		process.browser && window.addEventListener("wheel", (e) => e.preventDefault(), {passive: false})
	}

    	/**
	 * canvasセットアップ
	 */
	private onReadyCanvas = (node: HTMLCanvasElement): void => {
		if(!node) return
		this.canvas = new WebGLOcean(node, null, null)
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
						id="canvas"
						ref={this.onReadyCanvas}
						width="1920"
						height="1080"
					></canvas>
					<Info
						ref={this.onReadyInfo}
						title="ocean"
						details={[
							[
								{
									type: "text",
									text: "model by"
								},
								{
									type: "link",
									text: "DJMaesen - Boat",
									link: "https://sketchfab.com/3d-models/boat-5cdc4fc134e84a8d97fb2d3ffaf5c5fb"
								},
								{
									type: "text",
									text: "/ CC",
								}
							],
							[
								{
									type: "text",
									text: "model by"
								},
								{
									type: "link",
									text: "IUPUI University Library - Boat Man",
									link: "https://sketchfab.com/3d-models/boat-man-6137784429d640d3b671e34cd15ee6dc"
								},
								{
									type: "text",
									text: "/ CC",
								}
							],
							[
								{
									type: "text",
									text: "github"
								},
								{
									type: "link",
									text: "aratius - Eden",
									link: "https://github.com/aratius/Eden/tree/develop/src/components/webgl/work/ocean"
								},
								{
									type: "text",
									text: "/ CC"
								},
							]
						]}
						shareText="author @aualrxse"
						shareUrl="https://eden.aualrxse.com/works/ocean"
					/>
				</div>
			</>
		)
	}

}