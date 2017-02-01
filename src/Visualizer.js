import React from 'react';
import ReactDOM from 'react-dom';

import Augr from './Augr.js';


class Visualizer extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			augr: null,
			implementation: null,
		};
	}

	componentDidMount() {
		this.setState({
			augr: new Augr({
				element: this.refs.visualizer,
				soundUrl: this.props.streamUrl,
				on: null,
			}),
		}, () => {
			this.state.augr.play();
		});
	}

	componentWillReceiveProps(nextProps) {
		this.state.augr.rebind(nextProps.implementation);
	}

	shouldComponentUpdate(nextProps, nextState) {
		return false;
	}

	render() {
		return (
			<div ref="visualizer" className="visualizer">
			</div>
		);
	}

}


export default Visualizer;

