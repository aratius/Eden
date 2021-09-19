import { Component, ReactElement } from "react";
import styles from "../../../styles/layout/info.module.scss"

export default class Info extends Component {

    render(): ReactElement {

        return (
            <section className={styles.container}>
                <article className={styles.info}>
                    <h2 className={styles.info__title}>title</h2>
                    <div className={styles.info__author}>
                        <p className={styles.info__author__detail}>model by harry - boat / ©</p>
                        <p className={styles.info__author__detail}>model by harry - boat / ©</p>
                    </div>
                    <div className={styles.info__twitter}>
                        <a className={styles.info__twitter__follow} href="https://twitter.com/intent/follow?original_referer=https%3A%2F%2Fpublish.twitter.com%2F&ref_src=twsrc%5Etfw%7Ctwcamp%5Ebuttonembed%7Ctwterm%5Efollow%7Ctwgr%5Eaualrxse&screen_name=aualrxse" target="_blank">
                            <img src="/assets/images/common/ico-tw-wh.svg" alt="twitter" />
                        </a>
                        <a className={styles.info__twitter__share} href="https://twitter.com/intent/tweet?text=hello" target="_blank">share</a>
                    </div>
                    <footer className={styles.info__footer}>
                        <p>
                            © 2021 / Arata matsumoto All rights reserved.
                        </p>
                    </footer>
                </article>
            </section>
        )

    }

}