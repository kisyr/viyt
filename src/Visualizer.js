import React from 'react';
import ReactDOM from 'react-dom';

import MediaControls from './MediaControls.js';


class Visualizer extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			width: 0,
			height: 0,
			elapsedTime: 0,
			graphicsContext: null,
			graphicsAnimation: null,
			audioContext: null,
			audioStream: null,
			audioSource: null,
			audioAnalyser: null,
		};
		this.resize = this.resize.bind(this);
	}

	componentDidMount() {
		var audioContext = new (window.AudioContext || window.webkitAudioContext)();
		var graphicsCanvas = this.refs.graphicsCanvas;
		var graphicsContext = graphicsCanvas.getContext('2d');
		this.setState({
			graphicsContext,
			audioContext,
		});
		window.addEventListener('resize', this.resize);
		window.dispatchEvent(new Event('resize'));
	}

	componentWillDismount() {
		window.removeEventListener('resize', this.resize);
		window.cancelAnimationFrame(this.state.graphicsAnimation);
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.audioStreamUrl != nextProps.audioStreamUrl) {
			console.log('New stream detected', this.props.audioStreamUrl, nextProps.audioStreamUrl);
			if (this.state.audioSource) {
				this.state.audioStream.pause();
				this.state.audioSource.disconnect();
			}
			var audioStream = new Audio(nextProps.audioStreamUrl);
			var audioSource = this.state.audioContext.createMediaElementSource(audioStream);
			var audioAnalyser = this.state.audioContext.createAnalyser();
			audioSource.connect(this.state.audioContext.destination);
			audioSource.connect(audioAnalyser);
			audioStream.play();
			this.setState({
				audioStream,
				audioSource,
				audioAnalyser,
			});
		}
		if (nextProps.bindings != this.props.bindings && nextProps.bindings) {
			console.log('New bindings detected', nextProps.bindings);
			var context = {
				graphics: {
					canvas: this.refs.graphicsCanvas,
					context: this.state.graphicsContext,
				},
				audio: {
					context: this.state.audioContext,
					analyser: this.state.audioAnalyser,
				},
			};
			const onInit = nextProps.bindings.init.bind(context);
			const onAnimate = nextProps.bindings.animate.bind(context);
			onInit();
			var graphicsAnimation = null;
			var graphicsAnimate = time => {
				const deltaTime = time - this.state.elapsedTime;
				onAnimate(time / 1000, deltaTime / 1000);
				this.setState({ elapsedTime: time });
				graphicsAnimation = window.requestAnimationFrame(graphicsAnimate);
			};
			graphicsAnimate(0);
			this.setState({ graphicsAnimation });
		}
	}

	render() {
		return (
			<div className="visualizer" ref="visualizer">
				<canvas width={this.state.width} height={this.state.height} ref="graphicsCanvas"></canvas>
				{this.state.audioStream && 
					<MediaControls stream={this.state.audioStream} />
				}
			</div>
		);
	}

	resize() {
		this.setState({
			width: this.refs.visualizer.offsetWidth,
			height: this.refs.visualizer.offsetHeight,
		});
	}

}


export default Visualizer;

