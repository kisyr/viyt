import React from 'react';
import ReactDOM from 'react-dom';


class MediaControls extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			playing: false,
		};
		this.play = this.play.bind(this);
		this.pause = this.pause.bind(this);
		this.update = this.update.bind(this);
		this.seek = this.seek.bind(this);
	}

	componentDidMount() {
	}

	componentWillUnmount() {
	}

	componentWillReceiveProps(nextProps) {
		console.log('MediaControls.componentWillReceiveProps', this.props, nextProps);
		if (this.props.stream != nextProps.stream) {
			this.props.stream.removeEventListener('play', this.play);
			this.props.stream.removeEventListener('pause', this.pause);
			this.props.stream.removeEventListener('timeupdate', this.update);
			this.props.stream.addEventListener('play', this.play);
			this.props.stream.addEventListener('pause', this.pause);
			this.props.stream.addEventListener('timeupdate', this.update);
		}
	}

	render() {
		return (
			<div className="media-controls">
				<div className="controls">
					{this.state.playing
						? <button onClick={() => {this.props.stream.pause();}}><i className="fa fa-pause"></i></button>
						: <button onClick={() => {this.props.stream.play();}}><i className="fa fa-play"></i></button>
					}
				</div>
				<div className="progress">
					<div className="progress-overlay" ref="progress"></div>
					<div className="progress-seeker" ref="seeker" onClick={this.seek}></div>
				</div>
			</div>
		);
	}

	play() {
		this.setState({ playing: true });
	}

	pause() {
		this.setState({ playing: false });
	}

	seek(event) {
		const fraction = event.nativeEvent.offsetX / event.nativeEvent.target.offsetWidth;
		const time = fraction * this.props.stream.duration;
		this.props.stream.currentTime = time;
	}

	update() {
		const fraction = this.props.stream.currentTime / this.props.stream.duration;
		const width = (fraction * 100) + '%';
		this.refs.progress.style.width = width;
	}

}


export default MediaControls;

