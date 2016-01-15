define([
	'jquery',

	'socket',
	'client/canvas',
	'client/ticker',
	'core/types',
	'core/objects',

	'client/keys'
], function ($, socket, canvas, ticker, types, objects) {

	canvas.fullscreen(true);

	ticker.callbacks.push(canvas.draw);
	ticker.start();

	socket.on('remove', objects.delete);
	socket.on('objects', objects.update);
	socket.on('object', function (data) {
		if (objects.hasOwnProperty(data.id))
			objects.byId[data.id].extend(data);
		else
			objects.create(data);
	});
});