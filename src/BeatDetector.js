export default function(options) {
	this.level = 0;
	this.state = false;
	this.elapsedTime = 0;
	this.update = function(deltaTime, level) {
		this.elapsedTime += deltaTime;
		this.level -= (this.level > 0) * options.dropoff * deltaTime;
		this.state = level > this.level && this.elapsedTime > options.cutoff;
		if (this.state) {
			this.level = level;
			this.elapsedTime = 0;
		}
	};
}

