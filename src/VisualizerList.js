import React from 'react';
import ReactDOM from 'react-dom';

import visualizers from './visualizers';


class VisualizerList extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			visualizers: visualizers,
		};
	}

	render() {
		return (
			<div className="visualizer-list">
				<ul>
					{this.state.visualizers.map((visualizer, index) => (
						<li key={index} onClick={() => this.props.onSelect(visualizer)}>{visualizer.name}</li>
					))}
				</ul>
			</div>
		);
	}

}


export default VisualizerList;

