define([
	'jquery'
], function ($) {

	var self = {
		loadImage: function (path, destination, name) {
			var img = new Image();
			img.src = 'img/' + path + '.png';
			img.addEventListener("load", function () {
				destination[name || path] = img;
			}, false);
		},

		loadImages: function (map, destination) {
			for (var i in map)
				self.loadImage(map[i], destination, i);
		}
	};

	return self;
});