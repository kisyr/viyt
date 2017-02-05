import FrequencyBand from '../FrequencyBand.js';
import BeatDetector from '../BeatDetector.js';


export default {

	name: 'circles',

	init: function() {
		this.audio.analyser.smoothingTimeConstant = 0.0;
		this.audio.analyser.fftSize = 32;
		this.audio.frequenciesLength = this.audio.analyser.frequencyBinCount;
		this.audio.frequencies = new Uint8Array(this.audio.frequenciesLength);
		this.bands = [[0,15], [0,4], [5,9], [10,15], [0,4], [5,9], [10,15]].map(function(range) {
			return new FrequencyBand(range);
		});
		this.beats = this.bands.map(function(band) {
			return {
				range: band.range,
				detector: new BeatDetector({
					dropoff: 0.25,
					cutoff: 0.00015,
				}),
			};
		});
		this.circles = this.bands.map(function(band, i) {
			return {
				range: band.range,
				rotation: 0,
			};
		});
	},

	animate: function(elapsedTime, deltaTime) {
		this.audio.analyser.getByteFrequencyData(this.audio.frequencies);
		this.bands.forEach(function(band) {
			band.update(this.audio.frequencies);
		}, this);
		this.beats.forEach(function(beat, i) {
			beat.detector.update(deltaTime, this.bands[i].level);
		}, this);
		this.graphics.context.setTransform(
			this.graphics.canvas.width * 2, 
			0, 
			0, 
			this.graphics.canvas.height * 2, 
			this.graphics.canvas.width / 2, 
			this.graphics.canvas.height / 2
		);
		this.graphics.context.fillStyle = "#000000";
		this.graphics.context.fillRect(-1, -1, 2, 2);
		this.circles.forEach(function(circle, i, circles) {
			circle.rotation += ((this.beats[i].detector.state * 15) + 1) * 0.25 * deltaTime;
			this.graphics.context.setTransform(
				this.graphics.canvas.width * 2, 
				0, 
				0, 
				this.graphics.canvas.height * 2, 
				this.graphics.canvas.width / 2, 
				this.graphics.canvas.height / 2
			);
			this.graphics.context.rotate(circle.rotation * (i % 2 == 0 ? +1 : -1));
			var colors = ["#ffaa00", "#00ffaa", "#aa00ff", "#ff00aa", "#00ffaa", "#aa00ff", "#ff00aa"];
			this.graphics.context.strokeStyle = colors[i % colors.length];
			this.graphics.context.lineWidth = 0.0005 + (this.beats[i].detector.state * 0.005);
			for (var j = 0; j < 32; ++j) {
				var radians = (j / 32) * 2 * Math.PI;
				var direction = [ Math.sin(radians), Math.cos(radians) ];
				var range = [
					((i + 0) / circles.length) / 3,
					((i + 0 + (1 * this.bands[i].level)) / circles.length) / 3,
				];
				this.graphics.context.beginPath();
				this.graphics.context.moveTo(direction[0] * range[0], direction[1] * range[0]);
				this.graphics.context.lineTo(direction[0] * range[1], direction[1] * range[1]);
				this.graphics.context.stroke();
			}
		}, this);
	},
};

