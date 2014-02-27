define([
	'jquery',

	'core/objects',
	'client/loader'
], function ($, objects, loader) {

	var $canvas = $('<canvas>').appendTo('[data-canvas]'),
		canvas = $canvas[0],
		ctx = canvas.getContext('2d'),

		self,
		resources = ctx.resources = {};

	loader.loadImages({
		background: 'space',
		beam: 'beam',
		ship: 'ship',
		self: 'self',
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
			var i
				, img = resources.background
				;
			if (img)
				ctx.drawImage(img, (img.width - self.width) / -2, (img.height - self.height) / -2);
			ctx.save();
			ctx.translate(self.width / 2, self.height / 2);
//			for (i in objects)
//				objects[i].clear(ctx);
			for (i = 0; i < objects.length; i++)
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

	objects.on('add', self.add);

	return self;
});