var http_lib = require('http'),
	path = require('path'),
	url = require('url'),
	fs = require('fs'),
	io_lib = require('socket.io'),
	requirejs = require('requirejs'),

	Ship = requirejs('base/Ship'),
	Beam = requirejs('base/Beam'),
	ticker = requirejs('core/ticker'),
	objects = requirejs('core/objects'),

	http, io,

	writeError = function (err, response) {
		response.writeHeader(500, {"Content-Type": "text/plain"});
		response.write(err + "\n");
		response.end();
	},

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
	var i, data = {},
		ship = new Ship({
			id: ++id,
			keys: {up: false}
		}),
		shoot = function () {
			var beam = new Beam({
				id: ++id,
				x: ship.x,
				y: ship.y,
				angle: ship.angle
			});
			objects[id] = beam;
			beam = beam.toJSON();
			beam.type = 'Beam';
			io.sockets.emit('object', beam);
		};
	objects[id] = ship;
	for (i in objects) {
		data[i] = objects[i].toJSON();
		data[i].type = objects[i].type;
	}
	socket.emit('objects', data);
	socket.on('disconnect', function () {
		delete objects[ship.id];
		io.sockets.emit('remove', ship.id);
	});
	socket.on('key', function (data) {
		var keys = ship.keys;
		keys[data.key] = data.pressed;
		ship.rotating = keys.left ? keys.right ? 0 : 1 : keys.right ? -1 : 0;
		ship.accelerating = keys.up;

		if (data.key == 'ctrl' && data.pressed == !ship.shootInterval) {
			if (data.pressed) {
				shoot();
				ship.shootInterval = setInterval(shoot, 500);
			} else {
				clearInterval(ship.shootInterval);
				delete ship.shootInterval;
			}
		}

		io.sockets.emit('object', ship.toJSON());
	});
	socket.on('latency', function (data) {
		socket.emit('latency', data);
	});
});

ticker.callbacks.push(function () {
	var data = {}, i;
	if (++tickCounter == 30) {
		tickCounter = 0;
		for (i in objects)
			data[i] = objects[i].toJSON();
		io.sockets.emit('objects', data);
	}
});

ticker.start();