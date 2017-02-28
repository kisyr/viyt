import React from 'react';
import ReactDOM from 'react-dom';


class MediaControls extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			playing: false,
		};
		this.bind = this.bind.bind(this);
		this.unbind = this.unbind.bind(this);
		this.play = this.play.bind(this);
		this.pause = this.pause.bind(this);
		this.update = this.update.bind(this);
		this.seek = this.seek.bind(this);
	}

	componentDidMount() {
		this.bind(this.props.stream);
	}

	componentWillUnmount() {
		this.unbind(this.props.stream);
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.stream != nextProps.stream) {
			this.unbind(this.props.stream);
			this.bind(nextProps.stream);
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

	bind(stream) {
		stream.addEventListener('play', this.play);
		stream.addEventListener('pause', this.pause);
		stream.addEventListener('timeupdate', this.update);
	}

	unbind(stream) {
		stream.removeEventListener('play', this.play);
		stream.removeEventListener('pause', this.pause);
		stream.removeEventListener('timeupdate', this.update);
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

