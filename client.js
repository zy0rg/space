define([
	'client/socket',
	'core/objects',

	'client/canvas',
	'client/keys',
	'client/ticker'
], function (socket, objects, canvas, keys, ticker) {

	canvas.fullscreen(true);

	ticker.callbacks.push(canvas.draw);
	ticker.start();

	socket.on('remove', objects.delete);
	socket.on('objects', objects.update);
	socket.on('object', objects.set);

	keys.on('up', function (value) {
		socket.emit('control', 'accelerate', value);
	});
	keys.on('left right', function () {
		socket.emit('control', 'rotate', keys.left ? keys.right ? 0 : 1 : keys.right ? -1 : 0);
	});
	keys.on('ctrl', function (value) {
		socket.emit('control', 'beam', value);
	});
});