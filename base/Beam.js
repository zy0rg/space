define([
	'./Shape'
], function (Shape) {

	var speed = 0.01;

	return Shape.extend({

		type: 'Beam',
		image: 'pulse',

		x: 0,
		y: 0,

		xSpeed: 0,
		ySpeed: 0,

		constructor: function (data) {
			Shape.call(this);
			this.extend(data);
		},

		tick: function (ms) {
			for (var i = 0; i < ms; i++) {
				if (this.rotating)
					this.angle += rotation * this.rotating;
				if (this.accelerating) {
					this.xSpeed += Math.cos(this.angle) * acceleration;
					this.ySpeed -= Math.sin(this.angle) * acceleration;
				}
				this.x += (this.xSpeed *= deceleration);
				this.y += (this.ySpeed *= deceleration);
			}
		},

		toJSON: function () {
			return {
				id: this.id,
				x: this.x,
				y: this.y,
				xSpeed: this.xSpeed,
				ySpeed: this.ySpeed,
				angle: this.angle,
				rotating: this.rotating,
				accelerating: this.accelerating
			}
		}
	});
});