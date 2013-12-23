define(function (require) {
	requirejs.config({
		paths: {
			jquery: 'lib/jquery',
			io: 'lib/socket.io'
		},

		waitSeconds: 15
	});
	require(['client']);
});