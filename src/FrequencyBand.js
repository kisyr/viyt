export default function(range) {
	this.level = 0;
	this.range = range;
	this.update = function(buffer) {
		var sum = buffer.slice(this.range[0], this.range[1]).reduce(function(a, b) {
			return a + b;
		}, 0);
		this.level = sum / ((this.range[1] - this.range[0]) * 255);
	};
};

