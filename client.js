define([
	'client/socket',
	'core/objects',

	'client/canvas',
	'client/ticker',

	'client/keys'
], function (socket, objects, canvas, ticker) {

	canvas.fullscreen(true);

	ticker.callbacks.push(canvas.draw);
	ticker.start();

	socket.on('remove', objects.delete);
	socket.on('objects', objects.update);
	socket.on('object', objects.set);
});