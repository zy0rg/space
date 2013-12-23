define([
	'jquery',

	'core/loader',
	'core/objects'
], function ($, loader, objects) {

	var $canvas = $('<canvas>').appendTo('[data-canvas]'),
		canvas = $canvas[0],
		ctx = canvas.getContext('2d'),

		self,
		resources = ctx.resources = {};

	loader.loadImages({
		background: 'space',
		ship: 'ship',
		pulse: 'pulse'
	}, resources);

	self = {
		$el: $canvas,

		x: 0,
		y: 0,
		width: 100,
		height: 100,

		add: function (object) {
			if (object.image && !resources[object.image])
				loader.loadImage(object.image, resources);
			object.draw(ctx);
		},

		draw: function () {
			var i, img = resources.background;
			if (img)
				ctx.drawImage(img, (img.width - self.width) / -2, (img.height - self.height) / -2);
//				for (i = 0; i < objects.length; i++)
//					objects[i].clear(ctx);
			ctx.save();
			ctx.translate(self.width / 2, self.height / 2);
			for (i in objects)
				objects[i].draw(ctx);
			ctx.restore();
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