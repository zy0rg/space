define([
	'core/Extendable',
	'core/objects',

	'./io',
	'./users'
], function (Extendable, objects, io, users) {

	var range = 23.43,
		delta = 0.6946,
		speed = 0.55;

	return Extendable.extend({

		leftBeam: true,

		constructor: function (socket) {

			users.push(this);

			this.socket = socket;

			this.ship = objects.create('ship');

			socket.broadcast.emit('object', this.ship.toJSON(true));
			socket.emit('objects', objects.toJSON(true));
			socket.emit('you', this.ship.id);

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
			clearInterval(this.shootInterval);
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

			this.ship.update();
			var angle = this.ship.angle + ((this.leftBeam = !this.leftBeam) ? delta : -delta);

			io.sockets.emit('object', objects.create('beam', {
				x: this.ship.x + Math.cos(angle) * range,
				y: this.ship.y - Math.sin(angle) * range,
				xSpeed: Math.cos(this.ship.angle) * speed,
				ySpeed: Math.sin(this.ship.angle) * -speed,
				angle: this.ship.angle
			}).toJSON(true));
		}
	});
});
