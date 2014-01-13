define([
	'./Shape'
], function (Shape) {

	var speed = 0.35;

	return Shape.extend({

		type: 'beam',
		image: 'beam',
		composition: 'lighter',
		size: 21,

		timeout: 500,

		x: 0,
		y: 0,

		xSpeed: 0,
		ySpeed: 0,

		tick: function (ms) {
			var val = speed * ms;
			this.x += this.xSpeed * val;
			this.y += this.ySpeed * val;
		},

		toJSON: function (full) {
			var json = {
				id: this.id,
				x: this.x,
				y: this.y
			};
			if (full) {
				json.type = this.type;
				json.xSpeed = this.xSpeed;
				json.ySpeed = this.ySpeed;
				json.angle = this.angle;
			}
			return json;
		}
	});
});