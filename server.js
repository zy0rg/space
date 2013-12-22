var http_lib = require('http'),
	path = require('path'),
	url = require('url'),
	fs = require('fs'),
	io_lib = require('socket.io'),
	requirejs = require('requirejs'),

	Ship = requirejs('base/Ship'),
	ticker = requirejs('core/ticker'),

	http, io,

	writeError = function (err, response) {
		response.writeHeader(500, {"Content-Type": "text/plain"});
		response.write(err + "\n");
		response.end();
	},

	ships = [],
	id = 0,
	tickCounter = 0;

http = http_lib.createServer(function (request, response) {
	var my_path = url.parse(request.url).pathname;
	var full_path = path.join(process.cwd(), my_path);
	fs.exists(full_path, function (exists) {
		if (!exists) {
			response.writeHeader(404, {"Content-Type": "text/plain"});
			response.write("404 Not Found\n");
			response.end();
		} else {
			fs.stat(full_path, function (err, stats) {
				if (stats.isDirectory())
					full_path += 'index.html';
				else if (!stats.isFile()) {
					writeError(err, response);
					return;
				}
				fs.readFile(full_path, "binary", function (err, file) {
					if (err)
						writeError(err, response);
					else {
						response.writeHeader(200);
						response.write(file, "binary");
						response.end();
					}
				});
			});
		}
	});
}).listen(80);

io = io_lib.listen(http);

io.sockets.on('connection', function (socket) {
	var ship = new Ship();
	ship.id = ++id;
	ship.keys = {
		left: false,
		up: false,
		right: false,
		down: false
	};
	ships.push(ship);
	ticker.objects.push(ship);
	io.sockets.emit('add', ship.toJSON());
	socket.on('disconnect', function () {
		var i = ships.indexOf(ship);
		if (~i)
			ships.splice(i, 1);
		i = ticker.objects.indexOf(ship);
		if (~i)
			ticker.objects.splice(i, 1);
		io.sockets.emit('remove', ship.id);
	});
	socket.on('key', function (data) {
		var keys = ship.keys;
		keys[data.key] = data.pressed;
		ship.rotating = keys.left ? keys.right ? 0 : 1 : keys.right ? -1 : 0;
		ship.accelerating = keys.up;
		io.sockets.emit('ship', {
			id: ship.id,
			data: ship.toJSON()
		});
	});
	socket.on('latency', function (data) {
		socket.emit('latency', data);
	});
});

ticker.callbacks.push(function () {
	var data = {}, i, ship;
	if (++tickCounter == 30) {
		tickCounter = 0;
		for (i = 0; i < ships.length; i++) {
			ship = ships[i];
			data[ship.id] = ship.toJSON();
		}
		io.sockets.emit('ships', data);
	}
});

ticker.start();