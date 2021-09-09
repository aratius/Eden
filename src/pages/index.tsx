import { Component, ReactElement } from 'react'
import styles from '../styles/layout/top/top.module.scss'
import Main from '../components/next/main'

interface Props {

}

export default class Index extends Component<Props> {

	constructor(props: Props) {
		super(props)
	}


	render (): ReactElement {
		return (
			<section className={styles.container}>
				<Main/>
			</section>
		)
	}

}