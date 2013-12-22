define([
	'jquery',

	'core/socket',
	'core/canvas',
	'core/ticker',

	'base/Ship',

	'core/keys'
], function ($, socket, canvas, ticker, Ship) {

	canvas.fullscreen(true);

	ticker.callbacks.push(canvas.draw);
	ticker.start();

	var ships = {},
		addShip = function (data) {
			var ship = ships[data.id] = new Ship(data);
			canvas.add(ship);
			ticker.objects.push(ship);
		},
		removeShip = function (id) {
			var ship = ships[id];
			canvas.remove(ship);
			delete ships[id];
		};

	socket.on('add', function (data) {
		if (ships[data.id])
			removeShip(data.id);
		addShip(data);
	});
	socket.on('remove', removeShip);
	socket.on('ships', function (data) {
		var i, ship, props;
		for (i in data) {
			props = data[i];
			if (ship = ships[props.id])
				ship.extend(props);
			else
				addShip(props);
		}
		for (i in ships)
			if (!data[ships[i].id]) {
				canvas.remove(ship);
				delete ships[i];
			}
	});
	socket.on('key', function (data) {
		ships[data.id].keys[data.key] = data.pressed;
	});
	socket.on('ship', function (data) {
		ships[data.id].extend(data.data);
	});
});