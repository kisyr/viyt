import React from 'react';
import ReactDOM from 'react-dom';

import Overlay from './Overlay.js';
import VideoList from './VideoList.js';
import VisualizerList from './VisualizerList.js';


class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			videoListOpen: false,
			visualizerListOpen: false,
		};
	}

	render() {
		return (
			<div>
				<button onClick={this.toggleVideoList.bind(this)}>videolist</button>
				<Overlay open={this.state.videoListOpen}>
					<VideoList />
				</Overlay>
				<button onClick={this.toggleVisualizerList.bind(this)}>visualizerlist</button>
				<Overlay open={this.state.visualizerListOpen}>
					<VisualizerList />
				</Overlay>
			</div>
		);
	}

	toggleVideoList(event) {
		this.setState({ videoListOpen: !this.state.videoListOpen });
	}

	toggleVisualizerList(event) {
		this.setState({ visualizerListOpen: !this.state.visualizerListOpen });
	}

}


ReactDOM.render((
	<App />
), document.querySelector('#app'));

