export default function(options) {

	var self = this;
	var AudioContext = window.AudioContext || window.webkitAudioContext;

	self.binds = null;
	self.graphics = {};
	self.audio = {};
	self.elapsed = 0;
	self.animation = null;

	self.init = function() {
		self.graphics.canvas = document.createElement('canvas');
		self.graphics.context = self.graphics.canvas.getContext('2d');

		self.audio.stream = new Audio(options.soundUrl);
		self.audio.context = new AudioContext();

		self.audio.analyser = self.audio.context.createAnalyser();
		self.audio.source = self.audio.context.createMediaElementSource(self.audio.stream);
		self.audio.source.connect(self.audio.context.destination);
		self.audio.source.connect(self.audio.analyser);

		window.addEventListener('resize', self.resize);

		options.element.appendChild(self.graphics.canvas);
		window.dispatchEvent(new Event('resize'));

		self.rebind(options.on);
	};

	self.rebind = function(binds) {
		self.binds = binds;
		if (self.binds && self.binds.init) {
			self.binds.init.call(self);
		}
	};

	self.destroy = function() {
		self.stop();
		self.graphics.canvas.remove();
	};

	self.resize = function() {
		self.graphics.canvas.width = options.element.offsetWidth;
		self.graphics.canvas.height = options.element.offsetHeight;
	};

	self.animate = function(time) {
		var delta = time - self.elapsed;
		self.elapsed = time;
		if (self.binds && self.binds.animate) {
			self.binds.animate.call(self, time / 1000, delta / 1000);
		}
		self.animation = window.requestAnimationFrame(self.animate);
	};

	self.play = function() {
		self.audio.stream.play();
		window.requestAnimationFrame(self.animate);
	};

	self.stop = function() {
		self.audio.stream.pause();
		self.audio.stream.currentTime = 0;
		window.cancelAnimationFrame(self.animation);
	};

	self.seek = function(time) {
		self.audio.stream.currentTime = time;
	};

	self.init();

}

