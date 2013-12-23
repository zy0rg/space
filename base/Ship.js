define([
	'./Shape'
], function (Shape) {

	var rotation = 0.01 / Math.PI,
		acceleration = 0.0025,
		deceleration = 0.998;

	return Shape.extend({

		type: 'Ship',
		image: 'ship',

		x: 0,
		y: 0,

		xSpeed: 0,
		ySpeed: 0,
		rotating: 0,
		accelerating: false,

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
			var keys = this.keys;
			return {
				id: this.id,
				x: this.x,
				y: this.y,
				xSpeed: this.xSpeed,
				ySpeed: this.ySpeed,
				angle: this.angle,
				type: this.type,
				rotating: this.rotating,
				accelerating: this.accelerating
			}
		}
	});
});