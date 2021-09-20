import { Component, ReactElement, SyntheticEvent } from "react";
import styles from "../../../styles/layout/info.module.scss"
import gsap from "gsap"
import { EventEmitter } from "events"

interface Props {
	title: string,
	details: Array<{
		type: "link" | "text",
		text: string,
		link?: string
	}>[],
	shareText: string,
	shareUrl: string
}

export default class Info extends Component<Props> {

	public static events: {[key:string]: string} = {
		appear: "appear",
		disappear: "disappear"
	}

	private bg: HTMLElement = null
	private contents: HTMLElement = null
	private fadeTween: GSAPTimeline = null
	public events: EventEmitter = new EventEmitter()

	public appear(): void {
		if(this.fadeTween != null) this.fadeTween.kill()
		this.fadeTween = gsap.timeline()
		this.fadeTween.to(this.bg, {alpha: 1, duration: 0.3})
		this.fadeTween.to(this.contents, {alpha: 1, duration: 0.3})
		if(this.contents.classList.contains(styles.invisible)) this.contents.classList.remove(styles.invisible)
		this.events.emit(Info.events.appear)
	}

	public disappear(): void {
		if(this.fadeTween != null) this.fadeTween.kill()
		this.fadeTween = gsap.timeline()
		this.fadeTween.to(this.contents, {alpha: 0, duration: 0.3})
		this.fadeTween.to(this.bg, {alpha: 0, duration: 0.3})
		if(!this.contents.classList.contains(styles.invisible)) this.contents.classList.add(styles.invisible)
		this.events.emit(Info.events.disappear)
	}

	private onReadyBG = (node: HTMLElement): void => {
		if(!node) return
		this.bg = node
		gsap.set(this.bg, {alpha: 0})
	}

	private onReadyContents = (node: HTMLElement): void => {
		if(!node) return
		this.contents = node
		gsap.set(this.contents, {alpha: 0})
		this.contents.classList.add(styles.invisible)
	}

	/**
	 * ボタンクリックでappear
	 * @param e
	 */
	private onClickButton = (e: SyntheticEvent): void => {
		if(e && e.cancelable) e.preventDefault()
		this.appear()
	}

	/**
	 * 背景クリックでdisappear
	 * @param e
	 */
	private onClickBG = (e: SyntheticEvent): void => {
		if(e && e.cancelable) e.preventDefault()
		this.disappear()
	}

	/**
	 * コンテンツのイベントが伝播してBGのクリックイベントが発生するのを禁止
	 * @param e
	 */
	private onClickContents = (e: SyntheticEvent): void => {
		if(e) e.stopPropagation()
	}

	render(): ReactElement {

		return (
			<>
				<section className={styles.container} ref={this.onReadyBG} onClick={this.onClickBG}>
					<article className={styles.info} ref={this.onReadyContents} onClick={this.onClickContents}>
						<h2 className={styles.info__title}>{this.props.title}</h2>
						<div className={styles.info__author}>
							{this.props.details.map((data, i) => {
								return(
									<p className={styles.info__author__detail} key={i}>
										{data.map((d, _i) => {
											if(d.type == "text")
												return <span key={_i}>{d.text}&nbsp;</span>
											else if (d.type == "link")
												return <a key={_i} href={d.link} target="_blank">{d.text}&nbsp;</a>
										})}
									</p>
								)
							})}
						</div>
						<div className={styles.info__twitter}>
							<a className={styles.info__twitter__follow} href="https://twitter.com/intent/follow?original_referer=https%3A%2F%2Fpublish.twitter.com%2F&ref_src=twsrc%5Etfw%7Ctwcamp%5Ebuttonembed%7Ctwterm%5Efollow%7Ctwgr%5Eaualrxse&screen_name=aualrxse" target="_blank">
								<img src="/assets/images/common/ico-tw-wh.svg" alt="twitter" />
							</a>
							<a className={styles.info__twitter__share} href={"https://twitter.com/intent/tweet?text="+this.props.shareText+"&url="+this.props.shareUrl} target="_blank">share</a>
						</div>
						<footer className={styles.info__footer}>
							<p>
								© 2021 / Arata matsumoto All rights reserved.
							</p>
						</footer>
					</article>
				</section>
				<a onClick={this.onClickButton} className={styles.button} href="#">i</a>
			</>
		)

	}

}