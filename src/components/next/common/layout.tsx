import { Component } from "react";

export default class Layout extends Component {
	render() {
		return (
			<>{this.props.children}</>
		)
	}

}