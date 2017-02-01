export default {

	name: 'bars',

	init: function() {
		this.audio.analyser.smoothingTimeConstant = 0.5;
		this.audio.analyser.fftSize = 32;
		this.audio.frequenciesLength = this.audio.analyser.frequencyBinCount;
		this.audio.frequencies = new Uint8Array(this.audio.frequenciesLength);
	},

	animate: function(time) {
		this.audio.analyser.getByteFrequencyData(this.audio.frequencies);
		var intensity = this.audio.frequencies.reduce(function(a, b) {
			return a + b;
		}) / (this.audio.frequencies.length * 255);
		this.graphics.context.setTransform(
			this.graphics.canvas.width, 
			0, 
			0, 
			-this.graphics.canvas.height, 
			0, 
			this.graphics.canvas.height
		);
		this.graphics.context.fillStyle = '#000000';
		this.graphics.context.fillRect(0, 0, this.graphics.canvas.width, this.graphics.canvas.height);
		this.audio.frequencies.forEach(function(amplitude, i, frequencies) {
			var rect = [
				i / frequencies.length,
				0,
				1 / frequencies.length,
				amplitude / 255
			];
			var color = [
				'rgb(200, '+Math.floor(rect[0] * 100)+', '+Math.floor(intensity * 255)+')',
				'rgb(255, '+Math.floor(rect[0] * 200)+', '+Math.floor(intensity * 255)+')',
			];
			var fill = this.graphics.context.createLinearGradient(0, 0, 0, rect[3]);
			fill.addColorStop(0, color[0]);
			fill.addColorStop(1, color[1]);
			this.graphics.context.fillStyle = fill;
			this.graphics.context.fillRect(rect[0], rect[1], rect[2], rect[3]);
		}, this);
	},

};

