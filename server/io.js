define([
	'socket.io',
	'./httpServer'
], function (io, httpServer) {
	return io.listen(httpServer);
});