import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';

import Sidebar from './Sidebar.js';
import VideoList from './VideoList.js';
import VisualizerList from './VisualizerList.js';
import Visualizer from './Visualizer.js';


class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			socket: io('http://localhost:1337'),
			sidebarVideosOpen: false,
			sidebarVisualizersOpen: false,
			streamUrl: null,
			visualizer: null,
		};
		this.state.socket.on('dl.complete', (data) => {
			this.setState({ streamUrl: data.url });
		});
	}

	render() {
		return (
			<div>
				<Sidebar open={this.state.sidebarVideosOpen}>
					<VideoList onSelect={this.selectVideo.bind(this)} />
				</Sidebar>
				<Sidebar open={this.state.sidebarVisualizersOpen}>
					<VisualizerList onSelect={this.selectVisualizer.bind(this)} />
				</Sidebar>
				<button className="toggle-sidebar-videos" onClick={this.toggleSidebarVideos.bind(this)}>
					<i className="fa fa-search"></i>
				</button>
				<button className="toggle-sidebar-visualizers" onClick={this.toggleSidebarVisualizers.bind(this)}>
					<i className="fa fa-bar-chart"></i>
				</button>
				{this.state.streamUrl && 
					<Visualizer streamUrl={this.state.streamUrl} implementation={this.state.visualizer} />
				}
			</div>
		);
	}

	toggleSidebarVideos() {
		this.setState({
			sidebarVideosOpen: !this.state.sidebarVideosOpen,
			sidebarVisualizersOpen: false,
		});
	}

	toggleSidebarVisualizers() {
		this.setState({
			sidebarVideosOpen: false,
			sidebarVisualizersOpen: !this.state.sidebarVisualizersOpen,
		});
	}

	selectVideo(video) {
		this.state.socket.emit('dl.fetch', video.id);
	}

	selectVisualizer(visualizer) {
		this.setState({ visualizer: visualizer });
	}

}


ReactDOM.render((
	<App />
), document.querySelector('#app'));

