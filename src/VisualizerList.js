import React from 'react';
import ReactDOM from 'react-dom';


class VisualizerList extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			visualizers: [
				{ name: 'visualizer001' },
				{ name: 'visualizer002' },
			],
		};
	}

	render() {
		return (
			<div className="visualizer-list">
				<ul onClick={this.select.bind(this)}>
					{this.state.visualizers.map((visualizer, index) => (
						<li key={index}>{visualizer.name}</li>
					))}
				</ul>
			</div>
		);
	}

	select(event) {
		event.preventDefault();
		console.log(event.target);
	}

}


export default VisualizerList;

