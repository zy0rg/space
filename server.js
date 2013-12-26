define([
	'io',

	'core/objects',

	'base/Shape',
	'base/UserContext'
], function (io, objects, Shape, UserContext) {

	Shape.add({

		init: function () {
			this.lastTick = (new Date()).getTime();
		},

		update: function () {
			var current = (new Date()).getTime(),
				ms = current - this.lastTick;
			this.lastTick = current;
			this.tick(ms);
		}
	});

	io.sockets.on('connection', function (socket) {
		new UserContext(socket, io);
	});

	setInterval(function () {
		var i, object,
			data = {};
		for (i in objects) {
			object = objects[i];
			object.update();

			if (Math.abs(object.x) > 1000 || Math.abs(object.y) > 1000)
				delete objects[i];
			else
				data[i] = object.toJSON();
		}
		io.sockets.emit('objects', data);
	}, 1500);
});
