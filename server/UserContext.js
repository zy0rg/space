define([
	'core/Extendable',

	'core/objects',
	'core/users'
], function (Extendable, objects, users) {

	return Extendable.extend({

		constructor: function (socket, io) {

			users.push(this);

			this.socket = socket;
			this.io = io;

			this.ship = objects.create('ship');

			var i, object,
				data = {},
				_this = this;

			for (i in objects) {
				object = objects[i];
				object.update();
				data[i] = object.toJSON(true);
				data[i].type = object.type;
			}
			socket.emit('objects', data);

			socket.on('disconnect', function () {
				_this.disconnect();
			});
			socket.on('control', function (key, value) {
				_this.control(key, value);
			});
			socket.on('latency', function (data) {
				socket.emit('latency', data);
			});
		},

		init: function () {
		},

		disconnect: function () {
			objects.delete(this.ship.id);
			this.io.sockets.emit('remove', this.ship.id);
		},

		control: function (key, value) {
			var ship = this.ship;
			ship[key] = value;
			ship.update();

//			ship.rotating = keys.left ? keys.right ? 0 : 1 : keys.right ? -1 : 0;
//			ship.accelerating = keys.up;

			if (key == 'beam' && value == !this.shootInterval) {
				if (value) {
					this.shoot();
					var _this = this;
					ship.shootInterval = setInterval(function () {
						_this.shoot();
					}, 500);
				} else {
					clearInterval(this.shootInterval);
					delete this.shootInterval;
				}
			}

			this.io.sockets.emit('object', ship.toJSON());
		},

		shoot: function () {
			this.io.sockets.emit('object', objects.create('beam', {
				x: this.ship.x,
				y: this.ship.y,
				angle: this.ship.angle
			}).toJSON(true));
		}
	});
});
