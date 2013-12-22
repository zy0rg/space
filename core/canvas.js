define([
	'jquery',

	'core/loader'
], function ($, loader) {

	var $canvas = $('<canvas>').appendTo('[data-canvas]'),
		canvas = $canvas[0],
		ctx = canvas.getContext('2d'),

		objects = [],
		self,
		resources = ctx.resources = {};

	loader.loadImages({
		background: 'space',
		ship: 'ship'
	}, resources);

	self = {
		$el: $canvas,

		objects: objects,

		x: 0,
		y: 0,
		width: 100,
		height: 100,

		add: function (object) {
			var i = objects.indexOf(object);
			if (i == -1) {
				objects.push(object);
				object.draw(ctx);
			}
		},

		remove: function (object) {
			var i = objects.indexOf(object);
			if (~i) {
				objects.splice(i, 1);
//				object.clear(ctx);
			}
		},

		draw: function () {
			var i, img = resources.background;
			if (img)
				ctx.drawImage(img, (img.width - self.width) / -2, (img.height - self.height) / -2);
//				for (i = 0; i < objects.length; i++)
//					objects[i].clear(ctx);
			for (i = 0; i < objects.length; i++)
				objects[i].draw(ctx);
		},

		fullscreen: function (force) {
			self.resize();
			$(window)[force ? 'on' : 'off']('resize', self.resize);
		},

		resize: function () {
			var el = $canvas.parent()[0];
			$canvas.prop({
				width: self.width = el.clientWidth,
				height: self.height = el.clientHeight
			});
			self.draw();
		}
	};

	return self;
});