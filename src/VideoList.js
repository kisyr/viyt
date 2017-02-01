import React from 'react';


class VideoList extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			videos: [],
			query: '',
			nextPageToken: null,
		};
	}

	render() {
		return (
			<div className="video-list">
				<form onSubmit={this.search.bind(this)}>
					<input ref="query" placeholder="Search..." />
				</form>
				<ul>
					{this.state.videos.map((video, index) => (
						<li key={index} data-id={video.id} onClick={() => {this.props.onSelect(video)}}>
							<img src={video.thumbnail} />
							<span>{video.title}</span>
						</li>
					))}
				</ul>
				{this.state.nextPageToken
					? <button onClick={this.load.bind(this)}>more</button>
					: null
				}
			</div>
		);
	}

	load() {
		const url = 'https://www.googleapis.com/youtube/v3/search';
		const query = 'key=AIzaSyCKJM5AFfTlPguQ1h92x31zXWQMjTD-8do&part=snippet&type=video&order=viewCount&maxResults=20&q='+this.state.query+'&pageToken='+(this.state.nextPageToken ? this.state.nextPageToken : '');
		fetch(url + '?' + query).then(response => response.json()).then(response => {
			const videos = response.items.map(item => ({
				id: item.id.videoId,
				title: item.snippet.title,
				thumbnail: item.snippet.thumbnails.default.url,
			}));
			this.setState({
				videos: this.state.videos.concat(videos),
				nextPageToken: response.nextPageToken,
			});
		});
	}

	search(event) {
		event.preventDefault();
		this.setState({
			videos: [],
			query: this.refs.query.value,
			nextPageToken: null,
		}, () => {
			this.load();
		});
	}

}


export default VideoList;

