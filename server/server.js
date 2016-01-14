define([
	'core/objects',

	'base/Shape',

	'./io',
	'./UserContext'
], function (objects, Shape, io, UserContext) {

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
		var i, j, k, object,
			data = {};
		for (i = 0; i < objects.length; i++) {
			object = objects[i];
			object.update();
			object.buildPath(75);

			if (Math.abs(object.x) > 1000 || Math.abs(object.y) > 1000)
				objects.delete(i);
			else
				data[i] = object.toJSON();
		}

		io.sockets.emit('objects', data);
	}, 1500);
});
