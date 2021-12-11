import { Component, ReactElement } from "react";
import Link from "next/link"

export default class Guide extends Component {

	render(): ReactElement {
			return (
				<>
					<ul>
						<li>
							<Link href="/works/diving/depth_0">
								depth_0
							</Link>
						</li>
						<li>
							<Link href="/works/diving/depth_10">
								depth_10
							</Link>
						</li>
						<li>
							<Link href="/learning/gpgpu/gpgpuText">
								gpgpuText
							</Link>
						</li>
					</ul>
				</>
			)
	}

}