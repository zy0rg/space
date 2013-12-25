define([
	'io',

	'core/objects',

	'client/canvas',
	'client/keys',
	'client/ticker',
	'client/rig',

	'base/Ship'
], function (io, objects, canvas, keys, ticker, rig, Ship) {

	var socket = io.connect(),
		mouse = true;

	Ship.add({
		init: function () {
			if (this.id == rig.id)
				rig.ship = this;
			this.image = 'self';
		}
	});

	canvas.fullscreen(true);

	ticker.callbacks.push(canvas.draw);
	ticker.start();

	socket.on('remove', objects.delete);
	socket.on('objects', objects.update);
	socket.on('object', objects.set);

	socket.on('you', function (id) {
		rig.id = id;
		rig.ship = objects[id];
		if (rig.ship)
			rig.ship.image = 'self';
	});

	if (mouse) {
		var rotating = 0,
			rotate = 0,
			accuracy = 0.2,
			pi2 = Math.PI * 2;
		ticker.callbacks.push(function () {
			if (rotating && rig.ship && keys.mousePosition) {
				var delta = Math.atan2(
					rig.ship.y - keys.mousePosition.y,
					keys.mousePosition.x - rig.ship.x
				) - rig.ship.angle;

				if (delta > Math.PI)
					delta -= pi2;
				else if (delta < -Math.PI)
					delta += pi2;

				if (Math.abs(delta) < accuracy && rotate) {
					socket.emit('control', 'rotate', rotate = 0);
					rotating = false
				} else if ((delta = (delta > 0 ? 1 : -1)) != rotate) {
					socket.emit('control', 'rotate', rotate = delta);
				}
			}
		});

		keys.on('mousePosition', function () {
			rotating = true;
		});
		keys.on('mouseRight', function (value) {
			socket.emit('control', 'accelerate', value);
		});
		keys.on('mouseLeft', function (value) {
			socket.emit('control', 'beam', value);
		});
	} else {
		keys.on('up', function (value) {
			socket.emit('control', 'accelerate', value);
		});
		keys.on('left right', function () {
			socket.emit('control', 'rotate', keys.left ? keys.right ? 0 : 1 : keys.right ? -1 : 0);
		});
		keys.on('ctrl', function (value) {
			socket.emit('control', 'beam', value);
		});
	}
});