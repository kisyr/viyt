var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var ytdl = require('ytdl-core');


app.get('/', function (request, response) {
	response.sendFile(__dirname + '/public/index.html');
});


app.use(express.static('public'));


function sendFile(socket, videoId, filePath) {
	console.log('dl.complete', videoId);
	//var file = fs.readFileSync(filePath);
	socket.emit('dl.complete', {
		id: videoId,
		//data: file,
		url: 'http://' + socket.handshake.headers.host + '/cache/' + videoId,
	});
}


io.on('connection', function(socket) {
	console.log('connection', socket.id);
	socket.on('dl.fetch', function(videoId) {
		console.log('dl.fetch', videoId);
		socket.emit('dl.start');
		var filePath = __dirname + '/public/cache/' + videoId;
		console.log('Checking filepath ' + filePath);
		if (fs.existsSync(filePath)) {
			console.log('Found cached file');
			sendFile(socket, videoId, filePath);
		} else {
			var baseUrl = 'http://youtube.com/watch?v=';
			console.log('Downloading file ' + baseUrl + videoId);
			var download = ytdl(baseUrl + videoId, {
				filter: function(format) {
					console.log(format);
					return format.type.indexOf('audio/webm') >= 0;
				},
			});
			download.pipe(fs.createWriteStream(filePath));
			download.on('response', function(result) {
				var total = result.headers['content-length'];
				var read = 0;
				result.on('data', function(data) {
					read += data.length;
					socket.emit('dl.progress', (read / total) * 100);
				});
				result.on('end', function() {
					sendFile(socket, videoId, filePath);
				});
			});
		}
	});
});


http.listen(1337);

