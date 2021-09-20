import { Component, ReactElement } from 'react'
import styles from '../../styles/layout/top/top.module.scss'
import Main from '../../components/next/main'
import WebGLFace from '../../components/webgl/work/face/face'
import _Head from '../../components/next/common/head'
import Info from '../../components/next/common/info'

interface Props {

}

export default class Index extends Component<Props> {

	private canvas: WebGLFace = null
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
		this.canvas = new WebGLFace(node, null, null)
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
				<_Head
					title="face"
					ogUrl="https://eden.aualrxse.com/works/face"
					ogImgPath="https://eden.aualrxse.com/face/og.png"
					description="Touch his face and he'll be happy."
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
					<Info
						ref={this.onReadyInfo}
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
							],
							[
								{
									type: "text",
									text: "github"
								},
								{
									type: "link",
									text: "aratius - Eden",
									link: "https://github.com/aratius/Eden/tree/develop/src/components/webgl/work/face"
								},
								{
									type: "text",
									text: "/ CC"
								},
							]
						]}
						shareText="author @aualrxse"
						shareUrl="https://eden.aualrxse.com/works/face"
					/>
				</div>
			</>
		)
	}

}