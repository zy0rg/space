define([
	'base/Shape',

	'core/objects'
], function (Shape, objects) {

	Shape.add.call(Shape.prototype, {
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

	return {
		init: function (sockets) {
			setInterval(function () {
				var i, object,
					data = {};
				for (i in objects) {
					object = objects[i];
					object.update();
					data[i] = object.toJSON();
				}
				sockets.emit('objects', data);
			}, 1500);
		}
	}
});
