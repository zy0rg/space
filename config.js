define(function (require) {
	requirejs.config({
		paths: {
			jquery: 'lib/jquery',
			underscore: 'lib/underscore',
			io: 'lib/socket.io',

			text: 'lib/text'
		},

		shim: {
			'lunderscore': {
				exports: '_'
			}
		},

		waitSeconds: 15
	});
	require(['main']);
});