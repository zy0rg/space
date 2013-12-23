define([
	'./Shape'
], function (Shape) {

	var speed = 0.2;

	return Shape.extend({

		type: 'Beam',
		image: 'pulse',

		timeout: 500,

		x: 0,
		y: 0,

		xSpeed: 0,
		ySpeed: 0,

		tick: function (ms) {
			var val = speed * ms;
			this.x += Math.cos(this.angle) * val;
			this.y -= Math.sin(this.angle) * val;
		},

		toJSON: function () {
			return {
				id: this.id,
				x: this.x,
				y: this.y,
				xSpeed: this.xSpeed,
				ySpeed: this.ySpeed,
				angle: this.angle,
				type: this.type
			}
		}
	});
});