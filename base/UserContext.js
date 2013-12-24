define([
	'base/Extendable',

	'io',

	'core/objects',
	'server/users'
], function (Extendable, io, objects, users) {

	return Extendable.extend({

		constructor: function (socket) {

			users.push(this);

			this.socket = socket;

			this.ship = objects.create('ship');

			socket.emit('objects', objects.toJSON(true));

			var _this = this;

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
			io.sockets.emit('remove', this.ship.id);
		},

		control: function (key, value) {
			var ship = this.ship;
			ship.update();
			ship[key] = value;

			if (key == 'beam' && value == !this.shootInterval) {
				if (value) {
					this.shoot();
					var _this = this;
					this.shootInterval = setInterval(function () {
						_this.shoot();
					}, 500);
				} else {
					clearInterval(this.shootInterval);
					delete this.shootInterval;
				}
			}

			io.sockets.emit('object', ship.toJSON());
		},

		shoot: function () {
			io.sockets.emit('object', objects.create('beam', {
				x: this.ship.x,
				y: this.ship.y,
				angle: this.ship.angle
			}).toJSON(true));
		}
	});
});
