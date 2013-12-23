define([
	'jquery',

	'core/socket',
	'core/canvas',
	'core/ticker',
	'core/objects',

	'base/Ship',
	'base/Beam',

	'core/keys'
], function ($, socket, canvas, ticker, objects, Ship, Beam) {

	canvas.fullscreen(true);

	ticker.callbacks.push(canvas.draw);
	ticker.start();

	function add(data) {
		var object;
		switch (data.type) {
			case 'Ship':
				object = new Ship(data);
				break;
			case 'Beam':
				object = new Beam(data);
				break;
		}
		objects[data.id] = object;
		canvas.add(object);
	}

	socket.on('remove', function (id) {
		delete objects[id];
	});
	socket.on('objects', function (data) {
		var i, props;
		for (i in data) {
			props = data[i];
			if (objects.hasOwnProperty(props.id))
				objects[props.id].extend(props);
			else
				add(props);
		}
		for (i in objects)
			if (!data[i])
				delete objects[i];
	});
	socket.on('object', function (data) {
		if (objects.hasOwnProperty(data.id))
			objects[data.id].extend(data);
		else
			add(data);
	});
});