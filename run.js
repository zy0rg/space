var requirejs = require('requirejs');

requirejs.config({
	nodeRequire: require
});

requirejs('server/server');