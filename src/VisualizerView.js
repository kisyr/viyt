import React from 'react';
import ReactDOM from 'react-dom';


class VisualizerView extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			visualizer: null,
		};
	}

	render() {
		return (
			<div className="visualizer">
				{this.state.visualizer}
			</div>
		);
	}

}


export default VisualizerView;

