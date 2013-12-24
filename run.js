var path = require('path'),
	url = require('url'),
	fs = require('fs'),
	http = require('http').createServer(function (request, response) {
		var my_path = url.parse(request.url).pathname;
		var full_path = path.join(process.cwd(), my_path);
		fs.exists(full_path, function (exists) {
			if (!exists) {
				response.writeHeader(404, {"Content-Type": "text/plain"});
				response.write("404 Not Found\n");
				response.end();
			} else {
				fs.stat(full_path, function (err, stats) {
					if (stats.isDirectory())
						full_path += 'index.html';
					else if (!stats.isFile()) {
						writeError(err, response);
						return;
					}
					fs.readFile(full_path, "binary", function (err, file) {
						if (err)
							writeError(err, response);
						else {
							response.writeHeader(200);
							response.write(file, "binary");
							response.end();
						}
					});
				});
			}
		});
	}).listen(80),
	io = require('socket.io').listen(http),
	requirejs = require('requirejs');

function writeError(err, response) {
	response.writeHeader(500, {"Content-Type": "text/plain"});
	response.write(err + "\n");
	response.end();
}

requirejs.define('io', io);
requirejs('server');