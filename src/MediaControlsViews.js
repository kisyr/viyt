import React from 'react';
import ReactDOM from 'react-dom';


class MediaControlsView extends React.Componenent {

	constructor(props) {
		super(props);
		this.state = {
			playing: false,
		};
	}

	componentDidMount() {
		this.props.stream.addEventListener('timeupdate', this.update);
	}

	componentWillUnmount() {
		this.props.stream.removeEventListener('timeupdate', this.update);
	}

	render() {
		return (
			<div className="media-controls">
				{this.state.playing
					? <button onClick={this.pause.bind(this)}>pause</button>
					: <button onClick={this.play.bind(this)}>play</button>
				}
				<div onClick={this.seek.bind(this)} ref="seeker">
					<div onClick={this.seek.bind(this)} ref="progress"></div>
				</div>
			</div>
		);
	}

	play() {
		this.props.stream.play();
		this.setState({ playing: true });
	}

	pause() {
		this.props.stream.pause();
		this.setState({ playing: false });
	}

	seek(event) {
		// Does it work?!
		if (event.target == this.refs.seeker) {
			const fraction = event.offsetX / event.target.offsetWidth;
			const time = fraction * this.props.stream.duration;
			this.props.stream.currentTime = time;
		}
	}

	update: function() {
		const fraction = this.props.stream.currentTime / this.props.stream.duration;
		const width = (fraction * 100) + '%';
		this.refs.progress.style.width = width;
	}

}


export default MediaControlsView;

